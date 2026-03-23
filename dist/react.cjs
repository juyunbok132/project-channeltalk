"use client";
"use strict";
"use client";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react.ts
var react_exports = {};
__export(react_exports, {
  AdminDashboard: () => AdminDashboard,
  AdminLogin: () => AdminLogin,
  ChatWidget: () => ChatWidget,
  ChatWidgetWrapper: () => ChatWidgetWrapper
});
module.exports = __toCommonJS(react_exports);

// src/components/chat/ChatWidget.tsx
var import_react2 = require("react");
var import_react3 = require("@ai-sdk/react");
var import_ai = require("ai");

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/chat/ChatMessage.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function ChatMessage({ role, content, botName, botAvatar, brandColor }) {
  const displayContent = content.replace(/```json\s*\n?[\s\S]*?\n?\s*```/g, "").trim();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: cn("flex gap-2 mb-3", role === "user" ? "justify-end" : "justify-start"), children: [
    role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200", children: botAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: botAvatar, alt: botName || "Bot", className: "w-full h-full object-cover" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "w-full h-full flex items-center justify-center text-white text-sm font-bold",
        style: { backgroundColor: brandColor || "#6366f1" },
        children: (botName || "B")[0]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          role === "user" ? "text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"
        ),
        style: role === "user" ? { backgroundColor: brandColor || "#6366f1" } : void 0,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "whitespace-pre-wrap", children: displayContent })
      }
    )
  ] });
}

// src/components/chat/PresetButtons.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function PresetButtons({ presets, language, onSelect, brandColor }) {
  if (!presets.length) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "flex flex-col gap-2 mb-4", children: presets.map((preset, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "button",
    {
      onClick: () => onSelect(preset[language]),
      className: "text-left text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors",
      style: { "--brand": brandColor || "#6366f1" },
      children: preset[language]
    },
    i
  )) });
}

// src/components/chat/FollowUpButtons.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function FollowUpButtons({ questions, onSelect }) {
  if (!questions.length) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "flex flex-col gap-1.5 mb-3 ml-10", children: questions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "button",
    {
      onClick: () => onSelect(q),
      className: "text-left text-xs px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors text-gray-600",
      children: q
    },
    i
  )) });
}

// src/components/chat/EmailForm.tsx
var import_react = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function EmailForm({ config, language, brandColor, onSubmit }) {
  const [formData, setFormData] = (0, import_react.useState)({});
  const [submitted, setSubmitted] = (0, import_react.useState)(false);
  if (submitted) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "text-green-800 text-sm", children: config.success_message[language] }) });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { onSubmit: handleSubmit, className: "bg-white border border-gray-200 rounded-xl p-4 space-y-3", children: [
    config.fields.map((field) => {
      var _a;
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: [
          field.label[language],
          field.required && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-red-500 ml-0.5", children: "*" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            type: field.type,
            required: field.required,
            placeholder: ((_a = field.placeholder) == null ? void 0 : _a[language]) || "",
            value: formData[field.name] || "",
            onChange: (e) => setFormData((prev) => __spreadProps(__spreadValues({}, prev), { [field.name]: e.target.value })),
            className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1",
            style: { "--tw-ring-color": brandColor || "#6366f1" }
          }
        )
      ] }, field.name);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "button",
      {
        type: "submit",
        className: "w-full py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90",
        style: { backgroundColor: brandColor || "#6366f1" },
        children: config.submit_text[language]
      }
    )
  ] });
}

// src/components/chat/CTABanner.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function CTABanner({ cta, language, brandColor }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "border-t border-gray-100 bg-gray-50 px-4 py-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "a",
      {
        href: cta.primary.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "block w-full text-center py-2.5 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90",
        style: { backgroundColor: brandColor || "#6366f1" },
        children: cta.primary.text[language]
      }
    ),
    cta.secondary && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "a",
      {
        href: cta.secondary.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "block w-full text-center py-2 text-sm text-gray-600 hover:text-gray-800 mt-1",
        children: cta.secondary.text[language]
      }
    )
  ] });
}

// src/components/chat/ChatWidget.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function getTextFromMessage(message) {
  if (message.parts) {
    return message.parts.filter((p) => p.type === "text").map((p) => p.text).join("");
  }
  return "";
}
function ChatWidget({ config, apiEndpoint = "/api/chat" }) {
  var _a;
  const [isOpen, setIsOpen] = (0, import_react2.useState)(false);
  const [sessionId, setSessionId] = (0, import_react2.useState)(null);
  const [language, setLanguage] = (0, import_react2.useState)(((_a = config.language) == null ? void 0 : _a.default) || "en");
  const [funnelState, setFunnelState] = (0, import_react2.useState)("normal");
  const [followUpQuestions, setFollowUpQuestions] = (0, import_react2.useState)([]);
  const [showPresets, setShowPresets] = (0, import_react2.useState)(false);
  const [messageCount, setMessageCount] = (0, import_react2.useState)(0);
  const [inputValue, setInputValue] = (0, import_react2.useState)("");
  const scrollRef = (0, import_react2.useRef)(null);
  const { messages, sendMessage, status } = (0, import_react3.useChat)({
    transport: new import_ai.DefaultChatTransport({ api: apiEndpoint }),
    onFinish: ({ message }) => {
      const text = getTextFromMessage(message);
      setShowPresets(true);
      const jsonMatch = text.match(/```json\s*\n?([\s\S]*?)\n?\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          setFollowUpQuestions(parsed.follow_up_questions || []);
        } catch (e) {
          setFollowUpQuestions([]);
        }
      }
    }
  });
  const isLoading = status === "submitted" || status === "streaming";
  (0, import_react2.useEffect)(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, followUpQuestions]);
  const doSendMessage = (0, import_react2.useCallback)(
    (text) => {
      setFollowUpQuestions([]);
      setInputValue("");
      const koreanChars = text.match(/[\uAC00-\uD7AF]/g);
      if (koreanChars && koreanChars.length > 0) {
        setLanguage("ko");
      } else {
        setLanguage("en");
      }
      setMessageCount((c) => c + 1);
      sendMessage({
        text
      }, {
        body: { sessionId }
      });
    },
    [sendMessage, sessionId]
  );
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    doSendMessage(inputValue.trim());
  };
  const isBlocked = messageCount >= config.limits.max_messages_per_session;
  (0, import_react2.useEffect)(() => {
    if (messageCount >= config.limits.hard_redirect_after) {
      setFunnelState("hard_redirect");
    } else if (messageCount >= config.limits.soft_cta_after) {
      setFunnelState("soft_cta");
    } else {
      setFunnelState("normal");
    }
  }, [messageCount, config.limits]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    !isOpen && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "button",
      {
        onClick: () => setIsOpen(true),
        className: "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform z-50",
        style: { backgroundColor: config.brand_color },
        "aria-label": "Open chat",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) })
      }
    ),
    isOpen && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "div",
        {
          className: "flex items-center gap-3 px-4 py-3 text-white",
          style: { backgroundColor: config.brand_color },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "w-9 h-9 rounded-full overflow-hidden bg-white/20 flex-shrink-0", children: config.bot.avatar ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("img", { src: config.bot.avatar, alt: config.bot.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "w-full h-full flex items-center justify-center text-sm font-bold", children: config.bot.name[0] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "font-semibold text-sm", children: config.bot.name }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-xs opacity-80", children: "Online" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "p-1 hover:bg-white/10 rounded-lg transition-colors",
                "aria-label": "Close chat",
                children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { ref: scrollRef, className: "flex-1 overflow-y-auto px-4 py-4", children: [
        messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          ChatMessage,
          {
            role: "assistant",
            content: config.bot.greeting[language],
            botName: config.bot.name,
            botAvatar: config.bot.avatar,
            brandColor: config.brand_color
          }
        ) }),
        showPresets && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          PresetButtons,
          {
            presets: config.presets,
            language,
            onSelect: doSendMessage,
            brandColor: config.brand_color
          }
        ),
        messages.map((msg, i) => {
          const text = getTextFromMessage(msg);
          if (!text) return null;
          return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              ChatMessage,
              {
                role: msg.role,
                content: text,
                botName: config.bot.name,
                botAvatar: config.bot.avatar,
                brandColor: config.brand_color
              }
            ),
            msg.role === "assistant" && i === messages.length - 1 && !isLoading && followUpQuestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FollowUpButtons, { questions: followUpQuestions, onSelect: doSendMessage })
          ] }, msg.id);
        }),
        isLoading && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "div",
            {
              className: "w-full h-full flex items-center justify-center text-white text-sm font-bold",
              style: { backgroundColor: config.brand_color },
              children: config.bot.name[0]
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0ms" } }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "150ms" } }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "300ms" } })
          ] }) })
        ] }),
        funnelState === "hard_redirect" && config.email_form.enabled && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "mt-4", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          EmailForm,
          {
            config: config.email_form,
            language,
            brandColor: config.brand_color,
            onSubmit: (data) => {
              const emailInfo = [
                data.name ? `Name: ${data.name}` : "",
                data.email ? `Email: ${data.email}` : "",
                data.message ? `Message: ${data.message}` : ""
              ].filter(Boolean).join(", ");
              doSendMessage(`[Email Submitted] ${emailInfo}`);
              fetch("/api/chat-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
              });
            }
          }
        ) })
      ] }),
      funnelState === "soft_cta" && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CTABanner, { cta: config.cta, language, brandColor: config.brand_color }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "border-t border-gray-100 px-4 py-3", children: isBlocked ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "text-center text-sm text-gray-500 py-2", children: language === "ko" ? "\uB300\uD654 \uD55C\uB3C4\uC5D0 \uB3C4\uB2EC\uD588\uC2B5\uB2C8\uB2E4." : "You have reached the message limit." }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("form", { onSubmit: handleFormSubmit, className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "input",
          {
            type: "text",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            placeholder: language === "ko" ? "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694..." : "Type a message...",
            disabled: isLoading || funnelState === "hard_redirect",
            className: "flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50",
            style: { "--tw-ring-color": config.brand_color },
            maxLength: config.limits.max_input_length
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "button",
          {
            type: "submit",
            disabled: !inputValue.trim() || isLoading,
            className: "p-2 rounded-lg text-white disabled:opacity-50 transition-opacity hover:opacity-90",
            style: { backgroundColor: config.brand_color },
            "aria-label": "Send",
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
            ] })
          }
        )
      ] }) })
    ] })
  ] });
}

// src/components/chat/ChatWidgetWrapper.tsx
var import_react4 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function ChatWidgetWrapper({
  config: directConfig,
  configEndpoint = "/api/config",
  chatEndpoint
}) {
  const [config, setConfig] = (0, import_react4.useState)(directConfig || null);
  (0, import_react4.useEffect)(() => {
    if (directConfig) return;
    fetch(configEndpoint).then((res) => res.json()).then((data) => setConfig(data)).catch(console.error);
  }, [directConfig, configEndpoint]);
  if (!config) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ChatWidget, { config, apiEndpoint: chatEndpoint });
}

// src/components/admin/AdminDashboard.tsx
var import_react5 = require("react");

// src/components/ui/badge.tsx
var import_merge_props = require("@base-ui/react/merge-props");
var import_use_render = require("@base-ui/react/use-render");
var import_class_variance_authority = require("class-variance-authority");
var badgeVariants = (0, import_class_variance_authority.cva)(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge(_a) {
  var _b = _a, {
    className,
    variant = "default",
    render
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "render"
  ]);
  return (0, import_use_render.useRender)({
    defaultTagName: "span",
    props: (0, import_merge_props.mergeProps)(
      {
        className: cn(badgeVariants({ variant }), className)
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant
    }
  });
}

// src/components/admin/ChatList.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
function ChatList({ sessions, selectedId, onSelect }) {
  if (!sessions.length) {
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-gray-500 text-sm p-4", children: "No conversations yet." });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "divide-y divide-gray-100", children: sessions.map((session) => {
    const firstUserMsg = session.messages.find((m) => m.role === "user");
    const preview = (firstUserMsg == null ? void 0 : firstUserMsg.content.slice(0, 60)) || "No messages";
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "button",
      {
        onClick: () => onSelect(session),
        className: `w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedId === session.session_id ? "bg-indigo-50" : ""}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "text-xs text-gray-500", children: new Date(session.created_at).toLocaleString() }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Badge, { variant: "outline", className: "text-xs", children: session.language.toUpperCase() }),
              session.fallback_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Badge, { variant: "destructive", className: "text-xs", children: [
                session.fallback_count,
                " unanswered"
              ] }),
              session.converted_to && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Badge, { className: "text-xs bg-green-100 text-green-800", children: session.converted_to })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-sm text-gray-800 truncate", children: preview }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: "text-xs text-gray-400 mt-0.5", children: [
            session.message_count,
            " messages \xB7 $",
            session.cost_usd.toFixed(4)
          ] })
        ]
      },
      session.session_id
    );
  }) });
}

// src/components/admin/ChatDetail.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function ChatDetail({ session }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "mb-4 pb-4 border-b border-gray-100", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("h2", { className: "text-sm font-semibold text-gray-800", children: [
          "Session ",
          session.session_id
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Badge, { variant: "outline", className: "text-xs", children: session.language.toUpperCase() })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "text-xs text-gray-500 space-y-0.5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { children: [
          "Started: ",
          new Date(session.created_at).toLocaleString()
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { children: [
          "Messages: ",
          session.message_count,
          " \xB7 Unanswered: ",
          session.fallback_count
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { children: [
          "Cost: $",
          session.cost_usd.toFixed(4)
        ] }),
        session.email_submitted && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { children: [
          "Email: ",
          session.email_submitted
        ] }),
        session.converted_to && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { children: [
          "Converted: ",
          session.converted_to
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "space-y-3", children: session.messages.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "div",
      {
        className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "div",
          {
            className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "whitespace-pre-wrap", children: msg.content.replace(/```json\s*\n?[\s\S]*?\n?\s*```/g, "").trim() }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "text-xs opacity-60 mt-1", children: new Date(msg.timestamp).toLocaleTimeString() })
            ]
          }
        )
      },
      i
    )) })
  ] });
}

// src/components/admin/UnansweredList.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
function UnansweredList({ sessions }) {
  const unansweredQuestions = [];
  for (const session of sessions) {
    for (let i = 0; i < session.messages.length; i++) {
      const msg = session.messages[i];
      if (msg.role === "assistant") {
        const content = msg.content.toLowerCase();
        if (content.includes("don't have information") || content.includes("\uB2F4\uB2F9\uC790\uC5D0\uAC8C \uC5F0\uACB0") || content.includes("\uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4")) {
          const prevMsg = session.messages[i - 1];
          if (prevMsg && prevMsg.role === "user") {
            unansweredQuestions.push({
              question: prevMsg.content,
              sessionId: session.session_id,
              date: prevMsg.timestamp
            });
          }
        }
      }
    }
  }
  if (!unansweredQuestions.length) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-gray-500 text-sm p-4", children: "No unanswered questions found." });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "divide-y divide-gray-100", children: unansweredQuestions.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "px-4 py-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { className: "text-sm text-gray-800", children: [
      "\u201C",
      item.question,
      "\u201D"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { className: "text-xs text-gray-400 mt-1", children: [
      new Date(item.date).toLocaleString(),
      " \xB7 ",
      item.sessionId
    ] })
  ] }, i)) });
}

// src/components/admin/AdminDashboard.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
function AdminDashboard({ password, apiEndpoint = "/api/admin/sessions" }) {
  const [sessions, setSessions] = (0, import_react5.useState)([]);
  const [selectedSession, setSelectedSession] = (0, import_react5.useState)(null);
  const [tab, setTab] = (0, import_react5.useState)("conversations");
  const [costStats, setCostStats] = (0, import_react5.useState)({ dailyCost: 0, monthlyCost: 0, dailySessions: 0 });
  const fetchSessions = (0, import_react5.useCallback)(
    async (filter) => {
      const url = filter ? `${apiEndpoint}?filter=${encodeURIComponent(filter)}` : apiEndpoint;
      const res = await fetch(url, {
        headers: { "x-admin-password": password }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
        setCostStats(data.costStats);
      }
    },
    [password]
  );
  (0, import_react5.useEffect)(() => {
    fetchSessions();
  }, [fetchSessions]);
  const tabs = [
    { key: "conversations", label: "Conversations" },
    { key: "unanswered", label: "Unanswered" },
    { key: "cost", label: "Cost" }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("header", { className: "bg-white border-b border-gray-200 px-6 py-4", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h1", { className: "text-xl font-bold text-gray-900", children: "Admin Dashboard" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "bg-white border-b border-gray-200 px-6", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex gap-6", children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "button",
      {
        onClick: () => {
          setTab(t.key);
          if (t.key === "unanswered") fetchSessions("unanswered");
          else fetchSessions();
        },
        className: `py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`,
        children: t.label
      },
      t.key
    )) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "max-w-7xl mx-auto p-6", children: [
      tab === "conversations" && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "px-4 py-3 border-b border-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("h2", { className: "text-sm font-semibold text-gray-700", children: [
            "Conversations (",
            sessions.length,
            ")"
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "max-h-[calc(100vh-250px)] overflow-y-auto", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            ChatList,
            {
              sessions,
              selectedId: (selectedSession == null ? void 0 : selectedSession.session_id) || null,
              onSelect: setSelectedSession
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "px-4 py-3 border-b border-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h2", { className: "text-sm font-semibold text-gray-700", children: "Detail" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "max-h-[calc(100vh-250px)] overflow-y-auto", children: selectedSession ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ChatDetail, { session: selectedSession }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-gray-500 text-sm p-4", children: "Select a conversation to view details." }) })
        ] })
      ] }),
      tab === "unanswered" && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "px-4 py-3 border-b border-gray-100", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h2", { className: "text-sm font-semibold text-gray-700", children: "Unanswered Questions" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-xs text-gray-400 mt-0.5", children: "Add these to knowledge.md to improve your chatbot" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(UnansweredList, { sessions })
      ] }),
      tab === "cost" && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-gray-500", children: "Today's Cost" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: [
            "$",
            costStats.dailyCost.toFixed(4)
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-gray-500", children: "Monthly Cost" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: [
            "$",
            costStats.monthlyCost.toFixed(4)
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-gray-500", children: "Today's Sessions" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: costStats.dailySessions })
        ] })
      ] })
    ] })
  ] });
}

// src/components/admin/AdminLogin.tsx
var import_react6 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
function AdminLogin({ onLogin }) {
  const [password, setPassword] = (0, import_react6.useState)("");
  const [error, setError] = (0, import_react6.useState)(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/sessions", {
      headers: { "x-admin-password": password }
    });
    if (res.ok) {
      onLogin(password);
    } else {
      setError(true);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("form", { onSubmit: handleSubmit, className: "bg-white p-8 rounded-xl shadow-md w-80", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h1", { className: "text-xl font-bold mb-6 text-center", children: "Admin Login" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "input",
      {
        type: "password",
        value: password,
        onChange: (e) => {
          setPassword(e.target.value);
          setError(false);
        },
        placeholder: "Password",
        className: "w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      }
    ),
    error && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-red-500 text-sm mb-4", children: "Incorrect password" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "button",
      {
        type: "submit",
        className: "w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
        children: "Login"
      }
    )
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AdminDashboard,
  AdminLogin,
  ChatWidget,
  ChatWidgetWrapper
});
