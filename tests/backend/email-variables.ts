import assert from "node:assert/strict";
import { emailVariables, validateEmailVariables } from "../../packages/design-system/email/variables";
assert.deepEqual(validateEmailVariables(Object.values(emailVariables).join(" ")), Object.values(emailVariables));
assert.deepEqual(validateEmailVariables("{{.Email}} {{  .SiteURL  }}"), ["{{.Email}}", "{{  .SiteURL  }}"]);
for (const input of ["{{ .NewEmail }}", "{{ .OldEmail }}", "{{ .Phone }}", "{{ .OldPhone }}", "{{ .Password }}", "{{ .Email typo }}", "{{ . Email }}", "{{ .Email }", "{ .Email }}"])
  assert.throws(() => validateEmailVariables(input), /Unsupported|Malformed/);
assert.deepEqual(validateEmailVariables("Plain Arabic text — تعلّم"), []);
console.log("Email placeholder contract passed: seven allowed variables, whitespace variants, scoped/unknown/malformed rejection.");
