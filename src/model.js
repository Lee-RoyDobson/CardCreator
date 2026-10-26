export const newCard = () => ({id:crypto.randomUUID(),name:'Untitled card',type:'Character',cost:'2',power:'3',health:'4',rules:'Write what this card does.',flavor:'Every card has a story.',color:'#467765',art:'',quantity:1,layers:[]});
export function initialProject(){return upgradeProject({version:1,name:'The Wildwood',layout:'classic',cards:[{...newCard(),name:'Mosswood Guardian',rules:'When played, restore 2 health to an allied character.',flavor:'The forest remembers its friends.'},{...newCard(),name:'Ember Fox',color:'#b66b42',cost:'1',power:'2',health:'2',rules:'Quick. Can attack on the turn it enters play.',flavor:'A spark is all it takes.'},{...newCard(),name:'Moonlit Oracle',color:'#79739b',cost:'4',power:'1',health:'5',rules:'Draw two cards. Keep one and return the other to your deck.',flavor:'Tomorrow whispers in silver.'}]});}
export function validateProject(value){
 if(!value || value.version!==1 || typeof value.name!=='string' || !['classic','minimal','full'].includes(value.layout) || !Array.isArray(value.cards) || !value.cards.length || value.cards.length>200) throw Error('Choose a CardCreator project with 1–200 cards.');
 const ids=new Set();
 for(const c of value.cards){if(!c || typeof c.id!=='string' || ids.has(c.id)) throw Error('Card IDs must be unique.');ids.add(c.id);
 for(const k of ['name','type','cost','power','health','rules','flavor','color','art']) if(typeof c[k]!=='string') throw Error('A card is missing required text fields.');
 if(!/^#[0-9a-f]{6}$/i.test(c.color) || !Number.isInteger(c.quantity) || c.quantity<1 || c.quantity>30 || (c.art && !/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(c.art))) throw Error('Invalid card color, artwork, or quantity.');
 }return validateExtensions(upgradeProject(value));
}
export function printPages(project){const cards=project.cards.flatMap(c=>Array(c.quantity).fill(c));return Array.from({length:Math.ceil(cards.length/9)},(_,i)=>cards.slice(i*9,i*9+9));}

export const defaultBack = () => ({name:'Card back',color:'#315941',art:'',layers:[]});
export const newLayer = (kind='text') => ({id:crypto.randomUUID(),kind,text:kind==='text'?'Your text':'',x:10,y:10,width:70,height:18,fontSize:18,color:'#ffffff',fill:kind==='shape'?'#315941':'transparent',art:''});
export function upgradeProject(project){
 project.back ??= defaultBack();
 project.print ??= {mode:'fronts',flip:'long'};
 for(const c of project.cards)c.layers ??= [];
 return project;
}
export function validateExtensions(project){
 const color=v=>/^#[0-9a-f]{6}$/i.test(v);
 const image=v=>typeof v==='string'&&(!v||/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(v));
 const b=project.back;
 if(!b||typeof b.name!=='string'||!color(b.color)||!image(b.art))throw Error('Invalid card back.');
 if(!['fronts','duplex','bleed'].includes(project.print?.mode)||!['long','short'].includes(project.print?.flip))throw Error('Invalid print settings.');
 for(const target of [...project.cards,b]){
 if(!Array.isArray(target.layers)||target.layers.length>50)throw Error('Each side supports up to 50 layers.');
 const ids=new Set();
 for(const l of target.layers){
 if(!l||typeof l.id!=='string'||ids.has(l.id)||!['text','shape','image'].includes(l.kind)||typeof l.text!=='string'||!image(l.art)||!color(l.color)||!(l.fill==='transparent'||color(l.fill)))throw Error('Invalid layer.');
 ids.add(l.id);
 for(const k of ['x','y','width','height','fontSize'])if(!Number.isFinite(l[k]))throw Error('Invalid layer dimensions.');
 if(l.x<0||l.y<0||l.width<1||l.height<1||l.x+l.width>100.001||l.y+l.height>100.001||l.fontSize<6||l.fontSize>72)throw Error('Layer must fit inside the card.');
 }
 }return project;
}
export function duplexSlots(cards,flip='long'){
 const slots=Array.from({length:9},(_,i)=>cards[i]||null);
 return slots.map((_,i)=>slots[flip==='long'?Math.floor(i/3)*3+2-i%3:(2-Math.floor(i/3))*3+i%3]);
}
