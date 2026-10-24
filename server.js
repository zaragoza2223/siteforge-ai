import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = (process.env.LLM_BASE_URL || 'http://localhost:11434/v1').replace(/\/+$/, '');
const MODEL = process.env.LLM_MODEL || 'qwen3:8b';
const API_KEY = process.env.LLM_API_KEY || 'ollama';

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  const isLocal = /localhost|127\.0\.0\.1/i.test(BASE_URL);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  let connected = false;
  try {
    const response = await fetch(`${BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
      signal: controller.signal
    });
    connected = response.ok;
  } catch {
    connected = false;
  } finally {
    clearTimeout(timeout);
  }
  res.json({ ok: true, connected, provider: isLocal ? 'local' : 'remote', model: MODEL, baseUrl: BASE_URL });
});

function cleanJson(text) {
  const noFences = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  try { return JSON.parse(noFences); } catch {
    const first = noFences.indexOf('{');
    const last = noFences.lastIndexOf('}');
    if (first >= 0 && last > first) return JSON.parse(noFences.slice(first, last + 1));
    throw new Error('Модель вернула ответ не в формате JSON. Попробуйте ещё раз.');
  }
}

const schemaHint = `Верни ТОЛЬКО валидный JSON-объект без markdown и пояснений со следующими полями:
{
  "brandName": "название бренда",
  "tagline": "короткая подпись бренда",
  "heroTitle": "главный заголовок до 12 слов",
  "heroText": "подзаголовок 1-2 предложения",
  "primaryCta": "короткий текст основной кнопки",
  "secondaryCta": "текст вторичной кнопки",
  "benefits": [{"title":"...","text":"..."}, {"title":"...","text":"..."}, {"title":"...","text":"..."}],
  "features": [{"title":"...","text":"..."}, {"title":"...","text":"..."}, {"title":"...","text":"..."}],
  "process": [{"step":"01","title":"...","text":"..."}, {"step":"02","title":"...","text":"..."}, {"step":"03","title":"...","text":"..."}],
  "faq": [{"question":"...","answer":"..."}, {"question":"...","answer":"..."}, {"question":"...","answer":"..."}],
  "finalCtaTitle": "заголовок финального блока",
  "finalCtaText": "краткий текст финального блока",
  "seoTitle": "SEO title до 60 символов",
  "seoDescription": "meta description около 150 символов"
}
Все тексты на русском. Пиши естественно, конкретно и убедительно, без выдуманных цифр, отзывов, сертификатов и гарантий. Не используй клише вроде «лучший на рынке» и «инновационные решения». Если данных мало, делай аккуратные предположения без конкретных фактических обещаний.`;

app.post('/api/generate', async (req, res) => {
  const { businessName, niche, audience, offer, benefits, style } = req.body || {};
  if (!niche?.trim() || !offer?.trim()) {
    return res.status(400).json({ error: 'Укажи нишу бизнеса и основное предложение.' });
  }

  const prompt = `${schemaHint}\n\nБРИФ ДЛЯ ЛЕНДИНГА:\nНазвание бизнеса: ${businessName?.trim() || 'Придумай короткое подходящее название'}\nНиша: ${niche.trim()}\nЦелевая аудитория: ${audience?.trim() || 'Не указана; сформулируй нейтрально'}\nПредложение: ${offer.trim()}\nПреимущества со слов заказчика: ${benefits?.trim() || 'Не указаны; не придумывай факты, сформулируй только общие ценностные преимущества'}\nТон и визуальный стиль: ${style || 'Современный и дружелюбный'}\n\nСделай контент для понятного коммерческого лендинга: проблема клиента, ценность, конкретный следующий шаг. Не упоминай, что текст создан ИИ.`;

  const isLocalOllama = /localhost|127\.0\.0\.1|\[::1\]/i.test(BASE_URL);
  // Qwen3 can spend most of the time in its reasoning phase through the OpenAI-compatible
  // endpoint. For local Ollama, use its native API so `think: false` and JSON mode are honored.
  const requestUrl = isLocalOllama
    ? `${new URL(BASE_URL).origin}/api/chat`
    : `${BASE_URL}/chat/completions`;
  const messages = [
    { role: 'system', content: 'Ты опытный UX-редактор и специалист по структуре продающих лендингов. Выполняй формат ответа строго.' },
    { role: 'user', content: prompt }
  ];
  const requestBody = isLocalOllama
    ? {
        model: MODEL,
        messages,
        think: false,
        format: 'json',
        stream: false,
        keep_alive: '10m',
        options: { temperature: 0.25, num_ctx: 8192, num_predict: 2400 }
      }
    : {
        model: MODEL,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.35,
        max_tokens: 2400,
        stream: false
      };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180000);
  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isLocalOllama ? {} : { 'Authorization': `Bearer ${API_KEY}` })
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    const raw = await response.text();
    if (!response.ok) {
      let detail = raw;
      try {
        const parsedError = JSON.parse(raw);
        detail = parsedError?.error?.message || parsedError?.error || raw;
      } catch { /* keep raw response */ }
      return res.status(502).json({ error: `Ошибка LLM API (${response.status}): ${String(detail).slice(0, 500)}` });
    }

    let payload;
    try { payload = JSON.parse(raw); } catch {
      return res.status(502).json({ error: 'API вернул ответ, который не удалось прочитать.' });
    }
    const message = isLocalOllama
      ? payload?.message?.content
      : payload?.choices?.[0]?.message?.content;
    if (!message) {
      return res.status(502).json({ error: 'Модель вернула пустой ответ. Проверь название модели в .env и доступную память.' });
    }

    let result;
    try { result = cleanJson(message); } catch (parseError) {
      return res.status(502).json({ error: `${parseError.message} Повтори запрос; для Qwen3 используется режим без рассуждений и ограничение длины ответа.` });
    }
    return res.json({ content: result, model: MODEL, provider: isLocalOllama ? 'local' : 'remote' });
  } catch (error) {
    const message = error?.name === 'AbortError'
      ? 'Модель не ответила за 180 секунд. Проверь, не упёрлась ли она в память/нагрузку. Для локального Ollama теперь отключено рассуждение Qwen3 и включён JSON-режим.'
      : `Не удалось подключиться к LLM API. ${error?.cause?.code === 'ECONNREFUSED' ? 'Похоже, Ollama не запущен на указанном адресе.' : (error?.message || 'Проверь настройки подключения.')}`;
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
});

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`\nSiteForge AI API: http://localhost:${PORT}`);
  console.log(`LLM endpoint: ${BASE_URL} | model: ${MODEL}`);
  console.log(/localhost|127\.0\.0\.1|\[::1\]/i.test(BASE_URL)
    ? 'Local generation: native Ollama API, thinking disabled, JSON mode, context 8192'
    : 'Remote generation: OpenAI-compatible Chat Completions API');
  console.log('Для фронтенда в режиме разработки откройте http://localhost:5173\n');
});
