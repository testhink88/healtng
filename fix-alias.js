// fix-alias.js
import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "src");

// Extensiones a revisar
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// Regex para detectar import/export
const importRegex = /(import\s+[^'"]*['"])([^'"]+)(['"])/g;
const exportRegex = /(export\s+[^'"]*from\s+['"])([^'"]+)(['"])/g;

function cleanPath(p) {
  // Si contiene "@/...../../", limpiamos dejando solo la primera parte
  if (p.includes("@/") && (p.includes("../") || p.includes("./"))) {
    const base = p.match(/^@\/[^\/]+/); // toma "@/utils", "@/components", etc.
    if (base) return base[0];
  }

  // Limpieza adicional: elimina duplicados tipo @/@/ o // en medio
  return p.replace(/@\/+/, "@/").replace(/\/{2,}/g, "/");
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  function replacer(match, pre, p, post) {
    const newPath = cleanPath(p);
    if (newPath !== p) {
      console.log(`🔧 ${filePath}: "${p}" → "${newPath}"`);
    }
    return pre + newPath + post;
  }

  content = content.replace(importRegex, replacer);
  content = content.replace(exportRegex, replacer);

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Corregido: ${filePath}`);
  }
}

function getAllFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else if (EXTENSIONS.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

console.log("🔎 Escaneando imports...");
const allFiles = getAllFiles(SRC_DIR);
allFiles.forEach(fixFile);
console.log("\n🎯 Limpieza completada!");
