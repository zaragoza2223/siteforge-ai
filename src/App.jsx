import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Blocks, Bot, Check,
  ChevronDown, CircleHelp, Clipboard, Code2, Download, Eye, FileText, Gauge,
  Globe2, Image as ImageIcon, Layers3, LayoutTemplate, Link2, LoaderCircle,
  MessageSquareText, Monitor, MousePointer2, Palette, Plus, RefreshCw, Rocket,
  Search, Settings2, Sparkles, WandSparkles, Zap
} from 'lucide-react';

const initialBrief = {
  businessName: 'Forma Studio',
  niche: 'Дизайн интерьеров',
  audience: 'Люди, которые покупают первую квартиру или обновляют интерьер',
  offer: 'Разработка дизайн-проекта квартиры под ключ',
  benefits: 'Понятный процесс, продуманное хранение, визуализация до ремонта',
  style: 'Минималистичный и премиальный'
};

const demoContent = {
  brandName: 'FORMA STUDIO',
  tagline: 'Интерьер, в котором хочется жить',
  heroTitle: 'Пространство, созданное под вашу жизнь',
  heroText: 'Продумываем планировку, материалы и детали, чтобы ваш дом был красивым, удобным и по-настоящему вашим.',
  primaryCta: 'Обсудить проект',
  secondaryCta: 'Посмотреть подход',
  benefits: [
    { title: 'Продуманная планировка', text: 'Используем пространство рационально — с учётом привычек, задач и будущих сценариев жизни.' },
    { title: 'Цельный образ', text: 'Соединяем цвета, материалы, освещение и мебель в гармоничный интерьер.' },
    { title: 'Понятные решения', text: 'Объясняем выбор и помогаем ориентироваться в процессе от идеи до реализации.' }
  ],
  features: [
    { title: 'Планировочные решения', text: 'Находим баланс между эстетикой, хранением и удобством каждого дня.' },
    { title: 'Подбор материалов', text: 'Формируем палитру отделки и деталей с учётом общей концепции.' },
    { title: 'Визуальная концепция', text: 'Показываем будущий интерьер, чтобы согласовать направление до начала работ.' }
  ],
  process: [
    { step: '01', title: 'Знакомимся', text: 'Обсуждаем задачи, пожелания, бюджет и особенности пространства.' },
    { step: '02', title: 'Создаём концепцию', text: 'Подбираем планировку, настроение, материалы и основные решения.' },
    { step: '03', title: 'Готовим проект', text: 'Собираем согласованные материалы в понятную основу для реализации.' }
  ],
  faq: [
    { question: 'С чего начинается работа?', answer: 'С короткой встречи: обсуждаем пространство, пожелания, сроки и то, какой результат для вас важен.' },
    { question: 'Можно ли работать с отдельной комнатой?', answer: 'Да, формат и объём работы можно определить под конкретную задачу.' },
    { question: 'Будет ли проект учитывать мой бюджет?', answer: 'Да, бюджет и приоритеты обсуждаются в начале и учитываются при выборе решений.' }
  ],
  finalCtaTitle: 'Давайте обсудим ваш будущий интерьер',
  finalCtaText: 'Расскажите о пространстве и задачах — подумаем, с чего лучше начать.',
  seoTitle: 'Forma Studio — дизайн интерьеров',
  seoDescription: 'Дизайн-проекты интерьеров с продуманной планировкой, материалами и вниманием к деталям.'
};

const navItems = [
  { id: 'create', label: 'Конструктор', icon: LayoutTemplate },
  { id: 'templates', label: 'Шаблоны', icon: Layers3 },
  { id: 'library', label: 'Библиотека блоков', icon: Blocks }
];

const styleOptions = [
  { value: 'Минималистичный и премиальный', id: 'minimal', label: 'Минимализм', description: 'Воздух и спокойные оттенки', colors: ['#f7f5ef', '#292b24', '#b6a080'] },
  { value: 'Яркий и энергичный', id: 'bright', label: 'Яркий', description: 'Контраст и выразительные акценты', colors: ['#fff4ea', '#ff4f87', '#ffd34f'] },
  { value: 'Дружелюбный и простой', id: 'friendly', label: 'Дружелюбный', description: 'Мягкие формы и тёплые цвета', colors: ['#eff9f2', '#327a62', '#efbb82'] },
  { value: 'Технологичный и строгий', id: 'tech', label: 'Технологичный', description: 'Тёмная тема и неоновые детали', colors: ['#0b1220', '#4ce2fa', '#273b58'] }
];

function themeId(style) {
  return styleOptions.find((option) => option.value === style)?.id || 'minimal';
}

function safeArray(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function text(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function sanitizeContent(raw, brief) {
  return {
    brandName: text(raw?.brandName, brief.businessName || 'Ваш бренд').toUpperCase(),
    tagline: text(raw?.tagline, 'Решение для ваших задач'),
    heroTitle: text(raw?.heroTitle, 'Создайте результат, который подходит именно вам'),
    heroText: text(raw?.heroText, brief.offer),
    primaryCta: text(raw?.primaryCta, 'Обсудить проект'),
    secondaryCta: text(raw?.secondaryCta, 'Узнать подробнее'),
    benefits: safeArray(raw?.benefits, demoContent.benefits).slice(0, 3).map((item, i) => ({ title: text(item?.title, demoContent.benefits[i].title), text: text(item?.text, demoContent.benefits[i].text) })),
    features: safeArray(raw?.features, demoContent.features).slice(0, 3).map((item, i) => ({ title: text(item?.title, demoContent.features[i].title), text: text(item?.text, demoContent.features[i].text) })),
    process: safeArray(raw?.process, demoContent.process).slice(0, 3).map((item, i) => ({ step: text(item?.step, `0${i + 1}`), title: text(item?.title, demoContent.process[i].title), text: text(item?.text, demoContent.process[i].text) })),
    faq: safeArray(raw?.faq, demoContent.faq).slice(0, 4).map((item, i) => ({ question: text(item?.question, demoContent.faq[i % 3].question), answer: text(item?.answer, demoContent.faq[i % 3].answer) })),
    finalCtaTitle: text(raw?.finalCtaTitle, 'Обсудим вашу задачу?'),
    finalCtaText: text(raw?.finalCtaText, 'Расскажите, что хотите получить, и подберём подходящий следующий шаг.'),
    seoTitle: text(raw?.seoTitle, `${brief.businessName || 'Бренд'} — ${brief.niche || 'услуги'}`),
    seoDescription: text(raw?.seoDescription, brief.offer)
  };
}

function htmlEscape(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function exportThemeCss(theme) {
  const themes = {
    minimal: '',
    bright: `
      body{background:#fff8ef;color:#191c3a}.nav{border-color:#f2d9d0}.eyebrow{color:#f04479}
      .nav a:last-child,.btn{background:#ff4f87;color:#fff;border-radius:999px}.hero h1{color:#191c3a;font-weight:800}
      .art{background:linear-gradient(135deg,#ffd34f,#ff8cae);border-radius:28px;box-shadow:12px 12px 0 #191c3a0c}
      .art:before{background:#7b6cff;border-radius:50%;width:72%;height:66%;left:13%;bottom:-10%}.art:after{background:#ff4f87;border-radius:50% 50% 10px 10px}
      .art span{background:#fff8ef;color:#191c3a;border-radius:999px}.section.tint{background:#fff0e4}.card{background:#fff;border:2px solid #ffd5e1;border-radius:18px}
      .num,.feature h3~p,.eyebrow{color:#ee4778}.feature{border-color:#ffc5d6}.dot{background:#ff4f87;border-radius:3px}
      .cta{background:#22234b}.cta .btn{background:#ffd34f;color:#24234b}.footer{color:#6d6983}
    `,
    friendly: `
      body{background:#f3fbf6;color:#244538}.nav{border-color:#d6eee1}.eyebrow{color:#327a62}
      .nav a:last-child,.btn{background:#327a62;color:#fff;border-radius:14px}.art{background:#d9f1e3;border-radius:90px 90px 24px 24px}
      .art:before{background:#f0c18e;border-radius:50% 50% 14px 14px}.art:after{background:#a5d9bd;border-radius:50% 50% 12px 12px}
      .art span{background:#fff;color:#327a62;border-radius:12px}.section.tint{background:#e7f6ed}.card{background:#fff;border:1px solid #d4eade;border-radius:16px}
      .num,.eyebrow{color:#327a62}.feature{border-color:#d0e8da}.dot{background:#edab70}.step span{color:#327a62}
      .cta{background:#285b4b;border-radius:0}.cta .btn{background:#f0c18d;color:#244538;border-radius:14px}.footer{color:#638373}
    `,
    tech: `
      body{background:#0b1220;color:#eaf3ff}.nav{border-color:#263852}.nav a:last-child,.btn{background:#4ce2fa;color:#071322;border-radius:3px}
      .eyebrow,.num,.step span{color:#4ce2fa}.hero h1{color:#f2f7ff;letter-spacing:-.035em}.hero p,.muted,article p{color:#a5b7cf}
      .art{background:linear-gradient(140deg,#142844,#0c1729);border:1px solid #355476;border-radius:8px}
      .art:before{background:#153c61;border:1px solid #4ce2fa55;border-radius:3px}.art:after{background:#4ce2fa;border-radius:2px;opacity:.8}
      .art span{background:#10233a;color:#baf7ff;border:1px solid #345575;border-radius:3px}.section.tint{background:#111d31}
      .card{background:#111d31;border:1px solid #2c4362;border-radius:4px;color:#eaf3ff}.feature{border-color:#2c4362}.dot{background:#4ce2fa;border-radius:0}
      .cta{background:#050a14;border-top:1px solid #2b4868}.cta .btn{background:#4ce2fa;color:#071322;border-radius:3px}.cta p{color:#a5b7cf}.footer{color:#8da5c2}
    `
  };
  return themes[theme] || themes.minimal;
}

function makeExportHtml(content, theme = 'minimal') {
  const benefits = content.benefits.map((item, i) => `<article class="card"><span class="num">0${i + 1}</span><h3>${htmlEscape(item.title)}</h3><p>${htmlEscape(item.text)}</p></article>`).join('');
  const features = content.features.map((item) => `<article class="feature"><span class="dot"></span><div><h3>${htmlEscape(item.title)}</h3><p>${htmlEscape(item.text)}</p></div></article>`).join('');
  const process = content.process.map((item) => `<article class="step"><span>${htmlEscape(item.step)}</span><h3>${htmlEscape(item.title)}</h3><p>${htmlEscape(item.text)}</p></article>`).join('');
  const faq = content.faq.map((item) => `<details><summary>${htmlEscape(item.question)}</summary><p>${htmlEscape(item.answer)}</p></details>`).join('');
  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${htmlEscape(content.seoTitle)}</title><meta name="description" content="${htmlEscape(content.seoDescription)}"><style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;color:#20221e;background:#faf9f6;line-height:1.55}a{text-decoration:none;color:inherit}.wrap{max-width:1100px;margin:auto;padding:0 28px}.nav{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e9e6df}.logo{font-weight:800;letter-spacing:.12em;font-size:13px}.nav a:last-child,.btn{background:#262820;color:white;padding:13px 19px;border-radius:6px;font-size:13px;font-weight:650}.hero{padding:95px 0 88px;display:grid;grid-template-columns:1.15fr .85fr;gap:45px;align-items:center}.eyebrow{color:#8b7652;text-transform:uppercase;letter-spacing:.15em;font-size:11px;font-weight:700}.hero h1{font-size:clamp(38px,5.5vw,65px);line-height:1.05;letter-spacing:-.055em;margin:20px 0}.hero p{font-size:17px;color:#6f7068;max-width:520px}.actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:28px}.secondary{padding:13px 16px;font-size:13px;font-weight:650}.art{background:#e8e4da;min-height:360px;border-radius:160px 160px 8px 8px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}.art:before{content:"";position:absolute;width:65%;height:75%;background:#b6b8a6;border-radius:50% 50% 0 0;bottom:-12%;left:17%}.art:after{content:"";position:absolute;width:35%;height:40%;background:#d5b993;border-radius:50% 50% 4px 4px;bottom:0;left:33%}.art span{z-index:1;font-size:11px;letter-spacing:.18em;text-transform:uppercase;background:#f7f4ed;padding:9px 12px;border-radius:2px}.section{padding:75px 0}.section.tint{background:#f0eee8}.section-head{max-width:570px;margin-bottom:32px}.section h2{font-size:clamp(30px,4vw,44px);letter-spacing:-.045em;line-height:1.1;margin:10px 0 15px}.muted,article p{color:#73756c}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{background:#fbfaf7;border:1px solid #e5e2db;padding:25px;min-height:185px}.num{font-size:11px;color:#a18456}.card h3,.feature h3,.step h3{font-size:17px;margin:23px 0 8px}.card p,.feature p,.step p{font-size:13px;margin:0}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.feature{border-top:1px solid #dedbd3;padding-top:20px}.dot{height:8px;width:8px;display:block;background:#ba9c6e;border-radius:50%}.feature h3{margin-top:18px}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}.step span{font-size:12px;color:#9a8158;letter-spacing:.12em}.step h3{margin:14px 0 7px}.faq{max-width:780px}.faq details{border-bottom:1px solid #dcd9d1;padding:20px 0}.faq summary{font-weight:650;cursor:pointer}.faq p{color:#73756c;font-size:14px}.cta{background:#292b24;color:#fff;padding:62px 0}.cta-inner{display:flex;justify-content:space-between;gap:24px;align-items:center}.cta h2{max-width:550px;margin:9px 0;font-size:clamp(28px,4vw,42px);line-height:1.1;letter-spacing:-.04em}.cta p{color:#c0c2b7;max-width:510px}.cta .btn{background:#e6d7bd;color:#262820}.footer{padding:25px 0;color:#7e8076;font-size:12px;display:flex;justify-content:space-between;gap:12px}@media(max-width:700px){.hero{grid-template-columns:1fr;padding:55px 0}.art{min-height:260px}.grid,.features,.steps{grid-template-columns:1fr}.cta-inner{align-items:flex-start;flex-direction:column}.section{padding:55px 0}.nav{height:68px}.wrap{padding:0 20px}}
${exportThemeCss(theme)}</style></head><body class="site-theme-${theme}"><header class="wrap nav"><a class="logo" href="#top">${htmlEscape(content.brandName)}</a><a href="#contact">${htmlEscape(content.primaryCta)}</a></header><main id="top"><section class="wrap hero"><div><span class="eyebrow">${htmlEscape(content.tagline)}</span><h1>${htmlEscape(content.heroTitle)}</h1><p>${htmlEscape(content.heroText)}</p><div class="actions"><a class="btn" href="#contact">${htmlEscape(content.primaryCta)} ↗</a><a class="secondary" href="#benefits">${htmlEscape(content.secondaryCta)} ↓</a></div></div><div class="art"><span>пространство идей</span></div></section><section class="section tint" id="benefits"><div class="wrap"><div class="section-head"><span class="eyebrow">Почему это работает</span><h2>Больше ясности на каждом этапе</h2><p class="muted">${htmlEscape(content.heroText)}</p></div><div class="grid">${benefits}</div></div></section><section class="section"><div class="wrap"><div class="section-head"><span class="eyebrow">Что входит</span><h2>Решения вокруг вашей задачи</h2></div><div class="features">${features}</div></div></section><section class="section tint"><div class="wrap"><div class="section-head"><span class="eyebrow">Процесс</span><h2>От первого разговора до понятного плана</h2></div><div class="steps">${process}</div></div></section><section class="section"><div class="wrap"><div class="section-head"><span class="eyebrow">Вопросы и ответы</span><h2>Перед стартом</h2></div><div class="faq">${faq}</div></div></section><section class="cta" id="contact"><div class="wrap cta-inner"><div><span class="eyebrow">Следующий шаг</span><h2>${htmlEscape(content.finalCtaTitle)}</h2><p>${htmlEscape(content.finalCtaText)}</p></div><a class="btn" href="mailto:hello@example.com">${htmlEscape(content.primaryCta)} ↗</a></div></section></main><footer class="wrap footer"><span>${htmlEscape(content.brandName)}</span><span>Демонстрационный шаблон • Замените контакты перед публикацией</span></footer></body></html>`;
}

function Field({ label, hint, ...props }) {
  return <label className="field"><span className="field-label">{label}</span>{props.children || <input {...props} />}{hint && <small>{hint}</small>}</label>;
}

function WebsitePreview({ content, style, onEditClick }) {
  return <div className={`site-preview theme-${themeId(style)}`}>
    <div className="site-nav"><div className="site-logo"><span className="logo-mark">F</span>{content.brandName}</div><div className="site-nav-links"><span>Подход</span><span>Услуги</span><span>Вопросы</span></div><button className="site-nav-cta" onClick={onEditClick}>{content.primaryCta}<ArrowUpRight size={13} /></button></div>
    <div className="site-hero">
      <div className="hero-copy"><span className="site-eyebrow"><span></span>{content.tagline}</span><h1>{content.heroTitle}</h1><p>{content.heroText}</p><div className="site-actions"><button onClick={onEditClick}>{content.primaryCta}<ArrowUpRight size={14} /></button><a href="#preview-benefits">{content.secondaryCta}<ArrowDownRight size={14} /></a></div><div className="social-proof"><div className="avatar-stack"><i>А</i><i>М</i><i>К</i></div><span><b>Внимание к деталям</b><br />на каждом этапе</span></div></div>
      <div className="hero-art"><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-cube"><div className="cube-face cube-top"></div><div className="cube-face cube-front"></div><div className="cube-face cube-side"></div></div><div className="art-caption"><span>01 / CONCEPT</span><b>Form follows feeling.</b></div><div className="floating-chip"><Sparkles size={13} /> Идея → результат</div></div>
    </div>
    <div className="site-section-head" id="preview-benefits"><span>ПОЧЕМУ МЫ</span><h2>Больше ценности.<br />Меньше лишнего.</h2><p>Собираем важное в систему, которая работает на ваши цели.</p></div>
    <div className="site-benefits">{content.benefits.map((item, index) => <div className="site-benefit" key={`${item.title}-${index}`}><div className="benefit-icon">{index === 0 ? <Layers3 size={18} /> : index === 1 ? <Palette size={18} /> : <BadgeCheck size={18} />}</div><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
    <div className="site-bottom"><span>СОЗДАНО В SITEFORGE AI</span><div>Новая идея начинается с ясности <ArrowUpRight size={13} /></div></div>
  </div>;
}

function App() {
  const [activeNav, setActiveNav] = useState('create');
  const [activeTab, setActiveTab] = useState('preview');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [brief, setBrief] = useState(initialBrief);
  const [content, setContent] = useState(demoContent);
  const [contentSource, setContentSource] = useState('demo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [health, setHealth] = useState(null);
  const [notice, setNotice] = useState('');
  const [showSeo, setShowSeo] = useState(false);

  useEffect(() => {
    fetch('/api/health').then((r) => r.json()).then(setHealth).catch(() => setHealth({ ok: false }));
  }, []);

  const modeLabel = useMemo(() => {
    if (!health) return 'Проверка подключения…';
    if (!health.ok) return 'API-сервер не отвечает';
    if (!health.connected) return `LLM не отвечает · ${health.model}`;
    return health.provider === 'local' ? `Локальная модель · ${health.model}` : `Внешний API · ${health.model}`;
  }, [health]);

  function updateBrief(key, value) {
    setBrief((old) => ({ ...old, [key]: value }));
  }

  function updateContent(key, value) {
    setContent((old) => ({ ...old, [key]: value }));
  }

  async function generate() {
    setIsGenerating(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Не удалось сгенерировать контент.');
      setContent(sanitizeContent(result.content, brief));
      setContentSource('ai');
      setActiveTab('preview');
      setNotice(`Тексты сгенерированы моделью ${result.model}. Проверь факты перед публикацией.`);
    } catch (err) {
      setError(`${err.message} Проверь, что Ollama запущен, а модель загружена. Настройки — в README.`);
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadHtml() {
    const blob = new Blob([makeExportHtml(content, themeId(brief.style))], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'siteforge-landing.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setNotice('HTML-файл скачан. Перед публикацией замени демонстрационный e-mail на свой контакт.');
  }

  async function copyContent() {
    try {
      await navigator.clipboard.writeText(JSON.stringify({ brief, content }, null, 2));
      setNotice('Контент и бриф скопированы в JSON.');
    } catch {
      setNotice('Не удалось скопировать автоматически. Попробуй открыть редактор контента и скопировать тексты вручную.');
    }
  }

  function selectNav(id) {
    setActiveNav(id);
    if (id === 'templates') {
      setBrief((old) => ({ ...old, style: 'Минималистичный и премиальный' }));
      setNotice('Выбран стиль «Чистый минимализм». Измени бриф и создай свой вариант.');
    } else if (id === 'library') {
      setNotice('В MVP доступна базовая библиотека из 5 секций: Hero, преимущества, услуги, процесс и FAQ.');
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-symbol"><WandSparkles size={19} /></div><div><b>siteforge</b><span>AI WEBSITE STUDIO</span></div></div>
      <button className="workspace-switch"><div className="workspace-avatar">F</div><div><b>Мой workspace</b><span>Личный проект</span></div><ChevronDown size={15} /></button>
      <div className="sidebar-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <nav className="side-nav">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={activeNav === id ? 'nav-item active' : 'nav-item'} onClick={() => selectNav(id)}><Icon size={17} /><span>{label}</span>{id === 'templates' && <span className="nav-count">4</span>}</button>)}</nav>
      <div className="sidebar-label project-label">ПОСЛЕДНИЙ ПРОЕКТ</div>
      <button className="project-link" onClick={() => { setBrief(initialBrief); setContent(demoContent); setContentSource('demo'); setNotice('Открыт демо-проект Forma Studio.'); }}><span className="project-dot"></span><span>Forma Studio</span><span className="project-status"></span></button>
      <div className="sidebar-spacer"></div>
      <div className="usage-card"><div className="usage-icon"><Zap size={15} /></div><div className="usage-copy"><b>AI-генерация</b><span>Подключи свою модель</span></div><span className="usage-indicator"></span><p>Запросы к локальному Ollama не требуют оплаты внешнего API.</p></div>
      <button className="settings-link" onClick={() => setShowSeo((v) => !v)}><Settings2 size={16} />Настройки и SEO <ArrowUpRight size={13} /></button>
      <div className="user-profile"><div className="user-avatar">ЕБ</div><div><b>Мой аккаунт</b><span>Free workspace</span></div><MoreDots /></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><span>Мои проекты</span><span className="crumb-slash">/</span><b>Forma Studio</b><span className="draft-pill"><span></span> Черновик</span></div><div className="topbar-actions"><div className="connection"><span className={health?.connected ? 'connection-dot online' : 'connection-dot'}></span><span>{modeLabel}</span></div><button className="icon-button" onClick={copyContent} title="Скопировать JSON"><Clipboard size={16} /></button><button className="outline-button" onClick={downloadHtml}><Download size={15} /> Экспорт HTML</button><button className="publish-button" onClick={() => setNotice('Это MVP без хостинга: HTML экспортирован, дальше его можно загрузить на хостинг.')}><Globe2 size={15} /> Опубликовать <ArrowUpRight size={13} /></button></div></header>

      <div className="content-wrap">
        <div className="page-heading"><div><div className="eyebrow-chip"><Sparkles size={12} /> AI SITE BUILDER <span>·</span> MVP</div><h1>От идеи до лендинга</h1><p>Опиши бизнес — ИИ подготовит контент, а конструктор соберёт страницу из готовых блоков.</p></div><div className="heading-side"><div className="version-label"><span className="pulse-dot"></span> Черновик проекта <b>v0.1</b></div><button className="subtle-button" onClick={() => { setBrief(initialBrief); setContent(demoContent); setContentSource('demo'); setError(''); setNotice('Бриф и предпросмотр сброшены к демо-значениям.'); }}><RefreshCw size={14} /> Сбросить</button></div></div>

        {notice && <div className="notice-banner"><Check size={15} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Закрыть уведомление">×</button></div>}
        {error && <div className="error-banner"><CircleHelp size={16} /><span>{error}</span><button onClick={() => setError('')} aria-label="Закрыть ошибку">×</button></div>}

        <div className="builder-grid">
          <section className="brief-panel">
            <div className="panel-heading"><div><div className="step-label"><span>01</span> БРИФ ПРОЕКТА</div><h2>Расскажи о бизнесе</h2><p>Эти данные станут основой для контента лендинга.</p></div><div className="panel-heading-icon"><FileText size={18} /></div></div>
            <div className="form-fields">
              <Field label="Название бренда"><input value={brief.businessName} onChange={(e) => updateBrief('businessName', e.target.value)} placeholder="Например, Forma Studio" /></Field>
              <Field label="Ниша бизнеса" hint="В какой сфере работает компания?"><input value={brief.niche} onChange={(e) => updateBrief('niche', e.target.value)} placeholder="Например, студия фитнеса" /></Field>
              <Field label="Целевая аудитория"><textarea value={brief.audience} onChange={(e) => updateBrief('audience', e.target.value)} rows={2} placeholder="Для кого продукт или услуга?" /></Field>
              <Field label="Основное предложение" hint="Что именно продаём или предлагаем?"><textarea value={brief.offer} onChange={(e) => updateBrief('offer', e.target.value)} rows={2} placeholder="Опиши услугу или продукт" /></Field>
              <Field label="Ключевые преимущества" hint="Что важно донести клиенту?"><textarea value={brief.benefits} onChange={(e) => updateBrief('benefits', e.target.value)} rows={2} placeholder="Преимущество 1, преимущество 2…" /></Field>
              <div className="field"><span className="field-label">Визуальный стиль</span><small className="field-hint">Нажми на вариант — оформление предпросмотра изменится сразу.</small>
                <div className="style-picker">
                  {styleOptions.map((option) => <button type="button" key={option.value} className={`style-choice ${brief.style === option.value ? 'selected' : ''}`} onClick={() => { updateBrief('style', option.value); setNotice(`Применён стиль «${option.label}». Он используется в предпросмотре и экспорте HTML.`); }} aria-pressed={brief.style === option.value}>
                    <span className="style-swatches">{option.colors.map((color) => <i key={color} style={{ background: color }} />)}</span>
                    <span className="style-choice-copy"><b>{option.label}</b><small>{option.description}</small></span>
                    <span className="style-choice-check">{brief.style === option.value ? <Check size={13} /> : null}</span>
                  </button>)}
                </div>
              </div>
            </div>
            <div className="brief-footer"><div className="secure-note"><BadgeCheck size={14} /><span>Бриф используется только для генерации</span></div><button className="generate-button" onClick={generate} disabled={isGenerating || !brief.niche.trim() || !brief.offer.trim()}>{isGenerating ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={16} />}{isGenerating ? 'Генерируем контент…' : 'Сгенерировать контент'}<ArrowRight size={15} /></button><p className="generate-hint">Обычно занимает от нескольких секунд до минуты — зависит от модели.</p></div>
          </section>

          <section className="preview-panel">
            <div className="preview-top"><div><div className="step-label"><span>02</span> ПРЕДПРОСМОТР</div><h2>Твоя будущая страница</h2></div><div className="preview-actions"><div className="segmented-tabs"><button className={activeTab === 'preview' ? 'selected' : ''} onClick={() => setActiveTab('preview')}><Eye size={14} /> Превью</button><button className={activeTab === 'content' ? 'selected' : ''} onClick={() => setActiveTab('content')}><MessageSquareText size={14} /> Контент</button></div><button className="mini-icon-button" title="Экспорт HTML" onClick={downloadHtml}><Download size={15} /></button></div></div>
            <div className="preview-toolbar"><div className="browser-dots"><i></i><i></i><i></i></div><div className="url-bar"><Link2 size={11} /><span>preview.siteforge.local</span><span className="url-lock">●</span></div><div className="device-switch"><button className={previewDevice === 'desktop' ? 'active' : ''} title="Десктоп" onClick={() => setPreviewDevice('desktop')}><Monitor size={14} /></button><button className={previewDevice === 'mobile' ? 'active' : ''} title="Мобильный вид" onClick={() => setPreviewDevice('mobile')}><MousePointer2 size={14} /></button></div></div>
            {activeTab === 'preview' ? <div className={previewDevice === 'mobile' ? 'preview-stage mobile-stage' : 'preview-stage'}><WebsitePreview content={content} style={brief.style} onEditClick={() => setActiveTab('content')} /></div> : <div className="content-editor">
              <div className="editor-intro"><div className="editor-badge"><Code2 size={15} /></div><div><b>Редактор контента</b><p>{contentSource === 'ai' ? 'Контент создан моделью — можешь внести правки до экспорта.' : 'Сейчас показан пример. Сгенерируй свой вариант или отредактируй текст.'}</p></div></div>
              <Field label="Название в шапке"><input value={content.brandName} onChange={(e) => updateContent('brandName', e.target.value)} /></Field>
              <Field label="Подпись над заголовком"><input value={content.tagline} onChange={(e) => updateContent('tagline', e.target.value)} /></Field>
              <Field label="Главный заголовок"><textarea rows={2} value={content.heroTitle} onChange={(e) => updateContent('heroTitle', e.target.value)} /></Field>
              <Field label="Подзаголовок"><textarea rows={3} value={content.heroText} onChange={(e) => updateContent('heroText', e.target.value)} /></Field>
              <div className="editor-two-col"><Field label="Основная кнопка"><input value={content.primaryCta} onChange={(e) => updateContent('primaryCta', e.target.value)} /></Field><Field label="Вторичная кнопка"><input value={content.secondaryCta} onChange={(e) => updateContent('secondaryCta', e.target.value)} /></Field></div>
              <Field label="Финальный заголовок"><textarea rows={2} value={content.finalCtaTitle} onChange={(e) => updateContent('finalCtaTitle', e.target.value)} /></Field>
              <button className="small-action-button" onClick={() => setActiveTab('preview')}><Eye size={14} /> Вернуться к превью</button>
            </div>}
            <div className="preview-footer"><div className="content-origin"><span className={contentSource === 'ai' ? 'source-dot ai' : 'source-dot'}></span><span>{contentSource === 'ai' ? 'AI-контент · можно редактировать' : 'Демо-контент · пример структуры'}</span></div><div className="preview-footer-actions"><button onClick={copyContent}><Clipboard size={13} /> JSON</button><button onClick={downloadHtml}><Download size={13} /> HTML</button></div></div>
          </section>
        </div>

        <section className="lower-grid"><div className="lower-card section-library"><div className="lower-card-heading"><div className="lower-icon purple"><Blocks size={17} /></div><div><h3>Структура лендинга</h3><p>Блоки, из которых собирается страница</p></div><span className="count-tag">5 секций</span></div><div className="block-list"><div><span className="block-number">01</span><span className="block-name"><b>Hero / первый экран</b><small>Заголовок, текст и CTA</small></span><Check size={15} /></div><div><span className="block-number">02</span><span className="block-name"><b>Преимущества</b><small>3 карточки с ценностью</small></span><Check size={15} /></div><div><span className="block-number">03</span><span className="block-name"><b>Услуги / возможности</b><small>Основные предложения</small></span><Check size={15} /></div><div><span className="block-number">04</span><span className="block-name"><b>Как это работает</b><small>3 последовательных шага</small></span><Check size={15} /></div><div><span className="block-number">05</span><span className="block-name"><b>FAQ и финальный CTA</b><small>Возражения и следующий шаг</small></span><Check size={15} /></div></div></div>
          <div className="lower-card next-steps"><div className="lower-card-heading"><div className="lower-icon amber"><Rocket size={17} /></div><div><h3>Следующий шаг</h3><p>Подготовка к реальному запуску</p></div></div><div className="next-step-item"><div className="next-step-check"><Check size={13} /></div><div><b>Сгенерировать контент</b><p>Подключить локальную модель или API-провайдера</p><span className="task-status done">Базовый сценарий готов</span></div></div><div className="next-step-item"><div className="next-step-check pending"><ImageIcon size={13} /></div><div><b>Подключить изображения</b><p>Добавить генерацию изображений и выбор визуалов</p><span className="task-status planned">В следующей версии</span></div></div><div className="next-step-item"><div className="next-step-check pending"><Globe2 size={13} /></div><div><b>Публикация страницы</b><p>Подключить домен и хостинг</p><span className="task-status planned">В следующей версии</span></div></div><button className="roadmap-button" onClick={() => setNotice('Roadmap MVP: импорт контента конкурентов, генерация/поиск изображений, выбор дополнительных блоков, публикация на хостинг.')}>Посмотреть roadmap <ArrowRight size={14} /></button></div>
        </section>

        {showSeo && <section className="seo-panel"><div className="seo-heading"><Search size={17} /><div><b>SEO-настройки</b><span>Данные попадут в head скачиваемого HTML</span></div></div><Field label="SEO title"><input value={content.seoTitle} onChange={(e) => updateContent('seoTitle', e.target.value)} /></Field><Field label="Meta description"><textarea value={content.seoDescription} rows={2} onChange={(e) => updateContent('seoDescription', e.target.value)} /></Field><button className="small-action-button" onClick={() => setShowSeo(false)}>Готово</button></section>}
        <footer className="page-footer"><span>SiteForge AI <span className="footer-dot">•</span> Портфолио MVP</span><span>React · Express · LLM API</span><button onClick={() => setShowSeo((v) => !v)}><Settings2 size={13} /> SEO и настройки</button></footer>
      </div>
    </main>
  </div>;
}

function MoreDots() {
  return <button className="more-dots" aria-label="Меню аккаунта"><span></span><span></span><span></span></button>;
}

export default App;
