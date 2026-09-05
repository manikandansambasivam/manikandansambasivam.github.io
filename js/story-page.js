const TAMIL_RANGE_G = /[஀-௿]/g;
const LATIN_LETTER_RANGE_G = /[a-zA-Z]/g;

function findManifestEntry(pathname) {
    const manifest = window.CONTENT_MANIFEST || {};

    for (const collectionKey of Object.keys(manifest)) {
        const collection = manifest[collectionKey];

        for (const section of collection.sections) {
            const posts = section.posts;

            for (let i = 0; i < posts.length; i++) {
                if (posts[i].path === pathname) {
                    return {
                        collection,
                        collectionKey,
                        section,
                        post: posts[i],
                        index: i,
                        posts
                    };
                }
            }
        }
    }

    return null;
}

function renderBreadcrumb(entry) {
    const el = document.getElementById("story-breadcrumb");

    if (!el || !entry) return;

    const sectionHref = `${entry.collection.listingPath}#${entry.section.anchor}`;

    el.innerHTML = `
        <a href="/index.html">Home</a>
        <span aria-hidden="true">/</span>
        <a href="${entry.collection.listingPath}">${entry.collection.listingLabel}</a>
        <span aria-hidden="true">/</span>
        <a href="${sectionHref}">${entry.section.label}</a>
    `;
}

function renderPagination(entry) {
    const el = document.getElementById("story-pagination");

    if (!el || !entry) return;

    const prev = entry.posts[entry.index - 1];
    const next = entry.posts[entry.index + 1];

    if (!prev && !next) return;

    el.innerHTML = `
        <a class="story-pagination-prev" href="${prev ? prev.path : "#"}" ${prev ? "" : "aria-disabled=\"true\" tabindex=\"-1\""}>
            ${prev ? `&larr; ${prev.title}` : ""}
        </a>
        <a class="story-pagination-next" href="${next ? next.path : "#"}" ${next ? "" : "aria-disabled=\"true\" tabindex=\"-1\""}>
            ${next ? `${next.title} &rarr;` : ""}
        </a>
    `;
}

function tagParagraphLanguages(container) {
    const paragraphs = container.querySelectorAll(":scope > p");
    const languagesPresent = new Set();

    paragraphs.forEach(p => {
        const text = p.textContent;
        const tamilChars = (text.match(TAMIL_RANGE_G) || []).length;
        const latinChars = (text.match(LATIN_LETTER_RANGE_G) || []).length;

        // Paragraphs with no actual letters (e.g. a bare "..." in dialogue)
        // carry no language-specific content, so leave them untagged: always
        // visible, regardless of the toggle state.
        if (tamilChars === 0 && latinChars === 0) return;

        const lang = tamilChars >= latinChars ? "ta" : "en";

        p.setAttribute("data-lang", lang);
        languagesPresent.add(lang);
    });

    return languagesPresent;
}

function renderLanguageToggle(container, languagesPresent) {
    const el = document.getElementById("story-toolbar");

    if (!el || languagesPresent.size < 2) return;

    const savedFilter = localStorage.getItem("story-lang-filter") || "both";

    const applyFilter = filter => {
        if (filter === "both") {
            container.removeAttribute("data-lang-filter");
        } else {
            container.setAttribute("data-lang-filter", filter);
        }

        localStorage.setItem("story-lang-filter", filter);

        el.querySelectorAll("button").forEach(btn => {
            btn.setAttribute("aria-pressed", btn.dataset.filter === filter ? "true" : "false");
        });
    };

    el.innerHTML = `
        <button type="button" data-filter="both">Both</button>
        <button type="button" data-filter="en">EN</button>
        <button type="button" data-filter="ta">TA</button>
    `;

    el.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
    });

    applyFilter(savedFilter);
}

function initStoryPage() {
    const container = document.querySelector(".story-container");

    if (!container) return;

    const entry = findManifestEntry(window.location.pathname);

    if (entry) {
        renderBreadcrumb(entry);
        renderPagination(entry);
    }

    const languagesPresent = tagParagraphLanguages(container);
    renderLanguageToggle(container, languagesPresent);
}
