import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialProject,validateProject,printPages} from '../src/model.js';
test('projects survive JSON export and import with card data',()=>{const p=initialProject();p.cards[0].rules='<script>alert(1)</script>';assert.deepEqual(validateProject(JSON.parse(JSON.stringify(p))),p);});
test('rejects malformed projects and unsafe image sources',()=>{const p=initialProject();p.cards[0].art='javascript:alert(1)';assert.throws(()=>validateProject(p));assert.throws(()=>validateProject({version:1,cards:[]}));});
test('print sheets honor quantities and split after nine cards',()=>{const p=initialProject();p.cards[0].quantity=10;const pages=printPages(p);assert.deepEqual(pages.map(p=>p.length),[9,3]);assert.equal(pages[1][0].id,p.cards[0].id);});
test('duplicate IDs and invalid quantities cannot be imported',()=>{const p=initialProject();p.cards[1].id=p.cards[0].id;assert.throws(()=>validateProject(p));const q=initialProject();q.cards[0].quantity=-1;assert.throws(()=>validateProject(q));});
