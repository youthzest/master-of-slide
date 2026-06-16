import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: {
    bg: '#f4f0e8',
    text: '#15181d',
    accent: '#00a676', // Green
  },
  fonts: {
    display: '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
    body: '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
  },
  typeScale: {
    hero: 124,
    body: 34,
  },
  radius: 8,
};

const surface = '#fffaf1';
const ink = '#15181d';
const muted = '#66706f';
const line = '#d7d0c3';
const red = '#d94d42';
const blue = '#2c6bed';
const amber = '#e2a12c';
const violet = '#6d5bd0';

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
    @keyframes growX {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes pulseDot {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50%      { transform: scale(1.18); opacity: 1; }
    }
  `}</style>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 800,
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: ink,
      margin: 0,
      animation: 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
    }}
  >
    {children}
  </h1>
);

const SectionHeading = ({ children, color = 'var(--osd-accent)' }: { children: React.ReactNode; color?: string }) => (
  <div style={{ marginBottom: 48 }}>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 72,
        fontWeight: 800,
        color: ink,
        margin: '0 0 24px 0',
        animation: 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      {children}
    </h2>
    <div style={{ width: '100%', height: 2, background: color, transformOrigin: 'left', animation: 'growX 800ms cubic-bezier(0.16, 1, 0.3, 1) both' }} />
  </div>
);

const Footer = ({ page, section, total = 10 }: { page: number; section: string; total?: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 118,
      right: 118,
      bottom: 38,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `2px solid ${line}`,
      paddingTop: 16,
      color: muted,
      fontSize: 22,
      fontWeight: 700,
    }}
  >
    <span>{section}</span>
    <span>{String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>
);

const Eyebrow = ({ children, color = 'var(--osd-accent)' }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--osd-font-display)',
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.02em',
      color,
      marginBottom: 32,
    }}
  >
    <span style={{ width: 32, height: 2, background: color }} />
    {children}
  </div>
);

const Photo = ({ src, alt }: { src: string; alt: string }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${line}`,
      animation: 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
    }}
  >
    <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
);

const PullQuote = ({ children, color = 'var(--osd-accent)' }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      fontSize: 48,
      fontWeight: 800,
      color: ink,
      lineHeight: 1.4,
      borderLeft: `6px solid ${color}`,
      paddingLeft: 40,
      margin: '48px 0',
      animation: 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both',
    }}
  >
    {children}
  </div>
);

// --- Pages ---

const P01_Cover: Page = () => (
  <div style={{ ...fill, display: 'flex' }}>
    <SharedStyles />
    <div style={{ flex: 1, padding: '118px' }}>
      <Eyebrow color={blue}>TECHNOLOGY REPORT</Eyebrow>
      <Title>안티그래비티<br />집중 실습</Title>
      <PullQuote color={blue}>
        단순한 챗봇을 넘어선<br />
        '에이전트 AI'의 개념 이해와 실전 가이드.
      </PullQuote>
      <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.55 }}>
        업무 자동화 및 효율성 극대화를 위한 도입 방안.
      </p>
    </div>
    <div style={{ width: 700, padding: '40px 40px 40px 0' }}>
      <Photo src="../antigravity-1hour-workshop/assets/cover_art.png" alt="Hero Art" />
    </div>
    <Footer page={1} section="1HOUR WORKSHOP" />
  </div>
);

const P02_Intro: Page = () => (
  <div style={{ ...fill, padding: '82px 118px' }}>
    <SharedStyles />
    <Eyebrow color={amber}>CHAPTER 01</Eyebrow>
    <SectionHeading color={amber}>자판기와 비서</SectionHeading>
    <div style={{ display: 'flex', gap: 64, marginTop: 48 }}>
      <div style={{ flex: 1, padding: 48, background: surface, borderRadius: 'var(--osd-radius)', border: `1px solid ${line}` }}>
        <h3 style={{ fontSize: 40, fontWeight: 800, color: muted, marginBottom: 24 }}>일반 챗봇 (자판기)</h3>
        <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.55 }}>
          질문을 입력하면 단편적인 답변만 출력합니다. 답변을 복사하고 붙여넣는 일은 여전히 사용자의 몫입니다.
        </p>
      </div>
      <div style={{ flex: 1, padding: 48, background: '#fff', borderRadius: 'var(--osd-radius)', border: `2px solid ${amber}`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -12, right: -12, width: 24, height: 24, borderRadius: '50%', background: amber, animation: 'pulseDot 2s infinite' }} />
        <h3 style={{ fontSize: 40, fontWeight: 800, color: ink, marginBottom: 24 }}>안티그래비티 (비서)</h3>
        <p style={{ fontSize: 'var(--osd-size-body)', color: ink, lineHeight: 1.55, fontWeight: 500 }}>
          질문이 아닌 구체적인 '행동'을 지시합니다. 파일 생성, 정리, 분류 등 워크플로우를 스스로 실행합니다.
        </p>
      </div>
    </div>
    <Footer page={2} section="도입" />
  </div>
);

const P03_Concept: Page = () => (
  <div style={{ ...fill, padding: '82px 118px' }}>
    <SharedStyles />
    <div style={{ display: 'flex', gap: 64, height: '80%' }}>
      <div style={{ flex: 1 }}>
        <Photo src="../antigravity-1hour-workshop/assets/concept_diagram.png" alt="Concept Diagram" />
      </div>
      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Eyebrow color={amber}>CORE PRINCIPLES</Eyebrow>
        <SectionHeading color={amber}>에이전트의 작동 원리</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            ['Autonomy', '사용자가 직접 마우스를 쥐고 키보드를 치듯 스스로 판단하고 작동합니다.'],
            ['Execution', '단순 텍스트 생성을 넘어 시스템 내 파일 입출력 등을 제어합니다.'],
            ['Instruction', '단편적인 질문 대신 명확한 목표가 있는 심부름을 지시해야 합니다.']
          ].map(([title, desc], i) => (
            <div key={i}>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: amber, margin: '0 0 8px 0' }}>{title}</h3>
              <p style={{ fontSize: 24, color: ink, margin: 0, fontWeight: 500 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer page={3} section="도입" />
  </div>
);

const P04_Prac1: Page = () => (
  <div style={{ ...fill, padding: '82px 118px', background: surface }}>
    <SharedStyles />
    <Eyebrow color={violet}>CHAPTER 02</Eyebrow>
    <SectionHeading color={violet}>비서에게 생명 불어넣기</SectionHeading>
    <PullQuote color={violet}>
      똑똑한 비서가 일하려면<br />제미나이(Gemini) 모델과 같은<br />강력한 인공지능 두뇌와 연결을 해주어야 합니다.
    </PullQuote>
    <div style={{ background: ink, padding: 48, borderRadius: 'var(--osd-radius)', color: '#fff', marginTop: 80 }}>
      <p style={{ fontSize: 'var(--osd-size-body)', margin: 0, lineHeight: 1.55 }}>
        aistudio.google.com 에 접속하여 API 키를 발급받고 안티그래비티에 입력하는 과정이 에이전트 구동의 첫걸음입니다.
      </p>
    </div>
    <Footer page={4} section="실습 1" />
  </div>
);

const P05_Prac2: Page = () => (
  <div style={{ ...fill, padding: '82px 118px' }}>
    <SharedStyles />
    <Eyebrow color={violet}>PRACTICE 01</Eyebrow>
    <SectionHeading color={violet}>첫 번째 심부름: 기초 행정 업무</SectionHeading>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.55, marginBottom: 48 }}>
      단순 폴더 생성 및 문서 작성 작업을 비서에게 일임합니다.
    </p>
    <div style={{ background: surface, padding: 64, borderRadius: 'var(--osd-radius)', border: `1px solid ${line}` }}>
      <p style={{ fontSize: 44, lineHeight: 1.6, margin: 0, fontWeight: 700, color: ink }}>
        "바탕화면에 <span style={{ color: violet }}>2026년_교회행정</span> 폴더를 만들고,<br />
        그 안에 <span style={{ color: violet }}>환영인사.txt</span> 파일을 생성해.<br />
        내용은 '우리 교회에 오신 것을 환영합니다!'로 채워줘."
      </p>
    </div>
    <Footer page={5} section="실습 2" />
  </div>
);

const P06_Prac3: Page = () => (
  <div style={{ ...fill, padding: '82px 118px' }}>
    <SharedStyles />
    <div style={{ display: 'flex', gap: 64, height: '80%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Eyebrow color={'var(--osd-accent)'}>PRACTICE 02</Eyebrow>
        <SectionHeading color={'var(--osd-accent)'}>AI 문서 리서치</SectionHeading>
        <p style={{ fontSize: 'var(--osd-size-body)', color: ink, lineHeight: 1.55, fontWeight: 500, marginBottom: 32 }}>
          "요한복음 설교 뼈대 파일을 읽고 어울리는 '찰스 스펄전' 예화를 찾아 스펄전_설교예화.md 파일로 정리해줘."
        </p>
        <p style={{ fontSize: 24, color: muted, lineHeight: 1.55 }}>
          일반 챗봇이었다면 화면에 출력된 텍스트를 사람이 복사하고, 문서를 생성해 붙여넣는 과정을 거쳐야 합니다. 하지만 에이전트는 작성의 전 과정을 스스로 마무리합니다.
        </p>
      </div>
      <div style={{ flex: 1 }}>
        <Photo src="../antigravity-1hour-workshop/assets/ai_research.png" alt="AI Research" />
      </div>
    </div>
    <Footer page={6} section="실습 3" />
  </div>
);

const P07_Prac4: Page = () => (
  <div style={{ ...fill, padding: '82px 118px' }}>
    <SharedStyles />
    <div style={{ display: 'flex', gap: 64, height: '80%' }}>
      <div style={{ flex: 1 }}>
        <Photo src="../antigravity-1hour-workshop/assets/auto_sorting.png" alt="Auto Sorting" />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Eyebrow color={red}>PRACTICE 03</Eyebrow>
        <SectionHeading color={red}>대량 문서 자동 분류</SectionHeading>
        <PullQuote color={red}>
          "이 5개 파일을 모두 읽어보고 내용에 따라 폴더로 스스로 분류시켜."
        </PullQuote>
        <p style={{ fontSize: 24, color: muted, lineHeight: 1.55 }}>
          주보 광고, 심방 기록, 설교 메모 등 수십 개의 파일이 뒤섞인 폴더는 사람이 직접 하나씩 열어보고 내용을 파악하여 옮겨야 하는 비효율적인 작업입니다. 에이전트는 이를 완벽하게 자동화합니다.
        </p>
      </div>
    </div>
    <Footer page={7} section="실습 4" />
  </div>
);

const P08_WrapUp: Page = () => (
  <div style={{ ...fill, padding: '118px', background: ink }}>
    <SharedStyles />
    <Eyebrow color={'#fff'}>NEXT STEP</Eyebrow>
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 72, fontWeight: 800, color: '#fff', margin: '0 0 24px 0', animation: 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        지식 그물망으로의 연결
      </h2>
      <div style={{ width: '100%', height: 2, background: surface, transformOrigin: 'left', animation: 'growX 800ms cubic-bezier(0.16, 1, 0.3, 1) both' }} />
    </div>
    <PullQuote color={amber}>
      <span style={{ color: '#fff' }}>이제 AI에게는 단순한 질문을 넘어<br />'직접적인 행동과 워크플로우'를 지시할 수 있습니다.</span>
    </PullQuote>
    <p style={{ fontSize: 'var(--osd-size-body)', color: '#d7d0c3', lineHeight: 1.55, marginTop: 48 }}>
      다음 과정에서는 에이전트가 자동 생성한 수많은 파일들을 거대한 거미줄 지식망인 '옵시디언(Obsidian)' 툴에 어떻게 효율적으로 쓸어 담고 연결할지 알아봅니다.
    </p>
    <Footer page={8} total={8} section="마무리" />
  </div>
);

export const meta: SlideMeta = { title: '안티그래비티 매거진 런칭' };

export const narration: (string | undefined)[] = [
  '안녕하세요. 에이전트 AI 개념을 다루는 안티그래비티 워크샵입니다.',
  '일반 챗봇은 자판기입니다. 안티그래비티는 직접 행동하는 비서입니다.',
  '에이전트의 핵심 원리는 자율성과 실행력입니다.',
  '이 비서가 일할 수 있도록 구글 제미나이와 연결해야 합니다.',
  '첫 실습으로 행정 업무 자동화를 테스트해봅니다.',
  '두 번째는 AI를 활용한 문맥 기반 리서치 자동화입니다.',
  '세 번째는 대량의 어지러운 문서를 성격에 맞게 자동 분류하는 기능입니다.',
  '수고하셨습니다. 다음 시간에는 이렇게 생성된 지식들을 옵시디언으로 엮어내는 방법을 배웁니다.'
];

export default [
  P01_Cover,
  P02_Intro,
  P03_Concept,
  P04_Prac1,
  P05_Prac2,
  P06_Prac3,
  P07_Prac4,
  P08_WrapUp
] satisfies Page[];
