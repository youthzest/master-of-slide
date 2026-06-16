import fs from 'fs';

const filePath = '/Users/almond-mac/Antigravity/옵시디언- 마스터오브 슬라이드/packages/core/src/app/components/ai-generator-modal.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');

const startIndex = lines.findIndex(line => line.includes('// Step 1: Text extrac'));
const endIndex = lines.findIndex((line, i) => i > startIndex && line.includes('const response = await fetch('));

if (startIndex !== -1 && endIndex !== -1) {
  const newPrompt = `      // Step 1: Text extraction
      const systemPrompt = \`[제약 사항]
1. 전체 슬라이드 개수는 표지 슬라이드를 제외하고 정확히 \${slideCount}장으로 나누어 요약해 주세요.
2. 각 슬라이드는 제목(title), 핵심 내용 리스트(bullets), 그리고 발표자 스크립트(notes)로 이루어져야 합니다.
3. bullets는 각 슬라이드당 3~5개 사이의 핵심 문장으로 채워주세요.
4. 모든 슬라이드 제목과 내용은 원문의 핵심 개념을 유실하지 않고 논리적으로 이어져야 합니다.
5. 언어는 한국어로 답변해 주세요.
6. 주의: 응답하는 JSON 배열 내의 각 객체의 Key 이름은 절대 번역하지 말고 반드시 영문 "title", "bullets", "notes" 로만 작성하세요.

[요청 사항]
\${customPrompt ? \\\`특별 요청 사항: \${customPrompt}\\\` : ''}

반드시 아래 JSON 스키마를 만족하는 JSON 배열 형태로만 응답하세요. 다른 설명 문구는 절대 추가하지 마세요:
[
  {
    "title": "실제 생성된 슬라이드 제목",
    "bullets": [
      "첫 번째 상세 요약 내용",
      "두 번째 상세 요약 내용",
      "세 번째 상세 요약 내용"
    ],
    "notes": "발표자가 이야기할 구어체 스크립트 내용 (30~80단어 사이)"
  }
]\`;

`;

  lines.splice(startIndex, endIndex - startIndex, newPrompt);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log("File fixed.");
} else {
  console.log("Could not find boundaries.");
}
