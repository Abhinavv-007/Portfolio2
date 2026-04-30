(function () {
  "use strict";

  const data = window.PORTFOLIO;
  const caseStudies = window.CASE_STUDIES || [];
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const isExternal = (url) => /^https?:\/\//.test(url);
  const linkAttrs = (url) => isExternal(url) ? 'target="_blank" rel="noopener"' : "";
  const getBasePrefix = () => document.body.dataset.depth === "project" ? "../../" : "";
  const withBase = (url) => {
    if (!url || isExternal(url) || url.startsWith("#") || url.startsWith("mailto:")) return url;
    return `${getBasePrefix()}${url}`;
  };
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));

  function createProjectCard(project, index) {
    const caseUrl = project.caseStudyUrl || project.url;
    const liveUrl = project.liveUrl || project.url;
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.style.setProperty("--delay", `${index * 70}ms`);
    card.innerHTML = `
      <a class="project-main" href="${caseUrl}" ${linkAttrs(caseUrl)}>
        <header>
          <span>${project.label}</span>
          <img src="${project.logo}" alt="" loading="lazy">
        </header>
        <h3>${project.title}</h3>
        <div class="project-image">
          <img src="${project.shortImage}" alt="${project.description}" loading="lazy">
        </div>
        <footer>
          <p>${project.type}</p>
          <span>${project.title.slice(0, 1)}</span>
        </footer>
      </a>
      <a class="card-visit" href="${liveUrl}" ${linkAttrs(liveUrl)}>Visit Site</a>
    `;
    return card;
  }

  function createDetailedWorkCard(project, index) {
    const caseUrl = project.caseStudyUrl || project.url;
    const liveUrl = project.liveUrl || project.url;
    const card = document.createElement("article");
    card.className = `work-detail-card work-${project.slug || "item"} reveal`;
    card.style.setProperty("--delay", `${index * 60}ms`);
    card.innerHTML = `
      <div class="work-detail-main">
        <a class="detail-poster" href="${caseUrl}" ${linkAttrs(caseUrl)}>
          <img src="${project.detailedImage}" alt="${project.description}" loading="lazy">
        </a>
        <div class="detail-copy">
          <div class="kicker detail-label">${project.label}</div>
          <h2>${project.title}</h2>
          <div class="byline">By <strong>Abhinav Raj</strong></div>
          <p>${project.description}</p>
          <div class="tag-row">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="detail-actions">
            <a href="${caseUrl}" ${linkAttrs(caseUrl)}>Read Case Study</a>
            <a href="${liveUrl}" ${linkAttrs(liveUrl)}>Visit Site</a>
          </div>
        </div>
      </div>
    `;
    return card;
  }

  function createResearchCard(item, index) {
    const card = document.createElement("article");
    card.className = "work-detail-card research-card reveal";
    card.style.setProperty("--delay", `${index * 60}ms`);
    card.innerHTML = `
      <div class="work-detail-main">
        <a class="detail-poster" href="${item.url}" ${linkAttrs(item.url)}>
          <img src="${item.detailedImage}" alt="${item.description}" loading="lazy">
        </a>
        <div class="detail-copy">
          <div class="detail-label">${item.label}</div>
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <div class="tag-row">
            ${item.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="detail-actions">
            <a href="${item.url}" ${linkAttrs(item.url)}>Read Paper</a>
          </div>
        </div>
      </div>
    `;
    return card;
  }

  function renderProjects() {
    const rail = $("#projectRail");
    if (rail) {
      rail.innerHTML = "";
      data.projects.forEach((project, index) => {
        rail.appendChild(createProjectCard(project, index));
      });
    }

    const workGrid = $("#workPageGrid");
    if (workGrid) {
      workGrid.innerHTML = "";
      data.projects.forEach((project, index) => {
        workGrid.appendChild(createDetailedWorkCard(project, index));
      });
    }

    const researchGrid = $("#researchPageGrid");
    if (researchGrid && data.researchPapers) {
      researchGrid.innerHTML = "";
      data.researchPapers.forEach((item, index) => {
        researchGrid.appendChild(createResearchCard(item, index));
      });
    }
  }

  function renderCaseStudy() {
    const target = $("#caseStudy");
    if (!target) return;

    const slug = document.body.dataset.caseStudy;
    const studyIndex = caseStudies.findIndex((item) => item.slug === slug);
    const study = caseStudies[studyIndex];
    if (!study) {
      target.innerHTML = `
        <section class="case-missing">
          <h1>Case Study Missing</h1>
          <p>This editorial file could not be found.</p>
          <a class="text-link hover-cut" href="work.html"><span>Back to work</span></a>
        </section>
      `;
      return;
    }

    const previous = caseStudies[(studyIndex - 1 + caseStudies.length) % caseStudies.length];
    const next = caseStudies[(studyIndex + 1) % caseStudies.length];
    target.style.setProperty("--case-accent", study.accent || "var(--red)");
    document.title = `${study.title} - Case Study`;
    const supportingImages = study.supportingImages || [];
    const figCounter = { val: 2 };
    const renderEvidenceNotes = (label, index) => {
      const sourceSets = [
        {
          title: "What this proves",
          points: study.blueprint.features.slice(0, 4),
          flow: study.blueprint.flow.slice(0, 5)
        },
        {
          title: "How the system holds",
          points: study.anatomy.map((item) => `${item.title}: ${item.body}`).slice(0, 3),
          flow: study.blueprint.modules.slice(0, 5)
        },
        {
          title: "Why it matters",
          points: study.challenges.map((item) => `${item.title}: ${item.result}`).slice(0, 3),
          flow: study.impact.slice(0, 4)
        }
      ];
      const notes = sourceSets[index % sourceSets.length];
      return `
        <aside class="evidence-notes" aria-label="${esc(label)} notes">
          <div class="kicker">From the case-study file</div>
          <h3>${esc(notes.title)}</h3>
          <ul>
            ${notes.points.map((point) => `<li>${esc(point)}</li>`).join("")}
          </ul>
          <div class="mini-flow" aria-label="Project flow">
            ${notes.flow.map((step) => `<span>${esc(step)}</span>`).join("")}
          </div>
        </aside>
      `;
    };
    const renderImageSpread = (image, label, index) => image ? `
        <section class="case-section case-visual-spread ${index % 2 ? "is-reversed" : ""} reveal" aria-label="${esc(label)}">
          <div class="case-section-label">${esc(label)}</div>
          <div class="evidence-spread">
            <figure class="case-image-card wide">
              <img src="${withBase(image.src)}" alt="${esc(image.alt)}" loading="${index === 0 ? "eager" : "lazy"}">
              <figcaption class="editorial-caption"><span class="caption-number">Fig. ${figCounter.val++}</span> ${esc(image.caption)}</figcaption>
            </figure>
            ${renderEvidenceNotes(label, index)}
          </div>
        </section>
    ` : "";
    const renderImageGrid = (images, label) => images.length ? `
        <section class="case-section case-gallery reveal" aria-label="${esc(label)}">
          <div class="case-section-label">${esc(label)}</div>
          <div class="case-image-grid">
            ${images.map((image) => `
              <figure class="case-image-card">
                <img src="${withBase(image.src)}" alt="${esc(image.alt)}" loading="lazy">
                <figcaption class="editorial-caption"><span class="caption-number">Fig. ${figCounter.val++}</span> ${esc(image.caption)}</figcaption>
              </figure>
            `).join("")}
          </div>
        </section>
    ` : "";

    const pageNum = studyIndex + 1;
    const extras = (window.CASE_STUDY_EXTRAS && window.CASE_STUDY_EXTRAS[study.slug]) || {};
    const pullQuoteText = extras.pullQuote
      || (study.deepDive ? study.deepDive[0].slice(0, 140) + "…" : study.lead[0].slice(0, 140) + "…");
    const diagramNodes = [
      ...(study.blueprint.modules || []).slice(0, 4),
      ...(study.stack || []).slice(0, 3)
    ].slice(0, 7);
    const linkedInUrl = data.socials.find((item) => item.label === "LinkedIn")?.url || "https://www.linkedin.com/in/abhnv07/";
    const githubUrl = data.socials.find((item) => item.label === "GitHub")?.url || "https://github.com/Abhinavv-007";

    target.innerHTML = `
      <article class="case-study">
        <div class="folio-strip" aria-hidden="true">
          <span class="folio-section">${esc(study.label)}</span>
          <span class="volume-mark">Vol. 1 &middot; No. ${pageNum}</span>
          <span class="folio-page">Page ${pageNum}</span>
        </div>

        <header class="case-hero">
          <div class="case-kicker">
            <span>${esc(study.issue)}</span>
            <span>${esc(study.label)}</span>
            <span>${esc(study.version)}</span>
          </div>
          <div class="case-title-grid">
            <div>
              <div class="kicker">${esc(study.label)}</div>
              <h1>${esc(study.title)}</h1>
              <h2>${esc(study.headline)}</h2>
              <p class="deck">${esc(study.subtitle)}</p>
              <div class="byline">By <strong>Abhinav Raj</strong> &middot; Product Engineer &amp; Founder</div>
              <div class="dateline">Filed under ${esc(study.issue)} &middot; Compiled April 2026</div>
            </div>
            <aside>
              <span>Live File</span>
              <a class="text-link hover-cut" href="${study.liveUrl}" ${linkAttrs(study.liveUrl)}><span>Visit Site</span></a>
              ${study.repoUrl ? `<a class="text-link hover-cut" href="${study.repoUrl}" ${linkAttrs(study.repoUrl)}><span>GitHub</span></a>` : ""}
            </aside>
          </div>
          <figure class="case-hero-image">
            <img src="${withBase(study.heroImage.src)}" alt="${esc(study.heroImage.alt)}">
            <figcaption class="editorial-caption"><span class="caption-number">Fig. 1</span> ${esc(study.heroImage.caption)}</figcaption>
          </figure>
          <div class="case-stack" aria-label="Project stack">
            ${study.stack.map((item) => `<span>${esc(item)}</span>`).join("")}
          </div>
        </header>

        <section class="case-section case-lead reveal" aria-label="Lead story">
          <div class="case-section-label">Lead Story</div>
          <div class="case-lead-copy">
            ${study.lead.map((paragraph, index) => `<p class="${index === 0 ? "dropcap" : ""}">${esc(paragraph)}</p>`).join("")}
          </div>
          <div class="ornament" aria-hidden="true">&loz;</div>
        </section>

        <aside class="pull-quote reveal" aria-label="Pull quote">
          <p>${esc(pullQuoteText)}</p>
          <div class="attribution">&mdash; From the ${esc(study.label)} file</div>
        </aside>

        ${extras.vision ? `
        <section class="case-section case-vision reveal" aria-label="Founder vision">
          <div class="case-section-label">Founder Vision</div>
          <div class="case-vision-copy">
            <p class="dropcap">${esc(extras.vision)}</p>
            ${extras.longTerm ? `<p class="long-term">${esc(extras.longTerm)}</p>` : ""}
            ${(extras.differentiators && extras.differentiators.length) ? `
              <div class="case-differentiators" aria-label="What makes it different">
                <h4>What it is — and what it isn't</h4>
                <ul>
                  ${extras.differentiators.map((item) => `<li>${esc(item)}</li>`).join("")}
                </ul>
              </div>
            ` : ""}
          </div>
        </section>
        ` : ""}

        ${study.deepDive ? `
        <section class="case-section case-deep-dive reveal" aria-label="Deep dive">
          <div class="case-section-label">Deep Dive</div>
          <div class="case-deep-dive-copy">
            ${study.deepDive.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
          </div>
          <div class="jump-line" aria-hidden="true">Continued below</div>
        </section>
        ` : ""}

        ${renderImageSpread(supportingImages[0], "Visual Evidence", 0)}

        <section class="case-section case-blueprint reveal" aria-label="Product blueprint">
          <div class="case-section-label">Product Blueprint</div>
          <div class="blueprint-grid">
            <article>
              <h3>Key Features</h3>
              <ul>${study.blueprint.features.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
            </article>
            <article>
              <h3>User Flow</h3>
              <ol>${study.blueprint.flow.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>
            </article>
            <article>
              <h3>System Modules</h3>
              <ul>${study.blueprint.modules.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
            </article>
          </div>
        </section>

        <section class="case-section case-diagram reveal" aria-label="Project diagram">
          <div class="case-section-label">System Diagram</div>
          <div class="diagram-board">
            <div class="diagram-core">
              <span>${esc(study.title)}</span>
              <strong>${esc(study.issue)}</strong>
            </div>
            <div class="diagram-nodes">
              ${diagramNodes.map((node, index) => `
                <div class="diagram-node">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <strong>${esc(node)}</strong>
                </div>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="case-section case-anatomy reveal" aria-label="Technical anatomy">
          <div class="case-section-label">Technical Anatomy</div>
          <div class="anatomy-grid">
            ${study.anatomy.map((item, index) => `
              <article>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <h3>${esc(item.title)}</h3>
                <p>${esc(item.body)}</p>
              </article>
            `).join("")}
          </div>
        </section>

        ${renderImageSpread(supportingImages[1], "System Proof", 1)}

        <section class="case-section case-challenges reveal" aria-label="Engineering challenges">
          <div class="case-section-label">The Hard Parts</div>
          <div class="challenge-list">
            ${study.challenges.map((item) => `
              <article>
                <h3>${esc(item.title)}</h3>
                <p><strong>Problem:</strong> ${esc(item.problem)}</p>
                <p><strong>Fix:</strong> ${esc(item.solution)}</p>
                <p><strong>Result:</strong> ${esc(item.result)}</p>
              </article>
            `).join("")}
          </div>
        </section>

        ${renderImageSpread(supportingImages[2], "Field Notes", 2)}
        ${renderImageGrid(supportingImages.slice(3), "More Evidence")}

        <section class="case-section case-impact reveal" aria-label="Proof and impact">
          <div class="case-section-label">Proof / Impact</div>
          <div class="impact-strip">
            ${study.impact.map((item) => `<span>${esc(item)}</span>`).join("")}
          </div>
          ${(() => {
            const numericRe = /\b(\d[\d.,]*(?:\s*[-\u2013\u2014]\s*\d[\d.,]*)?(?:\s*(?:ms|MB|GB|KB|x|×|%|\+))?)\b/i;
            const candidates = study.impact
              .map((item) => {
                const match = String(item).match(numericRe);
                if (!match) return null;
                return {
                  headline: match[1].trim(),
                  label: String(item).replace(match[1], "").trim().replace(/^[-\u2013\u2014\s]+/, "")
                };
              })
              .filter(Boolean)
              .slice(0, 4);
            if (candidates.length < 2) return "";
            return `
              <div class="case-by-the-numbers" aria-label="By the numbers">
                ${candidates.map((c) => `
                  <article>
                    <strong>${esc(c.headline)}</strong>
                    <span>${esc(c.label || "Outcome")}</span>
                  </article>
                `).join("")}
              </div>
            `;
          })()}
        </section>

        <section class="case-section case-closing reveal" aria-label="Closing column">
          <div class="case-section-label">Closing Column</div>
          <div>
            ${study.closing.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
            <div class="sign-off">
              <span>Abhinav Raj</span>
              <a href="${linkedInUrl}" target="_blank" rel="noopener" aria-label="Abhinav Raj on LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.34 8h4.32v14H.34V8Zm7.2 0h4.14v1.91h.06c.58-1.09 1.99-2.24 4.1-2.24 4.38 0 5.19 2.88 5.19 6.63V22h-4.31v-6.82c0-1.63-.03-3.72-2.27-3.72-2.27 0-2.62 1.77-2.62 3.6V22H7.54V8Z"/></svg>
              </a>
              <a href="${githubUrl}" target="_blank" rel="noopener" aria-label="Abhinav Raj on GitHub">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.15c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18A11 11 0 0 1 12 6.02c.98 0 1.95.13 2.87.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.42.36.79 1.07.79 2.16v3.15c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
              </a>
            </div>
          </div>
        </section>

        ${(extras.lessons && extras.lessons.length) ? `
        <section class="case-section case-lessons reveal" aria-label="Lessons learned">
          <div class="case-section-label">Lessons Learned</div>
          <div class="case-lessons-grid">
            ${extras.lessons.map((lesson) => `
              <article class="case-lesson">
                <div class="lesson-cat">${esc(lesson.category)}</div>
                <p>${esc(lesson.body)}</p>
              </article>
            `).join("")}
          </div>
        </section>
        ` : ""}

        <section class="case-end-card reveal" aria-label="End card">
          <h3>${esc(study.headline)}</h3>
          <div class="end-card-cta">
            <a href="${study.liveUrl}" ${linkAttrs(study.liveUrl)}>Visit ${esc(study.title)}</a>
            ${study.repoUrl ? `<a href="${study.repoUrl}" ${linkAttrs(study.repoUrl)}>Source on GitHub</a>` : ""}
            <a href="../../contact.html">Talk to Abhinav</a>
          </div>
        </section>

        <nav class="case-next reveal" aria-label="Project navigation">
          <a class="hover-cut" href="../${previous.slug}/"><span>Previous: ${esc(previous.title)}</span></a>
          <a class="hover-cut" href="../../work.html"><span>All Work</span></a>
          <a class="hover-cut" href="../${next.slug}/"><span>Next: ${esc(next.title)}</span></a>
        </nav>
      </article>
    `;
  }

  function renderNotes() {
    $$("[data-notes-list]").forEach((notes) => {
      notes.innerHTML = "";
      data.notes.forEach((note) => {
        const item = document.createElement("article");
        item.className = "note-row";
        item.innerHTML = `
          <span>${note.number}</span>
          <div>
            <h3>${note.title}</h3>
            <p>${note.body}</p>
          </div>
        `;
        notes.appendChild(item);
      });
    });
  }

  function renderSocials() {
    $$("[data-socials]").forEach((target) => {
      target.innerHTML = "";
      data.socials.forEach((social) => {
        const link = document.createElement("a");
        link.className = "hover-cut";
        link.href = social.url;
        link.target = "_blank";
        link.rel = "noopener";
        link.innerHTML = `<span>${social.label}</span>`;
        target.appendChild(link);
      });
    });
  }

  function renderMarquees() {
    $$("[data-marquee]").forEach((target) => {
      const set = data.marquee.map((item, index) => {
        const emphasis = index % 2 === 0 ? "strong" : "span";
        return `<${emphasis}>${item}</${emphasis}>`;
      }).concat(`<a href="mailto:${data.profile.email}">Email Me</a>`).join('<i aria-hidden="true">✦</i>');
      target.innerHTML = `
        <div class="marquee-track">
          <div class="marquee-set">${set}</div>
          <div class="marquee-set" aria-hidden="true">${set}</div>
        </div>
      `;
    });
  }

  function setupMenu() {
    const button = $("#menuButton");
    const curtain = $("#menuCurtain");
    if (!button || !curtain) return;

    const masthead = $(".masthead");
    if (masthead && button.parentElement !== masthead) {
      masthead.appendChild(button);
    }

    button.classList.add("menu-toggle");
    button.setAttribute("aria-controls", "menuCurtain");

    if (!curtain.querySelector(".menu-burn")) {
      const burn = document.createElement("div");
      burn.className = "menu-burn";
      burn.setAttribute("aria-hidden", "true");
      burn.innerHTML = `
        <div class="menu-burn-paper">
          <div class="menu-burn-edge menu-burn-edge--top"></div>
          <div class="menu-burn-edge menu-burn-edge--bottom"></div>
          <div class="menu-burn-grain"></div>
        </div>
        <div class="menu-burn-ember" aria-hidden="true"></div>
      `;
      curtain.insertBefore(burn, curtain.firstChild);
    }

    const currentPage = document.body.dataset.page;
    const base = getBasePrefix();

    $$(".menu-panel > a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const route = href.split("/").pop()?.replace(".html", "");
      const isCurrent = route === currentPage;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "page");
    });

    if (base) {
      $$('a[href]:not([href^="http"]):not([href^="mailto:"]):not([href^="#"])').forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("../")) return;
        link.setAttribute("href", `${base}${href}`);
      });
    }

    // Tag each menu link with an editorial numeral (01, 02 ...)
    $$(".menu-panel > a").forEach((link, idx) => {
      const n = String(idx + 1).padStart(2, "0");
      link.setAttribute("data-num", n);
    });

    const closeButton = $(".menu-close", curtain);
    const syncCloseTarget = () => {
      if (!closeButton) return;
      const rect = button.getBoundingClientRect();
      curtain.style.setProperty("--menu-close-x", `${rect.left}px`);
      curtain.style.setProperty("--menu-close-y", `${rect.top}px`);
      curtain.style.setProperty("--menu-close-w", `${rect.width}px`);
      curtain.style.setProperty("--menu-close-h", `${rect.height}px`);
    };

    let isOpen = false;
    let igniteTimer = 0;
    const setMenu = (open) => {
      if (open) syncCloseTarget();
      isOpen = open;
      curtain.classList.toggle("active", open);
      curtain.classList.toggle("closing", !open);
      curtain.setAttribute("aria-hidden", String(!open));
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      button.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      // "Ignite" the paper square: short-lived burn pseudo on the button itself.
      if (igniteTimer) window.clearTimeout(igniteTimer);
      button.classList.add("igniting");
      igniteTimer = window.setTimeout(() => button.classList.remove("igniting"), 620);
      if (!open) {
        window.setTimeout(() => curtain.classList.remove("closing"), 520);
      }
    };

    button.addEventListener("click", (event) => {
      event.preventDefault();
      setMenu(!isOpen);
    });
    $$("[data-menu-close]").forEach((el) => {
      if (el === button) return;
      el.addEventListener("click", () => setMenu(false));
    });
    window.addEventListener("resize", () => {
      if (isOpen) syncCloseTarget();
    }, { passive: true });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) setMenu(false);
    });
  }

  function setupScrollProgress() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  function setupHeroSplit() {
    const heading = $(".hero-word h1");
    if (!heading || heading.dataset.split === "true") return;
    const text = heading.textContent || "";
    heading.textContent = "";
    heading.dataset.split = "true";
    const words = text.split(/(\s+)/);
    let charIndex = 0;
    words.forEach((word) => {
      if (/^\s+$/.test(word)) {
        heading.appendChild(document.createTextNode(word));
        return;
      }
      const wordSpan = document.createElement("span");
      wordSpan.className = "hero-letter-word";
      Array.from(word).forEach((ch) => {
        const span = document.createElement("span");
        span.className = "hero-letter";
        span.style.setProperty("--letter-delay", `${charIndex * 38}ms`);
        span.textContent = ch;
        wordSpan.appendChild(span);
        charIndex += 1;
      });
      heading.appendChild(wordSpan);
    });
  }

  function setupMagneticButtons() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const targets = $$("[data-rail-prev], [data-rail-next], .card-visit, .contact-form button[type=submit]");
    targets.forEach((target) => {
      target.addEventListener("pointermove", (event) => {
        const rect = target.getBoundingClientRect();
        const mx = event.clientX - rect.left - rect.width / 2;
        const my = event.clientY - rect.top - rect.height / 2;
        target.style.setProperty("--mx", `${mx * 0.18}px`);
        target.style.setProperty("--my", `${my * 0.22}px`);
      });
      target.addEventListener("pointerleave", () => {
        target.style.setProperty("--mx", `0px`);
        target.style.setProperty("--my", `0px`);
      });
    });
  }

  function setupRail() {
    const rail = $("#projectRail");
    if (!rail) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    rail.addEventListener("pointerdown", (event) => {
      isDown = true;
      startX = event.clientX;
      scrollLeft = rail.scrollLeft;
      rail.setPointerCapture(event.pointerId);
      rail.classList.add("dragging");
    });

    rail.addEventListener("pointermove", (event) => {
      if (!isDown) return;
      const delta = event.clientX - startX;
      rail.scrollLeft = scrollLeft - delta;
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach((name) => {
      rail.addEventListener(name, () => {
        isDown = false;
        rail.classList.remove("dragging");
      });
    });

    rail.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      rail.scrollLeft += event.deltaY;
    }, { passive: false });

    $("[data-rail-prev]")?.addEventListener("click", () => rail.scrollBy({ left: -430, behavior: "smooth" }));
    $("[data-rail-next]")?.addEventListener("click", () => rail.scrollBy({ left: 430, behavior: "smooth" }));
  }

  function setupReveal() {
    const elements = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    elements.forEach((el) => observer.observe(el));
  }

  function setupClock() {
    const clock = $("#clock");
    if (!clock) return;
    if (!clock.nextElementSibling || !clock.nextElementSibling.classList.contains("topline-meta")) {
      const meta = document.createElement("div");
      meta.className = "topline-meta";
      meta.textContent = "Desk / Live";
      clock.insertAdjacentElement("afterend", meta);
    }
    const update = () => {
      const now = new Date();
      const date = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "2-digit",
        month: "short"
      }).format(now);
      const time = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }).format(now);
      clock.textContent = `${date} / ${time} IST`;
    };
    update();
    setInterval(update, 30000);
  }

  function setupIntro() {
    const intro = $(".intro");
    if (!intro) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("loaded", "intro-complete");
      intro.remove();
      return;
    }
    window.setTimeout(() => {
      intro.classList.add("done");
      document.body.classList.add("loaded");
    }, 1720);
    window.setTimeout(() => {
      document.body.classList.add("intro-complete");
      intro.remove();
    }, 2650);
  }

  function setupNavTransitions() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = $(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function setupContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const submit = form.querySelector('button[type="submit"]');
    let burnTimer = 0;
    const igniteSubmit = () => {
      if (!submit) return;
      submit.classList.remove("is-burning");
      // Force reflow so the animation restarts on each click.
      void submit.offsetWidth;
      submit.classList.add("is-burning");
      if (burnTimer) window.clearTimeout(burnTimer);
      burnTimer = window.setTimeout(() => submit.classList.remove("is-burning"), 760);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      igniteSubmit();
      const formData = new FormData(form);
      const name = formData.get("name") || "Portfolio visitor";
      const email = formData.get("email") || "";
      const message = formData.get("message") || "";
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent([
        `Name: ${name}`,
        email ? `Email: ${email}` : "",
        "",
        message
      ].filter(Boolean).join("\n"));
      // Slight delay so the burn animation is visible before the mail client takes focus.
      window.setTimeout(() => {
        window.location.href = `mailto:${data.profile.email}?subject=${subject}&body=${body}`;
      }, 280);
    });
  }

  function renderCertifications() {
    const grid = $("#certsGrid");
    if (!grid) return;
    const list = Array.isArray(data.certifications) ? data.certifications : [];
    grid.classList.remove("is-empty");
    if (!list.length) {
      grid.classList.add("is-empty");
      grid.textContent = "Certifications will be reprinted here once links are filed.";
      return;
    }
    grid.innerHTML = "";
    list.forEach((cert, index) => {
      const tags = (cert.tags || []).slice(0, 3);
      const card = document.createElement("a");
      card.className = "cert-card reveal";
      card.style.setProperty("--delay", `${index * 28}ms`);
      if (cert.url) {
        card.href = cert.url;
        card.target = "_blank";
        card.rel = "noopener";
      }
      card.innerHTML = `
        <div class="cert-issuer">${esc(cert.issuer || "")}${cert.year ? ` &middot; ${esc(cert.year)}` : ""}</div>
        <h3 class="cert-title">${esc(cert.title || "Untitled certification")}</h3>
        <div class="cert-foot">
          <div class="cert-tags">
            ${tags.map((t) => `<span class="cert-tag">${esc(t)}</span>`).join("")}
          </div>
          <span class="cert-verify">${cert.url ? "Verify →" : ""}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function setupCardTilt() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const MAX_TILT = 14; // degrees
    const cards = $$(".project-card, .work-detail-card");

    cards.forEach((card) => {
      let frame = 0;
      let rect = null;

      const updateRect = () => { rect = card.getBoundingClientRect(); };

      const onMove = (event) => {
        if (!rect) updateRect();
        const r = rect;
        const px = (event.clientX - r.left) / r.width;
        const py = (event.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 2 * MAX_TILT;
        const rx = (0.5 - py) * 2 * MAX_TILT;
        // Parallax depth offset for inner layers (in px).
        const tx = (px - 0.5) * 24;
        const ty = (py - 0.5) * 24;

        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
          card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
          card.style.setProperty("--tx", `${tx.toFixed(2)}px`);
          card.style.setProperty("--ty", `${ty.toFixed(2)}px`);
          card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
          card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        });
      };

      const onEnter = () => {
        updateRect();
        card.classList.add("is-tilting");
      };
      const onLeave = () => {
        card.classList.remove("is-tilting");
        if (frame) cancelAnimationFrame(frame);
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--tx", "0px");
        card.style.setProperty("--ty", "0px");
      };

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
    });
  }

  /* =========================================================
     Press Console — newspaper-styled typewriter terminal
     ========================================================= */
  function setupPressTerminal() {
    const root = $("#pressTerminal");
    if (!root) return;

    const screen = $("#pressTerminalScreen", root);
    const form = $("#pressTerminalForm", root);
    const input = $("#pressTerminalInput", root);
    const typed = $("#pressTerminalTyped", root);
    const muteBtn = $("#pressTerminalMute", root);
    const paper = $(".press-terminal-paper", root);
    if (!screen || !form || !input || !typed) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const profile = data.profile || {};
    const projects = data.projects || [];
    const research = data.researchPapers || [];
    const certifications = data.certifications || [];
    const socials = data.socials || [];

    let muted = false;
    let audioCtx = null;
    const ensureAudio = () => {
      if (muted) return null;
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioCtx = new Ctx();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    };

    const click = (variant = "key") => {
      const ctx = ensureAudio();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      if (variant === "key") {
        osc.type = "square";
        osc.frequency.value = 1600 + Math.random() * 700;
        filter.frequency.value = 1800;
        filter.Q.value = 6;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (variant === "return") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);
        filter.frequency.value = 800;
        filter.Q.value = 2;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (variant === "bell") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1180, now);
        osc.frequency.exponentialRampToValueAtTime(820, now + 0.4);
        filter.frequency.value = 1500;
        filter.Q.value = 2;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (variant === "back") {
        osc.type = "square";
        osc.frequency.value = 320;
        filter.frequency.value = 600;
        filter.Q.value = 4;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.04, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.07);
      }
      osc.connect(filter).connect(gain).connect(ctx.destination);
    };

    const escapeHtml = esc;
    const renderChars = (text) => {
      // Each character is wrapped in a span so CSS can run the keystrike animation.
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const safe = ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch]) || ch;
        const display = ch === " " ? "&nbsp;" : safe;
        out += `<span class="press-terminal-char" style="animation-delay:${(i * 12)}ms">${display}</span>`;
      }
      return out;
    };

    const writeLine = (text, opts = {}) => {
      const div = document.createElement("div");
      div.className = "press-terminal-line";
      if (opts.tone) div.classList.add(`is-${opts.tone}`);
      if (opts.html) {
        div.innerHTML = opts.html;
      } else if (opts.animate !== false && !reduced) {
        div.innerHTML = renderChars(text || "");
      } else {
        div.textContent = text || "";
      }
      screen.appendChild(div);
      screen.scrollTop = screen.scrollHeight;
      return div;
    };

    const writePromptLine = (cmd) => {
      const div = document.createElement("div");
      div.className = "press-terminal-line is-prompt";
      div.innerHTML = `<span class="press-terminal-prompt-mark">abhnv@journal:~$</span><span>${escapeHtml(cmd)}</span>`;
      screen.appendChild(div);
      screen.scrollTop = screen.scrollHeight;
    };

    const writeBlock = (lines, opts = {}) => {
      lines.forEach((line) => {
        if (typeof line === "string") writeLine(line, opts);
        else writeLine(line.text || "", { ...opts, ...line });
      });
    };

    const ascii = [
      "    ____  ___    ____  __ _____   __                              __",
      "   / __ \\/   |  / __ \\/  // /   | / /  ____ ___  ___  ____  ___ _/ /",
      "  / /_/ / /| | / /_/ /  // / /| |/ /  / __ `__ \\/ _ \\/ __ \\/ _ `/ / ",
      " / _, _/ ___ |/ _, _/  // / ___ / /__/ / / / / /  __/ / / / _, /_/  ",
      "/_/ |_/_/  |_/_/ |_/__//_/_/  |_\\____/_/ /_/ /_/\\___/_/ /_/\\_,_(_)  "
    ];

    const banner = () => {
      const div = document.createElement("div");
      div.className = "press-terminal-line is-banner";
      const pre = document.createElement("pre");
      pre.className = "press-terminal-ascii";
      pre.textContent = ascii.join("\n");
      div.appendChild(pre);
      screen.appendChild(div);
      writeLine(`${profile.name || "Abhinav Raj"} · The Digital Journal · Press Console v1.0`, { tone: "muted", animate: false });
      writeLine("Type `help` to see all commands. Try `about`, `projects`, `certs`, or `contact`.", { tone: "muted", animate: false });
      writeLine("", { animate: false });
      screen.scrollTop = screen.scrollHeight;
    };

    const helpRows = [
      ["help", "list every command on this teletype"],
      ["about", "short bio of the operator"],
      ["whoami", "the byline behind this paper"],
      ["projects [slug]", "list shipped products, or print one"],
      ["research", "list research papers"],
      ["certs", "list issued certifications"],
      ["skills", "stack and toolchain"],
      ["social", "social channels and links"],
      ["contact", "open a mail draft to the editor"],
      ["resume", "open the live resume site"],
      ["date", "prints the current desk time (IST)"],
      ["echo <text>", "the press echoes back"],
      ["sudo <cmd>", "you cannot afford the privilege"],
      ["theme", "flip the press into night-edition (ink mode)"],
      ["banner", "reprint the masthead"],
      ["clear", "wipe the page and start fresh"]
    ];

    const projectMap = new Map(projects.map((p) => [String(p.slug || p.title || "").toLowerCase(), p]));

    const printProject = (project) => {
      writeLine(`▣ ${project.title}`, { tone: "banner", animate: false });
      writeLine(`  ${project.label || ""}`, { tone: "muted", animate: false });
      writeLine(`  ${project.description || ""}`, { animate: false });
      const links = [];
      if (project.liveUrl) links.push(`<a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener">live ↗</a>`);
      if (project.repoUrl) links.push(`<a href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener">repo ↗</a>`);
      if (project.caseStudyUrl) links.push(`<a href="${escapeHtml(project.caseStudyUrl)}">case study →</a>`);
      if (links.length) writeLine("", { html: `  ${links.join("  ·  ")}`, animate: false });
      if (project.tags && project.tags.length) {
        writeLine(`  tags: ${project.tags.join(", ")}`, { tone: "muted", animate: false });
      }
    };

    const commands = {
      help() {
        writeLine("Available commands:", { tone: "banner", animate: false });
        helpRows.forEach(([cmd, desc]) => {
          writeLine(`  ${cmd.padEnd(20, " ")} ${desc}`, { animate: false });
        });
      },
      about() {
        const bio = (profile.summary || "AI builder and full-stack developer.");
        writeLine("ABOUT THE OPERATOR", { tone: "banner", animate: false });
        writeLine(bio, { animate: false });
        writeLine("Open about.html for the full newspaper-cutting profile.", { tone: "muted", animate: false });
      },
      whoami() {
        writeLine(profile.name || "Abhinav Raj", { tone: "banner", animate: false });
        writeLine(`Editor & operator of ${profile.publication || "The Digital Journal"}.`, { animate: false });
      },
      projects(arg) {
        if (arg) {
          const target = projectMap.get(arg.toLowerCase());
          if (!target) {
            writeLine(`No file matching "${arg}". Try \`projects\` to list slugs.`, { tone: "error", animate: false });
            return;
          }
          printProject(target);
          return;
        }
        writeLine("FILED PRODUCTS", { tone: "banner", animate: false });
        projects.forEach((p, i) => {
          writeLine(`  ${String(i + 1).padStart(2, "0")}. ${p.title.padEnd(14, " ")}  ${p.type || ""}`, { animate: false });
        });
        writeLine("", { animate: false });
        writeLine("Tip: try `projects clex` or `projects modih-mail`.", { tone: "muted", animate: false });
      },
      research() {
        if (!research.length) {
          writeLine("No papers filed yet.", { tone: "muted", animate: false });
          return;
        }
        writeLine("RESEARCH DESK", { tone: "banner", animate: false });
        research.forEach((r) => {
          const link = r.url ? `<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">read ↗</a>` : "";
          writeLine("", { html: `  ▸ <strong>${escapeHtml(r.title)}</strong> — ${escapeHtml(r.label || "")} ${link}`, animate: false });
        });
      },
      certs() {
        if (!certifications.length) {
          writeLine("No certifications filed yet.", { tone: "muted", animate: false });
          return;
        }
        writeLine(`CERTIFICATIONS (${certifications.length})`, { tone: "banner", animate: false });
        certifications.forEach((c, i) => {
          const num = String(i + 1).padStart(2, "0");
          const issuer = c.issuer ? ` — ${c.issuer}` : "";
          const link = c.url ? `<a href="${escapeHtml(c.url)}" target="_blank" rel="noopener">verify ↗</a>` : "";
          writeLine("", { html: `  ${num}. <strong>${escapeHtml(c.title)}</strong>${escapeHtml(issuer)} ${link}`, animate: false });
        });
        writeLine("Or open work.html#certifications for the printed grid.", { tone: "muted", animate: false });
      },
      skills() {
        const stacks = [
          ["AI / ML", "LLM apps, prompt systems, evals, retrieval, fine-tuning"],
          ["Frontend", "React, Next.js, TypeScript, Tailwind, shadcn, Framer Motion"],
          ["Backend", "Node, FastAPI, Postgres, Redis, REST + websockets"],
          ["Edge / Infra", "Cloudflare Workers, Vercel, Docker, CI"],
          ["Mobile", "Flutter, React Native"],
          ["Crypto / Web3", "Solidity basics, applied cryptography"],
          ["Design", "Editorial systems, motion, type-driven UI"]
        ];
        writeLine("STACK", { tone: "banner", animate: false });
        stacks.forEach(([k, v]) => writeLine(`  ${k.padEnd(14, " ")} ${v}`, { animate: false }));
      },
      social() {
        if (!socials.length) {
          writeLine("No social channels listed.", { tone: "muted", animate: false });
          return;
        }
        writeLine("CHANNELS", { tone: "banner", animate: false });
        socials.forEach((s) => {
          writeLine("", { html: `  · <strong>${escapeHtml(s.label)}</strong> — <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.url)}</a>`, animate: false });
        });
      },
      contact() {
        const mail = profile.email || "hello@abhnv.in";
        writeLine("Drafting an envelope…", { tone: "muted", animate: false });
        writeLine("", { html: `  ✉ <a href="mailto:${escapeHtml(mail)}">${escapeHtml(mail)}</a>`, animate: false });
        click("bell");
      },
      resume() {
        writeLine("Opening live resume…", { tone: "muted", animate: false });
        try { window.open("https://www.abhnv.in", "_blank", "noopener"); } catch (_) {}
      },
      date() {
        const now = new Date();
        const date = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "long", day: "2-digit", month: "long", year: "numeric"
        }).format(now);
        const time = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
        }).format(now);
        writeLine(`${date} · ${time} IST`, { animate: false });
      },
      echo(arg) {
        writeLine(arg || "", { animate: false });
      },
      sudo() {
        writeLine("This press has no sudo. Authority is earned, not asserted.", { tone: "error", animate: false });
        click("bell");
      },
      theme() {
        document.body.classList.toggle("press-terminal-night");
        writeLine(document.body.classList.contains("press-terminal-night") ? "Night edition." : "Day edition.", { tone: "muted", animate: false });
      },
      banner() {
        banner();
      },
      clear() {
        screen.innerHTML = "";
      },
      ls() { return commands.projects(); },
      cat(arg) {
        if (!arg) {
          writeLine("usage: cat <slug>", { tone: "error", animate: false });
          return;
        }
        commands.projects(arg);
      }
    };

    const aliases = {
      "?" : "help",
      "h": "help",
      "info": "about",
      "bio": "about",
      "stack": "skills",
      "tech": "skills",
      "papers": "research",
      "certifications": "certs",
      "channels": "social",
      "links": "social",
      "mail": "contact",
      "email": "contact",
      "exit": "clear",
      "cls": "clear"
    };

    const run = (raw) => {
      const trimmed = (raw || "").trim();
      writePromptLine(trimmed);
      if (!trimmed) return;
      const [head, ...rest] = trimmed.split(/\s+/);
      const arg = rest.join(" ");
      const key = (aliases[head.toLowerCase()] || head.toLowerCase());
      const fn = commands[key];
      if (typeof fn === "function") {
        try {
          fn(arg);
        } catch (err) {
          writeLine(`error: ${err && err.message ? err.message : String(err)}`, { tone: "error", animate: false });
        }
      } else {
        writeLine(`command not found: ${head}. Type \`help\`.`, { tone: "error", animate: false });
      }
      writeLine("", { animate: false });
    };

    // History (arrow keys)
    const history = [];
    let historyIndex = -1;

    const updateTyped = () => {
      typed.textContent = input.value;
    };

    const focusInput = () => input.focus();
    paper && paper.addEventListener("click", focusInput);
    screen.addEventListener("click", focusInput);

    input.addEventListener("input", (event) => {
      updateTyped();
      const data = event.data;
      if (data) click("key");
      else if (event.inputType && event.inputType.startsWith("delete")) click("back");
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        if (history.length === 0) return;
        event.preventDefault();
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = history[historyIndex] || "";
        updateTyped();
      } else if (event.key === "ArrowDown") {
        if (history.length === 0) return;
        event.preventDefault();
        historyIndex = Math.min(history.length, historyIndex + 1);
        input.value = history[historyIndex] || "";
        updateTyped();
      } else if (event.key === "Tab") {
        event.preventDefault();
        const partial = input.value.trim().toLowerCase();
        if (!partial) return;
        const candidates = Object.keys(commands).concat(Object.keys(aliases))
          .filter((c) => c.startsWith(partial));
        if (candidates.length === 1) {
          input.value = candidates[0] + " ";
          updateTyped();
          click("key");
        } else if (candidates.length > 1) {
          writeLine(candidates.sort().join("  "), { tone: "muted", animate: false });
        }
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value;
      if (value.trim()) {
        history.push(value.trim());
        historyIndex = history.length;
      }
      click("return");
      paper && paper.classList.remove("is-stamping");
      void (paper && paper.offsetWidth);
      paper && paper.classList.add("is-stamping");
      input.value = "";
      updateTyped();
      run(value);
    });

    muteBtn && muteBtn.addEventListener("click", () => {
      muted = !muted;
      muteBtn.setAttribute("aria-pressed", String(muted));
      muteBtn.textContent = muted ? "Sound: OFF" : "Sound: ON";
    });

    // Auto-focus when scrolled into view (don't hijack on first paint)
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && document.hasFocus() && !document.activeElement.matches("input, textarea, [contenteditable]")) {
            // Don't autofocus; just signal availability with the caret already blinking.
          }
        });
      }, { threshold: 0.4 });
      obs.observe(root);
    }

    banner();
  }

  renderProjects();
  renderCaseStudy();
  renderNotes();
  renderSocials();
  renderMarquees();
  renderCertifications();
  setupMenu();
  setupRail();
  setupReveal();
  setupClock();
  setupIntro();
  setupNavTransitions();
  setupContactForm();
  setupScrollProgress();
  setupHeroSplit();
  setupMagneticButtons();
  setupCardTilt();
  setupPressTerminal();
})();
