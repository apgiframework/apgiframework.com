// Shared navigation component for the APGI site.
// Injects a consistent <nav class="main-nav"> at the top of <body> using the
// site's current, real page set. Previously this fetched a nonexistent
// components/navigation.html and fell back to a hardcoded nav full of dead
// legacy links (Home.html, Quiz.html, Assessment.html, Paper.html) that no
// longer exist on the site — that bug is fixed here by building the nav
// directly, with no fetch and no legacy filenames.
class APGINavigation {
  constructor() {
    this.links = [
      { href: "/index.html", label: "APGI Framework", brand: true },
      { href: "/papers-index.html", label: "Papers" },
      { href: "/apgi-assessment.html", label: "Assessment" },
      { href: "/book-outline.html", label: "Book" },
      { href: "/apgi-software-system.html", label: "Software" },
      { href: "/apgi-experiments.html", label: "Experiments" },
      { href: "/funnels.html", label: "Solutions" },
      { href: "/sitemap.html", label: "Sitemap" },
      { href: "/contact.html", label: "Contact" },
    ];
    this.init();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    return path.split("/").pop() || "index.html";
  }

  init() {
    this.createNavigation();
  }

  createNavigation() {
    if (document.querySelector(".main-nav")) {
      return;
    }

    const nav = document.createElement("nav");
    nav.className = "main-nav";
    nav.setAttribute("aria-label", "Primary");

    const current = this.getCurrentPage();
    const linksHtml = this.links
      .map((link) => {
        const linkPage = link.href.split("/").pop();
        const isCurrent = linkPage === current;
        const classes = ["nav-link"];
        if (link.brand) classes.push("nav-brand");
        if (isCurrent) classes.push("current");
        return `<a href="${link.href}" class="${classes.join(" ")}"${
          isCurrent ? ' aria-current="page"' : ""
        }>${link.label}</a>`;
      })
      .join("\n        ");

    nav.innerHTML = `
      <div class="nav-container">
        <div class="nav-links">
        ${linksHtml}
        </div>
      </div>
    `;

    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(nav, body.firstChild);
    } else {
      body.appendChild(nav);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.apgiNavigation) {
    window.apgiNavigation = new APGINavigation();
  }
});

if (document.readyState !== "loading" && !window.apgiNavigation) {
  window.apgiNavigation = new APGINavigation();
}
