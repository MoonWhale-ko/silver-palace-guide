// Verified public identity data; the admin mock application is intentionally excluded.
export function createCharacterRecord(character){
 const sheet=document.createElement('article');sheet.className='application-sheet character-summary';
 const photo=document.createElement('img');photo.className='character-summary-portrait';photo.src=character.portrait;photo.alt=character.name;
 const title=document.createElement('h3');title.textContent=character.name;
 const meta=document.createElement('p');meta.textContent=character.element+' · '+character.job;
 sheet.append(photo,title,meta);return sheet;
}
