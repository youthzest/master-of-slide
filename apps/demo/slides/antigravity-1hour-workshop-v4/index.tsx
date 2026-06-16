import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: {
    bg: '#0E0E0E',
    text: '#F5F5F5',
    accent: '#FF6363',
  },
  fonts: {
    display: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", system-ui, "Pretendard", sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", system-ui, "Pretendard", sans-serif',
  },
  typeScale: {
    hero: 112,
    body: 24,
  },
  radius: 14,
};

const surface = '#1A1A1A';
const surfaceHi = '#222222';
const border = '#2A2A2A';
const muted = '#8B8B8B';
const accentSoft = 'rgba(255, 99, 99, 0.12)';
const mono = '"SF Mono", "JetBrains Mono", "Menlo", monospace';

const fill = {
  width: '100%',
  height: '100%',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  overflow: 'hidden',
} as const;

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 700,
      lineHeight: 1.04,
      letterSpacing: '-0.02em',
      color: 'var(--osd-text)',
      margin: 0,
      animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both',
    }}
  >
    {children}
  </h1>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 64,
      fontWeight: 700,
      color: 'var(--osd-text)',
      margin: 0,
      marginBottom: 48,
      animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both',
    }}
  >
    {children}
  </h2>
);

const Footer = ({ pageNum, total, label }: { pageNum: number; total: number; label: string }) => (
  <div
    style={{
      position: 'absolute',
      left: 96,
      right: 96,
      bottom: 48,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: mono,
      fontSize: 18,
      letterSpacing: '0.04em',
      color: muted,
      borderTop: `1px solid ${border}`,
      paddingTop: 16,
    }}
  >
    <span>{label}</span>
    <span>{String(pageNum).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      borderRadius: 999,
      background: accentSoft,
      border: '1px solid rgba(255, 99, 99, 0.35)',
      fontFamily: mono,
      fontSize: 16,
      letterSpacing: '0.04em',
      color: 'var(--osd-accent)',
      marginBottom: 32,
    }}
  >
    {children}
  </div>
);

const Glow = ({ x = '50%', y = '50%', size = 1200 }: { x?: string; y?: string; size?: number }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      transform: 'translate(-50%, -50%)',
      background: 'radial-gradient(circle, rgba(255,99,99,0.18) 0%, transparent 60%)',
      pointerEvents: 'none',
      animation: 'glow 4s infinite alternate',
    }}
  />
);

const Panel = ({ children, style = {}, delay = '0ms' }: { children: React.ReactNode; style?: React.CSSProperties; delay?: string }) => (
  <div
    style={{
      background: surface,
      border: `1px solid ${border}`,
      borderRadius: 'var(--osd-radius)',
      padding: 48,
      animation: `fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay} both`,
      ...style
    }}
  >
    {children}
  </div>
);

const SharedStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes glow {
      0%, 100% { opacity: 0.55; }
      50%      { opacity: 0.95; }
    }
    @keyframes caret {
      0%, 60%   { opacity: 1; }
      61%, 100% { opacity: 0; }
    }
  `}</style>
);

const P01_Cover: Page = () => (
  <div style={{ ...fill, padding: '96px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <SharedStyles />
    <Glow x="70%" y="40%" size={1400} />
    <div style={{ zIndex: 1, position: 'relative' }}>
      <Eyebrow>v2.0 LAUNCH</Eyebrow>
      <Title>안티그래비티<br />집중 실습</Title>
      <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.55, marginTop: 40, maxWidth: 600, animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both' }}>
        단순한 챗봇을 넘어선 '에이전트 AI'의 개념 이해와 실전 가이드.<br />
        터미널을 넘어 시스템을 제어하는 인공지능의 시대.
      </p>
    </div>
    <Footer pageNum={1} total={10} label="Antigravity / Overview" />
  </div>
);

const P02_Intro: Page = () => (
  <div style={{ ...fill, padding: '96px 80px' }}>
    <SharedStyles />
    <Glow x="-10%" y="20%" size={1000} />
    <Eyebrow>PARADIGM SHIFT</Eyebrow>
    <SectionHeading>자판기와 비서</SectionHeading>
    <div style={{ display: 'flex', gap: 32, marginTop: 48, zIndex: 1, position: 'relative' }}>
      <Panel style={{ flex: 1 }}>
        <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 24px 0', color: muted }}>01. 일반 챗봇</h3>
        <div style={{ fontFamily: mono, fontSize: 16, color: muted, marginBottom: 32, padding: '12px 16px', background: surfaceHi, borderRadius: 8, border: `1px solid ${border}` }}>
          &gt; prompt: "정보 검색"<span style={{ animation: 'caret 1s infinite' }}>_</span>
        </div>
        <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.55 }}>
          질문을 넣으면 단편적 답변만 나옵니다.<br />복사해서 붙여넣는 후속 작업은 전적으로 사용자 몫입니다.
        </p>
      </Panel>
      <Panel style={{ flex: 1, borderColor: 'var(--osd-accent)', background: 'linear-gradient(180deg, rgba(26,26,26,1) 0%, rgba(34,22,22,1) 100%)' }} delay="100ms">
        <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 24px 0', color: 'var(--osd-text)' }}>02. 안티그래비티</h3>
        <div style={{ fontFamily: mono, fontSize: 16, color: 'var(--osd-accent)', marginBottom: 32, padding: '12px 16px', background: 'rgba(255, 99, 99, 0.05)', borderRadius: 8, border: `1px solid rgba(255, 99, 99, 0.2)` }}>
          &gt; execute: "워크플로우 자동화"<span style={{ animation: 'caret 1s infinite' }}>_</span>
        </div>
        <p style={{ fontSize: 'var(--osd-size-body)', color: 'var(--osd-text)', lineHeight: 1.55 }}>
          구체적인 <strong>'행동'</strong>을 지시합니다.<br />알아서 파일을 생성하고 정리하는 진짜 비서 역할을 수행합니다.
        </p>
      </Panel>
    </div>
    <Footer pageNum={2} total={10} label="Antigravity / Concept" />
  </div>
);

const P03_Concept: Page = () => (
  <div style={{ ...fill, padding: '96px 80px' }}>
    <SharedStyles />
    <Eyebrow>CORE FEATURES</Eyebrow>
    <SectionHeading>에이전트 작동 원리</SectionHeading>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, marginTop: 48 }}>
      {[
        ['Autonomy', '직접 판단', '사용자가 직접 마우스를 쥐고 키보드를 치듯 작동합니다.'],
        ['Execution', '행동 실행', '시스템 내 파일 입출력 및 관리를 알아서 수행합니다.'],
        ['Instruction', '명령 기반', '질문 대신 구체적인 목표가 있는 심부름을 지시합니다.']
      ].map(([eng, kor, desc], i) => (
        <Panel key={i} delay={`${i * 100}ms`}>
          <div style={{ fontFamily: mono, fontSize: 16, color: 'var(--osd-accent)', marginBottom: 16 }}>// {eng}</div>
          <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 24px 0' }}>{kor}</h3>
          <p style={{ fontSize: 20, color: muted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
        </Panel>
      ))}
    </div>
    <Footer pageNum={3} total={10} label="Antigravity / Architecture" />
  </div>
);

const P04_Prac1: Page = () => (
  <div style={{ ...fill, padding: '96px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <SharedStyles />
    <Glow x="50%" y="50%" size={1600} />
    <div style={{ zIndex: 1, position: 'relative', textAlign: 'center' }}>
      <Eyebrow>INITIALIZATION</Eyebrow>
      <Title>비서에게 생명 불어넣기</Title>
      <p style={{ fontSize: 32, color: muted, lineHeight: 1.55, marginTop: 40, animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both' }}>
        이 똑똑한 비서가 일하려면 <strong>구글 제미나이(Gemini)</strong>라는<br />강력한 인공지능 두뇌와 연결해주어야 합니다.
      </p>
      <div style={{ marginTop: 64, display: 'inline-block', fontFamily: mono, fontSize: 24, padding: '24px 48px', background: surface, border: `1px solid ${border}`, borderRadius: 12, animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both' }}>
        <span style={{ color: muted }}>$</span> connect aistudio.google.com
      </div>
    </div>
    <Footer pageNum={4} total={10} label="Antigravity / Auth" />
  </div>
);

const P05_Prac1Guide: Page = () => (
  <div style={{ ...fill, padding: '96px 80px' }}>
    <SharedStyles />
    <Eyebrow>WORKFLOW</Eyebrow>
    <SectionHeading>API 키 발급 시퀀스</SectionHeading>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 48 }}>
      {[
        ['auth.google.com', 'aistudio.google.com 에 접속하여 구글 계정으로 로그인'],
        ['dashboard.api_keys', '좌측 [Get API key] 클릭 후, [Create API key...] 생성'],
        ['clipboard.copy', '화면에 표시되는 긴 영문/숫자 비밀번호 확인 및 복사'],
        ['system.config', '안티그래비티 설정 창에 복사한 키를 붙여넣어 연결 완료']
      ].map(([code, text], i) => (
        <Panel key={i} delay={`${i * 100}ms`} style={{ padding: '32px 48px', display: 'flex', alignItems: 'center', gap: 48 }}>
          <div style={{ fontFamily: mono, fontSize: 16, color: 'var(--osd-accent)', width: 200 }}>
            {code}
          </div>
          <p style={{ fontSize: 22, color: 'var(--osd-text)', margin: 0, fontWeight: 500 }}>{text}</p>
        </Panel>
      ))}
    </div>
    <Footer pageNum={5} total={10} label="Antigravity / Auth" />
  </div>
);

const P06_Prac2: Page = () => (
  <div style={{ ...fill, padding: '96px 80px' }}>
    <SharedStyles />
    <Glow x="80%" y="80%" size={800} />
    <Eyebrow>EXECUTION</Eyebrow>
    <SectionHeading>첫 번째 심부름: 파일 시스템 제어</SectionHeading>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.55, marginBottom: 48, zIndex: 1, position: 'relative' }}>
      우클릭으로 새 폴더를 만들고 문서를 타이핑하던 일을 비서에게 맡깁니다.
    </p>
    <Panel delay="100ms" style={{ padding: 64, zIndex: 1, position: 'relative' }}>
      <div style={{ fontFamily: mono, fontSize: 18, color: muted, marginBottom: 24 }}>
        user@antigravity:~$
      </div>
      <p style={{ fontSize: 36, lineHeight: 1.6, margin: 0, fontWeight: 700, color: '#fff' }}>
        "바탕화면에 <span style={{ color: 'var(--osd-accent)' }}>2026년_교회행정</span> 폴더를 만들고,<br />
        그 안에 <span style={{ color: 'var(--osd-accent)' }}>환영인사.txt</span> 파일을 만들어줘.<br />
        내용은 '우리 교회에 오신 것을 환영합니다!'라고 적어."
      </p>
    </Panel>
    <Footer pageNum={6} total={10} label="Antigravity / Filesystem" />
  </div>
);

const P07_Prac3: Page = () => (
  <div style={{ ...fill, padding: '96px 80px' }}>
    <SharedStyles />
    <Eyebrow>RESEARCH</Eyebrow>
    <SectionHeading>두 번째 심부름: AI 문서 리서치</SectionHeading>
    <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
      <Panel style={{ flex: 1 }}>
        <div style={{ fontFamily: mono, fontSize: 16, color: muted, marginBottom: 32 }}>// Input Context</div>
        <p style={{ fontSize: 24, lineHeight: 1.6, margin: 0, color: 'var(--osd-text)' }}>
          바탕화면에 <code>요한복음_설교뼈대.txt</code> 파일을 생성.<br /><br />
          내용: "하나님의 사랑은 끝이 없다"
        </p>
      </Panel>
      <Panel style={{ flex: 1.5, borderColor: 'var(--osd-accent)', background: surfaceHi }} delay="100ms">
        <div style={{ fontFamily: mono, fontSize: 16, color: 'var(--osd-accent)', marginBottom: 32 }}>// Instruction Prompt</div>
        <p style={{ fontSize: 32, lineHeight: 1.6, margin: 0, fontWeight: 700 }}>
          "이 파일을 읽고 어울리는 '찰스 스펄전' 예화를 찾아 <code>스펄전_설교예화.md</code> 파일로 예쁘게 정리해줘."
        </p>
      </Panel>
    </div>
    <Footer pageNum={7} total={10} label="Antigravity / Research" />
  </div>
);

const P08_Prac3Result: Page = () => (
  <div style={{ ...fill, padding: '96px 80px' }}>
    <SharedStyles />
    <Glow x="20%" y="20%" size={1000} />
    <Eyebrow>OUTPUT</Eyebrow>
    <SectionHeading>자율적 프로세스 완료</SectionHeading>
    <Panel delay="100ms" style={{ padding: 64, background: 'linear-gradient(135deg, #1A1A1A 0%, #111111 100%)', zIndex: 1, position: 'relative' }}>
      <p style={{ fontSize: 40, color: 'var(--osd-text)', lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
        바탕화면에 정리된 문서가 <span style={{ color: 'var(--osd-accent)' }}>스스로 생성</span>됩니다.
      </p>
      <div style={{ width: '100%', height: 1, background: border, margin: '48px 0' }} />
      <p style={{ fontSize: 24, color: muted, lineHeight: 1.6, margin: 0 }}>
        복사하고 붙여넣는 물리적 행위가 생략됩니다.<br />
        에이전트는 맥락을 이해하고, 문서를 검색하고, 파일을 작성하는 모든 흐름을 자율적으로 통제합니다.
      </p>
    </Panel>
    <Footer pageNum={8} total={10} label="Antigravity / Research" />
  </div>
);

const P09_Prac4: Page = () => (
  <div style={{ ...fill, padding: '96px 80px' }}>
    <SharedStyles />
    <Eyebrow>AUTOMATION</Eyebrow>
    <SectionHeading>대량 문서 자동 분류</SectionHeading>
    <div style={{ display: 'flex', gap: 48, marginTop: 48 }}>
      <div style={{ flex: 1, animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both' }}>
        <p style={{ fontSize: 24, color: muted, lineHeight: 1.6, margin: 0 }}>
          주보 광고, 심방 기록, 설교 메모가 무작위로 섞인 실습 폴더.<br />사람이 읽고 직접 정리해야 하는 반복 업무를 에이전트에게 위임합니다.
        </p>
        <div style={{ fontFamily: mono, fontSize: 16, color: muted, marginTop: 32 }}>
          file_01.txt<br />file_02.txt<br />file_03.txt ...
        </div>
      </div>
      <Panel delay="100ms" style={{ flex: 1.5 }}>
        <div style={{ fontFamily: mono, fontSize: 16, color: 'var(--osd-accent)', marginBottom: 24 }}>// Process Array</div>
        <p style={{ fontSize: 28, lineHeight: 1.6, margin: 0, fontWeight: 700, color: 'var(--osd-text)' }}>
          "이 5개 파일을 모두 읽어보고, 내용의 성격에 따라 '심방기록' 폴더와 '설교메모' 폴더로 알아서 분류하고 이동시켜."
        </p>
      </Panel>
    </div>
    <Footer pageNum={9} total={10} label="Antigravity / Automation" />
  </div>
);

const P10_WrapUp: Page = () => (
  <div style={{ ...fill, padding: '96px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <SharedStyles />
    <Glow x="50%" y="70%" size={1800} />
    <div style={{ zIndex: 1, position: 'relative', textAlign: 'center' }}>
      <Eyebrow>NEXT PHASE</Eyebrow>
      <Title>지식 그물망으로의 연결</Title>
      <p style={{ fontSize: 32, color: 'var(--osd-text)', lineHeight: 1.55, marginTop: 48, animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both' }}>
        이제 AI에게는 단순한 질문이 아닌<br />
        <strong style={{ color: 'var(--osd-accent)' }}>'행동과 워크플로우'</strong>를 지시할 수 있습니다.
      </p>
      <p style={{ fontSize: 24, color: muted, lineHeight: 1.6, marginTop: 32, animation: 'fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both' }}>
        다음 시간에는 에이전트가 자동 생성한 수많은 파일들을<br />
        거대한 지식망인 '옵시디언'에 쓸어 담고 연결하는 방법을 학습합니다.
      </p>
    </div>
    <Footer pageNum={10} total={10} label="Antigravity / Conclusion" />
  </div>
);

export const meta: SlideMeta = { title: '안티그래비티 Launch Motion' };

export const narration: (string | undefined)[] = [
  '안녕하세요. 오늘 1시간 동안 단순한 챗봇을 넘어선 에이전트 AI, 안티그래비티 집중 실습을 시작하겠습니다.',
  '먼저 챗봇과 에이전트의 차이를 알아볼까요? 챗봇은 똑똑한 자판기입니다. 반면 안티그래비티는 직접 행동하는 똑똑한 비서입니다.',
  '에이전트는 사용자를 대신해 폴더를 만들거나 파일을 옮기는 등 자율적인 실행력을 갖추고 있습니다. 질문이 아닌 심부름을 지시하시면 됩니다.',
  '이제 이 비서가 일할 수 있도록 생명을 불어넣어 보겠습니다. 구글 제미나이의 API 키를 발급받아 연결해 주어야 합니다.',
  '인터넷 창을 열고 구글 AI 스튜디오에 접속하세요. 로그인 후 새 API 키를 발급받아 안티그래비티 설정 창에 붙여넣어 주시면 됩니다.',
  '이제 비서가 일할 준비를 마쳤습니다. 바탕화면에 2026년 교회행정 폴더와 환영인사 파일을 만들어 달라는 첫 심부름을 시켜보겠습니다.',
  '두 번째 심부름은 목회자에게 꼭 필요한 설교 예화 리서치입니다. 짧은 뼈대 파일만 주고, 스펄전의 예화를 찾아 정리해 달라고 지시해 봅시다.',
  '명령을 내리면 바탕화면에 새로운 마크다운 문서가 알아서 생성됩니다. 복사하고 붙여넣을 필요 없이 문서 작성 전 과정이 스스로 끝납니다.',
  '세 번째 심부름은 여러 문서가 섞인 폴더를 알아서 읽고 내용별로 심방기록과 설교메모 폴더로 척척 분류하는 작업입니다.',
  '오늘 1시간 동안 AI 비서의 능력을 경험하셨습니다. 다음 시간에는 이 파일들을 옵시디언 지식망에 연결하는 방법을 배우겠습니다. 수고하셨습니다.'
];

export default [
  P01_Cover,
  P02_Intro,
  P03_Concept,
  P04_Prac1,
  P05_Prac1Guide,
  P06_Prac2,
  P07_Prac3,
  P08_Prac3Result,
  P09_Prac4,
  P10_WrapUp
] satisfies Page[];
