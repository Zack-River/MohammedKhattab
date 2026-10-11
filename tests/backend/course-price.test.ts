import assert from "node:assert/strict";
import { test } from "node:test";
import { validCourseAmount, validPaidPriceInput, normalizeCoursePrice } from "../../modules/features/admin/helpers/course-price";
import { validateCourseEdit } from "../../modules/features/admin/helpers/validate-course-edit";
import { validateCourseCreate } from "../../modules/features/admin/helpers/validate-course-create";
test("Paid text prices accept positive integers and exclude zero, signs, decimals and exponents", () => {
  for (const value of ["1","499","1000000"]) assert.equal(validPaidPriceInput(value),true);
  for (const value of ["0","00","01","-1","+1","1.5","1e3","NaN","1000001"," 5 "]) assert.equal(validPaidPriceInput(value),false);
  assert.equal(validPaidPriceInput(""),true); // Editing may be empty; the required field blocks submission.
});
test("Arabic and Persian digits normalize without accepting malformed prices", () => {
  assert.equal(normalizeCoursePrice("١٢٣٤"),"1234");assert.equal(normalizeCoursePrice("۱۲۳۴"),"1234");
  assert.equal(validPaidPriceInput(normalizeCoursePrice("١٫٥")),false);
});
test("Creation and editing enforce integer amounts; zero remains the canonical free-course value", () => {
  const base={slug:"price-test",title:"Price test",description:"Course description",amount:1,category:"editing",delivery:"recorded",thumbnailUrl:"",introVideoUrl:"",published:false};
  for(const amount of [0,1,1000000]) { assert.equal(validCourseAmount(amount),true);assert.ok(validateCourseCreate({...base,amount}));assert.ok(validateCourseEdit({...base,amount})); }
  for(const amount of [-1,0.5,1200.99,1000001,Infinity,NaN,"10",null]) { assert.equal(validCourseAmount(amount),false);assert.equal(validateCourseCreate({...base,amount}),null);assert.equal(validateCourseEdit({...base,amount}),null); }
});
