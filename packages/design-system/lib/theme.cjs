/** Controlled token contract: root declarations, recursive var aliases, literal values. */
function parseTokens(sources) {
  const tokens = {};
  for (const source of sources) {
    const clean = source.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const block of clean.matchAll(/:root\s*\{([^}]+)\}/g))
      for (const entry of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
        tokens[entry[1]] = entry[2].trim();
  }
  return tokens;
}
function resolveToken(tokens, name, trail = []) {
  if (trail.includes(name))
    throw new Error(`Cyclic token: ${[...trail, name].join(" -> ")}`);
  if (!Object.hasOwn(tokens, name))
    throw new Error(`Missing theme token ${name}`);
  const result = tokens[name].replace(/var\((--[\w-]+)\)/g, (_, alias) =>
    resolveToken(tokens, alias, [...trail, name]),
  );
  if (/var\(|(?:color-mix|calc)\(/.test(result))
    throw new Error(`Unsupported export expression: ${name}`);
  return result;
}
module.exports = { parseTokens, resolveToken };
