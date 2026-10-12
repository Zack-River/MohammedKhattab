import assert from "node:assert/strict";
import test from "node:test";
import { getYouTubeEmbedUrl } from "../../packages/design-system/lib/video";
import { playableUrl } from "../../modules/helpers/media/playable-url";
import { lessonProbeSource } from "../../modules/helpers/media/lesson-probe-source";
const id = "svTNN9S7ipc", embed = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`;
test("YouTube formats resolve through the same course playback helper", () => {
  for (const url of [`https://youtu.be/${id}?si=share`, `https://www.youtube.com/watch?v=${id}&list=playlist`, `https://m.youtube.com/watch?v=${id}`, `https://youtube.com/shorts/${id}`, `https://youtube.com/live/${id}`, `https://www.youtube-nocookie.com/embed/${id}`]) {
    assert.equal(getYouTubeEmbedUrl(url), embed);
    assert.equal(playableUrl(url, "course", "lesson"), embed);
    assert.equal(lessonProbeSource("course", url), url);
  }
});
test("YouTube embeds reject spoofed hosts, credentials, invalid IDs and playlist-only links", () => {
  for (const url of [`https://youtube.com.evil.example/watch?v=${id}`, `https://user:password@youtube.com/watch?v=${id}`, `https://youtube.com:444/watch?v=${id}`, `http://youtube.com/watch?v=${id}`, "https://youtube.com/playlist?list=abc", "https://youtu.be/short", "javascript:alert(1)"])
    assert.equal(getYouTubeEmbedUrl(url), null);
});
test("Drive and direct-file playback retain their existing routing", () => {
  assert.equal(playableUrl("https://drive.google.com/file/d/1234567890/view", "course", "lesson"), "/api/courses/course/lessons/lesson/stream");
  assert.equal(playableUrl("/assets/video/workshop-intro.mp4", "course"), "/assets/video/workshop-intro.mp4");
});
