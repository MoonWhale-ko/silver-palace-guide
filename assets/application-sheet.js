export const partyPortrait = character => new URL('./party-icons/'+character.id+'.webp',import.meta.url).href;
const template = new URL('./character-application-aged.webp', import.meta.url).href;

export function createApplication(character) {
 const sheet = document.createElement('figure');
 sheet.className = 'application-sheet';
 sheet.dataset.previewOnly = 'true';
 sheet.setAttribute('aria-label', character.name + ' 지원서');
 const paper = document.createElement('img');
 paper.className = 'application-template';
 paper.src = template;
 paper.alt = '실버팰리스 문자로 인쇄한 오래된 지원서 양식';
 paper.width = 1055;
 paper.height = 1491;
 paper.decoding = 'async';
 const photo = document.createElement('img');
 photo.className = 'application-photo';
 photo.src = partyPortrait(character);
 photo.alt = character.name;
 const name = document.createElement('span');
 name.className = 'application-name';
 name.textContent = character.name;
 sheet.append(paper, photo, name);
 return sheet;
}
