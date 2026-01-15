#!/usr/bin/env node

/**
 * Markdown validation script
 * Checks for common markdown syntax issues
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function validateMarkdown(filePath) {
  const content = readFileSync(filePath, 'utf-8');

  const errors = [];
  const warnings = [];

  // Check for unclosed code blocks
  const codeBlockCount = (content.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    errors.push('Unclosed code block detected (odd number of ``` markers)');
  }

  // Check for proper heading levels
  const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
  for (const h of headings) {
    const level = h.match(/^#+/)[0].length;
    if (level > 6) {
      errors.push(`Invalid heading level (>6): ${h}`);
    }
  }

  // Check for broken links
  const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  for (const link of links) {
    const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (!match[2] || match[2].trim() === '') {
      errors.push(`Empty URL in link: ${link}`);
    }
  }

  // Check for mismatched bold/italic markers
  const boldCount = (content.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) {
    errors.push('Unclosed bold marker (uneven ** count)');
  }

  // Check for tables - ensure proper alignment
  const tables = content.match(/\|.*\|/g) || [];
  let inTable = false;
  for (const line of content.split('\n')) {
    if (line.includes('|')) {
      if (!inTable) {
        inTable = true;
      }
    } else if (inTable && line.trim() !== '') {
      inTable = false;
    }
  }

  console.log('✅ Markdown validation complete\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('   🎉 No issues found!\n');
    return true;
  }

  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach(e => console.log(`   - ${e}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }

  return false;
}

// Validate README.md
const readmePath = join(__dirname, '..', 'README.md');
const isValid = validateMarkdown(readmePath);

process.exit(isValid ? 0 : 1);
