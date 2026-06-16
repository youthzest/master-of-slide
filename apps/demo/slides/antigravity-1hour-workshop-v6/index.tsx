import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: {
    bg: '#000000',
    text: '#E5E5E5',
    accent: '#C8A951', // Cinematic Gold
  },
  fonts: {
    display: '"Playfair Display", "Times New Roman", "Pretendard", "KoPub Batang", serif',
    body: '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", system-ui, sans-serif',
  },
  typeScale: {
    hero: 130,
    body: 32,
  },
  radius: 0,
};

const surface = '#0A0A0A';
const muted = '#707070';
const line = '#222222';
const gold = '#C8A951';

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
    @keyframes cinematicFade {
      from { opacity: 0; filter: blur(10px); transform: scale(1.02); }
      to   { opacity: 1; filter: blur(0px); transform: scale(1); }
    }
    @keyframes fadeUpSlow {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes drawLine {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes slowZoom {
      from { transform: scale(1); }
      to   { transform: scale(1.05); }
    }
  `}</style>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: '#FFFFFF',
      margin: 0,
      animation: 'cinematicFade 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
    }}
  >
    {children}
  </h1>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 64 }}>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 80,
        fontWeight: 400,
        color: '#FFFFFF',
        margin: '0 0 24px 0',
        animation: 'fadeUpSlow 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
      }}
    >
      {children}
    </h2>
    <div style={{ width: 120, height: 1, background: gold, transformOrigin: 'left', animation: 'drawLine 1.5s ease-out 500ms both' }} />
  </div>
);

const Footer = ({ page }: { page: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      bottom: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: muted,
      fontSize: 20,
      fontFamily: 'var(--osd-font-display)',
      letterSpacing: '0.2em',
      animation: 'cinematicFade 3s both',
    }}
  >
    A N T I G R A V I T Y &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; {String(page).padStart(2, '0')}
  </div>
);

const NoirPhoto = ({ src, alt }: { src: string; alt: string }) => (
  <div
    style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden',
      zIndex: 0,
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
    <img 
      src={src} 
      alt={alt} 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover', 
        filter: 'grayscale(100%) contrast(1.2) brightness(0.7)',
        animation: 'slowZoom 20s linear infinite alternate',
      }} 
    />
  </div>
);

const PullQuote = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 56,
      fontWeight: 400,
      fontStyle: 'italic',
      color: gold,
      lineHeight: 1.4,
      textAlign: 'center',
      margin: '64px auto',
      maxWidth: 1000,
      animation: 'fadeUpSlow 2s cubic-bezier(0.2, 0.8, 0.2, 1) 300ms both',
    }}
  >
    "{children}"
  </div>
);

// --- Pages ---

const P01_Cover: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
    <SharedStyles />
    <NoirPhoto src="../antigravity-1hour-workshop/assets/cover_art.png" alt="Hero Art" />
    <div style={{ zIndex: 2, position: 'relative' }}>
      <div style={{ color: gold, letterSpacing: '0.4em', fontSize: 20, marginBottom: 40, animation: 'cinematicFade 2s 500ms both' }}>
        DIRECTED BY AI
      </div>
      <Title>안티그래비티<br />집중 실습</Title>
      <div style={{ width: 1, height: 80, background: gold, margin: '40px auto', animation: 'drawLine 2s ease-out 1s both', transformOrigin: 'top' }} />
      <p style={{ fontSize: 28, color: '#A0A0A0', letterSpacing: '0.1em', animation: 'fadeUpSlow 2s 1.5s both' }}>
        THE AGE OF AGENTIC AI
      </p>
    </div>
    <Footer page={1} />
  </div>
);

const P02_Intro: Page = () => (
  <div style={{ ...fill, padding: '120px' }}>
    <SharedStyles />
    <NoirPhoto src="../antigravity-1hour-workshop/assets/concept_diagram.png" alt="Concept" />
    <div style={{ zIndex: 2, position: 'relative', width: '60%' }}>
      <div style={{ color: muted, letterSpacing: '0.2em', fontSize: 18, marginBottom: 24 }}>SCENE 01 / PARADIGM</div>
      <SectionHeading>자판기와 비서</SectionHeading>
      <div style={{ borderLeft: `1px solid ${line}`, paddingLeft: 40, marginTop: 40 }}>
        <h3 style={{ fontSize: 32, fontWeight: 300, color: '#FFF', marginBottom: 16 }}>일반 챗봇 (Vending Machine)</h3>
        <p style={{ fontSize: 24, color: '#A0A0A0', lineHeight: 1.6, marginBottom: 48, fontWeight: 300 }}>
          질문을 입력하면 단편적인 답변만 떨어집니다. 차가운 텍스트의 나열일 뿐, 실행은 인간의 몫입니다.
        </p>
        <h3 style={{ fontSize: 32, fontWeight: 300, color: gold, marginBottom: 16 }}>안티그래비티 (The Assistant)</h3>
        <p style={{ fontSize: 24, color: '#E5E5E5', lineHeight: 1.6, fontWeight: 300 }}>
          구체적인 '행동'을 지시받고 어둠 속에서 스스로 움직입니다. 워크플로우를 완벽하게 집행합니다.
        </p>
      </div>
    </div>
    <Footer page={2} />
  </div>
);

const P03_Concept: Page = () => (
  <div style={{ ...fill, padding: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <SharedStyles />
    <div style={{ zIndex: 2, position: 'relative' }}>
      <PullQuote>
        사용자가 직접 마우스를 쥐고 키보드를 치듯,<br />어둠 속에서 스스로 판단하고 집행합니다.
      </PullQuote>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 120, marginTop: 80, textAlign: 'center' }}>
        {[
          ['01', 'AUTONOMY', '자율적 판단'],
          ['02', 'EXECUTION', '시스템 장악'],
          ['03', 'INSTRUCTION', '명령의 집행']
        ].map(([num, eng, kor], i) => (
          <div key={i} style={{ animation: `fadeUpSlow 2s ${i * 400 + 800}ms both` }}>
            <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 48, color: line, marginBottom: 16 }}>{num}</div>
            <div style={{ fontSize: 18, letterSpacing: '0.2em', color: gold, marginBottom: 8 }}>{eng}</div>
            <div style={{ fontSize: 24, color: muted }}>{kor}</div>
          </div>
        ))}
      </div>
    </div>
    <Footer page={3} />
  </div>
);

const P04_Prac1: Page = () => (
  <div style={{ ...fill, padding: '120px', background: surface }}>
    <SharedStyles />
    <div style={{ zIndex: 2, position: 'relative' }}>
      <div style={{ color: muted, letterSpacing: '0.2em', fontSize: 18, marginBottom: 24 }}>SCENE 02 / AWAKENING</div>
      <SectionHeading>비서에게 생명 불어넣기</SectionHeading>
      <p style={{ fontSize: 36, color: '#FFF', lineHeight: 1.6, fontWeight: 300, maxWidth: 900, marginTop: 64 }}>
        제미나이(Gemini)라는 거대한 지능과 연결되는 순간, 멈춰있던 시스템이 박동하기 시작합니다.
      </p>
      <div style={{ marginTop: 80, padding: 64, border: `1px solid ${line}`, background: '#000' }}>
        <div style={{ fontSize: 24, color: gold, letterSpacing: '0.1em', marginBottom: 24 }}>TARGET: aistudio.google.com</div>
        <p style={{ fontSize: 24, color: '#A0A0A0', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
          API 키를 발급받아 시스템의 심장부에 입력하십시오. 이것이 모든 것의 시작입니다.
        </p>
      </div>
    </div>
    <Footer page={4} />
  </div>
);

const P05_Prac2: Page = () => (
  <div style={{ ...fill, padding: '120px' }}>
    <SharedStyles />
    <NoirPhoto src="../antigravity-1hour-workshop/assets/ai_research.png" alt="Typewriter" />
    <div style={{ zIndex: 2, position: 'relative', width: '70%', background: 'rgba(0,0,0,0.85)', padding: 80, border: `1px solid ${line}` }}>
      <div style={{ color: gold, letterSpacing: '0.2em', fontSize: 18, marginBottom: 24 }}>MISSION 01</div>
      <SectionHeading>문서 리서치 집행</SectionHeading>
      <p style={{ fontSize: 32, color: '#FFF', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 40, fontFamily: 'var(--osd-font-display)' }}>
        "요한복음 뼈대 파일을 읽고 찰스 스펄전의 예화를 찾아 새 문서로 완벽하게 정리하라."
      </p>
      <p style={{ fontSize: 24, color: '#A0A0A0', lineHeight: 1.6, fontWeight: 300 }}>
        인간이 직접 브라우저를 열고, 복사하고, 붙여넣는 지난한 노동은 끝났습니다. 에이전트는 명령을 수령하는 즉시 보이지 않는 곳에서 리서치와 작문을 완료하고 바탕화면에 결과물을 떨어뜨립니다.
      </p>
    </div>
    <Footer page={5} />
  </div>
);

const P06_Prac3: Page = () => (
  <div style={{ ...fill, padding: '120px' }}>
    <SharedStyles />
    <div style={{ zIndex: 2, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
      <div style={{ color: muted, letterSpacing: '0.2em', fontSize: 18, marginBottom: 24 }}>MISSION 02</div>
      <div style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 80, fontWeight: 400, color: '#FFFFFF', margin: '0 0 24px 0', animation: 'fadeUpSlow 1.5s both' }}>
          대량 문서 자동 분류
        </h2>
        <div style={{ width: 120, height: 1, background: gold, float: 'right', animation: 'drawLine 1.5s ease-out 500ms both' }} />
      </div>
      <div style={{ clear: 'both' }} />
      <p style={{ fontSize: 36, color: '#FFF', lineHeight: 1.6, maxWidth: 900, marginTop: 40, fontWeight: 300 }}>
        혼돈 속에 섞여 있는 수십 개의 문서들.<br />에이전트는 그 내용의 본질을 꿰뚫어 봅니다.
      </p>
      <p style={{ fontSize: 24, color: gold, lineHeight: 1.6, maxWidth: 800, marginTop: 40, fontStyle: 'italic', fontFamily: 'var(--osd-font-display)' }}>
        "이 5개 파일을 모두 읽어보고 내용에 따라 폴더로 스스로 분류시켜라."
      </p>
    </div>
    <NoirPhoto src="../antigravity-1hour-workshop/assets/auto_sorting.png" alt="Sorting" />
  </div>
);

const P07_WrapUp: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
    <SharedStyles />
    <div style={{ zIndex: 2, position: 'relative', background: '#000', padding: '120px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ color: gold, letterSpacing: '0.4em', fontSize: 20, marginBottom: 64, animation: 'cinematicFade 2s 500ms both' }}>
        THE END OF THE BEGINNING
      </div>
      <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 96, fontWeight: 400, color: '#FFFFFF', margin: '0 0 64px 0', animation: 'fadeUpSlow 2s 1s both' }}>
        지식 그물망으로의 연결
      </h2>
      <p style={{ fontSize: 32, color: '#A0A0A0', lineHeight: 1.6, fontWeight: 300, animation: 'fadeUpSlow 2s 1.5s both' }}>
        단순한 대화를 넘어, 시스템의 통제권을 쥔 AI.<br />
        다음은 이 에이전트가 쏟아내는 지식들을 '옵시디언'이라는<br />
        거대한 심연의 그물망으로 엮어내는 방법을 마주할 차례입니다.
      </p>
    </div>
    <Footer page={7} />
  </div>
);

export const meta: SlideMeta = { title: '안티그래비티 Cinematic Noir' };

export default [
  P01_Cover,
  P02_Intro,
  P03_Concept,
  P04_Prac1,
  P05_Prac2,
  P06_Prac3,
  P07_WrapUp
] satisfies Page[];
