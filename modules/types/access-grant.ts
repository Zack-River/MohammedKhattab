export type AccessGrant = {kind:"course"|"bundle";slug:string;expiresAt:string|null;reason:string;revisions:Record<string,number>};
export type AccessChoice = {slug:string;title:string;courseSlugs:string[]};
