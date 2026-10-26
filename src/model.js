export const newCard = () => ({id:crypto.randomUUID(),name:'Untitled card',type:'Character',cost:'2',power:'3',health:'4',rules:'Write what this card does.',flavor:'Every card has a story.',color:'#467765',art:'',quantity:1});
export function initialProject(){return {version:1,name:'The Wildwood',layout:'classic',cards:[{...newCard(),name:'Mosswood Guardian',rules:'When played, restore 2 health to an allied character.',flavor:'The forest remembers its friends.'},{...newCard(),name:'Ember Fox',color:'#b66b42',cost:'1',power:'2',health:'2',rules:'Quick. Can attack on the turn it enters play.',flavor:'A spark is all it takes.'},{...newCard(),name:'Moonlit Oracle',color:'#79739b',cost:'4',power:'1',health:'5',rules:'Draw two cards. Keep one and return the other to your deck.',flavor:'Tomorrow whispers in silver.'}]};}
export function validateProject(value){
 if(!value || value.version!==1 || typeof value.name!=='string' || !['classic','minimal','full'].includes(value.layout) || !Array.isArray(value.cards) || !value.cards.length || value.cards.length>200) throw Error('Choose a CardCreator project with 1–200 cards.');
 const ids=new Set();
 for(const c of value.cards){if(!c || typeof c.id!=='string' || ids.has(c.id)) throw Error('Card IDs must be unique.');ids.add(c.id);
 for(const k of ['name','type','cost','power','health','rules','flavor','color','art']) if(typeof c[k]!=='string') throw Error('A card is missing required text fields.');
 if(!/^#[0-9a-f]{6}$/i.test(c.color) || !Number.isInteger(c.quantity) || c.quantity<1 || c.quantity>30 || (c.art && !/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(c.art))) throw Error('Invalid card color, artwork, or quantity.');
 }return value;
}
export function printPages(project){const cards=project.cards.flatMap(c=>Array(c.quantity).fill(c));return Array.from({length:Math.ceil(cards.length/9)},(_,i)=>cards.slice(i*9,i*9+9));}
