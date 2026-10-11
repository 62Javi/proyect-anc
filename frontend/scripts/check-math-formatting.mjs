#!/usr/bin/env node
/**
 * Linter y Verificador Automático de Notación Matemática (LaTeX / KaTeX).
 * 
 * Regla: Está terminantemente prohibido utilizar caracteres Unicode en texto plano
 * para subíndices/superíndices o notación matemática (ej. ₀, ₁, ₂, ᵢ, ₙ, Δx).
 * En su lugar, se debe usar <InlineMath math="..." /> o <MathText text="..." />.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src');

const FORBIDDEN_UNICODE_CHARS = [
  '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉',
  'ᵢ', 'ₙ',
  'Δx', 'Δt'
];

const EXEMPT_FILES = new Set([
  'MathText.tsx',
  'InlineMath.tsx',
]);

// Busca cadenas en texto JSX como >..._{n+1}...< en la misma línea
const RAW_LATEX_LEAK_REGEX = />[^<>\n]*_\{[a-zA-Z0-9+]+\}[^<>\n]*</g;

function scanDirectory(dir, violations = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath, violations);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      if (EXEMPT_FILES.has(entry.name)) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      const relativePath = path.relative(SRC_DIR, fullPath);

      lines.forEach((line, index) => {
        // 1. Check for forbidden unicode math subscripts
        for (const char of FORBIDDEN_UNICODE_CHARS) {
          if (line.includes(char)) {
            violations.push({
              file: relativePath,
              line: index + 1,
              type: 'UNICODE_SUB_LEAK',
              char,
              snippet: line.trim().slice(0, 100),
            });
            break;
          }
        }

        // 2. Check for raw LaTeX syntax leaked inside JSX children on the line
        const match = RAW_LATEX_LEAK_REGEX.exec(line);
        if (match) {
          violations.push({
            file: relativePath,
            line: index + 1,
            type: 'RAW_LATEX_LEAK',
            char: match[0],
            snippet: line.trim().slice(0, 100),
          });
        }
      });
    }
  }

  return violations;
}

console.log('🔍 [Verificación KaTeX/LaTeX] Analizando frontend/src por notación matemática incorrecta...');
const violations = scanDirectory(SRC_DIR);

if (violations.length === 0) {
  console.log('✅ [Verificación KaTeX/LaTeX] ¡Excelente! Todo el código cumple la regla de tipografía matemática.');
  process.exit(0);
} else {
  console.error(`❌ [Verificación KaTeX/LaTeX] Se encontraron ${violations.length} violaciones a la regla:`);
  violations.forEach((v) => {
    console.error(`   - ${v.file}:${v.line} [${v.type}] Carácter '${v.char}': "${v.snippet}"`);
  });
  console.error('\n⚠️ Solución: Reemplaza los caracteres Unicode o texto plano con <InlineMath math="..." /> o <MathText text="..." />.');
  process.exit(1);
}
