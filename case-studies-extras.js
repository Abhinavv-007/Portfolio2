window.CASE_STUDY_EXTRAS = {
  "clex": {
    "vision": "Cloud storage costs collapsed; cloud *trust* did not. Sharing a 200 MB PSD through Google Drive means signing into Google. Compressing a PDF through ILovePDF means handing the document to a third party. Compressing a portrait through Squoosh works — but you still have to leave the page to share it. The browser is now powerful enough (WebRTC, WebCodecs, WASM, IndexedDB, Web Crypto) that none of this needs to leave the device. Nobody is shipping that browser-native experience as a unified product. Clex does.",
    "differentiators": [
      "WeTransfer / Smash / Filemail: all server-storage products with a free tier. They are CDN companies. Clex is a transport.",
      "Snapdrop / PairDrop: great LAN-only WebRTC tools with no productisation around them — no vault, no tools, no chain, no mobile-native parity, no relay fallback.",
      "AirDrop / Quick Share: locked to single ecosystems. Cross-platform is impossible."
    ],
    "longTerm": "Clex becomes the neutral L4 of consumer file movement. The Workspace is the wedge. The Vault is the retention. The Chain is the moat — once verifiable transfer becomes a compliance primitive (legal e-discovery, journalist source protection, KYC document handoff), Clex owns the rail.",
    "lessons": [
      {
        "category": "Product",
        "body": "The route picker is the product. Hide the routing logic and you become \"magic\"; expose it and you become \"trustworthy.\" For a privacy product, trustworthy wins."
      },
      {
        "category": "Engineering",
        "body": "Back-pressure is not a \"nice-to-have\" on long-running data channels; it's the difference between a working product and a tab crash. Tune the watermark on real devices, not in theory."
      },
      {
        "category": "Design",
        "body": "Brutalist + Glass works as a dual-system: brutalist on landing/marketing for confidence, glass on app surfaces for focus. Mixing them in a single screen kills both. Keep them on separate routes."
      },
      {
        "category": "Founder",
        "body": "A privacy product's only currency is verifiability. Marketing copy is depreciation; the public Chain is durable. Build the proof layer early; it will be the moat."
      }
    ],
    "pullQuote": "A privacy-first browser workspace shipping on web, Android, and iOS. WebRTC peer-to-peer transfer. On-device tooling. End-to-end encrypted Vault. A public Chain that proves the transfer happened — and never sees what moved."
  },
  "clex-ai": {
    "vision": "Model proliferation is a developer-experience disaster. Every new state-of-the-art model adds another integration surface. The cost of trying a new model should be zero — change a string, ship. Today it's a half-day of integration work plus a vendor signup. Clex AI exists to make model access fungible.",
    "differentiators": [
      "OpenRouter: the closest comparable. Clex AI differentiates on (a) zero retention, (b) NVIDIA NIM as a generous free tier so developers can start at $0, (c) tighter playground UX with isolated COOP/COEP headers for cross-origin demos.",
      "Direct provider SDKs: Clex AI gives one bill, one key, model swappability — and a free tier nobody else offers via NIM.",
      "Hugging Face Inference Endpoints: different category — HF is hosting; Clex AI is routing."
    ],
    "longTerm": "Become the default abstraction layer between application code and model providers. Build the analytics surface — per-model latency, per-model cost, A/B test framework, prompt-versioned analytics — that turns the gateway into a *model operations* product, not just a billing aggregator.",
    "lessons": [
      {
        "category": "Product",
        "body": "Compatibility beats novelty. The OpenAI shape isn't perfect — it's just won. Build on the standard, not against it."
      },
      {
        "category": "Engineering",
        "body": "SSE pass-through is the only correct streaming pattern for a proxy. The moment you buffer, you break first-token latency. The moment you re-parse, you introduce a chance of corruption."
      },
      {
        "category": "Design",
        "body": "Pricing transparency is a feature, not a marketing exercise. A `pricing.html` page with a real calculator converts better than a \"contact us\" CTA."
      },
      {
        "category": "Founder",
        "body": "Privacy posture has to be visible in the architecture, not the marketing copy. \"Zero retention\" only means something when the proxy literally cannot log the body."
      }
    ],
    "pullQuote": "A unified AI gateway that routes any OpenAI-shaped request to the right provider in real time — streaming, abortable, and stateless. The Stripe-of-AI thesis, shipped as production code."
  },
  "driped": {
    "vision": "A consumer's inbox is the single most accurate ledger of their financial life — more accurate than bank statements (which miss app-store charges), more accurate than credit-card aggregators (which miss UPI), and more universal than either. The product that mines that ledger correctly wins the category.",
    "differentiators": [
      "Truebill / Rocket Money: US-only, bank-linked, doesn't see UPI / app-store / prepaid charges, expensive.",
      "Bobby / Subby: manual entry. Useless because nobody enters subscriptions; the entire problem is that nobody remembers them.",
      "Indian fintechs (Cred, Slice): card-data products, miss UPI auto-debit and digital wallets."
    ],
    "longTerm": "Subscription detection → category insights → forecast → savings recommendations → one-tap cancellation through merchant deep-links → renewal reminders with calendar integration. The endgame is a full **financial drip control plane** — not just visibility, but action.",
    "lessons": [
      {
        "category": "Product",
        "body": "\"On-device AI\" is a marketing slogan, not a product requirement. If a 8B cloud model is bigger, faster to ship, and more accurate than your 1B on-device model — switch. The user's privacy floor is \"what content leaves the device,\" not \"what model runs the inference.\""
      },
      {
        "category": "Engineering",
        "body": "Two-tier pipelines beat single-tier for any extraction problem. The deterministic layer handles the 85% you can predict; the LLM handles the long tail you can't."
      },
      {
        "category": "Design",
        "body": "Cross-platform parity needs cross-platform code reuse where possible (the parser logic) and cross-platform language where not (the same screen names, the same gesture vocabulary)."
      },
      {
        "category": "Founder",
        "body": "The category Truebill cannot serve is bigger than the category Truebill serves. India + the rest of the non-US world is the prize."
      }
    ],
    "pullQuote": "AI-powered subscription manager built on a two-tier email-extraction pipeline. On-device parser handles the predictable 85%; a Llama 3.1 8B fallback handles the long tail. Multi-currency, multi-locale, native + web. Designed for the world Truebill cannot reach."
  },
  "trgt": {
    "vision": "The official F1 app is a broadcast partner, not a fan tool. The fantasy products are spreadsheet-like. The Reddit-and-Twitter loop is unstructured. There is room for a high-fidelity, opinionated, prediction-game-centric F1 product — and the moment is now while the audience is still expanding.",
    "differentiators": [
      "Official F1 app: broadcast-tier; gated content; not fan-built.",
      "F1 Fantasy: spreadsheet experience, no live narrative.",
      "r/formula1: unstructured, no game layer."
    ],
    "longTerm": "Per-driver strategy commentary, real-time pit-wall mind (\"what would Toto do?\"), tire-compound delta predictions, sprint-race specific game modes, multi-season historical accuracy badges. Eventually: micro-leagues for friends, premium tiers for tier-1 fans.",
    "lessons": [
      {
        "category": "Product",
        "body": "The lockout timer is the entire game. Get it server-authoritative, get it cached for reads but never cached for writes."
      },
      {
        "category": "Engineering",
        "body": "Snapshot mode shouldn't be an error path; it should be the default fallback at every fetch boundary. The product gets more reliable, not less."
      },
      {
        "category": "Design",
        "body": "Brand utility classes (`glass`, `btn-angled`, `text-trgt-crimson`) are how you escape the framework-default look. Tailwind defaults are fine for an MVP; for a brand, you have to extend."
      },
      {
        "category": "Founder",
        "body": "The fan tier above the casual viewer is bigger than people think. Build for them; the casuals will follow."
      }
    ],
    "pullQuote": "A Formula 1 fan platform that combines a server-authoritative lockout-timer prediction game, AI-generated race intelligence, and a seven-badge gamification engine — all on a Cloudflare-edge Next.js 16 stack with a full snapshot-mode fallback so the product never goes down on race day."
  },
  "modih-mail": {
    "vision": "Every other disposable email product is hostile to look at — interstitial ads, third-party trackers, no design opinion, no API. Yet the use case is mass-market and unsolved at the premium tier. Modih fills the entire surface: cinematic web app, secure-by-architecture backend, paid plans with real features, developer API for integration.",
    "differentiators": [
      "TempMail / Mailinator / 10MinuteMail: ad-supported, no premium tier, no API.",
      "SimpleLogin / AnonAddy: alias products, not disposable inboxes — different category.",
      "ProtonMail / Hey: primary mail products, not throwaways."
    ],
    "longTerm": "Become the default \"I don't want to be tracked\" inbox for the world. Add reply-from (sometimes you have to confirm; you should be able to without breaking anonymity), aliases, custom-domain support, team accounts for QA pipelines.",
    "lessons": [
      {
        "category": "Product",
        "body": "The first feature in a disposable-email product is OTP extraction. Everything else is table stakes. Build it first, market it loudest."
      },
      {
        "category": "Engineering",
        "body": "Cloudflare-native is the right pattern for serverless mail in 2026. Email Routing + Email Workers + D1 + KV + Pages + Functions is one stack, one auth model, one billing line."
      },
      {
        "category": "Design",
        "body": "Vanilla JS + CSS is a feature, not a constraint, when the first-paint is the product. No framework cost = the cinematic background loads in the same RTT as the HTML."
      },
      {
        "category": "Founder",
        "body": "Premium positioning in commodity categories is a real wedge. The disposable-email category is solved as utility; nobody has shipped it as a brand."
      }
    ],
    "pullQuote": "Cloudflare-native disposable email with three tiers, OTP auto-extraction, HMAC-hashed owner tokens, edge-verified Firebase JWTs, and a cinematic vanilla-JS UI. The premium answer to a category that's been ad-supported for fifteen years."
  }
};
