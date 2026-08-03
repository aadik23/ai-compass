-- AI Compass — shared results store
--
-- Paste this whole file into the Supabase SQL editor and run it once.
--
-- Design: the browser may INSERT but may never SELECT. Aggregates come back
-- through one SECURITY DEFINER function, so the public key can add to the
-- totals and read the totals, but cannot dump anyone's individual answers.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.results (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  type_code   text        not null check (type_code ~ '^[A-Za-z]{4}$'),
  outcome     smallint    not null check (outcome  between 0 and 100),
  novelty     smallint    not null check (novelty  between 0 and 100),
  timeline    smallint    not null check (timeline between 0 and 100),
  control     smallint    not null check (control  between 0 and 100),
  is_human    boolean
);

create table if not exists public.responses (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  question_id text        not null check (length(question_id) between 1 and 12),
  score       smallint    not null check (score between -2 and 2),
  is_human    boolean
);

create index if not exists results_type_code_idx on public.results (upper(type_code));
create index if not exists responses_question_idx on public.responses (question_id);

-- ---------------------------------------------------------------------------
-- Row level security: insert-only for the public key
-- ---------------------------------------------------------------------------

alter table public.results   enable row level security;
alter table public.responses enable row level security;

drop policy if exists "public can add results" on public.results;
create policy "public can add results"
  on public.results for insert to anon, authenticated with check (true);

drop policy if exists "public can add responses" on public.responses;
create policy "public can add responses"
  on public.responses for insert to anon, authenticated with check (true);

-- No SELECT / UPDATE / DELETE policy exists, so RLS denies all of them.

-- ---------------------------------------------------------------------------
-- Aggregates
-- ---------------------------------------------------------------------------

create or replace function public.quiz_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'total',  (select count(*)::int from results),
    'humans', (select count(*)::int from results where is_human is true),
    'ais',    (select count(*)::int from results where is_human is false),

    'types', coalesce((
      select json_agg(t order by t.n desc, t.code)
      from (
        select upper(type_code) as code, count(*)::int as n
        from results
        group by upper(type_code)
      ) t
    ), '[]'::json),

    'axes', (
      select json_build_object(
        'outcome',  coalesce(round(avg(outcome))::int,  50),
        'novelty',  coalesce(round(avg(novelty))::int,  50),
        'timeline', coalesce(round(avg(timeline))::int, 50),
        'control',  coalesce(round(avg(control))::int,  50)
      ) from results
    ),

    'questions', coalesce((
      select json_agg(q order by q.question_id)
      from (
        select
          question_id,
          count(*)::int                                  as n,
          round(avg(score), 2)::float                    as avg,
          count(*) filter (where score = -2)::int        as "m2",
          count(*) filter (where score = -1)::int        as "m1",
          count(*) filter (where score =  0)::int        as "z",
          count(*) filter (where score =  1)::int        as "p1",
          count(*) filter (where score =  2)::int        as "p2"
        from responses
        group by question_id
      ) q
    ), '[]'::json)
  );
$$;

grant execute on function public.quiz_stats() to anon, authenticated;
