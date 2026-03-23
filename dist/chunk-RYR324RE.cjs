"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/lib/config-loader.ts
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _jsyaml = require('js-yaml'); var _jsyaml2 = _interopRequireDefault(_jsyaml);
var cachedConfig = null;
var DEFAULT_CONFIG = {
  bot: {
    name: "Assistant",
    avatar: "/avatar.png",
    tone: "friendly",
    greeting: { en: "Hi! How can I help?", ko: "\uC548\uB155\uD558\uC138\uC694! \uBB34\uC5C7\uC744 \uB3C4\uC640\uB4DC\uB9B4\uAE4C\uC694?" }
  },
  service: {
    name: "Our Service",
    fallback_message: {
      en: "I don't have information about that. Let me connect you with our team.",
      ko: "\uD574\uB2F9 \uB0B4\uC6A9\uC5D0 \uB300\uD55C \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2F4\uB2F9\uC790\uC5D0\uAC8C \uC5F0\uACB0\uD574 \uB4DC\uB9AC\uACA0\uC2B5\uB2C8\uB2E4."
    }
  },
  cta: {
    primary: {
      text: { en: "Get started \u2192", ko: "\uC2DC\uC791\uD558\uAE30 \u2192" },
      url: "/get-started"
    }
  },
  presets: [],
  email_form: {
    enabled: true,
    fields: [
      {
        name: "email",
        type: "email",
        required: true,
        label: { en: "Email", ko: "\uC774\uBA54\uC77C" },
        placeholder: { en: "your@email.com", ko: "your@email.com" }
      }
    ],
    submit_text: { en: "Submit", ko: "\uC81C\uCD9C\uD558\uAE30" },
    success_message: {
      en: "Thank you! We'll get back to you soon.",
      ko: "\uAC10\uC0AC\uD569\uB2C8\uB2E4! \uACE7 \uC5F0\uB77D\uB4DC\uB9AC\uACA0\uC2B5\uB2C8\uB2E4."
    }
  },
  limits: {
    max_messages_per_session: 10,
    soft_cta_after: 3,
    hard_redirect_after: 7,
    max_input_length: 500
  },
  cost_safety: {
    monthly_budget_usd: 30,
    daily_budget_usd: 1,
    kill_switch_usd: 27,
    max_sessions_per_day: 50,
    rate_limit_per_minute: 5
  },
  security: {
    blocked_keywords: []
  },
  brand_color: "#6366f1",
  language: {
    default: "en",
    supported: ["en", "ko"],
    auto_detect: false,
    switch_button: false
  }
};
function loadConfig(configPath) {
  if (cachedConfig) return cachedConfig;
  const resolvedPath = configPath || _path2.default.join(
    /* turbopackIgnore: true */
    process.cwd(),
    "chatbot",
    "config.yaml"
  );
  if (!_fs2.default.existsSync(resolvedPath)) {
    console.warn(`Config file not found at ${resolvedPath}, using defaults`);
    cachedConfig = DEFAULT_CONFIG;
    return cachedConfig;
  }
  const raw = _fs2.default.readFileSync(resolvedPath, "utf-8");
  const parsed = _jsyaml2.default.load(raw);
  cachedConfig = deepMerge(DEFAULT_CONFIG, parsed);
  return cachedConfig;
}
function clearConfigCache() {
  cachedConfig = null;
}
function deepMerge(target, source) {
  const result = __spreadValues({}, target);
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key]) && target[key] && typeof target[key] === "object" && !Array.isArray(target[key])) {
      result[key] = deepMerge(
        target[key],
        source[key]
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// src/lib/knowledge-loader.ts


var cachedKnowledge = null;
function loadKnowledge(knowledgePath) {
  if (cachedKnowledge) return cachedKnowledge;
  const resolvedPath = knowledgePath || _path2.default.join(
    /* turbopackIgnore: true */
    process.cwd(),
    "chatbot",
    "knowledge.md"
  );
  if (!_fs2.default.existsSync(resolvedPath)) {
    console.warn(`Knowledge file not found at ${resolvedPath}`);
    return "";
  }
  const raw = _fs2.default.readFileSync(resolvedPath, "utf-8");
  cachedKnowledge = parseKnowledge(raw);
  return cachedKnowledge;
}
function clearKnowledgeCache() {
  cachedKnowledge = null;
}
function parseKnowledge(raw) {
  const lines = raw.split("\n");
  const qaPairs = [];
  let currentCategory = "General";
  let currentQuestion = "";
  let currentAnswer = [];
  for (const line of lines) {
    const categoryMatch = line.match(/^## (?!Q:)(.+)/);
    if (categoryMatch) {
      if (currentQuestion) {
        qaPairs.push({
          question: currentQuestion,
          answer: currentAnswer.join("\n").trim(),
          category: currentCategory
        });
        currentQuestion = "";
        currentAnswer = [];
      }
      currentCategory = categoryMatch[1].trim();
      continue;
    }
    const questionMatch = line.match(/^#{2,3}\s*Q:\s*(.+)/);
    if (questionMatch) {
      if (currentQuestion) {
        qaPairs.push({
          question: currentQuestion,
          answer: currentAnswer.join("\n").trim(),
          category: currentCategory
        });
      }
      currentQuestion = questionMatch[1].trim();
      currentAnswer = [];
      continue;
    }
    if (currentQuestion) {
      const trimmed = line.trim();
      if (trimmed === "---" || trimmed === "") continue;
      if (trimmed.startsWith(">")) continue;
      currentAnswer.push(trimmed);
    }
  }
  if (currentQuestion) {
    qaPairs.push({
      question: currentQuestion,
      answer: currentAnswer.join("\n").trim(),
      category: currentCategory
    });
  }
  if (qaPairs.length === 0) return "";
  const sections = qaPairs.map(
    (qa) => `[Q] ${qa.question}
[A] ${qa.answer}`
  );
  return sections.join("\n\n");
}






exports.loadConfig = loadConfig; exports.clearConfigCache = clearConfigCache; exports.loadKnowledge = loadKnowledge; exports.clearKnowledgeCache = clearKnowledgeCache;
