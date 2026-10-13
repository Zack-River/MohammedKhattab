/** Reserve 100% for exact completion while retaining ordinary rounded percentages. */
export function completionPercent(count:number,total:number) {return total?Math.min(count<total?99:100,Math.round(count/total*100)):0;}
