import fs from 'fs';

const filePath = '/Users/almond-mac/Antigravity/옵시디언- 마스터오브 슬라이드/packages/core/src/app/components/ai-generator-modal.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// The line is currently: ${customPrompt ? \`특별 요청 사항: ${customPrompt}\` : ''}
// It should be: ${customPrompt ? `특별 요청 사항: ${customPrompt}` : ''}

content = content.replace(
  /\\\`특별 요청 사항: \${customPrompt}\\\`/g,
  "`특별 요청 사항: ${customPrompt}`"
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Fixed backticks.");
