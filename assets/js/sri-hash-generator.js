/**
 * SRI Hash Generator Utility
 * Generates Subresource Integrity hashes for CDN resources
 *
 * Usage:
 * 1. Run in browser console or as Node.js script
 * 2. Add generated hashes to <script> integrity attributes
 */

async function generateSRIHash(url) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    // Use SHA-384 for SRI (recommended by W3C)
    const hashBuffer = await crypto.subtle.digest('SHA-384', buffer);

    // Convert to base64
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));

    return `sha384-${hashBase64}`;
  } catch (error) {
    console.error(`Failed to generate hash for ${url}:`, error);
    return null;
  }
}

/**
 * CDN Resources that should have SRI hashes
 * Add your resource URLs here
 */
const cdnResources = [
  {
    name: "MathJax",
    url: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
  },
  {
    name: "Stripe.js",
    url: "https://js.stripe.com/v3/"
  },
  {
    name: "D3.js",
    url: "https://d3js.org/d3.v7.min.js"
  },
  {
    name: "Chart.js",
    url: "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"
  },
  {
    name: "Plotly.js",
    url: "https://cdn.plot.ly/plotly-latest.min.js"
  },
  {
    name: "React",
    url: "https://unpkg.com/react@17/umd/react.production.min.js"
  },
  {
    name: "React DOM",
    url: "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"
  },
  {
    name: "Google Fonts - Inter",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
  },
  {
    name: "Google Fonts - Crimson Pro",
    url: "https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap"
  }
];

/**
 * Generate SRI hashes for all CDN resources
 */
async function generateAllSRIHashes() {
  console.log("🔐 Generating SRI hashes for CDN resources...\n");

  const results = [];

  for (const resource of cdnResources) {
    try {
      console.log(`Generating hash for ${resource.name}...`);
      const hash = await generateSRIHash(resource.url);

      if (hash) {
        results.push({
          name: resource.name,
          url: resource.url,
          hash: hash
        });

        console.log(`✅ ${resource.name}: ${hash}\n`);
      } else {
        console.log(`❌ Failed to generate hash for ${resource.name}\n`);
      }
    } catch (error) {
      console.error(`Error processing ${resource.name}:`, error);
    }
  }

  // Generate HTML snippets
  console.log("\n📋 HTML Snippets with SRI Hashes:\n");
  console.log("=".repeat(80));

  results.forEach(result => {
    if (result.url.endsWith('.js')) {
      console.log(`<!-- ${result.name} -->`);
      console.log(`<script`);
      console.log(`  src="${result.url}"`);
      console.log(`  integrity="${result.hash}"`);
      console.log(`  crossorigin="anonymous"`);
      console.log(`  async></script>\n`);
    } else if (result.url.includes('fonts')) {
      console.log(`<!-- ${result.name} -->`);
      console.log(`<link`);
      console.log(`  rel="stylesheet"`);
      console.log(`  href="${result.url}"`);
      console.log(`  integrity="${result.hash}"`);
      console.log(`  crossorigin="anonymous">\n`);
    }
  });

  console.log("=".repeat(80));
  console.log("\n✅ Copy the HTML snippets above into your index.html");
  console.log("💾 Store the hashes for documentation and version control\n");

  return results;
}

/**
 * Validate SRI hash by checking current resource
 */
async function validateSRIHash(url, expectedHash) {
  const actualHash = await generateSRIHash(url);
  const isValid = actualHash === expectedHash;

  console.log(`\n📊 SRI Validation for: ${url}`);
  console.log(`Expected: ${expectedHash}`);
  console.log(`Actual:   ${actualHash}`);
  console.log(`Status:   ${isValid ? "✅ VALID" : "❌ MISMATCH (Resource may have been updated)"}`);

  return isValid;
}

// Export for use as module (Node.js)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateSRIHash,
    generateAllSRIHashes,
    validateSRIHash,
    cdnResources
  };
}

// Auto-run in browser if script loaded directly
if (typeof window !== "undefined" && document.currentScript?.src.includes("sri-hash-generator")) {
  document.addEventListener("DOMContentLoaded", () => {
    // Create button to generate hashes
    const button = document.createElement("button");
    button.textContent = "Generate SRI Hashes";
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 20px;
      background: #00B4FF;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      z-index: 10000;
      font-family: monospace;
      font-weight: bold;
    `;

    button.addEventListener("click", generateAllSRIHashes);
    document.body.appendChild(button);
  });
}

console.log("🔐 SRI Hash Generator loaded. Run generateAllSRIHashes() to start.");
