// fix-imports.js
import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "src");

// Carpetas que nunca deben procesarse
const EXCLUDE_DIRS = ["node_modules", ".git", "dist", "build"];

// Reglas de reemplazo básicas
const replacements = [
  { from: "@/shared/components/ui/", to: "@/components/ui/" },
  { from: "./pages/provider/", to: "@/features/provider/pages/" },
  { from: "pages/", to: "@/pages/" },
  { from: "components/", to: "@/components/" },
  { from: "./components/", to: "@/components/" },
  { from: "../components/", to: "@/components/" },
];

// Recorrer archivos de código recursivamente
function getAllFiles(dir, extList = [".js", ".jsx", ".ts", ".tsx"]) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (EXCLUDE_DIRS.some((ex) => filePath.includes(ex))) return;
      results = results.concat(getAllFiles(filePath, extList));
    } else if (extList.includes(path.extname(file))) {
      results.push(filePath);
    }
  });

  return results;
}

// Corrige imports
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // Aplicar reglas simples
  replacements.forEach(({ from, to }) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    content = content.replace(regex, to);
  });

  // Normalizar alias rotos tipo @/@/
  content = content.replace(/@\/{2,}/g, "@/");

  // 🔥 Fix especial: imports dañados como "@/utils"...../../utils/mockData
  content = content.replace(
    /@\/utils[^'"]*?(\.\.\/)+utils\//g,
    "@/utils/"
  );

  // 🔥 Fix general: imports con doble alias rotos
  content = content.replace(/"@\/utils"@\/utils\//g, '"@/utils/');

  // Eliminar duplicados de case 'provider':
  const lines = content.split("\n");
  const cleanedLines = [];
  let lastWasProvider = false;

  for (let line of lines) {
    if (line.includes("case 'provider':")) {
      if (lastWasProvider) {
        console.log(`⚠️ Eliminado duplicado en ${filePath}`);
        continue;
      }
      lastWasProvider = true;
    } else {
      lastWasProvider = false;
    }
    cleanedLines.push(line);
  }

  content = cleanedLines.join("\n");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Archivo corregido: ${filePath}`);
  }
}

// Ejecutar en todos los archivos dentro de src/
const allFiles = getAllFiles(SRC_DIR);
allFiles.forEach(fixFile);

console.log("\n🎯 Correcciones completadas en todos los archivos de src/");
