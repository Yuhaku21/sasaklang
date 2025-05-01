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
      if (!condMatch) throw new Error("Format lamun salah.");
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

        // Skip all genti and saklain blocks
        while (i < lines.length) {
          const next = lines[i].trim();
          if (next.startsWith("genti") || next.startsWith("saklain")) {
            i++;
            let depth = 1;
            while (i < lines.length && depth > 0) {
              const l = lines[i].trim();
              if (l === "{") depth++;
              else if (l === "}") depth--;
              i++;
            }
          } else break;
        }
      } else {
        let executed = false;
        while (i < lines.length) {
          const nextLine = lines[i].trim();
          if (nextLine.startsWith("genti")) {
            const gentiMatch = nextLine.match(/^genti\s*\((.+)\)\s*{$/);
            if (!gentiMatch) throw new Error("Format genti salah.");
            const gentiCond = gentiMatch[1];
            const gentiBlock = [];
            i++;
            let depth = 1;
            while (i < lines.length && depth > 0) {
              const l = lines[i].trim();
              if (l === "{") depth++;
              else if (l === "}") depth--;
              if (depth > 0) gentiBlock.push(lines[i]);
              i++;
            }
            if (!executed && evaluate(gentiCond)) {
              runLines(gentiBlock);
              executed = true;
            }
          } else if (nextLine.startsWith("saklain")) {
            const elseBlock = [];
            i++;
            let depth = 1;
            while (i < lines.length && depth > 0) {
              const l = lines[i].trim();
              if (l === "{") depth++;
              else if (l === "}") depth--;
              if (depth > 0) elseBlock.push(lines[i]);
              i++;
            }
            if (!executed) runLines(elseBlock);
            break;
          } else {
            break;
          }
        }
      }

      continue;
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
