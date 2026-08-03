import { useEffect, useRef, useState } from "react";
import { drawShareCard, ensureCardFonts, canvasToBlob } from "../logic/shareCard";
import { buildShareUrl } from "../logic/resultUrl";
import { shareText } from "../logic/shareText";

export default function Share({ code, label, tagline, scores }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("");
  const [cardReady, setCardReady] = useState(false);

  const link = buildShareUrl(code, scores);
  const text = shareText(label, tagline, link);
  // X and LinkedIn append the URL themselves, so pass them the bare copy.
  const textWithoutLink = shareText(label, tagline, null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureCardFonts();
      if (cancelled || !canvasRef.current) return;
      drawShareCard(canvasRef.current, { code, label, tagline, scores });
      setCardReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [code, label, tagline, scores]);

  function flash(message) {
    setStatus(message);
    setTimeout(() => setStatus(""), 2600);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      flash("Copied.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      flash("Copied.");
    }
  }

  async function handleDownloadCard() {
    const blob = await canvasToBlob(canvasRef.current);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-compass-${code.toLowerCase()}.png`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Card saved.");
  }

  /** Native share sheet, with the card attached where the platform allows it. */
  async function handleNativeShare() {
    const blob = await canvasToBlob(canvasRef.current);
    const file = blob
      ? new File([blob], `ai-compass-${code.toLowerCase()}.png`, { type: "image/png" })
      : null;

    const payload = { title: "AI Compass", text: textWithoutLink, url: link };
    if (file && navigator.canShare?.({ files: [file] })) {
      payload.files = [file];
    }

    try {
      await navigator.share(payload);
    } catch {
      // Cancelled or unavailable — nothing to report.
    }
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    textWithoutLink
  )}&url=${encodeURIComponent(link)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    link
  )}`;
  const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;

  return (
    <div className="share">
      <p className="share-text">{text}</p>

      <div className="share-links">
        <button type="button" className="btn btn-primary" onClick={handleCopy}>
          Copy text and link
        </button>
        <a
          className="btn"
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Post on X
        </a>
        <a
          className="btn"
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Post on LinkedIn
        </a>
        <a
          className="btn"
          href={blueskyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Post on Bluesky
        </a>
        {typeof navigator !== "undefined" && navigator.share && (
          <button type="button" className="btn" onClick={handleNativeShare}>
            Share…
          </button>
        )}
      </div>

      <p className="share-status" role="status" aria-live="polite">
        {status}
      </p>

      <div className="share-card-preview">
        <canvas
          ref={canvasRef}
          aria-label={`Share card for ${label}`}
          role="img"
        />
        <div className="share-links" style={{ marginTop: "0.85rem" }}>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={handleDownloadCard}
            disabled={!cardReady}
          >
            Download card
          </button>
        </div>
      </div>
    </div>
  );
}
