// fix-broken-imports.js
import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "src");
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// Reglas de corrección
const fixPatterns = [
  { regex: /@\/@\/+/g, replace: "@/"},
  { regex: /'@\/utils'@\/utils.*mockData.*;/g, replace: "'@/utils/mockData';" },
  { regex: /'@\/utils'@\/utils.*cn.*;/g, replace: "'@/utils/cn';" },
  { regex: /(\.\.\/)+@\/components/g, replace: "@/components"},
  { regex: /(\.\.\/)+@\/utils/g, replace: "@/utils"},
  { regex: /"@\/components'@\/components.*OrderCard.*;/g, replace: '"@/components/OrderCard";'},
  { regex: /"@\/components'@\/components.*ShipmentTracker.*;/g, replace: '"@/components/ShipmentTracker";'},
  { regex: /"@\/components'@\/components.*AnalyticsDashboard.*;/g, replace: '"@/components/AnalyticsDashboard";'},
];

// Buscar archivos
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

// Corregir imports
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  fixPatterns.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Arreglado: ${filePath}`);
  }
}

console.log("🔧 Corrigiendo imports dañados...");
const allFiles = getAllFiles(SRC_DIR);
allFiles.forEach(fixFile);
console.log("\n🎯 Corrección completada.");
