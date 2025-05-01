const fs = require("fs");

let variables = {};

function evaluate(expr) {
  try {
    const safeExpr = expr.replace(/([a-zA-Z_]\w*)/g, (_, name) => {
      return variables.hasOwnProperty(name) ? `variables["${name}"]` : name;
    });
    return eval(safeExpr);
  } catch (e) {
    throw new Error("Ekspresi tidak valid: " + expr);
  }
}

function runLines(lines) {
  let i = 0;

  while (i < lines.length) {
    let line = lines[i].trim();

    if (!line || line.startsWith("//")) {
      i++;
      continue;
    }

    // Deklarasi variabel
    if (line.startsWith("let ") || line.startsWith("aran ") || line.startsWith("pire ")) {
      const match = line.match(/^(let|aran|pire)\s+(\w+)\s*=\s*(.+);$/);
      if (match) {
        const [, , nama, nilai] = match;
        variables[nama] = evaluate(nilai);
        i++;
        continue;
      }
    }

    // Print
    if (line.startsWith("leka(")) {
      const match = line.match(/^leka\s*\((.+)\);$/);
      if (match) {
        console.log(evaluate(match[1]));
        i++;
        continue;
      }
    }

    // If (lamun)
    if (line.startsWith("lamun")) {
      const condMatch = line.match(/^lamun\s*\((.+)\)\s*{$/);
      if (condMatch) {
        const cond = condMatch[1];
        const block = [];
        i++;
        let depth = 1;
        while (i < lines.length && depth > 0) {
          const current = lines[i].trim();
          if (current === "{") depth++;
          else if (current === "}") depth--;
          if (depth > 0) block.push(lines[i]);
          i++;
        }

        const conditionTrue = evaluate(cond);
        if (conditionTrue) {
          runLines(block);

          // Skip saklain block
          while (i < lines.length) {
            const next = lines[i].trim();
            if (next.startsWith("saklain")) {
              i++; // skip line with saklain {
              let depth = 1;
              while (i < lines.length && depth > 0) {
                const l = lines[i].trim();
                if (l === "{") depth++;
                else if (l === "}") depth--;
                i++;
              }
            } else {
              break;
            }
          }
        } else {
          // Check saklain
          if (i < lines.length && lines[i].trim().startsWith("saklain")) {
            const elseHeader = lines[i].trim();
            if (!elseHeader.endsWith("{")) throw new Error("saklain harus diikuti dengan {");
            const elseBlock = [];
            i++;
            let depth = 1;
            while (i < lines.length && depth > 0) {
              const current = lines[i].trim();
              if (current === "{") depth++;
              else if (current === "}") depth--;
              if (depth > 0) elseBlock.push(lines[i]);
              i++;
            }
            runLines(elseBlock);
          }
        }

        continue;
      }
    }

    throw new Error("Baris tidak dikenali: " + line);
  }
}

function runFile(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const lines = content.split(/\r?\n/);
  runLines(lines);
}

if (process.argv.length !== 3) {
  console.log("Pakai: node sasak_interpreter.js nama_file.sasak");
  process.exit(1);
}

runFile(process.argv[2]);
