import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: {
    bg: '#FAF8F5',
    text: '#111111',
    accent: '#A68A64', // Champagne Gold / Camel
  },
  fonts: {
    display: '"Didot", "Bodoni MT", "Playfair Display", "Times New Roman", "KoPub Batang", serif',
    body: '"Optima", "Helvetica Neue", "Pretendard", system-ui, sans-serif',
  },
  typeScale: {
    hero: 120,
    body: 28,
  },
  radius: 0,
};

const surface = '#FFFFFF';
const muted = '#888888';
const line = '#E8E4DF';
const champagne = '#A68A64';

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
    @keyframes fashionReveal {
      from { clip-path: inset(100% 0 0 0); transform: translateY(20px); }
      to   { clip-path: inset(0 0 0 0); transform: translateY(0); }
    }
    @keyframes fashionFade {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes imageReveal {
      from { filter: sepia(0.6) brightness(0.8); transform: scale(1.05); }
      to   { filter: sepia(0.2) brightness(1); transform: scale(1); }
    }
    @keyframes drawHairline {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
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
      color: 'var(--osd-text)',
      margin: 0,
      animation: 'fashionReveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) both',
    }}
  >
    {children}
  </h1>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 40 }}>
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 72,
        fontWeight: 400,
        color: 'var(--osd-text)',
        margin: '0 0 16px 0',
        animation: 'fashionReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) both',
      }}
    >
      {children}
    </h2>
  </div>
);

const BrandHeader = () => (
  <div
    style={{
      position: 'absolute',
      top: 48,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontFamily: 'var(--osd-font-body)',
      fontSize: 14,
      letterSpacing: '0.4em',
      color: muted,
      textTransform: 'uppercase',
      animation: 'fashionFade 2s 500ms both',
      zIndex: 10,
    }}
  >
    A n t i g r a v i t y &nbsp; C o l l e c t i o n
  </div>
);

const PageNumber = ({ page }: { page: number }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 48,
      right: 80,
      fontFamily: 'var(--osd-font-display)',
      fontSize: 24,
      fontStyle: 'italic',
      color: champagne,
      animation: 'fashionFade 2s 1s both',
    }}
  >
    Nº {String(page).padStart(2, '0')}
  </div>
);

const BrandImage = ({ src, alt }: { src: string; alt: string }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      border: `1px solid ${line}`,
      padding: 16,
      background: surface,
      animation: 'fashionFade 1.5s cubic-bezier(0.4, 0, 0.2, 1) 200ms both',
    }}
  >
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          animation: 'imageReveal 3s ease-out both',
        }} 
      />
    </div>
  </div>
);

const VerticalLine = () => (
  <div 
    style={{ 
      position: 'absolute', 
      top: 120, 
      bottom: 120, 
      left: '50%', 
      width: 1, 
      background: line,
      transformOrigin: 'top',
      animation: 'drawHairline 2s cubic-bezier(0.4, 0, 0.2, 1) 500ms both'
    }} 
  />
);

// --- Pages ---

const P01_Cover: Page = () => (
  <div style={{ ...fill, padding: 80, display: 'flex' }}>
    <SharedStyles />
    <BrandHeader />
    <div style={{ flex: 1, border: `1px solid ${line}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: surface }}>
      <div style={{ fontFamily: 'var(--osd-font-body)', fontSize: 16, letterSpacing: '0.3em', color: champagne, marginBottom: 40, animation: 'fashionFade 1.5s 300ms both' }}>
        S P R I N G / S U M M E R &nbsp; 2 0 2 6
      </div>
      <Title>안티그래비티<br />워크샵</Title>
      <div style={{ width: 40, height: 1, background: 'var(--osd-text)', margin: '48px auto', animation: 'fashionFade 1.5s 600ms both' }} />
      <p style={{ fontFamily: 'var(--osd-font-display)', fontStyle: 'italic', fontSize: 32, color: muted, animation: 'fashionFade 1.5s 900ms both' }}>
        The Age of Agentic AI
      </p>
    </div>
    <PageNumber page={1} />
  </div>
);

const P02_Intro: Page = () => (
  <div style={{ ...fill, padding: '120px 80px', display: 'flex' }}>
    <SharedStyles />
    <BrandHeader />
    <VerticalLine />
    <div style={{ flex: 1, paddingRight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--osd-font-body)', fontSize: 14, letterSpacing: '0.2em', color: champagne, marginBottom: 24, textTransform: 'uppercase' }}>
        Chapter I &mdash; The Vending Machine
      </div>
      <SectionHeading>일반 챗봇</SectionHeading>
      <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.8, fontWeight: 300 }}>
        마치 자판기처럼, 질문을 넣으면 단편적인 답변만을 내놓습니다. 차가운 텍스트의 나열 속에서, 이를 엮고 구성하는 모든 후속 작업의 무게는 온전히 인간의 몫으로 남습니다.
      </p>
    </div>
    <div style={{ flex: 1, paddingLeft: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--osd-font-body)', fontSize: 14, letterSpacing: '0.2em', color: champagne, marginBottom: 24, textTransform: 'uppercase' }}>
        Chapter II &mdash; The Assistant
      </div>
      <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 72, fontWeight: 400, color: 'var(--osd-accent)', margin: '0 0 16px 0', animation: 'fashionReveal 1.2s 200ms both' }}>
        안티그래비티
      </h2>
      <p style={{ fontSize: 'var(--osd-size-body)', color: 'var(--osd-text)', lineHeight: 1.8, fontWeight: 400, animation: 'fashionFade 1.5s 400ms both' }}>
        단순한 대화를 넘어 구체적인 <strong>'행동'</strong>을 지시받는 우아한 비서. 당신을 대신하여 은밀하게 시스템을 움직이고, 파일을 생성하며, 복잡한 워크플로우를 완벽한 실루엣으로 완성해 냅니다.
      </p>
    </div>
    <PageNumber page={2} />
  </div>
);

const P03_Concept: Page = () => (
  <div style={{ ...fill, padding: '120px 80px', display: 'flex', gap: 80 }}>
    <SharedStyles />
    <BrandHeader />
    <div style={{ flex: 1 }}>
      <BrandImage src="../antigravity-1hour-workshop/assets/concept_diagram.png" alt="Concept" />
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SectionHeading>에이전트의<br />우아한 작동 원리</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, marginTop: 40 }}>
        {[
          ['I', 'Autonomy', '사용자가 마우스를 쥐듯 스스로 판단하는 자율성'],
          ['II', 'Execution', '단순 생성을 넘어 시스템에 개입하는 실행력'],
          ['III', 'Instruction', '질문이 아닌 명확한 목표를 부여하는 지시']
        ].map(([num, eng, kor], i) => (
          <div key={i} style={{ animation: `fashionFade 1.5s ${i * 300 + 400}ms both`, borderBottom: `1px solid ${line}`, paddingBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
              <span style={{ fontFamily: 'var(--osd-font-display)', fontSize: 24, fontStyle: 'italic', color: champagne }}>{num}.</span>
              <span style={{ fontFamily: 'var(--osd-font-body)', fontSize: 18, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{eng}</span>
            </div>
            <div style={{ fontSize: 24, color: muted, marginTop: 16, paddingLeft: 40, fontWeight: 300 }}>{kor}</div>
          </div>
        ))}
      </div>
    </div>
    <PageNumber page={3} />
  </div>
);

const P04_Prac1: Page = () => (
  <div style={{ ...fill, padding: '120px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#FFFFFF' }}>
    <SharedStyles />
    <BrandHeader />
    <div style={{ width: 1, height: 120, background: champagne, marginBottom: 48, animation: 'drawHairline 1.5s ease-out both' }} />
    <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 88, fontWeight: 400, color: 'var(--osd-text)', margin: '0 0 32px 0', animation: 'fashionReveal 1.5s 300ms both' }}>
      생명의 잉태
    </h2>
    <p style={{ fontFamily: 'var(--osd-font-display)', fontStyle: 'italic', fontSize: 36, color: muted, animation: 'fashionFade 1.5s 600ms both' }}>
      "제미나이(Gemini)라는 두뇌와의 완벽한 조우"
    </p>
    <p style={{ fontSize: 'var(--osd-size-body)', color: '#555', lineHeight: 1.8, maxWidth: 800, marginTop: 64, fontWeight: 300, animation: 'fashionFade 1.5s 900ms both' }}>
      이 똑똑한 비서가 아름다운 실루엣을 그려내려면, 그 중심에 심장이 필요합니다. aistudio.google.com 에 접속하여 API 키를 발급받는 것. 그것이 안티그래비티 컬렉션의 첫 단추입니다.
    </p>
    <PageNumber page={4} />
  </div>
);

const P05_Prac2: Page = () => (
  <div style={{ ...fill, padding: '120px 80px', display: 'flex', gap: 80 }}>
    <SharedStyles />
    <BrandHeader />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--osd-font-body)', fontSize: 14, letterSpacing: '0.2em', color: champagne, marginBottom: 24, textTransform: 'uppercase' }}>
        Atelier Work 01
      </div>
      <SectionHeading>문서 리서치 집행</SectionHeading>
      <p style={{ fontSize: 24, color: muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 64 }}>
        직접 브라우저를 열고 텍스트를 옮겨 담는 수고스러운 과정은 이제 구시대의 유물이 되었습니다. 에이전트는 하나의 명령만으로 가장 세련된 결과물을 재단하여 바탕화면에 올려놓습니다.
      </p>
      <div style={{ borderLeft: `1px solid ${champagne}`, paddingLeft: 32, animation: 'fashionFade 1.5s 400ms both' }}>
        <p style={{ fontFamily: 'var(--osd-font-display)', fontStyle: 'italic', fontSize: 32, color: 'var(--osd-text)', lineHeight: 1.6, margin: 0 }}>
          "요한복음 뼈대 파일을 읽고 찰스 스펄전의 예화를 찾아 스펄전_설교예화 파일로 우아하게 정리해줘."
        </p>
      </div>
    </div>
    <div style={{ flex: 0.8 }}>
      <BrandImage src="../antigravity-1hour-workshop/assets/ai_research.png" alt="Research" />
    </div>
    <PageNumber page={5} />
  </div>
);

const P06_Prac3: Page = () => (
  <div style={{ ...fill, padding: '120px 80px', display: 'flex', gap: 80 }}>
    <SharedStyles />
    <BrandHeader />
    <div style={{ flex: 0.8 }}>
      <BrandImage src="../antigravity-1hour-workshop/assets/auto_sorting.png" alt="Sorting" />
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--osd-font-body)', fontSize: 14, letterSpacing: '0.2em', color: champagne, marginBottom: 24, textTransform: 'uppercase' }}>
        Atelier Work 02
      </div>
      <SectionHeading>혼돈 속의 질서</SectionHeading>
      <p style={{ fontSize: 24, color: muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 40 }}>
        주보 광고, 심방 기록, 설교 메모가 무작위로 뒤섞인 폴더. 사람이 일일이 뜯어봐야 했던 그 무질서함 속에서, 에이전트는 본질을 꿰뚫어 보고 내용에 따라 완벽한 질서의 핏(fit)으로 옷장을 정리하듯 파일을 분류해 냅니다.
      </p>
      <div style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}`, padding: '32px 0', animation: 'fashionFade 1.5s 400ms both', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--osd-font-body)', letterSpacing: '0.1em', fontSize: 18, color: 'var(--osd-text)', margin: 0, textTransform: 'uppercase' }}>
          "5개 파일을 읽고 성격에 맞게 스스로 분류하라."
        </p>
      </div>
    </div>
    <PageNumber page={6} />
  </div>
);

const P07_WrapUp: Page = () => (
  <div style={{ ...fill, padding: 80, display: 'flex' }}>
    <SharedStyles />
    <BrandHeader />
    <div style={{ flex: 1, border: `1px solid ${champagne}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#FFFFFF', padding: 80 }}>
      <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 88, fontWeight: 400, color: 'var(--osd-text)', margin: '0 0 40px 0', animation: 'fashionReveal 1.5s 300ms both' }}>
        지식 그물망으로의<br />우아한 연결
      </h2>
      <div style={{ width: 80, height: 1, background: champagne, marginBottom: 48, animation: 'fashionFade 1.5s 600ms both' }} />
      <p style={{ fontSize: 'var(--osd-size-body)', color: '#555', lineHeight: 1.8, maxWidth: 800, fontWeight: 300, animation: 'fashionFade 1.5s 900ms both' }}>
        단순한 텍스트의 나열을 넘어, 이제 우리는 시스템의 실타래를 통제합니다. 다음 여정에서는 이 비서가 쏟아내는 수많은 지식들을 <strong>'옵시디언(Obsidian)'</strong>이라는 거대한 오뜨 꾸뛰르 그물망으로 엮어내는 아름다운 방법을 만나게 됩니다.
      </p>
    </div>
    <PageNumber page={7} />
  </div>
);

export const meta: SlideMeta = { title: '안티그래비티 Luxury Fashion' };

export default [
  P01_Cover,
  P02_Intro,
  P03_Concept,
  P04_Prac1,
  P05_Prac2,
  P06_Prac3,
  P07_WrapUp
] satisfies Page[];
