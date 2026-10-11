/** Dashboard-compatible placeholders; product templates use only this contract. */
export const emailVariables = {
  confirmationUrl: "{{ .ConfirmationURL }}", token: "{{ .Token }}", tokenHash: "{{ .TokenHash }}",
  siteUrl: "{{ .SiteURL }}", email: "{{ .Email }}", data: "{{ .Data }}", redirectTo: "{{ .RedirectTo }}",
} as const;
export function validateEmailVariables(source: string) {
  const allowed = new Set<string>(Object.values(emailVariables));
  const variables = [...source.matchAll(/{{[\s\S]*?}}/g)].map(match => match[0]);
  for (const variable of variables) {
    const expression = variable.match(/^{{\s*(\.\w+)\s*}}$/)?.[1];
    if (!expression || !allowed.has(`{{ ${expression} }}`)) throw new Error(`Unsupported email placeholder: ${variable}`);
  }
  if (/{{|}}/.test(source.replace(/{{[\s\S]*?}}/g, ""))) throw new Error("Malformed email placeholder");
  return [...new Set(variables)];
}
