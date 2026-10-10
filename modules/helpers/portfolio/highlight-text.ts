/** Highlight every literal match without adding or dropping source text. */
export function highlightText(body: string, emphasis: string) {
  if (!emphasis) return [{ text: body, highlighted: false }];
  return body.split(emphasis).flatMap((text, index) =>
    index ? [{ text: emphasis, highlighted: true }, { text, highlighted: false }]
      : [{ text, highlighted: false }]);
}
