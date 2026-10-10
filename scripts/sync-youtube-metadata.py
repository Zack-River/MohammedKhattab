"""Refresh verified YouTube captions/counts without adding a runtime/API dependency.
Run manually: python3 scripts/sync-youtube-metadata.py
Known asset/video associations remain in config/portfolio-youtube.json.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
import json
import re
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT = ROOT / "config/portfolio-youtube.json"
EVIDENCE = ROOT / "docs/evidence/youtube-metadata"


def fetch(association):
    video_id = association["videoId"]
    if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
        raise ValueError("Invalid YouTube video ID")
    url = f"https://www.youtube.com/watch?v={video_id}&hl=en"
    request = Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9"})
    with urlopen(request, timeout=25) as response:
        html = response.read().decode()
    match = re.search(r"(?:var )?ytInitialPlayerResponse\s*=\s*", html)
    if not match:
        raise ValueError(f"YouTube metadata unavailable: {video_id}")
    player = json.JSONDecoder().raw_decode(html[match.end():])[0]
    details = player.get("videoDetails", {})
    if details.get("videoId") != video_id or not details.get("title"):
        raise ValueError(f"Unexpected video metadata: {video_id}")
    views = details.get("viewCount", "")
    if not re.fullmatch(r"\d+", views):
        raise ValueError(f"View count unavailable: {video_id}")
    observed = datetime.now(timezone.utc).isoformat()
    updated = {**association, "title": details["title"], "viewCount": int(views),
               "lengthSeconds": int(details["lengthSeconds"]), "retrievedAt": observed}
    evidence = {"id": video_id, "url": association["url"], "retrievedAt": observed,
                "videoDetails": details, "playabilityStatus": player.get("playabilityStatus", {}).get("status")}
    return updated, evidence


def main():
    associations = json.loads(SNAPSHOT.read_text())
    # Resolve every response before replacing the last verified snapshot.
    with ThreadPoolExecutor(max_workers=6) as executor:
        results = list(executor.map(fetch, associations))
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    for row, evidence in results:
        (EVIDENCE / f"{row['videoId']}.json").write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
    temporary = SNAPSHOT.with_suffix(".json.tmp")
    temporary.write_text(json.dumps([row for row, _ in results], ensure_ascii=False, indent=2) + "\n")
    temporary.replace(SNAPSHOT)
    print(f"Refreshed {len(results)} verified YouTube records. Rebuild both Next.js apps to publish the snapshot.")


if __name__ == "__main__":
    main()
