import { expect, test } from "@playwright/test";
import { renderCertificate } from "../../modules/features/certificates/renderer";
test("T33 renderer escapes learner/issuer XML and receives concrete palette", () => {
  const result = renderCertificate(
    {
      brandName: "بديل <&",
      brandEnglishName: 'A"B',
      learnerName: "طالب <script>",
      courseTitle: "دورة & أخرى",
      title: "شهادة",
      disclaimer: "تجريبي",
    },
    {
      colors: { background: "#101317", primary: "#fc3522", text: "#ffffff" },
      fontBase64: "",
    },
  );
  expect(result).toContain("طالب &lt;script&gt;");
  expect(result).toContain("بديل &lt;&amp;");
  expect(result).not.toContain("<script>");
  expect(result).not.toContain("var(");
  expect(result).toContain('fill="#101317"');
  expect(result).toContain('stroke="#fc3522"');
});
