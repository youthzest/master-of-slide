import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: {
    bg: '#0A0A2A', // Deep Cyber Blue
    text: '#FFFFFF',
    accent: '#FF00FF', // Hot Magenta
  },
  fonts: {
    display: '"Arial Black", "Impact", "Pretendard", system-ui, sans-serif',
    body: '"Courier New", "Pretendard", monospace, sans-serif',
  },
  typeScale: {
    hero: 100,
    body: 28,
  },
  radius: 20, // Bubbly borders
};

const pink = '#FF00FF';
const cyan = '#00FFFF';
const lime = '#39FF14';
const silver = '#E0E0E0';

const fill = {
  width: '100%',
  height: '100%',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
  overflow: 'hidden',
} as const;

const SharedStyles = () => (
  <style>{`
    @keyframes y2kBounce {
      0% { transform: scale(0.8) translateY(50px); opacity: 0; }
      50% { transform: scale(1.1) translateY(-10px); opacity: 1; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    @keyframes glitch {
      0% { text-shadow: 2px 0 ${pink}, -2px 0 ${cyan}; }
      50% { text-shadow: -2px 0 ${pink}, 2px 0 ${cyan}; }
      100% { text-shadow: 2px 0 ${pink}, -2px 0 ${cyan}; }
    }
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    @keyframes rotateStar {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .y2k-panel {
      background: rgba(255, 0, 255, 0.1);
      border: 4px dotted ${cyan};
      border-radius: var(--osd-radius);
      box-shadow: 8px 8px 0px ${pink};
    }
  `}</style>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 900,
      lineHeight: 1.1,
      color: '#FFFFFF',
      textTransform: 'uppercase',
      WebkitTextStroke: `2px ${pink}`,
      textShadow: `6px 6px 0px ${cyan}`,
      margin: 0,
      animation: 'y2kBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
    }}
  >
    {children}
  </h1>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 40, display: 'inline-block' }}>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 900,
        color: lime,
        textShadow: `4px 4px 0px ${pink}`,
        margin: 0,
        animation: 'y2kBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 100ms both',
      }}
    >
      ★ {children} ★
    </h2>
  </div>
);

const MarqueeBar = ({ text }: { text: string }) => (
  <div style={{ width: '100%', overflow: 'hidden', background: pink, color: '#000', padding: '8px 0', fontFamily: '"Arial Black", sans-serif', fontSize: 24, textTransform: 'uppercase', borderTop: `4px solid ${cyan}`, borderBottom: `4px solid ${cyan}`, whiteSpace: 'nowrap' }}>
    <div style={{ animation: 'marquee 15s linear infinite' }}>
      {text} &nbsp; ★ &nbsp; {text} &nbsp; ★ &nbsp; {text} &nbsp; ★ &nbsp; {text} &nbsp; ★ &nbsp; {text}
    </div>
  </div>
);

const PageNumber = ({ page }: { page: number }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 30,
      right: 40,
      fontFamily: 'var(--osd-font-display)',
      fontSize: 48,
      color: '#FFF',
      textShadow: `3px 3px 0px ${cyan}`,
      WebkitTextStroke: `1px ${pink}`,
      animation: 'y2kBounce 1s both',
    }}
  >
    {String(page).padStart(2, '0')}
  </div>
);

const Sticker = ({ src, alt, top, left, right, bottom, rotate, delay = '0ms' }: any) => (
  <img 
    src={src} 
    alt={alt} 
    style={{ 
      position: 'absolute', 
      top, left, right, bottom, 
      width: 250, 
      height: 250, 
      objectFit: 'cover',
      borderRadius: '50%',
      border: `6px solid ${lime}`,
      boxShadow: `0 0 20px ${cyan}, inset 0 0 20px ${pink}`,
      filter: 'saturate(2) hue-rotate(45deg)',
      transform: `rotate(${rotate})`,
      animation: `y2kBounce 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay} both`,
      zIndex: 10
    }} 
  />
);

const GridBackground = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, backgroundSize: '40px 40px', backgroundImage: `linear-gradient(to right, rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 0, 255, 0.2) 1px, transparent 1px)` }} />
);

// --- Pages ---

const P01_Cover: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
    <SharedStyles />
    <GridBackground />
    <div style={{ position: 'absolute', top: 40, left: 0, right: 0, zIndex: 2 }}>
      <MarqueeBar text="WELCOME TO THE FUTURE // 2026 // AGENTIC AI // CYBER SPACE //" />
    </div>
    
    <div style={{ zIndex: 5, background: '#000', padding: '40px 80px', borderRadius: 40, border: `6px dashed ${pink}`, boxShadow: `0 0 40px ${cyan}` }}>
      <Title>안티그래비티<br />집중 실습</Title>
      <div style={{ marginTop: 32, fontSize: 36, color: cyan, fontFamily: '"Courier New", monospace', fontWeight: 'bold', animation: 'glitch 2s infinite' }}>
        LOADING... [AGENTIC AI WORKSHOP]
      </div>
    </div>

    <Sticker src="../antigravity-1hour-workshop/assets/cover_art.png" alt="Hero" top={150} left={100} rotate="-15deg" delay="400ms" />
    <Sticker src="../antigravity-1hour-workshop/assets/concept_diagram.png" alt="Concept" bottom={100} right={120} rotate="20deg" delay="600ms" />
    
    <PageNumber page={1} />
  </div>
);

const P02_Intro: Page = () => (
  <div style={{ ...fill, padding: 80, zIndex: 1 }}>
    <SharedStyles />
    <GridBackground />
    <div style={{ zIndex: 2, position: 'relative' }}>
      <SectionHeading>자판기 VS 사이버 비서</SectionHeading>
      
      <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
        <div className="y2k-panel" style={{ flex: 1, padding: 40, animation: 'y2kBounce 0.8s 200ms both' }}>
          <h3 style={{ fontSize: 40, color: silver, margin: '0 0 20px 0', fontFamily: 'var(--osd-font-display)' }}>#01. 일반 챗봇</h3>
          <p style={{ fontSize: 24, lineHeight: 1.6, color: '#FFF' }}>
            마치 구식 자판기처럼 질문만 받습니다.<br/>
            복붙은 결국 유저의 몫! (boring...) 💤
          </p>
        </div>
        
        <div className="y2k-panel" style={{ flex: 1, padding: 40, background: `rgba(0, 255, 255, 0.1)`, borderColor: pink, boxShadow: `8px 8px 0px ${lime}`, animation: 'y2kBounce 0.8s 400ms both' }}>
          <h3 style={{ fontSize: 40, color: cyan, margin: '0 0 20px 0', fontFamily: 'var(--osd-font-display)', animation: 'glitch 3s infinite' }}>#02. 안티그래비티</h3>
          <p style={{ fontSize: 24, lineHeight: 1.6, color: '#FFF', fontWeight: 'bold' }}>
            사이버 공간을 누비는 진짜 비서!<br/>
            알아서 척척 워크플로우를 자동화합니다. 🚀✨
          </p>
        </div>
      </div>
    </div>
    <PageNumber page={2} />
  </div>
);

const P03_Prac1: Page = () => (
  <div style={{ ...fill, padding: 80, zIndex: 1 }}>
    <SharedStyles />
    <GridBackground />
    <div style={{ zIndex: 2, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <SectionHeading>SYSTEM UPLINK: API 연결</SectionHeading>
      
      <div style={{ background: pink, color: '#000', padding: '40px 80px', borderRadius: 100, border: `8px solid #FFF`, marginTop: 40, animation: 'y2kBounce 0.8s 300ms both' }}>
        <p style={{ fontSize: 48, fontWeight: 900, margin: 0, fontFamily: 'var(--osd-font-display)' }}>
          "aistudio.google.com"
        </p>
      </div>

      <p style={{ fontSize: 32, color: cyan, lineHeight: 1.6, marginTop: 60, fontWeight: 'bold', background: '#000', padding: 20, border: `4px dashed ${lime}`, animation: 'y2kBounce 0.8s 600ms both' }}>
        강력한 두뇌(Gemini)와 연결하는 첫 단계!<br/>
        API 키를 발급받아 시스템에 주입하세요. 💉🌐
      </p>
    </div>
    <PageNumber page={3} />
  </div>
);

const P04_Prac2: Page = () => (
  <div style={{ ...fill, padding: 80, zIndex: 1 }}>
    <SharedStyles />
    <GridBackground />
    <div style={{ display: 'flex', gap: 60, zIndex: 2, position: 'relative' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <SectionHeading>MISSION: 파일 자동화</SectionHeading>
        <p style={{ fontSize: 28, color: '#FFF', lineHeight: 1.6, marginBottom: 40 }}>
          새 폴더를 만들고 텍스트를 적는 일?<br/>이제 비서에게 맡기세요!
        </p>
        <div className="y2k-panel" style={{ padding: 40, animation: 'y2kBounce 0.8s 300ms both' }}>
          <div style={{ color: lime, fontSize: 32, fontWeight: 'bold', lineHeight: 1.6 }}>
            "바탕화면에 <span style={{color: pink}}>2026_행정</span> 폴더 만들고,<br/>
            그 안에 <span style={{color: cyan}}>환영인사.txt</span> 생성해줘!"
          </div>
        </div>
      </div>
      <div style={{ flex: 0.8, position: 'relative' }}>
        <Sticker src="../antigravity-1hour-workshop/assets/ai_research.png" alt="Files" top="20%" left="10%" rotate="10deg" delay="400ms" />
      </div>
    </div>
    <PageNumber page={4} />
  </div>
);

const P05_WrapUp: Page = () => (
  <div style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
    <SharedStyles />
    <GridBackground />
    <div style={{ position: 'absolute', top: 100, left: 0, right: 0, zIndex: 2 }}>
      <MarqueeBar text="/// LEVEL COMPLETED /// NEXT STAGE /// OBSIDIAN ///" />
    </div>

    <div style={{ zIndex: 5, marginTop: 80 }}>
      <div style={{ animation: 'rotateStar 4s linear infinite', fontSize: 100, color: lime, textShadow: `0 0 20px ${lime}`, marginBottom: 20 }}>✺</div>
      <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 80, fontWeight: 900, color: '#FFF', textShadow: `4px 4px 0px ${pink}, -4px -4px 0px ${cyan}`, margin: '0 0 40px 0', animation: 'y2kBounce 0.8s 300ms both' }}>
        지식 그물망 접속 준비 완료
      </h2>
      <p style={{ fontSize: 32, color: silver, background: '#000', padding: '20px 40px', border: `4px double ${cyan}`, borderRadius: 20, animation: 'y2kBounce 0.8s 600ms both' }}>
        단순 질문을 넘어 시스템 통제권을 쥔 AI!<br/>
        다음은 방대한 지식을 '옵시디언'에 동기화할 차례입니다.
      </p>
    </div>
    <PageNumber page={5} />
  </div>
);

export const meta: SlideMeta = { title: '안티그래비티 Y2K Revival' };

export default [
  P01_Cover,
  P02_Intro,
  P03_Prac1,
  P04_Prac2,
  P05_WrapUp
] satisfies Page[];
