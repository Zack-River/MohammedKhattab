/* eslint-disable @typescript-eslint/no-require-imports -- Isolated local payment provider, never charges money. */
const http = require('node:http'), {randomUUID}=require('node:crypto');
function paymentGateway() {
 const transactions = new Map(); let created = 0, lookups = 0;
 const server=http.createServer(async(req,res)=>{
  let raw='';for await(const chunk of req) raw+=chunk;
  const body=raw?JSON.parse(raw):{};
  res.setHeader('Content-Type','application/json');
  if(req.url==='/oauth/token'){res.end(JSON.stringify({access_token:'local-payment-token',expires_in:3600}));return;}
  if(req.headers.authorization!=='Bearer local-payment-token'){res.statusCode=401;res.end('{}');return;}
  if(req.url==='/api/v3/createTransaction'){
   const intent=randomUUID();created++;transactions.set(intent,{intent_key:intent,transaction_id:created,paid:0,total:body.cartTotal,currency:body.currency,pay_load:body.pay_load,status_text:'unpaid',paid_at:null,request:body});
   res.end(JSON.stringify({status:'success',data:{intent_key:intent,url:`http://127.0.0.1:3046/ts/${intent}?lg=ar`,expires_in:172800}}));return;
  }
  if(req.url==='/api/v3/getTransactionData'){lookups++;res.end(JSON.stringify({status:'success',data:transactions.get(body.intent_key)}));return;}
  res.statusCode=404;res.end('{}');
 });
 return {server,transactions,counts:()=>({created,lookups})};
}
module.exports={paymentGateway};
