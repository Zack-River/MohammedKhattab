export const escapeXml=(text:string)=>text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g,"").replace(/[<>&"']/g,char=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"})[char]!);
/** Wrap by words without losing long titles; SVG text never contains raw markup. */
export function certificateLines(text:string,width=38) {
 const lines:string[]=[];
 for(const word of text.split(/\s+/)) {
  const parts=Array.from(word).reduce<string[]>((chunks,char,index)=>{const chunk=Math.floor(index/width);chunks[chunk]=(chunks[chunk]??"")+char;return chunks;},[]);
  for(const part of parts) {const last=lines.at(-1);if(last && last.length+part.length+1<=width) lines[lines.length-1]=last+" "+part;else lines.push(part);}
 }
 return lines;
}
export function certificateText(text:string,x:number,y:number,size:number,anchor="middle",extra="") {
 return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" direction="rtl" unicode-bidi="plaintext" ${extra}>${escapeXml(text)}</text>`;
}
