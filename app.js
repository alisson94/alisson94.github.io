'use strict';

const projectDetails = {
  engios: {
    category: 'VISTORIAS E LAUDOS · EM DESENVOLVIMENTO',
    title: 'EngiOS',
    description: 'Sistema web que ajuda engenheiros a transformar registros de vistoria em laudos técnicos.',
    problem: 'Durante uma vistoria, fotos, áudios e anotações precisam ser organizados para compor o laudo.',
    solution: 'A plataforma reúne os registros, usa IA para apoiar a análise e gera um rascunho em Word a partir dos achados confirmados pelo engenheiro.',
    contribution: 'Trabalho no fluxo de laudos, com contribuições nos modelos de documentos, nas legendas das fotos e na organização dos capítulos da vistoria.',
    site: 'https://engios.tech/'
  },
  verificador: {
    category: 'DADOS & AUTOMAÇÃO / PYTHON',
    title: 'O relatório confere?',
    description: 'Verificador de relatórios de compras com cálculos reproduzíveis e testes automatizados.',
    problem: 'Um relatório pode parecer consistente e ainda conter indicadores calculados com filtros, unidades ou períodos incorretos. O projeto nasceu de um exercício de conferência de dez itens de um relatório de compras.',
    solution: 'O script lê o CSV, valida campos e duplicatas, seleciona o período e recalcula os indicadores. Usa Decimal para valores monetários e registra as comparações e os hashes das entradas em JSON. Os códigos de saída distinguem aprovação, divergência e entrada inválida.',
    code: 'Em verificar_relatorio.py, acompanhe a leitura, os filtros e os cálculos. Em test_verificar_relatorio.py, veja casos com contas manuais, duplicatas conflitantes e a reintrodução isolada dos erros do relatório.',
    disclosure: 'O README documenta o uso de Codex como apoio na escrita e revisão do código, dos testes e da documentação.',
    repo: 'https://github.com/alisson94/verificador-relatorios-compras'
  },
  biblioteca: {
    category: 'DESENVOLVIMENTO WEB / NODE.JS',
    title: 'Uma estante, muitos mundos.',
    description: 'Um lugar para organizar leituras e lembrar em qual capítulo parei.',
    problem: 'Acompanhar várias obras significa lidar com títulos, status de leitura, capítulos e links em lugares diferentes. A biblioteca reúne essas informações em um catálogo pessoal.',
    solution: 'A aplicação usa Express e templates EJS para as páginas, Mongoose para os registros no MongoDB e upload de capas com Cloudinary. As rotas incluem cadastro e atualização de obras, manutenção de links e alteração do capítulo atual.',
    code: 'Comece em servidor.js para acompanhar as rotas e operações de persistência. Explore models/ para os dados e views/ para a apresentação das obras.',
    repo: 'https://github.com/alisson94/biblioteca-manhwas'
  },
  monitor: {
    category: 'BACKEND & INTEGRAÇÕES / C#',
    title: 'De olho no próximo sinal.',
    description: 'Monitor de cotações da B3 com parâmetros de compra e venda configuráveis.',
    problem: 'Consultar repetidamente uma cotação para descobrir se ela cruzou um limite é uma tarefa que pode ser automatizada.',
    solution: 'Uma aplicação de console consulta a API brapi com HttpClient, compara o preço com os limites informados e implementa o envio de alertas por SMTP com MailKit e MimeKit. Configurações e intervalo de consulta ficam em JSON.',
    code: 'Em Program.cs, veja a validação dos argumentos e o ciclo de monitoramento. Services/ separa consulta e e-mail. O README explica a configuração e o comportamento dos alertas, inclusive sua repetição a cada ciclo fora dos limites.',
    disclosure: 'O README informa apoio do ChatGPT na documentação e na pesquisa de boas práticas. O envio de e-mail requer configuração SMTP pelo usuário.',
    repo: 'https://github.com/alisson94/desafio-asset-monitor'
  },
  tank: {
    category: 'JOGOS & TEMPO REAL / JAVASCRIPT',
    title: 'Melhor com outro player.',
    description: 'Protótipo de jogo de tanques no navegador com comunicação por Socket.IO.',
    problem: 'Como compartilhar movimento, mira e disparos entre jogadores conectados à mesma partida? Esse experimento explora a comunicação entre navegador e servidor.',
    solution: 'O servidor Express entrega os arquivos do jogo. Eventos de Socket.IO recebem ações dos clientes e distribuem o estado dos jogadores e projéteis. É um experimento de aprendizado de comunicação em tempo real.',
    code: 'Em app.js, veja os eventos de conexão, desconexão, movimento e disparo. Em public/, acompanhe como o cliente desenha o jogo e conversa com o servidor.',
    repo: 'https://github.com/alisson94/tankGameMultiplayer'
  }
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
let paused = reducedMotion.matches;
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project-card')];
const search = document.getElementById('project-search');
let activeCategory = 'todos';
function normalize(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
const searchText = new Map(cards.map(card => {
  const translations = localizedFields
    .filter(field => !field.attribute && card.contains(field.element))
    .flatMap(field => [field.pt, field.en]);
  return [card, normalize([card.textContent, ...translations].join(' '))];
}));

function projectInCurrentLanguage(key) {
  const project = projectDetails[key];
  return language === 'en' ? { ...project, ...englishProjectDetails[key] } : project;
}

function filterProjects(category = activeCategory) {
  activeCategory = category;
  const query = normalize(search.value.trim());
  filters.forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  cards.forEach(card => {
    const wasHidden = card.hidden;
    card.hidden = (category !== 'todos' && card.dataset.category !== category) || !searchText.get(card).includes(query);
    if (!card.hidden) {
      count++;
      card.classList.add('is-visible');
      if (wasHidden && !paused) {
        card.classList.add('entering');
        window.setTimeout(() => card.classList.remove('entering'), 460);
      }
    }
  });
  document.getElementById('result-count').textContent = interfaceCopy[language].results(count);
  document.getElementById('empty-state').hidden = count !== 0;
}
filters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
search.addEventListener('input', () => filterProjects());
document.getElementById('clear-search').addEventListener('click', () => {
  search.value = '';
  filterProjects('todos');
  search.focus({ preventScroll: true });
});
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !dialog.open) {
    event.preventDefault();
    search.focus({ preventScroll: true });
    document.getElementById('projetos').scrollIntoView({ behavior: paused ? 'instant' : 'smooth' });
  }
});
search.addEventListener('keydown', event => {
  if (event.key === 'Escape') { search.value = ''; filterProjects(); }
});

const dialog = document.getElementById('project-dialog');
let lastProjectButton;
function renderProjectDetails(key) {
  const item = projectInCurrentLanguage(key);
  const copy = interfaceCopy[language];
  for (const key of ['category', 'title', 'description', 'problem', 'solution']) {
    document.getElementById(`dialog-${key}`).textContent = item[key];
  }
  document.getElementById('dialog-more-title').textContent = item.contribution ? copy.contribution : copy.code;
  document.getElementById('dialog-code').textContent = item.contribution ?? item.code;
  const disclosure = document.getElementById('dialog-disclosure');
  disclosure.textContent = item.disclosure || '';
  disclosure.hidden = !item.disclosure;
  document.getElementById('dialog-repo').href = item.site ?? item.repo;
  document.getElementById('dialog-link-label').textContent = item.site ? copy.visitEngios : copy.repository;
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-project]');
  if (!button || !Object.hasOwn(projectDetails, button.dataset.project)) return;
  lastProjectButton = button;
  renderProjectDetails(button.dataset.project);
  document.body.classList.add('dialog-open');
  dialog.showModal();
  dialog.scrollTop = 0;
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); lastProjectButton?.focus({ preventScroll: true }); });

const skills = {
  TypeScript: ['Sistemas internos e funcionalidades de CRM desenvolvidos na Venda Tech IA com React e Next.js.', ['engios']],
  JavaScript: ['Aplicações web e experimentos de comunicação em tempo real no navegador.', ['biblioteca', 'tank']],
  React: ['Interfaces de sistemas internos e CRM na experiência com a Venda Tech IA.', ['engios']],
  'Next.js': ['Desenvolvimento de sistemas internos com React e TypeScript na Venda Tech IA.', ['engios']],
  'Node.js': ['Servidor web, persistência de dados e troca de eventos entre clientes e servidor.', ['biblioteca', 'tank']],
  Python: ['Conferência de indicadores e testes automatizados. Também usei Python na pesquisa de desempenho com o Speedupy.', ['verificador']],
  Java: ['Desenvolvimento backend de um sistema de ponto eletrônico de monitores na Fábrica de Software do Centro Universitário Vale do Salgado.', []],
  PHP: ['Sistema para empréstimo de equipamentos de TI e reserva de salas na experiência com a Fábrica de Software.', []],
  'C#': ['Aplicação de console que consulta cotações por HTTP e implementa alertas por SMTP.', ['monitor']],
  SQL: ['Consultas e desenvolvimento backend na experiência com a Fábrica de Software.', []],
  MySQL: ['Banco de dados relacional presente no meu repertório técnico, junto de consultas SQL.', []],
  MongoDB: ['Dados das obras, links de leitura e progresso dos capítulos na biblioteca pessoal.', ['biblioteca']],
  Supabase: ['Integrações de chatbots e funcionalidades de sistemas internos na Venda Tech IA.', ['engios']],
  n8n: ['Fluxos de chatbots com IA para atendimento, agendamento e acompanhamento de leads na Venda Tech IA.', []],
  APIs: ['Integrações com serviços externos: cotações no monitor e APIs do WhatsApp na experiência profissional.', ['monitor']],
  Git: ['Versionamento de código e organização das alterações. Explore os repositórios para acompanhar as implementações.', ['verificador', 'biblioteca', 'monitor', 'tank']],
  Docker: ['Ferramenta do meu repertório técnico para trabalhar com ambientes em contêineres.', []],
  'C++': ['Linguagem presente no meu repertório de Engenharia de Computação.', []],
  LabVIEW: ['Lógica de defesa dos zagueiros e do goleiro dos robôs da RoboIME na categoria Small Size League.', []]
};
const skillButtons = [...document.querySelectorAll('[data-skill]')];
let selectedSkill = null;

function renderSkill() {
  const title = document.getElementById('skill-title');
  const descriptionElement = document.getElementById('skill-description');
  const copy = interfaceCopy[language];
  if (!selectedSkill) {
    title.textContent = copy.chooseSkill;
    descriptionElement.textContent = copy.skillPrompt;
    return;
  }
  const [description, projects] = skills[selectedSkill];
  title.textContent = selectedSkill;
  descriptionElement.textContent =
    language === 'en' ? englishSkillDescriptions[selectedSkill] : description;
  const links = document.getElementById('skill-links');
  links.replaceChildren();
  for (const key of projects) {
    const link = document.createElement('button');
    link.dataset.project = key;
    link.textContent = `${projectInCurrentLanguage(key).title} ↗`;
    links.append(link);
  }
  if (!projects.length) {
    const link = document.createElement('a');
    link.href = '#sobre';
    link.textContent = copy.journey;
    links.append(link);
  }
}

skillButtons.forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    selectedSkill = button.dataset.skill;
    for (const item of skillButtons) item.setAttribute('aria-pressed', String(item === button));
    renderSkill();
  });
});
let copyStatus = null;
function renderCopyStatus() {
  document.getElementById('copy-status').textContent = copyStatus ? interfaceCopy[language][copyStatus] : '';
}
document.getElementById('copy-contact').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('https://www.linkedin.com/in/alisson-nunes-santana/');
    copyStatus = 'copied';
  } catch {
    copyStatus = 'copyFailed';
  }
  renderCopyStatus();
});

// Original abstract pixel art: binary particles, changing glyphs and circuit waves.
// This layer is decorative and never intercepts navigation or keyboard input.
const hero = document.getElementById('inicio');
const canvas = document.getElementById('signal-field');
const ctx = canvas.getContext('2d');
let fieldWidth = 0, fieldHeight = 0, frame = 0, lastFrame = 0, elapsed = 0;
let heroVisible = true, mode = 1;
const pointer = { x: -1000, y: -1000 };
const pulses = [];
const particles = Array.from({length:100}, (_,i) => ({
  x: ((i * 73 + 17) % 997) / 997,
  y: ((i * 137 + 41) % 991) / 991,
  speed: .4 + (i % 5) * .12,
  digit: i % 2,
  phase: i * 3.17
}));
const glyphPatterns = {
  '<':['00010','00100','01000','10000','01000','00100','00010'],
  '>':['01000','00100','00010','00001','00010','00100','01000'],
  '0':['01110','11011','11011','11011','11011','11011','01110'],
  '1':['00100','01100','00100','00100','00100','00100','01110'],
  '*':['00100','10101','01110','11111','01110','10101','00100'],
  '#':['01010','01010','11111','01010','11111','01010','01010']
};
const glyphPairs = [['<','>'],['0','1'],['*','#']];
let glyphPixels = [];
function rebuildGlyphs() {
  const next = [];
  const size = Math.max(3,Math.min(9,fieldWidth/70));
  glyphPairs[mode].forEach((key,side) => {
    const xOrigin = fieldWidth * (side ? .88 : .12) - size * 2.5;
    const yOrigin = fieldHeight * .42 - size * 3.5;
    glyphPatterns[key].forEach((row,y) => [...row].forEach((value,x) => {
      if (value === '1') next.push({tx:xOrigin+x*size,ty:yOrigin+y*size,size:size*.72,side});
    }));
  });
  glyphPixels = next.map((point,i) => ({...point,x:paused?point.tx:(glyphPixels[i]?.x ?? point.tx),y:paused?point.ty:(glyphPixels[i]?.y ?? point.ty)}));
}
function resizeField() {
  const bounds = hero.getBoundingClientRect();
  fieldWidth = canvas.width = Math.ceil(bounds.width / 2);
  fieldHeight = canvas.height = Math.ceil(bounds.height / 2);
  ctx.imageSmoothingEnabled = false;
  rebuildGlyphs();
  if (paused) drawField(0);
}
function drawField(timestamp) {
  frame = 0;
  if (!paused && timestamp-lastFrame < 33) { scheduleField(); return; }
  const dt = paused ? 0 : Math.min(50, timestamp-lastFrame || 33);
  lastFrame = timestamp;
  if (!paused) elapsed += dt;
  ctx.clearRect(0,0,fieldWidth,fieldHeight);
  ctx.font = '7px monospace';
  particles.forEach((p,i) => {
    const x = p.x * fieldWidth;
    const y = ((p.y - elapsed * .000014 * p.speed + 100) % 1) * fieldHeight;
    const distance = Math.hypot(x-pointer.x,y-pointer.y);
    const force = Math.max(0,1-distance/80);
    const angle = Math.atan2(y-pointer.y,x-pointer.x);
    const px = x + Math.cos(angle)*force*22;
    const py = y + Math.sin(angle)*force*22;
    const center = Math.abs(x-fieldWidth/2)<fieldWidth*.32 && y>fieldHeight*.13 && y<fieldHeight*.81;
    const alpha = center ? .07 : .18+(i%4)*.05;
    ctx.fillStyle = `rgba(${force>.1?'160,212,255':'78,140,216'},${Math.min(.7,alpha+force*.35)})`;
    if(i%3)ctx.fillText(String((p.digit+Math.floor(elapsed/2400+i))%2),Math.round(px),Math.round(py));
    else ctx.fillRect(Math.round(px),Math.round(py),i%2?2:3,i%2?2:3);
  });
  // Pixel columns make a quiet, stepped wave beneath the typography.
  for(let x=0;x<fieldWidth;x+=6){
    const wave = 15+Math.sin(x*.026+elapsed*.00017+mode)*11+Math.cos(x*.057-elapsed*.0001)*9;
    const height = Math.floor(Math.abs(wave)/4)*4;
    for(let y=0;y<height;y+=5){
      ctx.fillStyle = `rgba(50,119,212,${.12+(height-y)/160})`;
      ctx.fillRect(x,fieldHeight-28-y,3,3);
    }
  }
  glyphPixels.forEach((p,i) => {
    const drift = paused?0:Math.sin(elapsed*.0006+p.side)*3;
    const distance = Math.hypot(p.tx-pointer.x,p.ty-pointer.y);
    const force = Math.max(0,1-distance/70);
    const angle = Math.atan2(p.ty-pointer.y,p.tx-pointer.x);
    p.x += (p.tx+Math.cos(angle)*force*18-p.x)*.12;
    p.y += (p.ty+drift+Math.sin(angle)*force*18-p.y)*.12;
    ctx.fillStyle = i%4?'rgba(69,139,237,.23)':'rgba(119,196,255,.43)';
    ctx.fillRect(Math.round(p.x),Math.round(p.y),Math.ceil(p.size),Math.ceil(p.size));
  });
  for(let i=pulses.length-1;i>=0;i--){
    const pulse=pulses[i];
    if(!paused)pulse.age+=dt;
    const progress=pulse.age/800;
    if(progress>=1){pulses.splice(i,1);continue;}
    ctx.fillStyle=`rgba(126,199,255,${(1-progress)*.5})`;
    for(let n=0;n<24;n++){
      const angle=n*Math.PI/12;
      ctx.fillRect(Math.round(pulse.x+Math.cos(angle)*progress*100),Math.round(pulse.y+Math.sin(angle)*progress*100),2,2);
    }
  }
  scheduleField();
}
function scheduleField(){if(!paused&&heroVisible&&!document.hidden&&!frame)frame=requestAnimationFrame(drawField);}
hero.addEventListener('pointermove',event=>{
  if(!finePointer.matches||paused)return;
  const bounds=hero.getBoundingClientRect();
  pointer.x=(event.clientX-bounds.left)/2;pointer.y=(event.clientY-bounds.top)/2;
});
hero.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-1000;});
hero.addEventListener('click',event=>{
  if(paused||event.target.closest('a,button'))return;
  const bounds=hero.getBoundingClientRect();
  pulses.push({x:(event.clientX-bounds.left)/2,y:(event.clientY-bounds.top)/2,age:0});
});
function renderSignalCaption() {
  document.getElementById('signal-caption').textContent = interfaceCopy[language].captions[mode];
}
document.querySelectorAll('[data-signal]').forEach(button=>button.addEventListener('click',()=>{
  mode=Number(button.dataset.signal);
  document.querySelectorAll('[data-signal]').forEach(item=>{
    item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));
  });
  renderSignalCaption();
  rebuildGlyphs();if(paused)drawField(0);
}));
const animationToggle=document.getElementById('animation-toggle');
function renderMotionLabel() {
  const copy = interfaceCopy[language];
  animationToggle.setAttribute('aria-label', paused ? copy.play : copy.pause);
}
function updateMotion(){
  cancelAnimationFrame(frame);frame=0;lastFrame=0;
  animationToggle.setAttribute('aria-pressed',String(paused));
  renderMotionLabel();
  animationToggle.firstElementChild.textContent=paused?'▷':'Ⅱ';
  document.body.classList.toggle('animations-paused',paused);
  if(paused){pulses.length=0;cards.forEach(card=>{card.style.removeProperty('--rx');card.style.removeProperty('--ry');});}
  drawField(0);
}
animationToggle.addEventListener('click',()=>{paused=!paused;updateMotion();});
reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;updateMotion();});
new ResizeObserver(resizeField).observe(hero);
new IntersectionObserver(entries=>{
  heroVisible=entries[0].isIntersecting;
  if(heroVisible)scheduleField();else{cancelAnimationFrame(frame);frame=0;}
}).observe(hero);
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);frame=0;if(!document.hidden){lastFrame=0;scheduleField();}});
resizeField();updateMotion();
document.getElementById('result-count').textContent = interfaceCopy[language].results(cards.length);
renderSignalCaption();
renderSkill();
watchLanguageChanges(() => {
  filterProjects();
  renderSignalCaption();
  renderMotionLabel();
  renderSkill();
  renderCopyStatus();
  if (dialog.open && lastProjectButton) renderProjectDetails(lastProjectButton.dataset.project);
});

// Hover depth and a small pixel burst are available to precise pointers.
cards.forEach(card=>{
  card.addEventListener('pointermove',event=>{
    if(!finePointer.matches||paused)return;
    const bounds=card.getBoundingClientRect();
    const x=(event.clientX-bounds.left)/bounds.width;
    const y=(event.clientY-bounds.top)/bounds.height;
    card.style.setProperty('--rx',`${(0.5-y)*3}deg`);
    card.style.setProperty('--ry',`${(x-0.5)*3}deg`);
    card.style.setProperty('--px',`${x*100}%`);card.style.setProperty('--py',`${y*100}%`);
  });
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');});
});
document.querySelectorAll('.button,.filter,.signal-mode').forEach(button=>button.addEventListener('click',event=>{
  if(paused)return;
  const bounds=button.getBoundingClientRect();
  const x=event.detail?event.clientX:bounds.left+bounds.width/2;
  const y=event.detail?event.clientY:bounds.top+bounds.height/2;
  for(let i=0;i<8;i++){
    const pixel=document.createElement('i');pixel.className='pixel-burst';pixel.setAttribute('aria-hidden','true');
    pixel.style.left=`${x}px`;pixel.style.top=`${y}px`;
    pixel.style.setProperty('--dx',`${Math.cos(i*Math.PI/4)*(20+i*3)}px`);
    pixel.style.setProperty('--dy',`${Math.sin(i*Math.PI/4)*(20+i*3)}px`);
    document.body.append(pixel);window.setTimeout(()=>pixel.remove(),700);
  }
}));

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});
},{threshold:.08});
document.querySelectorAll('.section-heading,.project-card,.about-copy,.journey article,.inventory-grid article,.skill-inspector,.contact-section').forEach((element,i)=>{
  element.classList.add('reveal');element.style.setProperty('--delay',`${(i%2)*85}ms`);revealObserver.observe(element);
});
document.body.classList.add('reveal-ready');
const navLinks=[...document.querySelectorAll('.site-header nav a[href^="#"]')];
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>{
    if(link.getAttribute('href')===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  });}});
},{rootMargin:'-15% 0px -55% 0px'});
navLinks.forEach(link=>sectionObserver.observe(document.querySelector(link.getAttribute('href'))));

const progressBar = document.getElementById('scroll-progress');
let progressFrame = 0;

function updateScrollProgress() {
  progressFrame = 0;
  const page = document.documentElement;
  const maxScroll = page.scrollHeight - page.clientHeight;
  const scroll = Math.max(0, window.scrollY);
  // Layout height is rounded while the scroll position can be fractional.
  const progress = maxScroll <= 0 ? 0 : maxScroll - scroll <= 1 ? 1 : scroll / maxScroll;
  progressBar.style.transform = `scaleX(${progress})`;
}

function scheduleScrollProgress() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateScrollProgress);
}

window.addEventListener('scroll', scheduleScrollProgress, { passive: true });
window.addEventListener('resize', scheduleScrollProgress);
new ResizeObserver(scheduleScrollProgress).observe(document.body);
updateScrollProgress();
