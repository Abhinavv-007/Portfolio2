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

    const statTotal = $("#certsStatTotal");
    const statIssuers = $("#certsStatIssuers");
    const statTags = $("#certsStatTags");
    const filterRow = $("#certsFilters");
    const emptyEl = $("#certsEmpty");

    if (statTotal) statTotal.textContent = String(list.length);
    if (statIssuers) {
      const set = new Set(list.map((c) => (c.issuer || "").trim()).filter(Boolean));
      statIssuers.textContent = String(set.size);
    }
    const allTags = Array.from(
      new Set(list.flatMap((c) => (c.tags || []).map((t) => String(t).trim()).filter(Boolean)))
    ).sort((a, b) => a.localeCompare(b));
    if (statTags) statTags.textContent = String(allTags.length);

    const writeCards = (filterTag) => {
      grid.classList.remove("is-empty");
      grid.innerHTML = "";
      const visible = filterTag === "All"
        ? list
        : list.filter((c) => (c.tags || []).map((t) => String(t)).includes(filterTag));
      if (!visible.length) {
        if (emptyEl) emptyEl.hidden = false;
        return;
      }
      if (emptyEl) emptyEl.hidden = true;
      visible.forEach((cert, index) => {
        const tags = (cert.tags || []).slice(0, 3);
        const card = document.createElement("a");
        card.className = "cert-card reveal is-revealed";
        card.style.setProperty("--delay", `${index * 24}ms`);
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
            <span class="cert-verify">${cert.url ? "Verify ↗" : ""}</span>
          </div>
        `;
        grid.appendChild(card);
      });
    };

    if (!list.length) {
      grid.classList.add("is-empty");
      grid.textContent = "Certifications will be reprinted here once links are filed.";
      return;
    }

    if (filterRow) {
      filterRow.innerHTML = "";
      const tagsForFilter = ["All", ...allTags];
      tagsForFilter.forEach((tag, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "certs-filter" + (i === 0 ? " is-active" : "");
        btn.dataset.filter = tag;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
        btn.textContent = tag;
        btn.addEventListener("click", () => {
          $$(".certs-filter", filterRow).forEach((b) => {
            b.classList.remove("is-active");
            b.setAttribute("aria-selected", "false");
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-selected", "true");
          writeCards(tag);
        });
        filterRow.appendChild(btn);
      });
    }

    writeCards("All");
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
})();
