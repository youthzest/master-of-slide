import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { ImagePlaceholder } from '@open-slide/core';
import cover_art from './assets/cover_art.png';
import concept_diagram from './assets/concept_diagram.png';
import ai_research from './assets/ai_research.png';
import auto_sorting from './assets/auto_sorting.png';

export const design: DesignSystem = {
  palette: {
    bg: '#f7f5f0',
    text: '#1a1814',
    accent: '#6d4cff',
  },
  fonts: {
    display: '"Times New Roman", "Georgia", "Nanum Myeongjo", serif',
    body: '-apple-system, BlinkMacSystemFont, "Inter", "Pretendard", system-ui, sans-serif',
  },
  typeScale: {
    hero: 160,
    body: 36,
  },
  radius: 16,
};

const muted = '#6b6660';
const line = '#e4e0d8';

const fill = {
  width: '100%',
  height: '100%',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
} as const;

// Common Components
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 700,
      lineHeight: 1.02,
      letterSpacing: '-0.02em',
      color: 'var(--osd-text)',
      margin: 0,
    }}
  >
    {children}
  </h1>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 84,
      fontWeight: 700,
      lineHeight: 1.2,
      color: 'var(--osd-text)',
      margin: 0,
      marginBottom: 64,
    }}
  >
    {children}
  </h2>
);

const Footer = ({ pageNum, total, section }: { pageNum: number; total: number; section: string }) => (
  <div
    style={{
      position: 'absolute',
      left: 100,
      right: 100,
      bottom: 56,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--osd-font-body)',
      fontSize: 20,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: muted,
      borderTop: `1px solid ${line}`,
      paddingTop: 18,
    }}
  >
    <span>{section}</span>
    <span>{String(pageNum).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: 'var(--osd-font-body)',
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
      marginBottom: 32,
    }}
  >
    {children}
  </div>
);

const P01_Cover: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', display: 'flex', padding: '0 100px', alignItems: 'center' }}>
    <div style={{ flex: 1, paddingRight: 64 }}>
      <Eyebrow>1시간 집중 코스</Eyebrow>
      <Title>안티그래비티<br />집중 실습</Title>
      <p style={{ fontSize: 'var(--osd-size-body)', color: muted, marginTop: 48, lineHeight: 1.6 }}>
        단순한 챗봇을 넘어선<br />'에이전트 AI'의 개념 이해와 실전 가이드
      </p>
    </div>
    <div style={{ width: 720, height: 720, borderRadius: 'var(--osd-radius)', overflow: 'hidden', border: `1px solid ${line}` }}>
      <img src={cover_art} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <Footer pageNum={1} total={10} section="도입" />
  </div>
);

const P02_Intro: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px' }}>
    <Eyebrow>도입</Eyebrow>
    <SectionHeading>자판기와 비서</SectionHeading>
    <div style={{ display: 'flex', gap: 64 }}>
      <div style={{ flex: 1, background: '#ffffff', padding: 48, borderRadius: 'var(--osd-radius)', border: `1px solid ${line}` }}>
        <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 24px 0' }}>일반 챗봇 (자판기)</h3>
        <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.6 }}>
          질문을 넣으면 답변이 나옵니다.<br />
          답변을 복사해서 문서를 켜고 붙여넣는 건<br />
          오롯이 사용자의 몫입니다.
        </p>
      </div>
      <div style={{ flex: 1, background: 'rgba(109, 76, 255, 0.05)', padding: 48, borderRadius: 'var(--osd-radius)', border: `1px solid var(--osd-accent)` }}>
        <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 24px 0', color: 'var(--osd-accent)' }}>안티그래비티 (비서)</h3>
        <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.6 }}>
          질문이 아닌 '행동'을 지시합니다.<br />
          알아서 폴더를 만들고 파일을 완성해주는<br />
          똑똑한 부교역자 역할을 수행합니다.
        </p>
      </div>
    </div>
    <Footer pageNum={2} total={10} section="도입" />
  </div>
);

const P03_Concept: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px' }}>
    <Eyebrow>도입</Eyebrow>
    <SectionHeading>에이전트의 작동 원리</SectionHeading>
    <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <ul style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.6, paddingLeft: 32, margin: 0, color: muted }}>
          <li style={{ marginBottom: 32 }}><strong style={{ color: 'var(--osd-text)' }}>자율성:</strong> 직접 마우스를 쥐고 키보드를 치듯 작동</li>
          <li style={{ marginBottom: 32 }}><strong style={{ color: 'var(--osd-text)' }}>실행력:</strong> 파일 생성, 이동, 분석 등을 알아서 처리</li>
          <li><strong style={{ color: 'var(--osd-text)' }}>명령 방식:</strong> 질문 대신 구체적인 심부름을 지시</li>
        </ul>
      </div>
      <div style={{ width: 600, height: 400, borderRadius: 'var(--osd-radius)', overflow: 'hidden', border: `1px solid ${line}` }}>
        <img src={concept_diagram} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
    <Footer pageNum={3} total={10} section="도입" />
  </div>
);

const P04_Prac1: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px' }}>
    <Eyebrow>실습 1</Eyebrow>
    <SectionHeading>비서에게 생명 불어넣기</SectionHeading>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.6, maxWidth: 1200 }}>
      이 똑똑한 비서가 일하려면 <strong style={{ color: 'var(--osd-text)' }}>구글 제미나이(Gemini)</strong>라는 인공지능 두뇌와 연결을 해줘야 합니다.<br />
      이를 위해 API 키(비밀번호)를 발급받아 입력하는 과정이 필요합니다.
    </p>
    <div style={{ marginTop: 64, background: '#ffffff', padding: 48, borderRadius: 'var(--osd-radius)', border: `1px solid ${line}`, display: 'inline-block' }}>
      <p style={{ fontSize: 28, margin: 0, color: 'var(--osd-accent)', fontWeight: 600 }}>핵심 목표: aistudio.google.com 접속 및 API 키 복사</p>
    </div>
    <Footer pageNum={4} total={10} section="실습 1" />
  </div>
);

const P05_Prac1Guide: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px' }}>
    <Eyebrow>실습 1 가이드</Eyebrow>
    <SectionHeading>API 키 발급 순서</SectionHeading>
    <ol style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.6, paddingLeft: 40, margin: 0, color: muted }}>
      <li style={{ marginBottom: 24 }}>인터넷 창을 열고 <code style={{ color: 'var(--osd-accent)' }}>aistudio.google.com</code> 에 접속합니다.</li>
      <li style={{ marginBottom: 24 }}>구글(Gmail) 아이디로 로그인합니다.</li>
      <li style={{ marginBottom: 24 }}>좌측 메뉴에서 <strong style={{ color: 'var(--osd-text)' }}>[Get API key]</strong> 클릭 후, 파란색 <strong style={{ color: 'var(--osd-text)' }}>[Create API key...]</strong> 버튼 클릭.</li>
      <li style={{ marginBottom: 24 }}>긴 영문/숫자 비밀번호가 나오면 <strong style={{ color: 'var(--osd-text)' }}>[Copy]</strong> 버튼을 누릅니다.</li>
      <li>안티그래비티 설정 창에 복사한 키를 붙여넣기 합니다.</li>
    </ol>
    <Footer pageNum={5} total={10} section="실습 1" />
  </div>
);

const P06_Prac2: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px' }}>
    <Eyebrow>실습 2</Eyebrow>
    <SectionHeading>첫 번째 심부름: 행정 업무</SectionHeading>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.6, marginBottom: 48 }}>
      직접 우클릭해서 '새 폴더'를 만들고 타이핑하던 일을 비서에게 맡깁니다.
    </p>
    <div style={{ background: '#ffffff', padding: 48, borderRadius: 'var(--osd-radius)', border: `1px solid ${line}` }}>
      <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 16px 0', color: 'var(--osd-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>명령어 입력</h3>
      <p style={{ fontSize: 32, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
        "바탕화면에 <code style={{ color: 'var(--osd-accent)' }}>2026년_교회행정</code> 이라는 폴더를 만들고,<br />
        그 안에 <code style={{ color: 'var(--osd-accent)' }}>환영인사.txt</code> 파일을 만들어줘.<br />
        내용은 '우리 교회에 오신 것을 환영합니다!'라고 적어줘."
      </p>
    </div>
    <Footer pageNum={6} total={10} section="실습 2" />
  </div>
);

const P07_Prac3: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px' }}>
    <Eyebrow>실습 3</Eyebrow>
    <SectionHeading>두 번째 심부름: 예화 리서치</SectionHeading>
    <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.6, marginBottom: 40 }}>
          바탕화면에 <code style={{ color: 'var(--osd-text)' }}>요한복음_설교뼈대.txt</code> 파일을 만들고<br />
          "하나님의 사랑은 끝이 없다"라고 한 줄 적습니다.
        </p>
        <div style={{ background: 'rgba(109, 76, 255, 0.05)', padding: 40, borderRadius: 'var(--osd-radius)', border: `1px solid var(--osd-accent)` }}>
          <p style={{ fontSize: 28, lineHeight: 1.5, margin: 0 }}>
            "이 파일을 읽고 어울리는 '찰스 스펄전' 예화를 찾아 <code style={{ color: 'var(--osd-text)' }}>스펄전_설교예화.md</code> 파일로 예쁘게 정리해줘."
          </p>
        </div>
      </div>
      <div style={{ width: 500, height: 500, borderRadius: 'var(--osd-radius)', overflow: 'hidden', border: `1px solid ${line}` }}>
        <img src={ai_research} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
    <Footer pageNum={7} total={10} section="실습 3" />
  </div>
);

const P08_Prac3Result: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px' }}>
    <Eyebrow>실습 3 결과</Eyebrow>
    <SectionHeading>AI의 자율성 체감</SectionHeading>
    <div style={{ display: 'flex', gap: 48, flexDirection: 'column' }}>
      <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.6, margin: 0 }}>
        바탕화면에 새로운 마크다운 문서가 스스로 생성됩니다.<br />
        단순 검색을 넘어, 기존 문서의 맥락을 파악하고<br />
        알맞은 내용을 찾아 새로운 문서로 완성하는 능력을 보여줍니다.
      </p>
      <div style={{ borderTop: `1px solid ${line}`, width: 200 }} />
      <p style={{ fontSize: 28, color: 'var(--osd-text)', lineHeight: 1.6, margin: 0 }}>
        챗GPT는 복사/붙여넣기를 사람이 해야 하지만,<br />
        에이전트는 <strong style={{ color: 'var(--osd-accent)' }}>문서 작성의 전 과정을 스스로 마무리</strong>합니다.
      </p>
    </div>
    <Footer pageNum={8} total={10} section="실습 3" />
  </div>
);

const P09_Prac4: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px' }}>
    <Eyebrow>실습 4</Eyebrow>
    <SectionHeading>대량의 문서 분류 자동화</SectionHeading>
    <div style={{ display: 'flex', gap: 64 }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.6, marginBottom: 40 }}>
          주보 광고, 심방 기록, 설교 메모가 뒤섞인 실습 폴더를 엽니다.<br />
          사람이 하면 파일 하나씩 열어보고 옮겨야 하는 귀찮은 작업입니다.
        </p>
        <div style={{ background: '#ffffff', padding: 32, borderRadius: 'var(--osd-radius)', border: `1px solid ${line}` }}>
          <p style={{ fontSize: 24, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
            "이 5개 파일을 읽어보고 '심방' 내용이면 심방기록 폴더로, '설교' 내용이면 설교메모 폴더로 스스로 분류해서 이동시켜줘."
          </p>
        </div>
      </div>
      <div style={{ width: 440, height: 440, borderRadius: 'var(--osd-radius)', overflow: 'hidden', border: `1px solid ${line}` }}>
        <img src={auto_sorting} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
    <Footer pageNum={9} total={10} section="실습 4" />
  </div>
);

const P10_WrapUp: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Eyebrow>마무리</Eyebrow>
    <SectionHeading>옵시디언 연결 예고</SectionHeading>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, lineHeight: 1.6, textAlign: 'left', maxWidth: 1200 }}>
      이제 AI에게는 단순한 '질문'을 넘어 <strong style={{ color: 'var(--osd-text)' }}>'행동'</strong>을 요구할 수 있습니다. 1시간 만에 비서의 능력을 확인하셨습니다.
    </p>
    <div style={{ marginTop: 64, background: 'rgba(109, 76, 255, 0.05)', padding: 48, borderRadius: 'var(--osd-radius)', border: `1px solid var(--osd-accent)` }}>
      <p style={{ fontSize: 32, margin: 0, color: 'var(--osd-text)', fontWeight: 600, lineHeight: 1.5 }}>
        다음 시간에는 안티그래비티가 만든 수많은 파일들을<br />
        <span style={{ color: 'var(--osd-accent)' }}>'옵시디언'</span>이라는 지식 그물망에 어떻게 쓸어 담고 연결할지<br />
        그 마법 같은 방법을 알려드립니다!
      </p>
    </div>
    <Footer pageNum={10} total={10} section="마무리" />
  </div>
);

export const meta: SlideMeta = { title: '안티그래비티 집중 실습' };

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
