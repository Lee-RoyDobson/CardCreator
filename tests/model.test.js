import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialProject,validateProject,printPages,newLayer,duplexSlots} from '../src/model.js';
test('projects survive JSON export and import with card data',()=>{const p=initialProject();p.cards[0].rules='<script>alert(1)</script>';assert.deepEqual(validateProject(JSON.parse(JSON.stringify(p))),p);});
test('rejects malformed projects and unsafe image sources',()=>{const p=initialProject();p.cards[0].art='javascript:alert(1)';assert.throws(()=>validateProject(p));assert.throws(()=>validateProject({version:1,cards:[]}));});
test('print sheets honor quantities and split after nine cards',()=>{const p=initialProject();p.cards[0].quantity=10;const pages=printPages(p);assert.deepEqual(pages.map(p=>p.length),[9,3]);assert.equal(pages[1][0].id,p.cards[0].id);});
test('duplicate IDs and invalid quantities cannot be imported',()=>{const p=initialProject();p.cards[1].id=p.cards[0].id;assert.throws(()=>validateProject(p));const q=initialProject();q.cards[0].quantity=-1;assert.throws(()=>validateProject(q));});

test('legacy projects gain optional backs, layers, and print defaults',()=>{const p=initialProject();delete p.back;delete p.print;for(const c of p.cards)delete c.layers;const restored=validateProject(p);assert.deepEqual(restored.cards[0].layers,[]);assert.equal(restored.print.mode,'fronts');assert.equal(restored.back.color,'#315941');});
test('custom layers and shared back survive round-trip; invalid geometry is rejected',()=>{const p=initialProject();p.cards[0].layers.push(newLayer());p.back.layers.push(newLayer('shape'));assert.deepEqual(validateProject(JSON.parse(JSON.stringify(p))),p);p.cards[0].layers[0].x=90;assert.throws(()=>validateProject(p));p.cards[0].layers[0].x=10;p.back.layers[0].art='https://example.com/image.png';assert.throws(()=>validateProject(p));});
test('duplex placement mirrors populated and empty positions for either flip edge',()=>{const cards=['a','b','c','d'];assert.deepEqual(duplexSlots(cards,'long'),['c','b','a',null,null,'d',null,null,null]);assert.deepEqual(duplexSlots(cards,'short'),[null,null,null,'d',null,null,'a','b','c']);});
