import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: {
    bg: '#ffffff',
    text: '#000000',
    accent: '#0070f3', // Vercel Blue
  },
  fonts: {
    display: '"Geist", "Inter", "Pretendard", system-ui, sans-serif',
    body: '"Geist", "Inter", "Pretendard", system-ui, sans-serif',
  },
  typeScale: {
    hero: 140, // Adjusted slightly for Korean
    body: 28,
  },
  radius: 12,
};

const surface = '#fafafa';
const muted = '#666666';
const subtle = '#a1a1a1';
const border = '#eaeaea';
const blue = '#0070f3';
const pink = '#ff0080';
const cyan = '#50e3c2';
const purple = '#7928ca';

const fill = {
  width: '100%',
  height: '100%',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
} as const;

const SharedStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes stream {
      0%   { transform: translateX(-30px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.55; }
      50%      { opacity: 1; }
    }
    @keyframes drawLine {
      from { stroke-dashoffset: 1000; }
      to   { stroke-dashoffset: 0; }
    }
    .mono { font-family: "Geist Mono", "SF Mono", monospace; }
    .card { background: ${surface}; border: 1px solid ${border}; border-radius: var(--osd-radius); padding: 40px; }
  `}</style>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: '-0.04em',
      color: '#000000',
      margin: 0,
      animation: 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
    }}
  >
    {children}
  </h1>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 48 }}>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 72,
        fontWeight: 700,
        letterSpacing: '-0.04em',
        color: '#000000',
        margin: '0 0 16px 0',
        animation: 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      {children}
    </h2>
  </div>
);

const Footer = ({ page, total }: { page: number; total: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 96,
      right: 96,
      bottom: 48,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: '"Geist Mono", "SF Mono", monospace',
      fontSize: 18,
      letterSpacing: '0.04em',
      color: subtle,
      borderTop: `1px solid ${border}`,
      paddingTop: 16,
    }}
  >
    <span>OBSIDIAN KNOWLEDGE GRAPH</span>
    <span>{String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>
);

const Eyebrow = ({ children, color = blue }: { children: React.ReactNode; color?: string }) => (
  <div
    className="mono"
    style={{
      display: 'inline-block',
      fontSize: 18,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color,
      borderBottom: `2px solid ${color}`,
      paddingBottom: 4,
      marginBottom: 32,
    }}
  >
    {children}
  </div>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <div
    className="mono"
    style={{
      background: '#000',
      color: '#fff',
      padding: '24px 32px',
      borderRadius: 'var(--osd-radius)',
      fontSize: 20,
      lineHeight: 1.6,
      animation: 'fadeUp 800ms 200ms both',
    }}
  >
    {children}
  </div>
);

// --- Pages ---

const P01_Cover: Page = () => (
  <div style={{ ...fill, padding: '96px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <SharedStyles />
    <Eyebrow color={blue}>SYSTEM ARCHITECTURE</Eyebrow>
    <Title>지식 그물망:<br />옵시디언 연결</Title>
    <div style={{ marginTop: 40, width: 80, height: 2, background: '#000', animation: 'fadeUp 800ms 200ms both' }} />
    <p style={{ fontSize: 36, color: muted, letterSpacing: '-0.02em', marginTop: 40, fontWeight: 500, animation: 'fadeUp 800ms 400ms both' }}>
      흩어진 데이터를 영구적인 두 번째 뇌(Second Brain)로 통합하는<br />가장 완벽한 파이프라인.
    </p>
    <Footer page={1} total={6} />
  </div>
);

const P02_Problem: Page = () => (
  <div style={{ ...fill, padding: '96px', display: 'flex', gap: 64 }}>
    <SharedStyles />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Eyebrow color={pink}>THE PROBLEM</Eyebrow>
      <SectionHeading>파편화된 지식의 무덤</SectionHeading>
      <p style={{ fontSize: 32, color: muted, lineHeight: 1.6, animation: 'fadeUp 800ms 200ms both' }}>
        유튜브 요약본, PDF 텍스트, 메신저 대화, 번뜩이는 아이디어 메모...<br /><br />
        기존의 폴더 방식 시스템에서는 한 번 저장된 데이터는 서로 <b>고립</b>되어 다시는 발견되지 않는 '지식의 무덤'에 갇히게 됩니다.
      </p>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
      {['Desktop/youtube_summary.txt', 'Documents/Sermon/2026_idea.pdf', 'Downloads/meeting_notes.docx'].map((text, i) => (
        <div key={i} className="card mono" style={{ display: 'flex', alignItems: 'center', gap: 16, animation: `fadeUp 800ms ${300 + i * 150}ms both` }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: pink, animation: 'pulse 2s infinite' }} />
          {text}
        </div>
      ))}
    </div>
    <Footer page={2} total={6} />
  </div>
);

const P03_Solution: Page = () => (
  <div style={{ ...fill, padding: '96px', display: 'flex', gap: 64 }}>
    <SharedStyles />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Eyebrow color={cyan}>THE SOLUTION</Eyebrow>
      <SectionHeading>뇌세포처럼 연결하라</SectionHeading>
      <p style={{ fontSize: 32, color: muted, lineHeight: 1.6, animation: 'fadeUp 800ms 200ms both' }}>
        옵시디언(Obsidian)은 폴더 대신 <b>링크(`[[ ]]`)</b>를 사용합니다.<br />하나의 아이디어는 다른 문서들과 양방향으로 강하게 결합하여 거대한 지식망(Knowledge Graph)을 형성합니다.
      </p>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <CodeBlock>
        <span style={{ color: muted }}># 요한복음 1장 요약</span><br /><br />
        태초에 말씀이 계시니라.<br />
        이 말씀이 하나님과 함께 계셨으니...<br /><br />
        <span style={{ color: subtle }}>관련 생각:</span><br />
        이 구절은 <span style={{ color: cyan }}>[[찰스 스펄전의 설교]]</span>와 맞닿아 있다.<br />
        또한 <span style={{ color: cyan }}>[[빛과 어둠의 메타포]]</span> 문서 참조 요망.
      </CodeBlock>
    </div>
    <Footer page={3} total={6} />
  </div>
);

const P04_Graph: Page = () => (
  <div style={{ ...fill, padding: '96px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <SharedStyles />
    <Eyebrow color={purple}>GRAPH VIEW</Eyebrow>
    <SectionHeading>시각화된 나의 두 번째 뇌</SectionHeading>
    
    <div style={{ position: 'relative', width: 800, height: 450, marginTop: 40, border: `1px solid ${border}`, borderRadius: 'var(--osd-radius)', background: surface, overflow: 'hidden' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Connection Lines */}
        {[
          [400, 225, 200, 150], [400, 225, 600, 100], [400, 225, 700, 350], 
          [400, 225, 250, 380], [200, 150, 100, 200], [600, 100, 750, 150]
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={border} strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: `drawLine 2s ease-out ${i * 200}ms forwards` }} />
        ))}
        {/* Nodes */}
        <circle cx="400" cy="225" r="16" fill={purple} style={{ animation: 'fadeUp 500ms 200ms both' }} />
        <circle cx="200" cy="150" r="10" fill={blue} style={{ animation: 'fadeUp 500ms 400ms both' }} />
        <circle cx="600" cy="100" r="12" fill={cyan} style={{ animation: 'fadeUp 500ms 600ms both' }} />
        <circle cx="700" cy="350" r="8" fill={pink} style={{ animation: 'fadeUp 500ms 800ms both' }} />
        <circle cx="250" cy="380" r="10" fill={blue} style={{ animation: 'fadeUp 500ms 1000ms both' }} />
        <circle cx="100" cy="200" r="6" fill={muted} style={{ animation: 'fadeUp 500ms 1200ms both' }} />
        <circle cx="750" cy="150" r="8" fill={muted} style={{ animation: 'fadeUp 500ms 1400ms both' }} />
      </svg>
      
      <div style={{ position: 'absolute', top: 245, left: 350, fontSize: 18, fontWeight: 700, background: '#fff', padding: '4px 8px', borderRadius: 4, border: `1px solid ${border}` }}>로마서 강해</div>
      <div style={{ position: 'absolute', top: 110, left: 620, fontSize: 14, color: muted }}>유튜브_바울요약.md</div>
    </div>
    
    <Footer page={4} total={6} />
  </div>
);

const P05_Pipeline: Page = () => (
  <div style={{ ...fill, padding: '96px', display: 'flex', gap: 64 }}>
    <SharedStyles />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Eyebrow color={blue}>THE PIPELINE</Eyebrow>
      <SectionHeading>오류율 0%의 파이프라인</SectionHeading>
      <p style={{ fontSize: 24, color: muted, lineHeight: 1.6, animation: 'fadeUp 800ms 200ms both' }}>
        이 거대한 지식망과 방금 우리가 만든 텔레그램 AI 봇이 결합하면, 궁극의 프레젠테이션 자동화 시스템이 완성됩니다.
      </p>
    </div>
    
    <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
      {[
        ['01. 수집', '유튜브, 웹 문서 등을 AI 비서가 옵시디언(.md)에 요약 저장'],
        ['02. 보관 및 연결', '옵시디언 내에서 다른 지식들과 결합 및 보관 (Knowledge Graph)'],
        ['03. 호출', 'PPT가 필요할 때 텔레그램 봇에게 옵시디언 파일 전송'],
        ['04. 렌더링', '에이전트가 마크다운 텍스트를 인식해 코드로 된 명품 슬라이드 즉각 생성']
      ].map(([step, desc], i) => (
        <div key={i} className="card" style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '24px', animation: `stream 800ms ${i * 200}ms both` }}>
          <div className="mono" style={{ fontSize: 20, color: blue, fontWeight: 700 }}>{step}</div>
          <div style={{ fontSize: 20, color: '#000', fontWeight: 500 }}>{desc}</div>
        </div>
      ))}
    </div>
    <Footer page={5} total={6} />
  </div>
);

const P06_Outro: Page = () => (
  <div style={{ ...fill, padding: '96px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
    <SharedStyles />
    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, animation: 'fadeUp 800ms both' }}>
      <div style={{ width: 24, height: 24, background: '#fff', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
    </div>
    <Title>지식을 장악하다</Title>
    <p style={{ fontSize: 32, color: muted, letterSpacing: '-0.02em', marginTop: 40, lineHeight: 1.6, maxWidth: 900, animation: 'fadeUp 800ms 300ms both' }}>
      이제 데이터는 휘발되지 않고 목사님의 두뇌와 시스템 속에 영원히 연결됩니다.<br />필요할 땐 언제든 가장 아름다운 형태로 세상에 꺼내어 놓으십시오.
    </p>
    <Footer page={6} total={6} />
  </div>
);

export const meta: SlideMeta = { title: '옵시디언 지식 그물망 가이드' };

export default [
  P01_Cover,
  P02_Problem,
  P03_Solution,
  P04_Graph,
  P05_Pipeline,
  P06_Outro
] satisfies Page[];
