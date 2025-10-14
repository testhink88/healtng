// fix-imports.js
import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "src");

// Reglas de reemplazo de imports
const replacements = [
  { from: "@/shared/components/ui/", to: "@/components/ui/" },
  { from: "./pages/provider/", to: "@/features/provider/pages/" },
  { from: "pages/", to: "@/pages/" },
  { from: "components/", to: "@/components/" },
  { from: "./components/", to: "@/components/" },
  { from: "../components/", to: "@/components/" },
];

// Recorrer archivos .js y .jsx recursivamente
function getAllFiles(dir, extList = [".js", ".jsx"]) {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, extList));
    } else if (extList.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

// Corrige imports y elimina duplicados
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // Aplicar reemplazos de imports
  replacements.forEach(({ from, to }) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    content = content.replace(regex, to);
  });

  // Eliminar duplicados de case 'provider':
  const lines = content.split("\n");
  const cleanedLines = [];
  let lastWasProvider = false;

  for (let line of lines) {
    if (line.includes("case 'provider':")) {
      if (lastWasProvider) {
        console.log(`⚠️  Eliminado duplicado en ${filePath}`);
        continue; // omite la línea duplicada
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

// Ejecutar en todos los archivos
const allFiles = getAllFiles(SRC_DIR);
allFiles.forEach(fixFile);

console.log("\n🎯 Correcciones completadas en todos los archivos!");
