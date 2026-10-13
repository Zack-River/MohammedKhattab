import { test } from "node:test";
import assert from "node:assert/strict";
import { adminPreviewVideoUrl } from "../../modules/features/admin/helpers/preview-video-url";
import { routes } from "../../modules/config/navigation";
test("Admin preview normalizes YouTube, scopes Drive to protected draft stream and rejects unsafe links", () => {
  assert.match(adminPreviewVideoUrl("https://youtu.be/h1G6qEPRIPg"), /youtube.*\/embed\/h1G6qEPRIPg/);
  const drive = "https://drive.google.com/file/d/1pVLFPEqSMCXJAjAR3VRl69hg_3zVQctu/view";
  assert.match(adminPreviewVideoUrl(drive, "draft-course"), /^\/api\/admin\/courses\/draft-course\/media\/stream\?url=/);
  assert.equal(adminPreviewVideoUrl(drive), "");
  assert.equal(adminPreviewVideoUrl("javascript:alert(1)", "draft-course"), "");
  assert.equal(adminPreviewVideoUrl("/assets/video/workshop-intro.mp4"), "/assets/video/workshop-intro.mp4");
});
test("Featured destinations are independent from course details and payment", () => {
  assert.equal(routes.featured("course"), "/featured/course");
  assert.equal(routes.featured("course", "bundle"), "/featured/course?kind=bundle");
  assert.equal(routes.course("course", "live"), "/courses/course");
  assert.equal(routes.checkout("course"), "/checkout/course");
  assert.throws(() => routes.featured("../private"));
});
