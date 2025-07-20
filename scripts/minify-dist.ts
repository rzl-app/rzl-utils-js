import Console from "console";
import fs, { globSync } from "fs";

const files = globSync("dist/**/*.{d.ts,cjs,js}");

Console.log(`Minify Starting`);

files.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");

  const parts: Record<string, string>[] = [];
  let lastIndex = 0;

  const regex = /\/\*\*[\s\S]*?\*\/|\/\*(?!\*)[\s\S]*?\*\//g;
  let match: RegExpExecArray | null = null;

  while ((match = regex.exec(content)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;

    if (start > lastIndex) {
      parts.push({ type: "code", content: content.slice(lastIndex, start) });
    }

    const isJsDoc = match[0].startsWith("/**");
    parts.push({ type: isJsDoc ? "jsdoc" : "comment", content: match[0] });
    lastIndex = end;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "code", content: content.slice(lastIndex) });
  }

  const result = parts
    .map((part) => {
      if (part.type === "jsdoc") {
        return `\n${part.content}\n`;
      }
      if (part.type === "comment") {
        return ` ${part.content.replace(/\n/g, " ").replace(/\s+/g, " ")} `;
      }
      return part.content
        .replace(/[\n\r\t]/g, "")
        .replace(/ {2,}/g, " ")
        .replace(/import\s+([^'"]+?)\s+from/g, (_, imp) => {
          const cleaned = imp
            .replace(/\{\s*/g, "{")
            .replace(/\s*\}/g, "}")
            .replace(/\s*,\s*/g, ",")
            .replace(/\s+/g, " ");
          return `import ${cleaned} from`;
        })
        .replace(/ ?([=:{},;()<>]) ?/g, "$1")
        .replace(/ +/g, " ")
        .trim();
    })
    .filter(Boolean)
    .join("");

  fs.writeFileSync(filePath, result, "utf-8");
  Console.log(`✔️  Minified: ${filePath}`);
});

Console.log(`✔️ ✔️ ✔️  Minify Finish`);
