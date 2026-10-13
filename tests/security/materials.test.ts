import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMaterial,validMaterialLink} from '../../modules/features/resources/validate-material';
import {readRecordQuery,recordPageHref,recordSearchPattern} from '../../modules/helpers/read-record-query';
const input={revision:0,title:'Lesson resources',description:'',type:'TXT',kind:'text',content:'Practice',assignments:[{courseSlug:'editing',lessonId:'lesson-one'}]};
test('materials validate safe links, distinct attachments and bounded payloads',()=>{
 assert.ok(validateMaterial(input));
 for(const patch of [{revision:null},{revision:2147483648},{revision:1.5},{revision:-1},{id:'bad/id'},{title:' '},{content:'x'.repeat(2001)},{assignments:[]},{assignments:[input.assignments[0],input.assignments[0]]},{assignments:[{courseSlug:'course',lessonId:'../etc'}]},{kind:'link',content:'javascript:alert(1)'},{kind:'link',content:'https://user:pass@example.com'}]) assert.equal(validateMaterial({...input,...patch}),null);
 assert.equal(validMaterialLink('https://drive.google.com/file/d/test/view'),true);
 for(const url of ['http://example.com','https://user@example.com','https://example.com/space here']) assert.equal(validMaterialLink(url),false);
});
test('material query bounds and pagination preserve combined filters without wildcard injection',()=>{
 assert.deepEqual(readRecordQuery({q:[' practice ','ignored'],filter:'link',page:'2'},['link','text']),{search:'practice',filter:'link',page:2});
 assert.deepEqual(readRecordQuery({page:'Infinity',filter:'injected'},['link']),{search:'',filter:'all',page:1});
 assert.equal(recordPageHref('/dashboard/resources',{search:'a & b',filter:'link',page:1},2),'/dashboard/resources?q=a+%26+b&filter=link&page=2');
 assert.equal(recordSearchPattern('a%_\\b'),'%ab%');
});
