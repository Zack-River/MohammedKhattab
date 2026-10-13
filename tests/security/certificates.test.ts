import {certificateResponse} from "../../modules/features/certificates/document";
import {requestPolicy} from "../../modules/lib/security/request-policy";
import ProgressBar from "../../modules/components/ui/progress-bar";
import {completionPercent} from "../../modules/helpers/completion-percent";
import assert from "node:assert/strict";
import {test} from "node:test";
import {validateCertificate} from "../../modules/features/certificates/validate";
import {renderCertificate} from "../../modules/features/certificates/renderer";
import {certificateLines} from "../../modules/features/certificates/xml";
import {courseProgress} from "../../modules/features/learning/helpers/course-progress";
import {createCourseMetadata} from "../../modules/features/admin/helpers/create-course-metadata";
test("Certificate payloads cannot assign a learner or moderation authority",()=>{
 assert.deepEqual(validateCertificate({operation:"issue",slug:"editing-course"}),{operation:"issue",slug:"editing-course"});
 for(const value of [{operation:"issue",slug:"editing-course",username:"someone"},{operation:"issue",slug:"../evil"},{operation:"revoke",id:"x",revision:1,reason:"x"}]) assert.equal(validateCertificate(value),null);
 assert.equal(validateCertificate({operation:"issue",slug:"editing",username:"user"},true)?.operation,"issue");
});
test("Certificate XML escapes names, titles, serials, labels and watermarks",()=>{
 const value='طالب <script> & "';const svg=renderCertificate({brandName:value,brandEnglishName:value,learnerName:value,courseTitle:value,title:value,disclaimer:value,watermark:value,serial:value},{colors:{primary:"#fc3522",background:"#101317",text:"#fff"},fontBase64:""});
 assert.ok(!svg.includes('<script>'));assert.ok(svg.includes('&lt;script&gt;'));assert.ok(svg.includes('direction="rtl"'));assert.ok(svg.includes('width="1200"'));assert.ok(!svg.includes('var('));
 assert.equal(certificateLines('a'.repeat(150)).join('').length,150);
});
test("Completion never rounds an unfinished large course to 100%",()=>{
 const course=createCourseMetadata({slug:"large-course",title:"Large",description:"Course",amount:1,category:"editing",delivery:"recorded"},{currency:"EGP",action:"Enroll",liveLabel:"Live"});
 const lessons=Array.from({length:250},(_,index)=>({id:String(index),title:"Lesson",duration:"1:00",durationSeconds:60,description:"",videoUrl:"",resourceIds:[],takeaway:[]}));
 course.modules=[{title:"Chapter",lessons}];assert.equal(courseProgress(course,{completed:lessons.slice(0,-1).map(lesson=>course.slug+"/"+lesson.id)}).percent,99);
 assert.equal(courseProgress(course,{completed:lessons.map(lesson=>course.slug+"/"+lesson.id)}).percent,100);
});

test("Progress presentation validates the same exact-completion percentage",()=>{
 const props={count:2,total:3,percent:completionPercent(2,3),copy:{progress:"Progress",lessons:"Lessons"}};
 assert.equal(props.percent,67);assert.doesNotThrow(()=>ProgressBar(props));assert.throws(()=>ProgressBar({...props,percent:100}));
});

test("Certificate document policy permits embedded fonts while disabling scripts and network requests",()=>{
 const response=certificateResponse("<svg/>","certificate",true),policy=response.headers.get("content-security-policy")!;
 assert.ok(policy.includes("font-src data:"));assert.ok(policy.includes("script-src 'none'"));assert.ok(policy.includes("default-src 'none'"));assert.equal(response.headers.get("content-disposition"),'inline; filename="certificate.svg"');
});
test("Proxy grants embedded font access only to certificate document GETs",()=>{
 for(const path of ["/api/certificates/editing-course","/api/admin/certificates/preview","/api/admin/certificates/1234-abcd"])
  assert.ok(requestPolicy({method:"GET",url:"https://example.com"+path},"nonce").includes("font-src data:"));
 for(const [method,path] of [["POST","/api/certificates/editing-course"],["GET","/api/admin/certificates"],["GET","/dashboard"],["GET","/api/admin/certificates/id/other"]])
  assert.ok(requestPolicy({method,url:"https://example.com"+path},"nonce").includes("font-src 'self'"));
});
