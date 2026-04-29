window.CASE_STUDIES = [
  {
    slug: "clex",
    title: "CLEX",
    label: "THE CLEX FILE",
    headline: "The neutral layer for file movement.",
    subtitle: "Drop. Prepare. Share. Without default server storage.",
    liveUrl: "https://clex.in",
    repoUrl: "https://github.com/Abhinavv-007/clex",
    issue: "Privacy / Transfer / Trust",
    version: "Web 1.0 / Android 1.9.12 / iOS 1.9.5",
    accent: "#9f7a36",
    stack: ["Svelte", "Cloudflare Workers", "WebRTC", "D1", "KV", "Kotlin", "SwiftUI"],
    heroImage: {
      src: "assets/case-studies/clex/workspace.webp",
      alt: "CLEX workspace newspaper poster",
      caption: "The workspace wedge: files stay on device while the user prepares and sends them."
    },
    supportingImages: [
      {
        src: "assets/case-studies/clex/chain.webp",
        alt: "CLEX chain explorer newspaper poster",
        caption: "The Chain turns transfer metadata into public proof without exposing the payload."
      },
      {
        src: "assets/case-studies/clex/vault.webp",
        alt: "CLEX vault newspaper poster",
        caption: "The Vault is the retention layer: encrypted notes, secret links, and timed relay."
      },
      {
        src: "assets/case-studies/clex/share-anywhere.webp",
        alt: "CLEX share modes newspaper poster",
        caption: "Direct, local, and encrypted relay paths keep sharing useful in real networks."
      }
    ],
    lead: [
      "CLEX is a privacy-first file workspace for web, Android, and iOS. It treats file transfer as a product primitive, not as a cheap upload form wrapped around a bucket.",
      "The workflow is intentionally simple: drop files, prepare them on-device, then send through direct WebRTC, same-network delivery, or an encrypted fallback relay when the network refuses to cooperate.",
      "The bigger bet is trust. CLEX combines local-first preparation, encrypted Vault flows, and a public Chain explorer so users can prove that a transfer happened without giving a server the file itself."
    ],
    deepDive: [
      "Clex inverts the standard file-sharing model. Files are dropped into a browser workspace that performs all preparation work on-device — image compression, format conversion, PDF merge/split, ZIP creation, OCR — and then shares them through one of three deterministic routes: WebRTC peer-to-peer, same-LAN delivery, or a Google Drive fallback when neither side can hole-punch.",
      "A separate Vault subsystem handles encrypted notes, view-once secret links, and a 24-hour timed relay for files. A public Chain explorer makes every transfer verifiable via a cryptographic hash trail without exposing payloads. The browser is now powerful enough (WebRTC, WebCodecs, WASM, IndexedDB, Web Crypto) that none of this needs to leave the device.",
      "The three-route mental model (Direct / Local / Drive) keeps users informed without requiring NAT-traversal knowledge. WebRTC is the primary transport, LAN is the optimisation, and Google Drive is the fallback for hostile NATs. Nothing is uploaded by default."
    ],
    blueprint: {
      features: ["Workspace file preparation", "Direct / Local / Relay routing", "Encrypted Vault notes", "View-once Secret Share", "Public Chain explorer", "Android CLEX Link"],
      flow: ["Drop", "Prepare", "Choose route", "Transfer", "Verify"],
      modules: ["Workspace", "Vault", "Chain", "Signaling", "Cloud Share Relay"]
    },
    anatomy: [
      { title: "Frontend", body: "Svelte and TypeScript on web, Jetpack Compose on Android, and SwiftUI on iOS. The visual system keeps brutalist confidence on marketing surfaces and focused glass panels inside app flows." },
      { title: "Transport", body: "WebRTC DataChannel is the primary route. Signaling runs through Cloudflare Durable Objects rooms, while LAN and encrypted relay modes keep the product reliable outside ideal networks." },
      { title: "Data", body: "D1 stores ledger metadata, KV stores short-lived encrypted secrets, IndexedDB holds local Vault state, and Supabase is used only for timed relay ciphertext." },
      { title: "Security", body: "Payloads are prepared and encrypted client-side. Chain entries store hashes, timestamps, sizes, MIME type, and route metadata, never the file contents." }
    ],
    challenges: [
      { title: "Hostile networks", problem: "Carrier NAT and enterprise firewalls break naive peer-to-peer flows.", solution: "Built a three-route model with connection-kind detection and visible fallback states.", result: "Transfers remain understandable even when the network downgrades the route." },
      { title: "Large file back-pressure", problem: "Raw DataChannel sends can overwhelm browser memory.", solution: "Added a 1 MB high-watermark with drain polling.", result: "Large sends stay controlled instead of freezing the tab." },
      { title: "Key ownership", problem: "A Vault is useless if the service becomes the key server.", solution: "Generated MasterKeys on-device and exposed user-verifiable fingerprints.", result: "Trust stays local while pairing remains practical." },
      { title: "Proof without surveillance", problem: "A ledger can become analytics by another name.", solution: "Recorded only file hashes and transfer metadata.", result: "The Chain proves transit without storing payloads." }
    ],
    impact: ["Three coherent production surfaces", "150-300ms Android cold-start improvement", "Reduced Android release size through R8 cleanup", "Zero-knowledge Vault and secret-share posture", "Public transfer-verification explorer"],
    closing: [
      "The route picker became the product. Hiding routing would feel magical, but showing it feels trustworthy.",
      "The next step is turning Chain verification into a stronger compliance primitive for teams that need proof of handoff, not another cloud bucket."
    ]
  },
  {
    slug: "clex-ai",
    title: "CLEX AI",
    label: "THE MODEL EXCHANGE",
    headline: "Every model. One endpoint.",
    subtitle: "OpenAI-compatible access across many model providers.",
    liveUrl: "https://ai.clex.in",
    repoUrl: "https://github.com/Abhinavv-007/clex-ai",
    issue: "One API / Every Model",
    version: "Gateway / Dashboard / Playground",
    accent: "#34546a",
    stack: ["Express", "Vercel", "Firebase", "React", "NVIDIA NIM", "OpenAI", "Anthropic", "Gemini"],
    heroImage: {
      src: "assets/case-studies/clex-ai/overview.webp",
      alt: "CLEX AI overview newspaper poster",
      caption: "One dashboard for model routing, usage, keys, and OpenAI-compatible requests."
    },
    supportingImages: [
      {
        src: "assets/case-studies/clex-ai/routing-layer.webp",
        alt: "CLEX AI routing layer newspaper poster",
        caption: "The routing layer translates one API shape into provider-specific execution."
      },
      {
        src: "assets/case-studies/clex-ai/api-playground.webp",
        alt: "CLEX AI API playground newspaper poster",
        caption: "The playground validates prompts, streaming, latency, and response shape in one place."
      },
      {
        src: "assets/case-studies/clex-ai/model-catalog.webp",
        alt: "CLEX AI model catalog newspaper poster",
        caption: "The model catalog makes provider choice visible without forcing SDK rewrites."
      }
    ],
    lead: [
      "CLEX AI is a developer gateway that puts many model providers behind one OpenAI-compatible endpoint. The product exists for teams tired of rewriting SDK glue every time model choice changes.",
      "One API key, one request shape, and one dashboard can route across OpenAI, Anthropic, Gemini, NVIDIA, Meta, Mistral, and other providers while keeping a zero-retention posture.",
      "The experience is sharp because the abstraction is practical: developers can start with the SDK they already know, then compare latency, quality, cost, and provider behavior without touching application logic."
    ],
    deepDive: [
      "Clex AI puts many model providers behind one OpenAI-compatible endpoint. One API key, one request shape, and one dashboard can route across OpenAI, Anthropic, Gemini, NVIDIA, Meta, Mistral, and other providers while keeping a zero-retention posture.",
      "SSE pass-through is implemented as direct chunk-by-chunk streaming with no buffering — one decoder, one pass. AbortController is wired to req.on('close') so client disconnects free upstream capacity in real time. A hard 60-second timeout ceiling prevents hung upstreams from starving the proxy worker.",
      "The dashboard SPA (React + Vite + Firebase) gives developers keys, usage visibility, model catalog, and a live playground with isolated COOP/COEP headers. The marketing surface is vanilla HTML + Tailwind via CDN — no framework cost on the landing page."
    ],
    blueprint: {
      features: ["OpenAI-compatible proxy", "Provider routing", "API key dashboard", "Streaming playground", "Model catalog", "Pricing and usage visibility"],
      flow: ["Create key", "Choose model", "Send OpenAI-shaped request", "Route provider", "Stream response", "Compare usage"],
      modules: ["Gateway", "Adapters", "Dashboard", "Playground", "Billing surface"]
    },
    anatomy: [
      { title: "Gateway", body: "Express routes normalize request and streaming behavior into an OpenAI-compatible surface while provider adapters handle upstream differences." },
      { title: "Providers", body: "Adapters wrap NVIDIA NIM, OpenAI, Anthropic, Gemini, and open-model providers with routing logic based on model, availability, latency, and cost." },
      { title: "Dashboard", body: "React and Firebase power keys, usage, model catalog, pricing surfaces, and playground sessions without storing prompts or outputs." },
      { title: "Deployment", body: "The gateway ships on Vercel with edge-friendly API boundaries and a stateless-by-design privacy posture." }
    ],
    challenges: [
      { title: "Streaming mismatch", problem: "Providers disagree on streaming event shape and finish signals.", solution: "Normalized chunks into one OpenAI-style stream contract.", result: "Apps can switch providers without changing UI stream handling." },
      { title: "Hung upstreams", problem: "Some model calls can stall and leave clients waiting.", solution: "Added timeouts, fallback behavior, and visible operational status.", result: "The gateway fails predictably instead of silently hanging." },
      { title: "Auth split", problem: "Users need dashboard auth while API clients need key auth.", solution: "Separated Firebase dashboard identity from scoped API-key execution.", result: "Human and machine access stay cleanly isolated." },
      { title: "Privacy versus analytics", problem: "A gateway needs usage data without becoming a prompt store.", solution: "Tracked operational metadata while avoiding prompt/output retention.", result: "Usage visibility remains compatible with a zero-retention story." }
    ],
    impact: ["OpenAI-shaped compatibility", "Multi-provider routing", "Live API playground", "Zero-retention gateway posture", "One dashboard for keys, usage, and model choice"],
    closing: [
      "CLEX AI is infrastructure disguised as a simple form field: change the base URL, keep the SDK, and get model optionality.",
      "The next step is deeper routing intelligence: quality, latency, cost, and reliability signals feeding provider choice automatically."
    ]
  },
  {
    slug: "driped",
    title: "DRIPED",
    label: "THE SUBSCRIPTION LEAK",
    headline: "Stop the drip.",
    subtitle: "Your inbox already knows every subscription you have.",
    liveUrl: "https://driped.in",
    repoUrl: "https://github.com/Abhinavv-007/DRIPED-Web",
    issue: "Inbox / Spend / Forecast",
    version: "Web + Android",
    accent: "#5b6a48",
    stack: ["Next.js", "React", "Flutter", "Riverpod", "Hive", "Workers AI", "Firebase", "Gmail API"],
    heroImage: {
      src: "assets/case-studies/driped/dashboard.webp",
      alt: "DRIPED dashboard newspaper poster",
      caption: "The command dashboard: subscriptions, renewal forecast, spend analytics, and savings opportunities."
    },
    supportingImages: [
      {
        src: "assets/case-studies/driped/receipt-pipeline.webp",
        alt: "DRIPED receipt pipeline newspaper poster",
        caption: "The receipt pipeline parses inbox evidence first, then uses AI only for low-confidence cases."
      },
      {
        src: "assets/case-studies/driped/mobile-command.webp",
        alt: "DRIPED mobile command center newspaper poster",
        caption: "The Android surface keeps scanning, renewals, analytics, and savings visible on the go."
      },
      {
        src: "assets/case-studies/driped/analytics-forecast.webp",
        alt: "DRIPED analytics and forecast newspaper poster",
        caption: "The analytics board turns category spend, renewal timing, and savings opportunities into a simple control surface."
      }
    ],
    lead: [
      "DRIPED is an AI subscription manager built around a simple insight: receipts are already a financial ledger. Users do not need to connect a bank account just to remember what is renewing.",
      "The product scans Gmail receipts, extracts recurring payments, detects billing cadence, and shows spend forecasts across web and Android surfaces.",
      "Its trust posture matters. Most emails stay on device through deterministic parsing, while AI fallback handles harder cases only when needed."
    ],
    deepDive: [
      "Driped reframes subscription management: the source of truth for 'what am I subscribed to' is your inbox. Every subscription emits a receipt. Parse the receipts; you have the picture. No bank linking, no Plaid, no US-only constraint.",
      "The two-tier extraction pipeline handles 85% of emails deterministically on-device in milliseconds. The long tail — unknown senders, novel templates, multi-language emails — goes to a Llama 3.1 8B model on Cloudflare Workers AI, invoked only when overall confidence falls below 70. Even then, only a sanitised body slice hits the network.",
      "Removing the on-device LiteRT-LM model in v3.1.1 stripped ~570 MB from the APK. The cloud model is bigger, more accurate, and ships lighter. The privacy line is content boundary, not model location — a deliberate product call that prioritised usable over pure."
    ],
    blueprint: {
      features: ["Gmail receipt scan", "Subscription detection", "Forecast dashboard", "Renewal reminders", "Category analytics", "Savings view"],
      flow: ["Connect inbox", "Scan receipts", "Parse merchant", "Infer cycle", "Show forecast", "Remind before renewal"],
      modules: ["Inbox scanner", "Parser", "AI fallback", "Dashboard", "Android sync"]
    },
    anatomy: [
      { title: "Frontend", body: "Next.js and React power the web dashboard while Flutter, Riverpod, and Hive keep the Android app fast and local-friendly." },
      { title: "AI", body: "A deterministic classifier handles common receipts first, with Workers AI fallback for messy global emails and ambiguous merchant formats." },
      { title: "Data", body: "Firebase handles identity and sync, while local mobile state keeps the app responsive during background scans." },
      { title: "Privacy", body: "The product avoids bank credentials and treats Gmail scope minimization as a core UX and security requirement." }
    ],
    challenges: [
      { title: "APK bloat", problem: "On-device LLM experiments made the Android build too heavy.", solution: "Moved AI fallback to Workers AI and kept deterministic parsing local.", result: "The app became dramatically lighter while keeping global receipt support." },
      { title: "False positives", problem: "Receipts and promotions often look similar.", solution: "Layered merchant rules, cadence inference, and confidence scoring.", result: "Detected subscriptions feel more reliable and editable." },
      { title: "Currency chaos", problem: "Receipts use different symbols, formats, and billing language.", solution: "Normalized currency extraction and fallback parsing.", result: "The product supports non-US receipt patterns more gracefully." },
      { title: "Cycle inference", problem: "A receipt rarely says 'monthly' in a clean machine-readable way.", solution: "Combined repeated merchant evidence, dates, and pricing history.", result: "Forecasting works even when a single email is incomplete." }
    ],
    impact: ["Bank-free subscription visibility", "85%+ emails handled without AI fallback", "Web and Android parity", "Daily background scan path", "Global receipt support"],
    closing: [
      "DRIPED taught that financial utility can come from lighter trust boundaries. Inbox receipts are enough for the first useful version.",
      "The next step is better user correction loops so every edit improves future extraction without making the app feel like accounting software."
    ]
  },
  {
    slug: "trgt",
    title: "TRGT",
    label: "THE GRID REPORT",
    headline: "Target every lap.",
    subtitle: "Live telemetry, brutal AI insights, and race predictions for obsessed fans.",
    liveUrl: "https://trgt.in",
    repoUrl: "https://github.com/Abhinavv-007/f1",
    issue: "F1 / Prediction / Race Intel",
    version: "Race-weekend product",
    accent: "#ee3f2c",
    stack: ["Next.js", "React", "Tailwind", "Framer Motion", "Prisma", "D1", "Firebase", "Gemini"],
    heroImage: {
      src: "assets/case-studies/trgt/f1-intelligence.webp",
      alt: "TRGT F1 intelligence platform newspaper poster",
      caption: "The full platform promise: telemetry, race deck, prediction lock, performance index, and AI insight."
    },
    supportingImages: [
      {
        src: "assets/case-studies/trgt/grid-report.webp",
        alt: "TRGT grid report newspaper poster",
        caption: "The race intelligence system unifies feed data, prediction locking, AI notes, and snapshot fallback."
      },
      {
        src: "assets/case-studies/trgt/predict-race.webp",
        alt: "TRGT predict the race newspaper poster",
        caption: "The game layer turns podium locks, badges, scoring, and leaderboards into a repeatable weekend loop."
      },
      {
        src: "assets/case-studies/trgt/circuit-intelligence.webp",
        alt: "TRGT circuit intelligence newspaper poster",
        caption: "Circuit context gives predictions a sharper race-weekend memory: weather, DRS, tyre wear, and strategy."
      }
    ],
    lead: [
      "TRGT is a Formula 1 race-intelligence and prediction platform built for fans who follow more than the podium. It combines prediction lockouts, session state, race context, AI insights, badges, and leaderboards.",
      "The core loop is opinionated: make a prediction before the lockout, follow the session, then let the platform turn race context into feedback and competitive scoring.",
      "It is part sports newspaper, part pit-wall telemetry, and part fantasy game. The challenge is keeping all three feelings coherent."
    ],
    deepDive: [
      "TRGT unifies live session state, AI-generated strategic insights, podium-prediction game, badges, and leaderboard into a single high-fidelity weekend experience. The core loop is opinionated: make a prediction before the lockout, follow the session, then let the platform turn race context into feedback and competitive scoring.",
      "Snapshot mode protects the product from race-feed instability so the UI can keep working during volatile weekends. Server-side lockout enforcement keeps the game layer credible — predictions lock at session start and compute at session end. The badge engine rewards both quantity and accuracy.",
      "The design keeps a monochrome newspaper structure and reserves TRGT Crimson for brand-specific emphasis. Full-bleed background video on the home shell, glassmorphism cards over carbon-fibre textures, and framer-motion entrance animations calibrated at 0.1 / 0.3 / 0.5 / 0.65 s intervals give the product its aggressive but coherent voice."
    ],
    blueprint: {
      features: ["Prediction lockout", "Live session state", "AI Race Intel", "Weather context", "Badge engine", "Leaderboard"],
      flow: ["Read race state", "Make prediction", "Lock before session", "Watch results", "Earn badges", "Climb board"],
      modules: ["Race feed", "Prediction engine", "Gemini insights", "Badge system", "Snapshot mode"]
    },
    anatomy: [
      { title: "Frontend", body: "Next.js, React, Tailwind, and Framer Motion create a fast race-weekend UI with deliberate motion and a single crimson accent." },
      { title: "Data", body: "Prisma and Cloudflare D1 store predictions, badges, sessions, and leaderboard state for edge-friendly reads." },
      { title: "AI", body: "Gemini generates race insight cards, with cost and latency controlled by snapshot-style session context." },
      { title: "Reliability", body: "Snapshot mode protects the product from race-feed instability so the UI can keep working during volatile weekends." }
    ],
    challenges: [
      { title: "Feed reliability", problem: "Motorsport data feeds can lag, fail, or disagree.", solution: "Added snapshot mode and defensive session-state handling.", result: "Race-weekend pages stay usable when upstream data is rough." },
      { title: "Fair lockouts", problem: "Predictions are meaningless if users can edit after information changes.", solution: "Moved lockout enforcement server-side.", result: "The game layer has a credible competitive boundary." },
      { title: "AI cost", problem: "Race context can become expensive when generated too often.", solution: "Used structured snapshots and limited insight surfaces.", result: "AI adds flavor without becoming the whole product cost center." },
      { title: "Brand aggression", problem: "F1 visuals can quickly become noisy.", solution: "Kept monochrome newspaper structure and reserved crimson for TRGT-specific emphasis.", result: "The page feels aggressive without breaking the portfolio system." }
    ],
    impact: ["Race-weekend prediction loop", "Server-side lockout model", "Seven-badge gamification layer", "Snapshot reliability mode", "AI insight cards tied to session context"],
    closing: [
      "TRGT is where the portfolio can flex. It proves the same engineering taste can support a louder, faster, more competitive product.",
      "The next step is deeper live-race explainability: why a prediction moved, which events mattered, and what fans should watch next."
    ]
  },
  {
    slug: "modih-mail",
    title: "MODIH Mail",
    label: "THE BURNER POST",
    headline: "Premium disposable email.",
    subtitle: "@modih.in - fast, beautiful, secure, and auto-expiring.",
    liveUrl: "https://modih.in",
    repoUrl: "https://github.com/Abhinavv-007/modih-email",
    issue: "Mailroom / Utility / Edge",
    version: "Cloudflare-native",
    accent: "#775d3c",
    stack: ["Cloudflare Pages", "Workers", "D1", "KV", "Email Routing", "Firebase", "Resend", "Turnstile"],
    heroImage: {
      src: "assets/case-studies/modih-mail/temporary-inbox.webp",
      alt: "MODIH temporary inbox newspaper poster",
      caption: "The temporary inbox is the main promise: fast, private, OTP-aware, and disposable by design."
    },
    supportingImages: [
      {
        src: "assets/case-studies/modih-mail/mail-routing.webp",
        alt: "MODIH mail routing stack newspaper poster",
        caption: "The mail routing stack: Cloudflare Email Routing, Workers, D1, KV, and Pages as one edge-native system."
      },
      {
        src: "assets/case-studies/modih-mail/otp-inbox.webp",
        alt: "MODIH OTP inbox newspaper poster",
        caption: "OTP extraction is treated as a first-class inbox workflow instead of a buried message detail."
      },
      {
        src: "assets/case-studies/modih-mail/developer-mailroom.webp",
        alt: "MODIH developer mailroom newspaper poster",
        caption: "The developer mailroom exposes inbox creation, message access, testing flows, and API key management."
      }
    ],
    lead: [
      "MODIH Mail is a premium disposable email product for @modih.in addresses. It is built for fast inbox creation, OTP extraction, expiry controls, and developer API access.",
      "Most disposable mail tools look temporary in the worst way: ugly, fragile, and suspicious. MODIH turns the same utility into a polished, owner-controlled mailroom.",
      "The architecture is Cloudflare-native from inbound routing to storage, cleanup, Turnstile protection, and API access."
    ],
    deepDive: [
      "MODIH Mail turns disposable email into a polished, owner-controlled mailroom. Fast inbox creation, OTP extraction, expiry controls, and developer API access — all built on a Cloudflare-native architecture from inbound routing to storage, cleanup, Turnstile protection, and API access.",
      "Owner tokens and scoped sessions provide inbox sovereignty without killing the instant-use flow. Turnstile, quota thinking, API keys, and cleanup jobs keep free-tier abuse from owning the product. The architecture is edge-native: Cloudflare Pages for UI, Workers for API, D1 for metadata, KV for sessions.",
      "Cloudflare Email Routing receives messages and Workers parse, sanitize, classify, and store the inbox record. D1 stores message metadata and inbox records while KV supports short-lived access and owner-token flows. Resend is ready for outbound contact and product mail when needed."
    ],
    blueprint: {
      features: ["Disposable inboxes", "OTP extraction", "Owner tokens", "Custom prefixes", "Developer API", "Hourly cleanup"],
      flow: ["Create inbox", "Receive mail", "Extract OTP", "Expire content", "Use API", "Clean automatically"],
      modules: ["Email routing", "Inbox worker", "D1 metadata", "KV sessions", "API keys", "Admin dashboard"]
    },
    anatomy: [
      { title: "Inbound mail", body: "Cloudflare Email Routing receives messages and Workers parse, sanitize, classify, and store the inbox record." },
      { title: "Storage", body: "D1 stores message metadata and inbox records while KV supports short-lived access and owner-token flows." },
      { title: "Security", body: "Turnstile, owner tokens, Firebase verification, and aggressive cleanup keep free-tier abuse from owning the product." },
      { title: "Delivery", body: "Cloudflare Pages serves the UI, Workers power the API, and Resend is ready for outbound contact/product mail." }
    ],
    challenges: [
      { title: "Identity without friction", problem: "Disposable email needs control without a heavy account wall.", solution: "Used owner tokens and scoped sessions for inbox ownership.", result: "Users get sovereignty without killing the instant-use flow." },
      { title: "Email sanitization", problem: "Inbound HTML mail can be messy and unsafe.", solution: "Parsed and sanitized messages before rendering.", result: "The inbox can show useful content while reducing risk." },
      { title: "Free-tier abuse", problem: "Temporary inbox tools invite bots and scripted use.", solution: "Added Turnstile, quota thinking, API keys, and cleanup jobs.", result: "The utility stays open without becoming unmanaged infrastructure." },
      { title: "Edge auth", problem: "Firebase admin patterns do not fit cleanly into Workers.", solution: "Designed edge-safe token verification boundaries.", result: "Auth works without dragging server assumptions into edge runtime." }
    ],
    impact: ["71-test API suite", "MX-to-UI Cloudflare architecture", "Owner-token security model", "OTP extraction in production", "Edge-native disposable email platform"],
    closing: [
      "MODIH Mail proves utility can still have taste. Disposable does not need to mean careless.",
      "The next step is deeper developer access: better API analytics, team keys, and premium inbox automation."
    ]
  }
];
