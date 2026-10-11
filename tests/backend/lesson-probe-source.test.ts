import assert from "node:assert/strict";
import { test } from "node:test";
import { lessonProbeSource } from "../../modules/helpers/media/lesson-probe-source";
test("Drive metadata uses the admin stream; safe direct sources stay direct", () => {
  const drive="https://drive.google.com/file/d/1234567890/view";
  assert.equal(lessonProbeSource("video-course",drive),"/api/admin/courses/video-course/media/stream?url="+encodeURIComponent(drive));
  assert.equal(lessonProbeSource("video-course"," /assets/video/workshop-intro.mp4 "),"/assets/video/workshop-intro.mp4");
  for(const url of ["","javascript:alert(1)","https://drive.google.com/drive/folders/1234567890","/assets/../file"]) assert.equal(lessonProbeSource("video-course",url),null);
});
