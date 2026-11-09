export function createCharacterRecord(character, icons = {}) {
 const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
 };

 const redesigned = character.id === '1501';
 const record = make('article', redesigned ? 'character-record stats-profile' : 'character-record');
 const hero = make('header', 'character-profile');
 const identity = make('div', 'character-identity');
 if (redesigned) identity.append(make('p', 'stats-profile-kicker', '캐릭터 도감'));
 if (!redesigned && character.alias) identity.append(make('p', 'character-alias', character.alias));
 identity.append(make('h1', '', character.name));
 const facts = make('dl');
 for (const [label, value, icon] of [
  ['속성', character.element, icons.element],
  ['직군', character.job, icons.job],
  ['소속', character.affiliation],
  ['역할', character.role],
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
 if (redesigned) {
  const profile = make('dl', 'stats-profile-details');
  for (const [label, value] of [['소개', character.introduction], ['생일', character.birthday]]) {
   const row = make('div');
   row.append(make('dt', '', label), make('dd', '', value || '—'));
   profile.append(row);
  }
  identity.append(profile);
 } else if (character.guideSource) {
  identity.append(make('p', 'character-guide-source', character.guideSource));
 }
 hero.append(identity, picture);
 record.append(hero);

 const navigation = make('nav', 'character-sections');
 navigation.setAttribute('aria-label', '캐릭터 상세 목차');
 const sections = redesigned ? make('div', 'stats-profile-sections') : record;
 if (redesigned) {
  const layout = make('div', 'stats-profile-layout');
  layout.append(navigation, sections);
  record.append(layout);
 } else {
  record.append(navigation);
 }
 for (const [key, label, content] of [
  ['combat', '전투 특징', character.combat],
  ['skills', '스킬', character.skills],
  ['growth', '육성·장비', character.growth],
  ['gallery', '갤러리', character.gallery],
 ]) {
  if (character.guideSource && !content?.length) continue;
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
   const steps = key === 'combat' && character.combatNote ? make('ol', 'character-combat-steps') : null;
   for (const item of content) {
    const entry = make(steps ? 'li' : 'div', 'character-entry');
    entry.append(make('h3', '', item.name));
    if (item.condition) {
     const facts = make('dl', 'character-skill-facts');
     for (const [label, value] of [['발동 조건', item.condition], ['효과', item.description], ['자원 변화', item.resource]]) {
      if (value) facts.append(make('dt', '', label), make('dd', '', value));
     }
     entry.append(facts);
    } else {
     entry.append(make('p', '', item.description));
    }
    if (item.values?.length) {
     const details = make('details', 'character-skill-values');
     details.append(make('summary', '', '레벨 1·10 수치 보기'));
     const table = make('table');
     const head = table.createTHead().insertRow();
     for (const label of ['항목', '레벨 1', '레벨 10']) {
      const cell = make('th', '', label);
      cell.scope = 'col';
      head.append(cell);
     }
     const rows = table.createTBody();
     for (const [label, first, last] of item.values) {
      const row = rows.insertRow();
      const cell = make('th', '', label);
      cell.scope = 'row';
      row.append(cell, make('td', '', first), make('td', '', last));
     }
     details.append(table);
     entry.append(details);
    }
    if (item.url && key === 'gallery') {
     const media = make('a', '', '자료 보기');
     media.href = item.url;
     entry.append(media);
    }
    (steps || section).append(entry);
   }
   if (steps) section.append(steps, make('p', 'character-combat-note', character.combatNote));
  } else {
   section.append(make('p', 'character-section-empty', '등록된 자료가 없습니다.'));
  }
  sections.append(section);
 }
 return record;
}
