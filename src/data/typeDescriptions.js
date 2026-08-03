export const typeDescriptions = {
  GUFO: {
    label: "The Builder",
    tagline: "Optimistic, unprecedented, fast, and ready to steer",
    description:
      "This worldview sees AGI-level systems arriving within the decade, representing something humanity has never faced before. The outcome could be overwhelmingly positive—if the right people make the right calls right now. There's genuine excitement about capability breakthroughs paired with a sense of responsibility to shape how they unfold. People with this outlook tend to follow alignment research closely and believe that building safe AI and building powerful AI aren't in tension—they're the same project.",
    thinkers: ["Dario Amodei", "Sam Altman", "Demis Hassabis", "Ilya Sutskever (early OpenAI era)"],
    communities: ["Anthropic", "OpenAI", "Google DeepMind", "Alignment Forum", "80,000 Hours"],
  },
  GUFI: {
    label: "The Accelerationist",
    tagline: "Optimistic, unprecedented, fast—and it's happening regardless",
    description:
      "This perspective shares the conviction that something genuinely new and transformative is arriving fast—but sees the idea of centrally \"steering\" it as a comforting fiction. Competitive dynamics between nations, companies, and researchers make top-down coordination extremely difficult. And that may be fine, because the default trajectory looks positive anyway. From this view, heavy-handed regulation poses more risk than the technology itself, and the best path forward is to let innovation proceed with minimal interference.",
    thinkers: ["Guillaume Verdon (Beff Jezos)", "Marc Andreessen", "Balaji Srinivasan"],
    communities: ["e/acc", "Techno-libertarians", "a16z", "r/singularity (optimist wing)"],
  },
  BUFO: {
    label: "The Safety Researcher",
    tagline: "Worried, unprecedented, fast—but we can fix this",
    description:
      "This outlook takes the risks of transformative AI seriously while maintaining that human choices, right now, can change the outcome. The technology is arriving soon, it's qualitatively different from prior tools, and the default trajectory is concerning—but not locked in. People drawn to this view often support a combination of technical alignment research, governance proposals, and advocacy. There's often a tension between wanting to engage constructively with AI labs and feeling that the pace of development is dangerously fast.",
    thinkers: ["Stuart Russell", "Yoshua Bengio", "Paul Christiano", "Jan Leike", "Connor Leahy"],
    communities: ["MIRI (moderate wing)", "ARC Evals", "CAIS", "Pause AI", "r/ControlProblem", "AI safety Twitter"],
  },
  BUFI: {
    label: "The Doomer",
    tagline: "Worried, unprecedented, fast—and we're probably cooked",
    description:
      "This view holds that transformative AI is coming fast, it's unlike anything humanity has dealt with, the default outcome is catastrophic, and the coordination required to change course may be beyond what we can realistically achieve. It's not a position people arrive at happily—it often comes with a wish to be proven wrong. The reasoning tends to focus on the difficulty of the alignment problem itself and the structural incentives pushing labs to race ahead. Some who hold this view channel it into continued work; others have moved toward acceptance or dark humor.",
    thinkers: ["Eliezer Yudkowsky", "Roman Yampolskiy", "Nate Soares"],
    communities: ["Late-stage MIRI", "AI doom Twitter/X", "r/ControlProblem (pessimist wing)", "LessWrong doomers"],
  },
  GAFO: {
    label: "The Pragmatic Optimist",
    tagline: "Optimistic, familiar, fast, and engaged",
    description:
      "This worldview sees AI advancing fast and delivering enormous value, but doesn't buy the framing that it's totally unlike anything before. Electricity was transformative. The internet was transformative. AI is transformative. That doesn't make it alien. The approach here is to evaluate AI by what it actually does—not by speculation about what it might become—and to apply existing frameworks like antitrust, safety engineering, and consumer protection, updating them as needed. From this perspective, the existential risk discourse often overshadows the practical work of deploying AI well.",
    thinkers: ["Bill Gates", "Satya Nadella", "Reid Hoffman", "Arvind Narayanan", "Ezra Klein (on optimistic days)"],
    communities: ["Tech industry mainstream", "AI Snake Oil readers", "Wired/Ars Technica readership", "Most VC firms", "Davos/WEF AI panels"],
  },
  BAFI: {
    label: "The Fatalist Realist",
    tagline: "Worried, familiar, fast—and powerless",
    description:
      "This perspective treats AI as a normal technology—no sci-fi framing needed—but that doesn't lead to optimism. AI is moving fast and creating real, familiar problems: job displacement, surveillance, concentration of power. And the track record of addressing these kinds of problems under existing economic systems isn't encouraging. Benefits tend to accrue at the top, costs get socialized, and reform efforts get captured or weakened. This view is less common in organized AI discourse but resonates with many people in industries being disrupted—those watching the concrete effects unfold in real time.",
    thinkers: ["Jaron Lanier (on pessimistic days)"],
    communities: ["Disillusioned tech workers", "Creative industry under threat", "r/antiwork meets AI"],
  },
  BAFO: {
    label: "The Policy Advocate",
    tagline: "Worried, familiar, fast—let's regulate",
    description:
      "This is the action-oriented wing of treating AI as a normal technology. AI is advancing fast and poses serious risks—but they're recognizable ones: labor displacement, algorithmic bias, corporate monopoly, surveillance, misinformation. These are policy problems with policy solutions. There are existing legal frameworks—antitrust, civil rights, labor protections—that can be applied and updated. The key ingredient is political will. This outlook tends to find both the \"AI will save us\" and \"AI will kill us\" framings unhelpful, preferring to focus on questions of power, accountability, and who actually benefits from deployment.",
    thinkers: ["Lina Khan", "Margrethe Vestager", "Anu Bradford", "Daron Acemoglu", "Arvind Narayanan"],
    communities: ["EU AI regulatory sphere", "AI Now Institute", "AI Snake Oil community", "AFL-CIO tech policy", "FAccT-adjacent"],
  },
  GAFI: {
    label: "The Comfortable Observer",
    tagline: "Optimistic, familiar, fast—and it'll sort itself out",
    description:
      "This view sees AI as a normal technology—moving fast, broadly positive, not fundamentally different from the internet or mobile or cloud—and trusts that markets will handle allocation effectively. It's a common implicit position even if few people write essays about it, because the whole point is that essays aren't really needed. AI is the next platform shift, and the best response is to adopt it and adapt. From this perspective, much of the AI safety and policy discourse feels premature or self-important relative to where the technology actually is.",
    thinkers: [],
    communities: ["Business press mainstream", "Corporate AI adopters", "Laissez-faire tech culture", "Most enterprise SaaS"],
  },
  GUSO: {
    label: "The Patient Architect",
    tagline: "Optimistic, unprecedented, slow, and building carefully",
    description:
      "This outlook holds that truly transformative AI is further out than the hype cycle suggests—but agrees it will eventually be genuinely unprecedented and potentially wonderful. The longer timeline is actually good news: it provides room to build the right institutions, technical foundations, and governance frameworks before they're urgently needed. People drawn to this view tend to be skeptical of scaling-maximalism while remaining deeply serious about long-term implications. Current capabilities are impressive but overhyped, and the real breakthroughs may require fundamentally new approaches.",
    thinkers: ["Francois Chollet", "Gary Marcus (on optimistic days)"],
    communities: ["Academic AI research (non-scaling camp)", "Long-horizon safety research", "Parts of EA/longtermism"],
  },
  GUSI: {
    label: "The Relaxed Visionary",
    tagline: "Optimistic, unprecedented, slow—and it'll unfold naturally",
    description:
      "This perspective believes genuinely transformative AI is coming eventually—and it will be something truly new—but the timeline is long enough that there's no urgency to steer it. Humanity will figure it out as it goes, as it generally has with previous challenges. This is a rarer combination in organized AI discourse. It maps to a certain kind of fascination with AI's long-term potential, paired with low anxiety and skepticism toward both accelerationist urgency and safety panic. Current systems may be sophisticated pattern matchers, with real AI still decades away—but when it arrives, it could be magnificent.",
    thinkers: [],
    communities: ["This combination is rarer in public discourse—you may be charting your own course"],
  },
  BUSO: {
    label: "The Long-term Safety Advocate",
    tagline: "Worried, unprecedented, slow—but we have time to prepare",
    description:
      "This view combines genuine worry about AI's long-term trajectory with the belief that we have more time than the doomers claim. Transformative AI is coming and will be genuinely unprecedented, and the default outcome is concerning—but the silver lining is that we likely have decades, not years, to prepare. The open question is whether that time will actually be used wisely. This perspective tends to focus on institutional design and long-term governance rather than near-term technical alignment, and sometimes finds current AI safety discourse too focused on today's systems at the expense of harder problems ahead.",
    thinkers: ["Nick Bostrom (circa 2014)", "Toby Ord"],
    communities: ["Early MIRI/FHI era", "Oxford-style longtermism", "GovAI"],
  },
  BUSI: {
    label: "The Distant Doomer",
    tagline: "Worried, unprecedented, slow—and we won't prepare in time",
    description:
      "This view sees a slow-moving catastrophe. Transformative AI is further away than the hype suggests, but when it arrives it will be genuinely unprecedented—and the intervening decades are likely to be squandered on discourse rather than preparation. The iceberg will be visible for years and we'll still hit it. The parallel to climate change feels apt: decades of clear science, and still nowhere close to adequate action. This is a rare and somewhat lonely position that combines a contrarian timeline view with deep structural pessimism about humanity's capacity for coordination.",
    thinkers: [],
    communities: ["No natural home—this is a position arrived at through pessimism about human coordination, not AI-specific discourse"],
  },
  GASO: {
    label: "The Incrementalist",
    tagline: "Optimistic, familiar, slow, and calm",
    description:
      "This is perhaps the purest expression of the \"AI as normal technology\" worldview. AGI is far away. AI is powerful but ultimately familiar. Outcomes will be broadly positive. And normal institutional tools—regulations, standards bodies, market competition, consumer protection—are sufficient to steer it. The approach is straightforward: build good products, write sensible regulations, and evaluate systems by what they actually do rather than by speculation about superintelligence. Much of the AI discourse, from both utopians and doomers, feels overheated from this perspective.",
    thinkers: ["Yann LeCun", "Andrew Ng", "Arvind Narayanan", "Sayash Kapoor", "Steven Pinker", "Gary Marcus"],
    communities: ["AI Snake Oil / normal technology movement", "ML engineering mainstream", "AI hype skeptics", "Economics departments", "r/MachineLearning (skeptic threads)"],
  },
  GASI: {
    label: "The Calm Skeptic",
    tagline: "Optimistic, familiar, slow—relax, it'll be fine",
    description:
      "This perspective sees the entire AI discourse as massively overheated. AGI is far away. AI is a normal technology, not a new species. Outcomes will be fine. And markets will handle things better than committees of worried intellectuals. From this view, the safety crowd is catastrophizing, the policy crowd is empire-building, and the accelerationists are being dramatic. AI will be fine the way the internet was fine, the way smartphones were fine. This may actually be the most widely held position among the general public, even if it's underrepresented in AI-specific discourse—precisely because people who hold it don't feel compelled to write about it.",
    thinkers: [],
    communities: ["The general public", "Most of the non-AI tech industry", "Normal technology default position"],
  },
  BASO: {
    label: "The Skeptical Critic",
    tagline: "Worried, familiar, slow—but about present harms",
    description:
      "This outlook insists on treating AI as a normal technology—and that means holding it to normal standards of accountability, right now. The AGI discourse is seen as a distraction from real harms AI is causing today: bias in hiring algorithms, facial recognition deployed against marginalized communities, recommendation engines that maximize engagement at democracy's expense, gig economy surveillance, and massive concentration of corporate power. These aren't speculative risks; they're happening. The \"existential risk\" framing, from this view, conveniently redirects attention and funding away from present accountability toward hypothetical futures.",
    thinkers: ["Timnit Gebru", "Emily Bender", "Meredith Whittaker", "Safiya Noble", "Ruha Benjamin"],
    communities: ["DAIR Institute", "FAccT", "AI Now Institute", "AI Ethics academia", "Tech accountability movement"],
  },
  BASI: {
    label: "The Quiet Pessimist",
    tagline: "Worried, familiar, slow—and change is hard",
    description:
      "This view shares the Skeptical Critic's focus on present harms and rejection of AGI hype—but is more pessimistic about the prospects for meaningful reform. The harms of AI are real: surveillance, labor exploitation, algorithmic discrimination, corporate consolidation. But the political and economic forces driving these outcomes are deeply entrenched. Regulation gets captured. Movements get co-opted. Reforms get watered down. People who hold this view may still do the work, but tend to do so without illusions about systemic transformation. Technology is seen as embedded in—and reinforcing—existing power structures.",
    thinkers: ["Evgeny Morozov", "Shoshana Zuboff", "Cory Doctorow"],
    communities: ["Tech criticism/pessimism", "Platform criticism", "Surveillance studies", "Logic Magazine readers"],
  },
};
