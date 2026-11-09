export function createCharacterRecord(character, icons = {}) {
 const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
 };

 const record = make('article', 'character-record');
 const hero = make('header', 'character-profile');
 const identity = make('div', 'character-identity');
 if (character.alias) identity.append(make('p', 'character-alias', character.alias));
 identity.append(make('h1', '', character.name));
 const facts = make('dl');
 for (const [label, value, icon] of [
  ['속성', character.element, icons.element],
  ['직군', character.job, icons.job],
  ['소속', character.affiliation],
 ]) {
  if (!value) continue;
  const row = make('div');
  const definition = make('dd');
  if (icon) {
   const image = make('img');
   image.src = icon;
   image.alt = '';
   definition.append(image);
  }
  definition.append(document.createTextNode(value));
  row.append(make('dt', '', label), definition);
  facts.append(row);
 }
 identity.append(facts);
 const picture = make('img', 'character-profile-art');
 picture.src = character.illustration || character.portrait;
 picture.alt = character.name;
 hero.append(identity, picture);
 record.append(hero);

 const navigation = make('nav', 'character-sections');
 navigation.setAttribute('aria-label', '캐릭터 상세 목차');
 record.append(navigation);
 for (const [key, label, content] of [
  ['combat', '전투 특징', character.combat],
  ['skills', '스킬', character.skills],
  ['growth', '육성·장비', character.growth],
  ['gallery', '갤러리', character.gallery],
 ]) {
  const id = 'character-' + key;
  const link = make('a', '', label);
  link.href = '#' + id;
  navigation.append(link);
  const section = make('section', 'character-section');
  section.id = id;
  section.append(make('h2', '', label));
  if (typeof content === 'string' && content.trim()) {
   section.append(make('p', '', content));
  } else if (Array.isArray(content) && content.length) {
   for (const item of content) {
    const entry = make('div', 'character-entry');
    entry.append(make('h3', '', item.name), make('p', '', item.description));
    if (item.url && key === 'gallery') {
     const media = make('a', '', '자료 보기');
     media.href = item.url;
     entry.append(media);
    }
    section.append(entry);
   }
  } else {
   section.append(make('p', 'character-section-empty', '등록된 자료가 없습니다.'));
  }
  record.append(section);
 }
 return record;
}
