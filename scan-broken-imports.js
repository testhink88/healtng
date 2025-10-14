// scan-broken-imports.js
import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "src");
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// Regex que detecta imports con cosas raras (alias mezclados, ../../ pegados, comillas mal cerradas)
const weirdImportRegex =
  /(import\s+[^'"]*['"][^'"]*(?:@\/.*\.\.\/.*|@\/.*@\/.*|['"][^'"]*['"][^;]*$))/gm;

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

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  let match;
  while ((match = weirdImportRegex.exec(content)) !== null) {
    console.log(`⚠️  Posible import dañado en: ${filePath}`);
    console.log(`   → ${match[0].trim()}\n`);
  }
}

console.log("🔎 Escaneando imports sospechosos...");
const allFiles = getAllFiles(SRC_DIR);
allFiles.forEach(scanFile);
console.log("\n🎯 Escaneo completado.");
