const fs = require("fs");
const path = require("path");

const domain = "https://twarro.app";

const ignore = [
  "node_modules",
  ".git",
  "admin",
  "images",
  "content"
];

function findIndexFiles(dir, results = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignore.includes(file)) {
        findIndexFiles(fullPath, results);
      }
    } else if (file === "index.html") {
      results.push(fullPath);
    }
  });

  return results;
}

const pages = findIndexFiles(".")
  .map(file => {
    let urlPath = path.dirname(file).replace(/\\/g, "/").replace(".", "");

    if (urlPath === "") urlPath = "/";
    else urlPath = `${urlPath}/`;

    return `${domain}${urlPath}`;
  })
  .filter(url => !url.includes("/thank-you/"));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(url => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap);

console.log("Sitemap generated successfully.");
