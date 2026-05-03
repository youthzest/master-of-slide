import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
import governanceLayers from './assets/governance-layers.png';
import harnessHero from './assets/harness-hero.png';

export const design: DesignSystem = {
  palette: { bg: '#f4f0e8', text: '#15181d', accent: '#00a676' },
  fonts: {
    display:
      '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
    body: '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
  },
  typeScale: { hero: 124, body: 34 },
  radius: 8,
};

const ink = '#15181d';
const paper = '#f4f0e8';
const surface = '#fffaf1';
const muted = '#66706f';
const line = '#d7d0c3';
const red = '#d94d42';
const blue = '#2c6bed';
const amber = '#e2a12c';
const violet = '#6d5bd0';
const padX = 118;
const padY = 82;
const totalPages = 10;

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
};

const css = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes growX {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.18); opacity: 1; }
}
.fade-up { animation: fadeUp 720ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.grow-x { animation: growX 780ms cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: left center; }
.pulse-dot { animation: pulseDot 2.2s ease-in-out infinite; }
`;

const Style = () => <style>{css}</style>;

const Footer = ({ page, section }: { page: number; section: string }) => (
  <div
    style={{
      position: 'absolute',
      left: padX,
      right: padX,
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
    <span>
      {String(page).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
    </span>
  </div>
);

const PageShell = ({
  page,
  section,
  children,
  bg = paper,
}: {
  page: number;
  section: string;
  children: ReactNode;
  bg?: string;
}) => (
  <div style={{ ...fill, background: bg, padding: `${padY}px ${padX}px` }}>
    <Style />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(90deg, rgba(21,24,29,0.04) 1px, transparent 1px), linear-gradient(0deg, rgba(21,24,29,0.04) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }}
    />
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    <Footer page={page} section={section} />
  </div>
);

const Eyebrow = ({
  children,
  color = 'var(--osd-accent)',
}: {
  children: ReactNode;
  color?: string;
}) => (
  <div
    className="fade-up"
    style={{
      color,
      fontSize: 24,
      fontWeight: 900,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 24,
    }}
  >
    {children}
  </div>
);

const Title = ({
  children,
  size = 76,
  maxWidth = 1260,
}: {
  children: ReactNode;
  size?: number;
  maxWidth?: number;
}) => (
  <h2
    className="fade-up"
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: size,
      lineHeight: 1.14,
      fontWeight: 900,
      margin: 0,
      maxWidth,
      letterSpacing: 0,
    }}
  >
    {children}
  </h2>
);

const Body = ({ children, maxWidth = 1040 }: { children: ReactNode; maxWidth?: number }) => (
  <p
    className="fade-up"
    style={{
      animationDelay: '120ms',
      fontSize: 38,
      lineHeight: 1.52,
      fontWeight: 600,
      color: muted,
      maxWidth,
      margin: '34px 0 0',
    }}
  >
    {children}
  </p>
);

const NumberCard = ({
  value,
  label,
  tone = 'var(--osd-accent)',
}: {
  value: string;
  label: string;
  tone?: string;
}) => (
  <div
    style={{
      background: surface,
      border: `3px solid ${ink}`,
      borderRadius: 'var(--osd-radius)',
      padding: '34px 36px',
      boxShadow: `10px 10px 0 ${ink}`,
      minWidth: 322,
    }}
  >
    <div style={{ color: tone, fontSize: 72, lineHeight: 1, fontWeight: 950 }}>{value}</div>
    <div style={{ marginTop: 18, color: ink, fontSize: 28, lineHeight: 1.36, fontWeight: 850 }}>
      {label}
    </div>
  </div>
);

const Pill = ({ children, color = ink }: { children: ReactNode; color?: string }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 52,
      border: `2px solid ${color}`,
      borderRadius: 999,
      padding: '8px 22px',
      color,
      fontSize: 24,
      fontWeight: 900,
      background: 'rgba(255,255,255,0.52)',
    }}
  >
    {children}
  </span>
);

const Cover: Page = () => (
  <div style={{ ...fill, background: ink, color: paper, padding: `${padY}px ${padX}px` }}>
    <Style />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 74% 28%, rgba(0,166,118,0.36), transparent 28%), linear-gradient(135deg, rgba(244,240,232,0.08), transparent 52%)',
      }}
    />
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: 76,
      }}
    >
      <div style={{ paddingTop: 54 }}>
        <Eyebrow>NewsInsight · 2026.05.03</Eyebrow>
        <h1
          className="fade-up"
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            lineHeight: 1.05,
            fontWeight: 950,
            margin: 0,
            maxWidth: 1040,
            letterSpacing: 0,
          }}
        >
          모델은 상품이 된다,
          <br />
          그래서 하네스가 이긴다
        </h1>
        <p
          className="fade-up"
          style={{
            animationDelay: '160ms',
            color: '#b7c2bd',
            fontSize: 36,
            lineHeight: 1.5,
            margin: '42px 0 0',
            maxWidth: 920,
            fontWeight: 650,
          }}
        >
          같은 모델을 써도 결과가 달라지는 이유는 모델 안이 아니라 모델 바깥의 실행 구조에 있다.
        </p>
      </div>
      <div style={{ alignSelf: 'center' }}>
        <img
          src={harnessHero}
          alt="모델 코어를 둘러싼 하네스와 피드백 루프 추상 이미지"
          style={{
            width: 720,
            height: 720,
            display: 'block',
            objectFit: 'cover',
            border: '4px solid #8df0c5',
            boxShadow: '18px 18px 0 rgba(0, 0, 0, 0.42)',
          }}
        />
      </div>
    </div>
    <Footer page={1} section="cover" />
  </div>
);

const Premise: Page = () => (
  <PageShell page={2} section="premise">
    <Eyebrow>같은 모델, 다른 결과</Eyebrow>
    <Title size={82}>차이는 더 좋은 프롬프트가 아니라 더 좋은 배관이다.</Title>
    <Body maxWidth={1280}>
      모두가 Claude와 GPT를 쓴다. 그런데 어떤 팀은 에이전트가 장시간 작업을 끝내고, 어떤 팀은 여전히
      복붙 프롬프트에 갇힌다.
    </Body>
    <div style={{ display: 'flex', gap: 42, marginTop: 72 }}>
      <NumberCard value="52.8%" label="기본 하네스의 Terminal-Bench 2.0 점수" tone={red} />
      <NumberCard value="66.5%" label="모델은 그대로, 하네스만 재설계한 결과" />
      <NumberCard value="+13.7p" label="2026년 경쟁우위가 생기는 위치" tone={blue} />
    </div>
  </PageShell>
);

const PromptEra: Page = () => (
  <PageShell page={3} section="from prompt to harness">
    <Eyebrow>우리는 모두 죄인이었다</Eyebrow>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.92fr 1.08fr',
        gap: 70,
        alignItems: 'center',
      }}
    >
      <Title size={74}>프롬프트 시대는 실패의 책임을 사용자에게 돌렸다.</Title>
      <div style={{ display: 'grid', gap: 28 }}>
        {[
          ['프롬프트', '사용자가 문장을 고친다', red],
          ['컨텍스트', '엔지니어가 RAG와 툴을 고친다', amber],
          ['하네스', '시스템이 자기 룰을 고친다', 'var(--osd-accent)'],
        ].map(([label, copy, color]) => (
          <div
            key={label}
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              gap: 24,
              alignItems: 'center',
              padding: '28px 34px',
              background: surface,
              border: `3px solid ${ink}`,
              boxShadow: `7px 7px 0 ${color}`,
            }}
          >
            <div style={{ color, fontSize: 32, fontWeight: 950 }}>{label}</div>
            <div style={{ fontSize: 32, lineHeight: 1.38, fontWeight: 750 }}>{copy}</div>
          </div>
        ))}
      </div>
    </div>
  </PageShell>
);

const AccuracyCliff: Page = () => (
  <PageShell page={4} section="accuracy cliff" bg="#fbf7ee">
    <Eyebrow color={red}>롱러닝 정확도 절벽</Eyebrow>
    <Title size={76}>95% 모델도 10단계 작업에서는 약 60%로 내려간다.</Title>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 72,
        marginTop: 68,
        alignItems: 'end',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'end', gap: 36, height: 360 }}>
        {[
          ['1', '95%', 342, 'var(--osd-accent)'],
          ['5', '77%', 277, amber],
          ['10', '60%', 216, red],
        ].map(([step, value, height, color]) => (
          <div key={step} style={{ width: 160 }}>
            <div
              style={{
                height,
                background: color,
                border: `3px solid ${ink}`,
                boxShadow: `8px 8px 0 ${ink}`,
              }}
            />
            <div style={{ marginTop: 24, fontSize: 26, fontWeight: 900 }}>Step {step}</div>
            <div style={{ color, fontSize: 42, fontWeight: 950 }}>{value}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: ink,
          color: paper,
          padding: '46px 50px',
          borderRadius: 10,
          minHeight: 314,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#8df0c5', fontSize: 28, fontWeight: 900, marginBottom: 22 }}>
          핵심 산수
        </div>
        <div style={{ fontSize: 78, lineHeight: 1.1, fontWeight: 950 }}>0.95¹⁰ ≈ 0.60</div>
        <p
          style={{
            margin: '28px 0 0',
            color: '#cbd5d0',
            fontSize: 31,
            lineHeight: 1.5,
            fontWeight: 650,
          }}
        >
          에이전트가 오래 일할수록 한 번의 실수는 뒤 단계 전체를 오염시킨다.
        </p>
      </div>
    </div>
  </PageShell>
);

const FeedbackLoop: Page = () => (
  <PageShell page={5} section="feedback loop">
    <Eyebrow>하네스는 피드백 루프다</Eyebrow>
    <Title size={74}>틀린 답을 고치는 대신, 틀리게 만든 규칙을 고친다.</Title>
    <div style={{ position: 'relative', height: 470, marginTop: 70 }}>
      {[
        ['입력', '요청·목표·제약', 60, 84, blue],
        ['작업', '모델·툴·메모리', 650, 84, violet],
        ['검증', '테스트·리뷰·관찰', 1240, 84, amber],
        ['룰 보강', '다음 실행의 기본값', 650, 300, 'var(--osd-accent)'],
      ].map(([title, copy, left, top, color]) => (
        <div
          key={title}
          style={{
            position: 'absolute',
            left,
            top,
            width: 420,
            minHeight: 132,
            padding: '28px 32px',
            background: surface,
            border: `3px solid ${ink}`,
            boxShadow: `8px 8px 0 ${color}`,
          }}
        >
          <div style={{ color, fontSize: 30, fontWeight: 950 }}>{title}</div>
          <div style={{ marginTop: 12, fontSize: 28, lineHeight: 1.38, fontWeight: 760 }}>
            {copy}
          </div>
        </div>
      ))}
      <div
        className="grow-x"
        style={{
          position: 'absolute',
          left: 504,
          top: 152,
          width: 112,
          height: 8,
          background: ink,
        }}
      />
      <div
        className="grow-x"
        style={{
          position: 'absolute',
          left: 1094,
          top: 152,
          width: 112,
          height: 8,
          background: ink,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 820,
          top: 242,
          width: 280,
          height: 120,
          borderBottom: `8px solid ${ink}`,
          borderLeft: `8px solid ${ink}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 426,
          top: 356,
          width: 248,
          height: 8,
          background: ink,
        }}
      />
    </div>
  </PageShell>
);

const RuleExample: Page = () => (
  <PageShell page={6} section="rule example" bg="#eef6f1">
    <Eyebrow>자가진화는 이렇게 작동한다</Eyebrow>
    <Title size={72}>비가 오면 캔슬하지 말고 실내로 전환하라.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 54, marginTop: 72 }}>
      <div style={{ background: surface, border: `3px solid ${red}`, padding: 42, minHeight: 340 }}>
        <Pill color={red}>옛날 방식</Pill>
        <p style={{ fontSize: 42, lineHeight: 1.44, fontWeight: 850, margin: '46px 0 0' }}>
          답변을 고친다.
          <br />
          다음번에도 같은 실수를 다시 만난다.
        </p>
      </div>
      <div
        style={{
          background: ink,
          color: paper,
          border: `3px solid ${ink}`,
          padding: 42,
          minHeight: 340,
        }}
      >
        <Pill color="#8df0c5">하네스 방식</Pill>
        <p style={{ fontSize: 42, lineHeight: 1.44, fontWeight: 850, margin: '46px 0 0' }}>
          들어가는 룰을 고친다.
          <br />
          다음 실행부터 기본 행동이 바뀐다.
        </p>
      </div>
    </div>
  </PageShell>
);

const ProgressiveDisclosure: Page = () => (
  <PageShell page={7} section="progressive disclosure">
    <Eyebrow>채우지 말고 아껴 써라</Eyebrow>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.95fr 1.05fr',
        gap: 70,
        alignItems: 'center',
      }}
    >
      <div>
        <Title size={74}>컨텍스트는 넓을수록 똑똑해지는 자원이 아니다.</Title>
        <Body>
          좋은 하네스는 모든 것을 항상 넣지 않는다. frontmatter부터 읽고, 필요할 때만 본문과 도구를
          연다.
        </Body>
      </div>
      <div style={{ display: 'grid', gap: 28 }}>
        {[
          ['200K', '약 96%', '스위트 스팟', 'var(--osd-accent)'],
          ['500K', '약 90%', '주의 구간', amber],
          ['1M', '약 86%', '정확도 손실', red],
        ].map(([tokens, accuracy, label, color]) => (
          <div
            key={tokens}
            style={{
              display: 'grid',
              gridTemplateColumns: '190px 1fr 220px',
              gap: 24,
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 54, fontWeight: 950, color }}>{tokens}</div>
            <div style={{ height: 24, border: `2px solid ${ink}`, background: line }}>
              <div
                style={{
                  width: accuracy === '약 96%' ? '96%' : accuracy === '약 90%' ? '90%' : '86%',
                  height: '100%',
                  background: color,
                }}
              />
            </div>
            <div style={{ fontSize: 30, fontWeight: 900 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  </PageShell>
);

const Governance: Page = () => (
  <PageShell page={8} section="skill governance" bg="#f7f3fb">
    <Eyebrow>팀 스킬을 강제하면 죽는다</Eyebrow>
    <Title size={72}>
      하나의 마스터 스킬이 아니라, 아래에서 위로 올라가는 거버넌스가 필요하다.
    </Title>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, marginTop: 70 }}>
      {[
        ['개인 스킬', '본인', '무제한', '내 일을 줄이는 규칙부터 시작한다.', 'var(--osd-accent)'],
        ['팀 스킬', '팀 합의', '중간', '반복되는 패턴만 공유 자산으로 올린다.', blue],
        ['회사 자산', '거버넌스', '엄격', '검증된 규칙만 승인과 감사 대상이 된다.', violet],
      ].map(([tier, owner, freedom, copy, color]) => (
        <div
          key={tier}
          style={{
            background: surface,
            border: `3px solid ${ink}`,
            boxShadow: `8px 8px 0 ${color}`,
            padding: 34,
            minHeight: 420,
          }}
        >
          <div style={{ color, fontSize: 34, fontWeight: 950 }}>{tier}</div>
          <div
            style={{
              marginTop: 42,
              display: 'grid',
              gap: 18,
              fontSize: 28,
              lineHeight: 1.38,
              fontWeight: 800,
            }}
          >
            <div>관리 주체: {owner}</div>
            <div>변경 자유도: {freedom}</div>
          </div>
          <p
            style={{
              margin: '46px 0 0',
              color: muted,
              fontSize: 28,
              lineHeight: 1.48,
              fontWeight: 650,
            }}
          >
            {copy}
          </p>
        </div>
      ))}
    </div>
  </PageShell>
);

const Questions: Page = () => (
  <PageShell page={9} section="questions">
    <Eyebrow>생각해볼 질문</Eyebrow>
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 0.82fr', gap: 68, alignItems: 'center' }}
    >
      <div style={{ display: 'grid', gap: 30 }}>
        {[
          '자가진화 스킬을 팀 단위로 동기화할 때, 거버넌스 부담은 어떻게 낮출까?',
          '마크다운 기반 지식 관리는 AI 인터페이스의 적응성을 어떻게 바꿀까?',
          '토큰 누적으로 정확도가 떨어지는 환경에서 개인 평가는 무엇을 봐야 할까?',
        ].map((question, index) => (
          <div
            key={question}
            style={{
              display: 'grid',
              gridTemplateColumns: '74px 1fr',
              gap: 26,
              alignItems: 'start',
            }}
          >
            <div
              className="pulse-dot"
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                background: index === 0 ? 'var(--osd-accent)' : index === 1 ? blue : violet,
                color: paper,
                display: 'grid',
                placeItems: 'center',
                fontSize: 26,
                fontWeight: 950,
              }}
            >
              {index + 1}
            </div>
            <div style={{ fontSize: 39, lineHeight: 1.42, fontWeight: 860 }}>{question}</div>
          </div>
        ))}
      </div>
      <img
        src={governanceLayers}
        alt="개인 스킬, 팀 스킬, 회사 자산으로 확장되는 거버넌스 레이어 인포그래픽"
        style={{
          width: 620,
          height: 620,
          display: 'block',
          objectFit: 'cover',
          border: `4px solid ${ink}`,
          boxShadow: `14px 14px 0 ${ink}`,
          background: surface,
        }}
      />
    </div>
  </PageShell>
);

const Closing: Page = () => (
  <PageShell page={10} section="closing" bg={ink}>
    <div style={{ color: paper }}>
      <Eyebrow>결론</Eyebrow>
      <Title size={86} maxWidth={1340}>
        모델은 상품,
        <br />
        하네스는 차별이다.
      </Title>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44, marginTop: 76 }}>
        {[
          ['나만의 룰 파일을 만들어라', 'AI가 어제 한 실수를 마크다운 한 줄로 남겨라.'],
          ['피드백 받을 채널을 열어둬라', '스킬의 결함이 발견되는 자리를 시스템 안에 만들어라.'],
        ].map(([title, copy], index) => (
          <div
            key={title}
            style={{
              background: '#222831',
              border: '3px solid #8df0c5',
              padding: 42,
              minHeight: 250,
            }}
          >
            <div style={{ color: '#8df0c5', fontSize: 28, fontWeight: 950 }}>0{index + 1}</div>
            <div style={{ marginTop: 28, fontSize: 40, lineHeight: 1.32, fontWeight: 900 }}>
              {title}
            </div>
            <p
              style={{
                margin: '22px 0 0',
                color: '#cbd5d0',
                fontSize: 29,
                lineHeight: 1.48,
                fontWeight: 650,
              }}
            >
              {copy}
            </p>
          </div>
        ))}
      </div>
    </div>
  </PageShell>
);

export const meta: SlideMeta = {
  title: '모델은 상품이 된다, 그래서 하네스가 이긴다',
};

export default [
  Cover,
  Premise,
  PromptEra,
  AccuracyCliff,
  FeedbackLoop,
  RuleExample,
  ProgressiveDisclosure,
  Governance,
  Questions,
  Closing,
] satisfies Page[];
