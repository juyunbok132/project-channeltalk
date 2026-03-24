"use client";
"use client";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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

// src/components/chat/ChatWidget.tsx
import { useState as useState2, useRef, useEffect, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/chat/ChatMessage.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function ChatMessage({ role, content, botName, botAvatar, brandColor }) {
  const displayContent = content.replace(/```json\s*\n?[\s\S]*?\n?\s*```/g, "").trim();
  return /* @__PURE__ */ jsxs("div", { className: cn("flex gap-2 mb-3", role === "user" ? "justify-end" : "justify-start"), children: [
    role === "assistant" && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200", children: botAvatar ? /* @__PURE__ */ jsx("img", { src: botAvatar, alt: botName || "Bot", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center text-white text-sm font-bold",
        style: { backgroundColor: brandColor || "#6366f1" },
        children: (botName || "B")[0]
      }
    ) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          role === "user" ? "text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"
        ),
        style: role === "user" ? { backgroundColor: brandColor || "#6366f1" } : void 0,
        children: /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap", children: displayContent })
      }
    )
  ] });
}

// src/components/chat/PresetButtons.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function PresetButtons({ presets, language, onSelect, brandColor }) {
  if (!presets.length) return null;
  return /* @__PURE__ */ jsx2("div", { className: "flex flex-col gap-2 mb-4", children: presets.map((preset, i) => /* @__PURE__ */ jsx2(
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
import { jsx as jsx3 } from "react/jsx-runtime";
function FollowUpButtons({ questions, onSelect }) {
  if (!questions.length) return null;
  return /* @__PURE__ */ jsx3("div", { className: "flex flex-col gap-1.5 mb-3 ml-10", children: questions.map((q, i) => /* @__PURE__ */ jsx3(
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
import { useState } from "react";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function EmailForm({ config, language, brandColor, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  if (submitted) {
    return /* @__PURE__ */ jsx4("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 text-center", children: /* @__PURE__ */ jsx4("p", { className: "text-green-800 text-sm", children: config.success_message[language] }) });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
  };
  return /* @__PURE__ */ jsxs2("form", { onSubmit: handleSubmit, className: "bg-white border border-gray-200 rounded-xl p-4 space-y-3", children: [
    config.fields.map((field) => {
      var _a;
      return /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: [
          field.label[language],
          field.required && /* @__PURE__ */ jsx4("span", { className: "text-red-500 ml-0.5", children: "*" })
        ] }),
        /* @__PURE__ */ jsx4(
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
    /* @__PURE__ */ jsx4(
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
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function CTABanner({ cta, language, brandColor }) {
  return /* @__PURE__ */ jsxs3("div", { className: "border-t border-gray-100 bg-gray-50 px-4 py-3", children: [
    /* @__PURE__ */ jsx5(
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
    cta.secondary && /* @__PURE__ */ jsx5(
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
import { Fragment, jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function getTextFromMessage(message) {
  if (message.parts) {
    return message.parts.filter((p) => p.type === "text").map((p) => p.text).join("");
  }
  return "";
}
var SESSION_STORAGE_KEY = "channeltalk_session_id";
var VISIT_COUNT_KEY = "channeltalk_visit_count";
var FIRST_VISIT_KEY = "channeltalk_first_visit";
function ChatWidget({ config, apiEndpoint = "/api/chat" }) {
  var _a;
  const [isOpen, setIsOpen] = useState2(false);
  const [sessionId, setSessionId] = useState2(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(SESSION_STORAGE_KEY);
    }
    return null;
  });
  const [language, setLanguage] = useState2(((_a = config.language) == null ? void 0 : _a.default) || "en");
  const [funnelState, setFunnelState] = useState2("normal");
  const [followUpQuestions, setFollowUpQuestions] = useState2([]);
  const [showPresets, setShowPresets] = useState2(false);
  const [messageCount, setMessageCount] = useState2(0);
  const [inputValue, setInputValue] = useState2("");
  const scrollRef = useRef(null);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: apiEndpoint,
      fetch: async (input, init) => {
        const response = await fetch(input, init);
        const newSessionId = response.headers.get("x-session-id");
        if (newSessionId && newSessionId !== sessionId) {
          setSessionId(newSessionId);
          localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
        }
        const funnel = response.headers.get("x-funnel-state");
        if (funnel) {
          setFunnelState(funnel);
        }
        return response;
      }
    }),
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
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, followUpQuestions]);
  const doSendMessage = useCallback(
    (text) => {
      setFollowUpQuestions([]);
      setInputValue("");
      const koreanChars = text.match(/[\uAC00-\uD7AF]/g);
      if (koreanChars && koreanChars.length > 0) {
        setLanguage("ko");
      } else {
        setLanguage("en");
      }
      setMessageCount((c) => {
        const newCount = c + 1;
        if (newCount === 1) {
          const prevCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10);
          const visitCount = prevCount + 1;
          localStorage.setItem(VISIT_COUNT_KEY, String(visitCount));
          if (!localStorage.getItem(FIRST_VISIT_KEY)) {
            localStorage.setItem(FIRST_VISIT_KEY, (/* @__PURE__ */ new Date()).toISOString());
          }
          const firstVisitAt = localStorage.getItem(FIRST_VISIT_KEY) || void 0;
          sendMessage({ text }, {
            body: {
              sessionId,
              metadata: {
                page_url: window.location.href,
                referrer: document.referrer || void 0,
                visit_count: visitCount,
                first_visit_at: firstVisitAt
              }
            }
          });
        } else {
          sendMessage({ text }, { body: { sessionId } });
        }
        return newCount;
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
  useEffect(() => {
    if (messageCount >= config.limits.hard_redirect_after) {
      setFunnelState("hard_redirect");
    } else if (messageCount >= config.limits.soft_cta_after) {
      setFunnelState("soft_cta");
    } else {
      setFunnelState("normal");
    }
  }, [messageCount, config.limits]);
  return /* @__PURE__ */ jsxs4(Fragment, { children: [
    !isOpen && /* @__PURE__ */ jsx6(
      "button",
      {
        onClick: () => setIsOpen(true),
        className: "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform z-50",
        style: { backgroundColor: config.brand_color },
        "aria-label": "Open chat",
        children: /* @__PURE__ */ jsx6("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx6("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) })
      }
    ),
    isOpen && /* @__PURE__ */ jsxs4("div", { className: "fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200", children: [
      /* @__PURE__ */ jsxs4(
        "div",
        {
          className: "flex items-center gap-3 px-4 py-3 text-white",
          style: { backgroundColor: config.brand_color },
          children: [
            /* @__PURE__ */ jsx6("div", { className: "w-9 h-9 rounded-full overflow-hidden bg-white/20 flex-shrink-0", children: config.bot.avatar ? /* @__PURE__ */ jsx6("img", { src: config.bot.avatar, alt: config.bot.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx6("div", { className: "w-full h-full flex items-center justify-center text-sm font-bold", children: config.bot.name[0] }) }),
            /* @__PURE__ */ jsxs4("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx6("p", { className: "font-semibold text-sm", children: config.bot.name }),
              /* @__PURE__ */ jsx6("p", { className: "text-xs opacity-80", children: "Online" })
            ] }),
            /* @__PURE__ */ jsx6(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "p-1 hover:bg-white/10 rounded-lg transition-colors",
                "aria-label": "Close chat",
                children: /* @__PURE__ */ jsxs4("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx6("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ jsx6("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs4("div", { ref: scrollRef, className: "flex-1 overflow-y-auto px-4 py-4", children: [
        messages.length === 0 && /* @__PURE__ */ jsx6("div", { className: "mb-4", children: /* @__PURE__ */ jsx6(
          ChatMessage,
          {
            role: "assistant",
            content: config.bot.greeting[language],
            botName: config.bot.name,
            botAvatar: config.bot.avatar,
            brandColor: config.brand_color
          }
        ) }),
        showPresets && /* @__PURE__ */ jsx6(
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
          return /* @__PURE__ */ jsxs4("div", { children: [
            /* @__PURE__ */ jsx6(
              ChatMessage,
              {
                role: msg.role,
                content: text,
                botName: config.bot.name,
                botAvatar: config.bot.avatar,
                brandColor: config.brand_color
              }
            ),
            msg.role === "assistant" && i === messages.length - 1 && !isLoading && followUpQuestions.length > 0 && /* @__PURE__ */ jsx6(FollowUpButtons, { questions: followUpQuestions, onSelect: doSendMessage })
          ] }, msg.id);
        }),
        isLoading && /* @__PURE__ */ jsxs4("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsx6("div", { className: "flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200", children: /* @__PURE__ */ jsx6(
            "div",
            {
              className: "w-full h-full flex items-center justify-center text-white text-sm font-bold",
              style: { backgroundColor: config.brand_color },
              children: config.bot.name[0]
            }
          ) }),
          /* @__PURE__ */ jsx6("div", { className: "bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3", children: /* @__PURE__ */ jsxs4("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx6("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0ms" } }),
            /* @__PURE__ */ jsx6("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "150ms" } }),
            /* @__PURE__ */ jsx6("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "300ms" } })
          ] }) })
        ] }),
        funnelState === "hard_redirect" && config.email_form.enabled && /* @__PURE__ */ jsx6("div", { className: "mt-4", children: /* @__PURE__ */ jsx6(
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
      funnelState === "soft_cta" && /* @__PURE__ */ jsx6(CTABanner, { cta: config.cta, language, brandColor: config.brand_color }),
      /* @__PURE__ */ jsx6("div", { className: "border-t border-gray-100 px-4 py-3", children: isBlocked ? /* @__PURE__ */ jsx6("div", { className: "text-center text-sm text-gray-500 py-2", children: language === "ko" ? "\uB300\uD654 \uD55C\uB3C4\uC5D0 \uB3C4\uB2EC\uD588\uC2B5\uB2C8\uB2E4." : "You have reached the message limit." }) : /* @__PURE__ */ jsxs4("form", { onSubmit: handleFormSubmit, className: "flex gap-2", children: [
        /* @__PURE__ */ jsx6(
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
        /* @__PURE__ */ jsx6(
          "button",
          {
            type: "submit",
            disabled: !inputValue.trim() || isLoading,
            className: "p-2 rounded-lg text-white disabled:opacity-50 transition-opacity hover:opacity-90",
            style: { backgroundColor: config.brand_color },
            "aria-label": "Send",
            children: /* @__PURE__ */ jsxs4("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsx6("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
              /* @__PURE__ */ jsx6("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
            ] })
          }
        )
      ] }) })
    ] })
  ] });
}

// src/components/chat/ChatWidgetWrapper.tsx
import { useEffect as useEffect2, useState as useState3 } from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
function ChatWidgetWrapper({
  config: directConfig,
  configEndpoint = "/api/config",
  chatEndpoint
}) {
  const [config, setConfig] = useState3(directConfig || null);
  useEffect2(() => {
    if (directConfig) return;
    fetch(configEndpoint).then((res) => res.json()).then((data) => setConfig(data)).catch(console.error);
  }, [directConfig, configEndpoint]);
  if (!config) return null;
  return /* @__PURE__ */ jsx7(ChatWidget, { config, apiEndpoint: chatEndpoint });
}

// src/components/admin/AdminDashboard.tsx
import { useState as useState4, useEffect as useEffect3, useCallback as useCallback2, useRef as useRef2 } from "react";

// src/components/ui/badge.tsx
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
var badgeVariants = cva(
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
  return useRender({
    defaultTagName: "span",
    props: mergeProps(
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
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
function ChatList({ sessions, selectedId, onSelect }) {
  if (!sessions.length) {
    return /* @__PURE__ */ jsx8("p", { className: "text-gray-500 text-sm p-4", children: "No conversations yet." });
  }
  return /* @__PURE__ */ jsx8("div", { className: "divide-y divide-gray-100", children: sessions.map((session) => {
    const firstUserMsg = session.messages.find((m) => m.role === "user");
    const preview = (firstUserMsg == null ? void 0 : firstUserMsg.content.slice(0, 60)) || "No messages";
    return /* @__PURE__ */ jsxs5(
      "button",
      {
        onClick: () => onSelect(session),
        className: `w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedId === session.session_id ? "bg-indigo-50" : ""}`,
        children: [
          /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx8("span", { className: "text-xs text-gray-500", children: new Date(session.created_at).toLocaleString() }),
            /* @__PURE__ */ jsxs5("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx8(Badge, { variant: "outline", className: "text-xs", children: session.language.toUpperCase() }),
              session.fallback_count > 0 && /* @__PURE__ */ jsxs5(Badge, { variant: "destructive", className: "text-xs", children: [
                session.fallback_count,
                " unanswered"
              ] }),
              session.converted_to && /* @__PURE__ */ jsx8(Badge, { className: "text-xs bg-green-100 text-green-800", children: session.converted_to })
            ] })
          ] }),
          /* @__PURE__ */ jsx8("p", { className: "text-sm text-gray-800 truncate", children: preview }),
          /* @__PURE__ */ jsxs5("p", { className: "text-xs text-gray-400 mt-0.5", children: [
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
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
function ChatDetail({ session }) {
  return /* @__PURE__ */ jsx9("div", { className: "p-4", children: /* @__PURE__ */ jsx9("div", { className: "space-y-3", children: session.messages.map((msg, i) => /* @__PURE__ */ jsx9(
    "div",
    {
      className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
      children: /* @__PURE__ */ jsxs6(
        "div",
        {
          className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"}`,
          children: [
            /* @__PURE__ */ jsx9("p", { className: "whitespace-pre-wrap", children: msg.content.replace(/```json\s*\n?[\s\S]*?\n?\s*```/g, "").trim() }),
            /* @__PURE__ */ jsx9("p", { className: "text-xs opacity-60 mt-1", children: new Date(msg.timestamp).toLocaleTimeString() })
          ]
        }
      )
    },
    i
  )) }) });
}

// src/lib/csv-export.ts
function escapeCsvField(value) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
function downloadCsv(filename, csvContent) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function downloadSessionCsv(session) {
  const header = "timestamp,role,content";
  const rows = session.messages.map(
    (msg) => [
      msg.timestamp,
      msg.role,
      escapeCsvField(msg.content.replace(/```json\s*\n?[\s\S]*?\n?\s*```/g, "").trim())
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");
  downloadCsv(`chat_${session.session_id}.csv`, csv);
}
function downloadAllSessionsCsv(sessions) {
  const header = [
    "session_id",
    "created_at",
    "language",
    "email",
    "country",
    "city",
    "device",
    "browser",
    "os",
    "page_url",
    "referrer",
    "visit_count",
    "message_count",
    "fallback_count",
    "converted_to",
    "cost_usd"
  ].join(",");
  const rows = sessions.map((s) => {
    const m = s.metadata || {};
    return [
      s.session_id,
      s.created_at,
      s.language,
      escapeCsvField(s.email_submitted || ""),
      m.country || "",
      m.city || "",
      m.device || "",
      m.browser || "",
      m.os || "",
      escapeCsvField(m.page_url || ""),
      escapeCsvField(m.referrer || ""),
      m.visit_count || "",
      s.message_count,
      s.fallback_count,
      s.converted_to || "",
      s.cost_usd.toFixed(4)
    ].join(",");
  });
  const csv = [header, ...rows].join("\n");
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  downloadCsv(`sessions_${date}.csv`, csv);
}

// src/components/admin/SessionInfo.tsx
import { jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
function formatDuration(startIso, endIso) {
  if (!endIso) return "-";
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (ms < 0) return "-";
  const totalSeconds = Math.floor(ms / 1e3);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}\uCD08`;
  return `${minutes}\uBD84 ${seconds}\uCD08`;
}
function getLastMessageTime(session) {
  if (session.last_message_at) return session.last_message_at;
  const msgs = session.messages;
  if (msgs.length > 0) return msgs[msgs.length - 1].timestamp;
  return void 0;
}
function InfoRow({ label, value }) {
  return /* @__PURE__ */ jsxs7("div", { className: "flex justify-between py-1.5 text-sm", children: [
    /* @__PURE__ */ jsx10("span", { className: "text-gray-500", children: label }),
    /* @__PURE__ */ jsx10("span", { className: "text-gray-900 font-medium text-right max-w-[60%] truncate", children: value || "-" })
  ] });
}
function SessionInfo({ session }) {
  const meta = session.metadata || {};
  const lastMsg = getLastMessageTime(session);
  const duration = formatDuration(session.created_at, lastMsg);
  const visitLabel = meta.visit_count ? meta.visit_count === 1 ? "\uCCAB \uBC29\uBB38" : `\uC7AC\uBC29\uBB38 (${meta.visit_count}\uD68C\uC9F8)` : "-";
  const locationLabel = [meta.country, meta.city].filter(Boolean).join(" \xB7 ") || void 0;
  const deviceLabel = [meta.device, meta.browser, meta.os].filter(Boolean).join(" / ") || void 0;
  let pageLabel = meta.page_url;
  if (pageLabel) {
    try {
      pageLabel = new URL(pageLabel).pathname;
    } catch (e) {
    }
  }
  let referrerLabel = meta.referrer;
  if (referrerLabel) {
    try {
      referrerLabel = new URL(referrerLabel).hostname;
    } catch (e) {
    }
  }
  return /* @__PURE__ */ jsxs7("div", { className: "p-4 space-y-4", children: [
    /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsx10("h3", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2", children: "\uACE0\uAC1D \uC815\uBCF4" }),
      /* @__PURE__ */ jsxs7("div", { className: "divide-y divide-gray-50", children: [
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uC774\uBA54\uC77C", value: session.email_submitted }),
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uAD6D\uAC00 / \uB3C4\uC2DC", value: locationLabel }),
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uAE30\uAE30 / \uBE0C\uB77C\uC6B0\uC800", value: deviceLabel }),
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uC811\uC18D \uD398\uC774\uC9C0", value: pageLabel }),
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uC720\uC785 \uACBD\uB85C", value: referrerLabel }),
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uBC29\uBB38 \uC774\uB825", value: visitLabel }),
        meta.first_visit_at && /* @__PURE__ */ jsx10(
          InfoRow,
          {
            label: "\uCD5C\uCD08 \uBC29\uBB38",
            value: new Date(meta.first_visit_at).toLocaleDateString()
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsx10("h3", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2", children: "\uC138\uC158 \uD1B5\uACC4" }),
      /* @__PURE__ */ jsxs7("div", { className: "divide-y divide-gray-50", children: [
        /* @__PURE__ */ jsx10(
          InfoRow,
          {
            label: "\uC2DC\uC791",
            value: new Date(session.created_at).toLocaleString()
          }
        ),
        lastMsg && /* @__PURE__ */ jsx10(
          InfoRow,
          {
            label: "\uB9C8\uC9C0\uB9C9 \uBA54\uC2DC\uC9C0",
            value: new Date(lastMsg).toLocaleString()
          }
        ),
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uC9C0\uC18D \uC2DC\uAC04", value: duration }),
        /* @__PURE__ */ jsx10(
          InfoRow,
          {
            label: "\uBA54\uC2DC\uC9C0",
            value: `${session.message_count}\uAC1C (\uC0AC\uC6A9\uC790) / ${session.messages.length}\uAC1C (\uC804\uCCB4)`
          }
        ),
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uD3F4\uBC31", value: `${session.fallback_count}\uD68C` }),
        /* @__PURE__ */ jsx10(
          InfoRow,
          {
            label: "\uC804\uD658",
            value: session.converted_to ? `\u2705 ${session.converted_to}` : "\uC5C6\uC74C"
          }
        ),
        /* @__PURE__ */ jsx10(InfoRow, { label: "\uBE44\uC6A9", value: `$${session.cost_usd.toFixed(4)}` })
      ] })
    ] }),
    /* @__PURE__ */ jsxs7(
      "button",
      {
        onClick: () => downloadSessionCsv(session),
        className: "w-full py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2",
        children: [
          /* @__PURE__ */ jsxs7("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx10("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
            /* @__PURE__ */ jsx10("polyline", { points: "7 10 12 15 17 10" }),
            /* @__PURE__ */ jsx10("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
          ] }),
          "\uC774 \uC138\uC158 CSV \uB2E4\uC6B4\uB85C\uB4DC"
        ]
      }
    )
  ] });
}

// src/components/admin/UnansweredList.tsx
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
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
    return /* @__PURE__ */ jsx11("p", { className: "text-gray-500 text-sm p-4", children: "No unanswered questions found." });
  }
  return /* @__PURE__ */ jsx11("div", { className: "divide-y divide-gray-100", children: unansweredQuestions.map((item, i) => /* @__PURE__ */ jsxs8("div", { className: "px-4 py-3", children: [
    /* @__PURE__ */ jsxs8("p", { className: "text-sm text-gray-800", children: [
      "\u201C",
      item.question,
      "\u201D"
    ] }),
    /* @__PURE__ */ jsxs8("p", { className: "text-xs text-gray-400 mt-1", children: [
      new Date(item.date).toLocaleString(),
      " \xB7 ",
      item.sessionId
    ] })
  ] }, i)) });
}

// src/components/admin/AdminDashboard.tsx
import { jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
var MIN_LEFT = 220;
var MIN_CENTER = 300;
var MIN_RIGHT = 240;
function ResizeHandle({ onMouseDown }) {
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      onMouseDown,
      className: "w-1.5 cursor-col-resize flex-shrink-0 group relative",
      children: [
        /* @__PURE__ */ jsx12("div", { className: "absolute inset-y-0 -left-1 -right-1" }),
        /* @__PURE__ */ jsx12("div", { className: "h-full w-0.5 mx-auto bg-gray-200 group-hover:bg-indigo-400 group-active:bg-indigo-600 transition-colors rounded-full" })
      ]
    }
  );
}
function AdminDashboard({ password, apiEndpoint = "/api/admin/sessions" }) {
  const [sessions, setSessions] = useState4([]);
  const [selectedSession, setSelectedSession] = useState4(null);
  const [tab, setTab] = useState4("conversations");
  const [costStats, setCostStats] = useState4({ dailyCost: 0, monthlyCost: 0, dailySessions: 0 });
  const containerRef = useRef2(null);
  const [leftWidth, setLeftWidth] = useState4(280);
  const [rightWidth, setRightWidth] = useState4(320);
  const dragging = useRef2(null);
  const dragStartX = useRef2(0);
  const dragStartWidth = useRef2(0);
  const fetchSessions = useCallback2(
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
  useEffect3(() => {
    fetchSessions();
  }, [fetchSessions]);
  const handleMouseDown = useCallback2((side, e) => {
    e.preventDefault();
    dragging.current = side;
    dragStartX.current = e.clientX;
    dragStartWidth.current = side === "left" ? leftWidth : rightWidth;
  }, [leftWidth, rightWidth]);
  useEffect3(() => {
    const handleMouseMove = (e) => {
      if (!dragging.current || !containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const delta = e.clientX - dragStartX.current;
      if (dragging.current === "left") {
        const newLeft = Math.max(MIN_LEFT, dragStartWidth.current + delta);
        const maxLeft = containerWidth - rightWidth - MIN_CENTER - 12;
        setLeftWidth(Math.min(newLeft, maxLeft));
      } else {
        const newRight = Math.max(MIN_RIGHT, dragStartWidth.current - delta);
        const maxRight = containerWidth - leftWidth - MIN_CENTER - 12;
        setRightWidth(Math.min(newRight, maxRight));
      }
    };
    const handleMouseUp = () => {
      dragging.current = null;
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [leftWidth, rightWidth]);
  const tabs = [
    { key: "conversations", label: "Conversations" },
    { key: "unanswered", label: "Unanswered" },
    { key: "cost", label: "Cost" }
  ];
  return /* @__PURE__ */ jsxs9("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxs9("header", { className: "bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx12("h1", { className: "text-xl font-bold text-gray-900", children: "Admin Dashboard" }),
      tab === "conversations" && sessions.length > 0 && /* @__PURE__ */ jsxs9(
        "button",
        {
          onClick: () => downloadAllSessionsCsv(sessions),
          className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors",
          children: [
            /* @__PURE__ */ jsxs9("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsx12("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
              /* @__PURE__ */ jsx12("polyline", { points: "7 10 12 15 17 10" }),
              /* @__PURE__ */ jsx12("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
            ] }),
            "CSV \uC804\uCCB4 \uB2E4\uC6B4\uB85C\uB4DC"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx12("div", { className: "bg-white border-b border-gray-200 px-6", children: /* @__PURE__ */ jsx12("div", { className: "flex gap-6", children: tabs.map((t) => /* @__PURE__ */ jsx12(
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
    /* @__PURE__ */ jsxs9("div", { className: "mx-auto p-6", style: { maxWidth: "1600px" }, children: [
      tab === "conversations" && /* @__PURE__ */ jsxs9("div", { ref: containerRef, className: "flex", style: { userSelect: dragging.current ? "none" : void 0 }, children: [
        /* @__PURE__ */ jsxs9(
          "div",
          {
            className: "bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0",
            style: { width: leftWidth },
            children: [
              /* @__PURE__ */ jsx12("div", { className: "px-4 py-3 border-b border-gray-100", children: /* @__PURE__ */ jsxs9("h2", { className: "text-sm font-semibold text-gray-700", children: [
                "Conversations (",
                sessions.length,
                ")"
              ] }) }),
              /* @__PURE__ */ jsx12("div", { className: "max-h-[calc(100vh-220px)] overflow-y-auto", children: /* @__PURE__ */ jsx12(
                ChatList,
                {
                  sessions,
                  selectedId: (selectedSession == null ? void 0 : selectedSession.session_id) || null,
                  onSelect: setSelectedSession
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsx12(ResizeHandle, { onMouseDown: (e) => handleMouseDown("left", e) }),
        /* @__PURE__ */ jsxs9("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden flex-1", style: { minWidth: MIN_CENTER }, children: [
          /* @__PURE__ */ jsx12("div", { className: "px-4 py-3 border-b border-gray-100", children: /* @__PURE__ */ jsx12("h2", { className: "text-sm font-semibold text-gray-700", children: "Detail" }) }),
          /* @__PURE__ */ jsx12("div", { className: "max-h-[calc(100vh-220px)] overflow-y-auto", children: selectedSession ? /* @__PURE__ */ jsx12(ChatDetail, { session: selectedSession }) : /* @__PURE__ */ jsx12("p", { className: "text-gray-500 text-sm p-4", children: "Select a conversation to view details." }) })
        ] }),
        /* @__PURE__ */ jsx12(ResizeHandle, { onMouseDown: (e) => handleMouseDown("right", e) }),
        /* @__PURE__ */ jsxs9(
          "div",
          {
            className: "bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0",
            style: { width: rightWidth },
            children: [
              /* @__PURE__ */ jsx12("div", { className: "px-4 py-3 border-b border-gray-100", children: /* @__PURE__ */ jsx12("h2", { className: "text-sm font-semibold text-gray-700", children: "Session Info" }) }),
              /* @__PURE__ */ jsx12("div", { className: "max-h-[calc(100vh-220px)] overflow-y-auto", children: selectedSession ? /* @__PURE__ */ jsx12(SessionInfo, { session: selectedSession }) : /* @__PURE__ */ jsx12("p", { className: "text-gray-500 text-sm p-4", children: "Select a conversation to view session info." }) })
            ]
          }
        )
      ] }),
      tab === "unanswered" && /* @__PURE__ */ jsxs9("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs9("div", { className: "px-4 py-3 border-b border-gray-100", children: [
          /* @__PURE__ */ jsx12("h2", { className: "text-sm font-semibold text-gray-700", children: "Unanswered Questions" }),
          /* @__PURE__ */ jsx12("p", { className: "text-xs text-gray-400 mt-0.5", children: "Add these to knowledge.md to improve your chatbot" })
        ] }),
        /* @__PURE__ */ jsx12(UnansweredList, { sessions })
      ] }),
      tab === "cost" && /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs9("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx12("p", { className: "text-sm text-gray-500", children: "Today's Cost" }),
          /* @__PURE__ */ jsxs9("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: [
            "$",
            costStats.dailyCost.toFixed(4)
          ] })
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx12("p", { className: "text-sm text-gray-500", children: "Monthly Cost" }),
          /* @__PURE__ */ jsxs9("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: [
            "$",
            costStats.monthlyCost.toFixed(4)
          ] })
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx12("p", { className: "text-sm text-gray-500", children: "Today's Sessions" }),
          /* @__PURE__ */ jsx12("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: costStats.dailySessions })
        ] })
      ] })
    ] })
  ] });
}

// src/components/admin/AdminLogin.tsx
import { useState as useState5 } from "react";
import { jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState5("");
  const [error, setError] = useState5(false);
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
  return /* @__PURE__ */ jsx13("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxs10("form", { onSubmit: handleSubmit, className: "bg-white p-8 rounded-xl shadow-md w-80", children: [
    /* @__PURE__ */ jsx13("h1", { className: "text-xl font-bold mb-6 text-center", children: "Admin Login" }),
    /* @__PURE__ */ jsx13(
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
    error && /* @__PURE__ */ jsx13("p", { className: "text-red-500 text-sm mb-4", children: "Incorrect password" }),
    /* @__PURE__ */ jsx13(
      "button",
      {
        type: "submit",
        className: "w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
        children: "Login"
      }
    )
  ] }) });
}
export {
  AdminDashboard,
  AdminLogin,
  ChatWidget,
  ChatWidgetWrapper
};
