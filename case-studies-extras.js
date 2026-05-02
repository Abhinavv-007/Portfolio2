window.CASE_STUDY_EXTRAS = {
  "clex": {
    "vision": "CLEX started from a practical trust problem: people often need to send, compress, merge, or protect files without turning every step into a cloud upload. Modern browsers already support much of the required work through WebRTC, WebCodecs, WASM, IndexedDB, and Web Crypto, so the product explores how much of the workflow can stay local by default.",
    "differentiators": [
      "WeTransfer / Smash / Filemail: useful upload-and-link products, but centered on server storage rather than local-first transfer.",
      "Snapdrop / PairDrop: strong lightweight WebRTC tools, but without the broader workspace, vault, chain, mobile parity, or fallback paths CLEX is testing.",
      "AirDrop / Quick Share: excellent inside their ecosystems, but limited for cross-platform sharing."
    ],
    "longTerm": "The long-term direction is a neutral file-movement layer: prepare files locally, choose the most appropriate route, and keep a verifiable handoff record when proof matters.",
    "lessons": [
      {
        "category": "Product",
        "body": "The route picker is a trust surface. Showing how a file moves can be more useful than making the transfer feel mysterious."
      },
      {
        "category": "Engineering",
        "body": "Back-pressure matters on long-running data channels. Real-device testing exposed limits that were not obvious in smaller local demos."
      },
      {
        "category": "Design",
        "body": "The strongest visual system separates marketing confidence from app focus. Landing pages can be expressive; task surfaces need restraint."
      },
      {
        "category": "Product",
        "body": "A privacy product benefits from proof layers. Architecture and verifiable behavior carry more weight than broad privacy claims."
      }
    ],
    "pullQuote": "A privacy-first browser workspace for web, Android, and iOS, combining peer-to-peer transfer, on-device tools, encrypted Vault flows, and a public Chain for transfer proof."
  },
  "clex-ai": {
    "vision": "CLEX AI addresses a common developer problem: model choice changes faster than application code should. The product keeps the familiar OpenAI-shaped request flow while routing to multiple providers behind one endpoint.",
    "differentiators": [
      "OpenRouter: the closest comparison. CLEX AI focuses on zero-retention routing, a practical free starting path through NVIDIA NIM, and a tighter playground for testing provider behavior.",
      "Direct provider SDKs: direct integration is still useful, but a gateway reduces rewrite work when teams want to compare models or providers.",
      "Hugging Face Inference Endpoints: a different category. HF hosts models; CLEX AI focuses on routing and request compatibility."
    ],
    "longTerm": "The next stage is a model-operations surface: latency, cost, reliability, prompt versions, and A/B testing visible enough to help developers choose the right model for each workload.",
    "lessons": [
      {
        "category": "Product",
        "body": "Compatibility reduces adoption friction. Building around a familiar API shape lets developers test the gateway without rewriting the rest of their app."
      },
      {
        "category": "Engineering",
        "body": "Streaming proxies need to stay simple. Passing SSE through directly protects first-token latency and avoids unnecessary parsing risk."
      },
      {
        "category": "Design",
        "body": "Pricing transparency is part of the product experience. A visible calculator is more useful than vague enterprise-style copy."
      },
      {
        "category": "Privacy",
        "body": "A zero-retention posture has to be reflected in the system design. The gateway should avoid storing prompts and outputs by default."
      }
    ],
    "pullQuote": "An OpenAI-compatible AI gateway that routes requests across providers with streaming support, abort handling, usage visibility, and a zero-retention posture."
  },
  "driped": {
    "vision": "DRIPED is built around a simple observation: subscription receipts already live in the inbox. Reading those receipts can give users useful recurring-spend visibility without requiring bank access as the first step.",
    "differentiators": [
      "Truebill / Rocket Money: strong products in supported markets, but bank-linking and regional coverage do not fit every user.",
      "Bobby / Subby: useful for manual tracking, but manual entry breaks down when users forget what renews.",
      "Card-data products: helpful for some payments, but they can miss UPI, app-store, wallet, or prepaid charges."
    ],
    "longTerm": "The roadmap moves from detection to action: category insight, forecasts, renewal reminders, merchant links, and correction loops that make future extraction better.",
    "lessons": [
      {
        "category": "Product",
        "body": "The privacy boundary is about what content leaves the device, not only where a model runs. A lighter app with selective cloud fallback can be the more usable product."
      },
      {
        "category": "Engineering",
        "body": "Two-tier extraction works well for messy receipt data. Deterministic parsing handles the known cases, while an LLM can handle unusual templates when confidence is low."
      },
      {
        "category": "Design",
        "body": "Cross-platform parity depends on shared language as much as shared code: the same screen names, same gestures, and same correction model."
      },
      {
        "category": "Market",
        "body": "Non-US payment behavior deserves first-class design. UPI, app-store billing, wallets, and multi-currency receipts change the product requirements."
      }
    ],
    "pullQuote": "A subscription manager that reads receipt evidence first, uses AI fallback only when needed, and gives users bank-free visibility into recurring spend."
  },
  "trgt": {
    "vision": "TRGT explores a richer F1 fan workflow: prediction, race context, live state, and post-session feedback in one focused product. The goal is to make race weekends more interactive without turning the experience into a spreadsheet.",
    "differentiators": [
      "Official F1 app: excellent for broadcast and official content, but not designed around fan prediction loops.",
      "F1 Fantasy: strong game layer, but more spreadsheet-like than narrative-driven.",
      "r/formula1 and social feeds: valuable conversation, but fragmented and hard to turn into a repeatable game."
    ],
    "longTerm": "Future work includes driver strategy notes, tire-compound deltas, sprint-specific modes, historical accuracy badges, friend leagues, and deeper race-weekend explainability.",
    "lessons": [
      {
        "category": "Product",
        "body": "The lockout timer defines the game boundary. It has to be enforced server-side and communicated clearly."
      },
      {
        "category": "Engineering",
        "body": "Snapshot mode should be a normal reliability path, not only an error fallback. Race-weekend data can be volatile."
      },
      {
        "category": "Design",
        "body": "A strong sports identity needs restraint. A limited accent color and newspaper structure kept the interface from becoming noisy."
      },
      {
        "category": "Audience",
        "body": "The best target user is the engaged fan who wants context before and after a session, not only the final result."
      }
    ],
    "pullQuote": "A Formula 1 fan platform combining prediction lockouts, race intelligence, AI-generated context, badges, and leaderboard mechanics on a Cloudflare-edge stack."
  },
  "modih-mail": {
    "vision": "MODIH Mail takes a familiar utility, disposable email, and gives it a cleaner product surface: fast inbox creation, OTP extraction, expiry controls, and API access on a Cloudflare-native backend.",
    "differentiators": [
      "TempMail / Mailinator / 10MinuteMail: useful and familiar, but often ad-heavy and limited for developer use.",
      "SimpleLogin / AnonAddy: strong alias products, but different from disposable inbox workflows.",
      "ProtonMail / Hey: primary mail products, not temporary inbox utilities."
    ],
    "longTerm": "The product can grow through reply-from support, aliases, custom domains, team accounts, QA workflows, and better API analytics for developers.",
    "lessons": [
      {
        "category": "Product",
        "body": "OTP extraction is central to the disposable-email use case. It should be visible and fast, not hidden inside a generic message view."
      },
      {
        "category": "Engineering",
        "body": "Cloudflare's mail stack fits this category well: Email Routing, Workers, D1, KV, Pages, and Functions can share one deployment model."
      },
      {
        "category": "Design",
        "body": "A lightweight frontend can be a product advantage when first paint and perceived speed matter."
      },
      {
        "category": "Positioning",
        "body": "Commodity utilities can still feel considered. The product should make the temporary workflow feel safe, clear, and controlled."
      }
    ],
    "pullQuote": "A Cloudflare-native disposable email product with OTP extraction, owner-token controls, API access, automatic cleanup, and a cleaner interface for temporary inboxes."
  }
};
