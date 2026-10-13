import {test} from "node:test";
import assert from "node:assert/strict";
import {validateEnrollment} from "../../modules/features/admin/enrollments/validate";
import {paymentNeedsPolling,paymentStatusHint} from "../../modules/features/payments/helpers/status-hint";
import {paymentCopy} from "../../modules/data/payment-copy";
test("new and existing enrollment revisions are bounded integers",()=>{
 const valid={courseSlug:"editing-foundations",action:"grant",reason:"  Support review  ",revision:0};
 assert.equal(validateEnrollment(valid)?.reason,"Support review");
 for(const revision of [-1,0.5,"0",2147483647,NaN]) assert.equal(validateEnrollment({...valid,revision}),null);
});
test("revoked paid receipts do not poll or imply activation is pending",()=>{
 assert.equal(paymentNeedsPolling("paid",false,true),false);
 assert.equal(paymentStatusHint({status:"paid",enrolled:false,accessRevoked:true},paymentCopy),paymentCopy.revokedHint);
 assert.equal(paymentNeedsPolling("paid",false),true);
});
