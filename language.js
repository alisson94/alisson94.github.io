'use strict';

const englishProjectDetails = {
  engios: {
    category: 'INSPECTIONS & REPORTS · IN DEVELOPMENT',
    title: 'EngiOS',
    description: 'A web application that helps engineers turn inspection records into technical reports.',
    problem: 'Engineers need to organize photos, audio recordings and notes from an inspection before they can write the report.',
    solution: 'The platform brings those records together, uses AI to assist with analysis and generates a Word draft from the findings the engineer confirms.',
    contribution: 'I work on the reporting workflow, including document templates, photo captions and the structure of inspection chapters.'
  },
  verificador: {
    category: 'DATA & AUTOMATION / PYTHON',
    title: 'Do the numbers add up?',
    description: 'A purchase report validator with reproducible calculations and automated tests.',
    problem: 'A report can look consistent even when metrics use the wrong filters, units or dates. This project started as an exercise to check ten items in a purchase report.',
    solution: 'The script reads the CSV, validates fields and duplicates, selects the date range and recalculates the metrics. It uses Decimal for currency and records comparisons and input hashes in JSON. Exit codes distinguish a passing report, discrepancies and invalid input.',
    code: 'See verificar_relatorio.py for parsing, filtering and calculations. The tests in test_verificar_relatorio.py cover hand-checked totals, conflicting duplicates and each report error in isolation.',
    disclosure: 'The README documents how I used Codex to help write and review the code, tests and documentation.'
  },
  biblioteca: {
    category: 'WEB DEVELOPMENT / NODE.JS',
    title: 'One bookshelf, many worlds.',
    description: 'A place to organize my reading and remember where I left off.',
    problem: 'Following several series means keeping track of titles, reading status, chapters and links scattered across different places. This library brings them together in a personal catalog.',
    solution: 'The app uses Express and EJS for its pages, Mongoose for MongoDB records and Cloudinary for cover uploads. Its routes handle adding and updating titles, managing links and changing the current chapter.',
    code: 'Start with servidor.js for routes and persistence, then see models/ for the data and views/ for the catalog pages.'
  },
  monitor: {
    category: 'BACKEND & INTEGRATIONS / C#',
    title: 'Watching for the next signal.',
    description: 'A B3 stock price monitor with configurable buy and sell thresholds.',
    problem: 'Repeatedly checking whether a stock price has crossed a threshold is a task a script can handle.',
    solution: 'A console app queries the brapi API with HttpClient, compares the price against the configured thresholds and sends SMTP alerts with MailKit and MimeKit. Settings and polling intervals are stored in JSON.',
    code: 'See Program.cs for argument validation and the monitoring loop. Services/ separates price lookups from email delivery. The README explains setup and when alerts repeat.',
    disclosure: 'The README documents how ChatGPT helped with documentation and research. Sending email requires your own SMTP configuration.'
  },
  tank: {
    category: 'GAMES & REAL-TIME SYSTEMS / JAVASCRIPT',
    title: 'Better with another player.',
    description: 'A browser-based tank game prototype powered by Socket.IO.',
    problem: 'How can players in the same match share movement, aiming and shots? This prototype explores communication between browser clients and the server.',
    solution: 'An Express server serves the game files. Socket.IO events receive player actions and broadcast player and projectile state. I built it to learn about real-time communication.',
    code: 'See app.js for connection, disconnection, movement and shooting events. In public/, you can see how the client renders the game and communicates with the server.'
  }
};

const englishSkillDescriptions = {
  TypeScript: 'Internal systems and CRM features built at Venda Tech IA with React and Next.js.',
  JavaScript: 'Web applications and experiments with real-time browser communication.',
  React: 'Interfaces for internal tools and CRM at Venda Tech IA.',
  'Next.js': 'Internal systems built with React and TypeScript at Venda Tech IA.',
  'Node.js': 'Web servers, data persistence and events shared between clients and servers.',
  Python: 'Report validation and automated tests. I also used Python for performance research with Speedupy.',
  Java: 'Backend development for a time-tracking system for teaching assistants at Centro Universitário Vale do Salgado.',
  PHP: 'A system for borrowing IT equipment and booking rooms, built during my time at Fábrica de Software.',
  'C#': 'A console app that fetches stock prices over HTTP and sends SMTP alerts.',
  SQL: 'Queries and backend development during my time at Fábrica de Software.',
  MySQL: 'A relational database I use alongside SQL queries.',
  MongoDB: 'Titles, reading links and chapter progress in my personal library.',
  Supabase: 'Chatbot integrations and internal tools at Venda Tech IA.',
  n8n: 'AI chatbot workflows for customer service, scheduling and lead follow-up at Venda Tech IA.',
  APIs: 'Integrations with external services, including stock prices in my monitor and WhatsApp APIs at work.',
  Git: 'Version control across my projects. The repositories show how the implementations evolved.',
  Docker: 'A tool I use to work with containerized environments.',
  'C++': 'A language in my computer engineering toolkit.',
  LabVIEW: 'Defensive logic for the defenders and goalkeeper on RoboIME’s Small Size League team.'
};

const interfaceCopy = {
  pt: {
    results: count => `${count} ${count === 1 ? 'projeto' : 'projetos'}`,
    chooseSkill: 'Escolha uma tecnologia.',
    skillPrompt: 'Clique em uma ferramenta para explorar suas conexões com projetos e experiências.',
    contribution: 'Minha contribuição',
    code: 'Explore no código',
    visitEngios: 'Conhecer o EngiOS',
    repository: 'Abrir repositório',
    journey: 'Conhecer minha trajetória ↑',
    copied: 'Link copiado. Vamos conversar!',
    copyFailed: 'Use o botão Conversar no LinkedIn para abrir meu perfil.',
    play: 'Ativar animações',
    pause: 'Pausar animações',
    captions: [
      'Pixels que conectam pessoas e ideias.',
      'Sistemas, lógica e conexões entre bits.',
      'Curiosidade é o começo de todo experimento.'
    ]
  },
  en: {
    results: count => `${count} ${count === 1 ? 'project' : 'projects'}`,
    chooseSkill: 'Choose a technology.',
    skillPrompt: 'Choose a tool to see related projects and experience.',
    contribution: 'My contribution',
    code: 'Explore the code',
    visitEngios: 'Visit EngiOS',
    repository: 'Open repository',
    journey: 'Read about my experience ↑',
    copied: 'Link copied.',
    copyFailed: 'Use the LinkedIn button to open my profile.',
    play: 'Resume animations',
    pause: 'Pause animations',
    captions: [
      'Pixels that connect people and ideas.',
      'Systems, logic and connections between bits.',
      'Every experiment starts with curiosity.'
    ]
  }
};

function requestedLanguage() {
  const value = new URLSearchParams(window.location.search).get('lang');
  return value === 'en' || value === 'pt' ? value : null;
}

function savedLanguage() {
  try {
    return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
}

const initialLanguage = requestedLanguage() ?? savedLanguage();
let language = initialLanguage;
const languageButtons = [...document.querySelectorAll('[data-language]')];
const localizedFields = [];

for (const [marker, attribute] of [
  ['data-en', null],
  ['data-en-label', 'aria-label'],
  ['data-en-placeholder', 'placeholder'],
  ['data-en-content', 'content']
]) {
  for (const element of document.querySelectorAll(`[${marker}]`)) {
    localizedFields.push({
      element, attribute,
      pt: attribute ? element.getAttribute(attribute) : element.textContent,
      en: element.getAttribute(marker)
    });
  }
}

function localizePage() {
  document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
  for (const field of localizedFields) {
    if (field.attribute) {
      field.element.setAttribute(field.attribute, field[language]);
    } else {
      field.element.textContent = field[language];
    }
  }
  for (const button of languageButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  }
}

localizePage();

function watchLanguageChanges(render) {
  function selectLanguage(next) {
    if (language === next) return;
    language = next;
    localizePage();
    render();
  }

  for (const button of languageButtons) {
    button.addEventListener('click', () => {
      const next = button.dataset.language;
      if (next === language) return;
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      window.history.pushState(null, '', url);
      try {
        localStorage.setItem('portfolio-language', next);
      } catch {
        // The language still works when browser storage is unavailable.
      }
      selectLanguage(next);
    });
  }

  window.addEventListener('popstate', () => selectLanguage(requestedLanguage() ?? initialLanguage));
}
