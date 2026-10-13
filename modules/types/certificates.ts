export type CertificateRecord = import("./database").Database["public"]["Tables"]["certificates"]["Row"];
export type CertificateLabels = {[K in keyof typeof import("@platform/data/certificates").certificateCopy]:string};
export type CertificateAction = {operation:"issue";slug:string;username?:string}|{operation:"revoke"|"restore";id:string;revision:number;reason:string};
