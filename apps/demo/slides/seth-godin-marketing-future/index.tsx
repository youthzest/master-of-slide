import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
import brandPromise from './assets/brand-promise.png';
import marketingHero from './assets/marketing-future-hero.png';

export const design: DesignSystem = {
  palette: { bg: '#0b0d10', text: '#f4ecdc', accent: '#d6a64b' },
  fonts: {
    display: '"Georgia", "Source Serif Pro", "Times New Roman", serif',
    body: 'system-ui, -apple-system, "Helvetica Neue", "Pretendard", "Noto Sans KR", sans-serif',
  },
  typeScale: { hero: 156, body: 34 },
  radius: 4,
};

const total = 10;
const surface = '#14171c';
const text = '#f4ecdc';
const accent = '#d6a64b';
const muted = '#7a7468';
const line = '#2a2620';
const soft = '#24201a';
const padX = 120;
const padY = 96;

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
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 600ms ease-out both; }
`;

const Style = () => <style>{css}</style>;

const Footer = ({ page, section = 'Marketing Future' }: { page: number; section?: string }) => (
  <div
    style={{
      position: 'absolute',
      left: padX,
      right: padX,
      bottom: 54,
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 21,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: muted,
      borderTop: `1px solid ${line}`,
      paddingTop: 22,
      fontWeight: 650,
    }}
  >
    <span>Editorial Noir · {section}</span>
    <span>
      {String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </span>
  </div>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      fontSize: 23,
      fontWeight: 700,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
      marginBottom: 30,
    }}
  >
    {children}
  </div>
);

const Title = ({
  children,
  size = 82,
  maxWidth = 1250,
}: {
  children: ReactNode;
  size?: number;
  maxWidth?: number;
}) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: '-0.01em',
      color: text,
      margin: 0,
      maxWidth,
    }}
  >
    {children}
  </h2>
);

const Body = ({ children, maxWidth = 1080 }: { children: ReactNode; maxWidth?: number }) => (
  <p
    style={{
      margin: '36px 0 0',
      fontSize: 35,
      lineHeight: 1.52,
      color: '#b7aa96',
      maxWidth,
      fontWeight: 520,
    }}
  >
    {children}
  </p>
);

const Shell = ({
  page,
  section,
  children,
}: {
  page: number;
  section?: string;
  children: ReactNode;
}) => (
  <div style={{ ...fill, padding: `${padY}px ${padX}px` }}>
    <Style />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: 96,
        left: padX,
        width: 320,
        height: 2,
        background: accent,
      }}
    />
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    <Footer page={page} section={section} />
  </div>
);

const Quote = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      borderLeft: `5px solid ${accent}`,
      paddingLeft: 34,
      fontFamily: 'var(--osd-font-display)',
      fontSize: 54,
      lineHeight: 1.25,
      color: text,
      maxWidth: 1320,
    }}
  >
    {children}
  </div>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div style={{ borderTop: `1px solid ${accent}`, paddingTop: 22 }}>
    <div
      style={{
        color: accent,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 62,
        lineHeight: 1,
        fontWeight: 800,
      }}
    >
      {value}
    </div>
    <div
      style={{ marginTop: 16, color: '#b7aa96', fontSize: 26, lineHeight: 1.42, fontWeight: 650 }}
    >
      {label}
    </div>
  </div>
);

const Cover: Page = () => (
  <div
    style={{
      ...fill,
      display: 'grid',
      gridTemplateColumns: '1fr 0.78fr',
      gap: 70,
      padding: `${padY}px ${padX}px`,
    }}
  >
    <Style />
    <div style={{ alignSelf: 'center' }}>
      <Eyebrow>Seth Godin · Learning Note</Eyebrow>
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: '-0.02em',
          margin: 0,
          color: text,
          maxWidth: 1040,
        }}
      >
        마케팅의 미래는
        <br />더 크게가 아니라
        <br />더 깊게다
      </h1>
      <Body maxWidth={900}>
        광고를 많이 사는 시대가 끝나면, 브랜드는 사람들이 기꺼이 이야기하는 약속이 된다.
      </Body>
    </div>
    <img
      src={marketingHero}
      alt="밤의 전략 스튜디오에 놓인 브랜드 노트와 마케팅 메모"
      style={{
        width: 660,
        height: 660,
        objectFit: 'cover',
        alignSelf: 'center',
        border: `1px solid ${line}`,
      }}
    />
    <Footer page={1} section="Cover" />
  </div>
);

const Definition: Page = () => (
  <Shell page={2} section="Definition">
    <Eyebrow>01 · 마케팅의 정의</Eyebrow>
    <Title>마케팅은 광고가 아니라, 사람들이 이야기하게 만드는 조건이다.</Title>
    <Body>
      허슬, 프로모션, 노출량이 아니라 누군가가 자발적으로 말하고 싶어지는 환경을 설계하는 일이다.
    </Body>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 42, marginTop: 86 }}>
      <Metric value="광고" label="돈을 내고 interrupt 하는 것" />
      <Metric value="입소문" label="사람이 사람에게 옮기는 것" />
      <Metric value="조건" label="그 이야기가 생기게 만드는 설계" />
    </div>
  </Shell>
);

const Permission: Page = () => (
  <Shell page={3} section="Permission">
    <Eyebrow>02 · Permission Marketing</Eyebrow>
    <Title>좋은 메시지는 도착했을 때 방해가 아니라 기대가 된다.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 34, marginTop: 78 }}>
      {[
        ['Anticipated', '기다리던 메시지인가?'],
        ['Personal', '나에게 온 말처럼 느껴지는가?'],
        ['Relevant', '지금 내 문제와 관련 있는가?'],
      ].map(([head, copy]) => (
        <div
          key={head}
          style={{
            background: surface,
            padding: 40,
            minHeight: 240,
            borderTop: `2px solid ${accent}`,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--osd-font-display)',
              color: accent,
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            {head}
          </div>
          <p
            style={{
              margin: '34px 0 0',
              color: '#b7aa96',
              fontSize: 31,
              lineHeight: 1.42,
              fontWeight: 560,
            }}
          >
            {copy}
          </p>
        </div>
      ))}
    </div>
  </Shell>
);

const BrandPromise: Page = () => (
  <div
    style={{
      ...fill,
      display: 'grid',
      gridTemplateColumns: '0.78fr 1fr',
      gap: 70,
      padding: `${padY}px ${padX}px`,
    }}
  >
    <Style />
    <img
      src={brandPromise}
      alt="약속과 일관성을 상징하는 어두운 책상 위 오브젝트"
      style={{
        width: 640,
        height: 640,
        objectFit: 'cover',
        objectPosition: '62% 50%',
        alignSelf: 'center',
        border: `1px solid ${line}`,
      }}
    />
    <div style={{ alignSelf: 'center' }}>
      <Eyebrow>03 · Brand = Promise</Eyebrow>
      <Title size={78}>브랜드는 로고가 아니라, 사람들이 당신에게 기대하는 약속이다.</Title>
      <Body>
        나이키가 호텔을 열면 무언가 상상된다. 하얏트가 운동화를 만들면 상상이 흐릿하다. 차이는
        로고가 아니라 약속이다.
      </Body>
    </div>
    <Footer page={4} section="Brand" />
  </div>
);

const Consistency: Page = () => (
  <Shell page={5} section="Consistency">
    <Eyebrow>04 · Consistency</Eyebrow>
    <Quote>고객이 원하는 것은 당신의 매일 다른 감정이 아니라, 매번 지켜지는 전문성이다.</Quote>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, marginTop: 88 }}>
      <div style={{ background: surface, padding: 44 }}>
        <div
          style={{
            color: muted,
            fontSize: 24,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Overrated
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 58,
            fontFamily: 'var(--osd-font-display)',
            color: text,
          }}
        >
          진정성
        </div>
      </div>
      <div style={{ background: soft, padding: 44, borderTop: `2px solid ${accent}` }}>
        <div
          style={{
            color: accent,
            fontSize: 24,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          What earns trust
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 58,
            fontFamily: 'var(--osd-font-display)',
            color: text,
          }}
        >
          일관성
        </div>
      </div>
    </div>
  </Shell>
);

const Remarkable: Page = () => (
  <Shell page={6} section="Remarkable">
    <Eyebrow>05 · Remarkable</Eyebrow>
    <Title>리마커블하다는 것은, 사람들이 말하지 않을 수 없게 만드는 것이다.</Title>
    <Body>
      Carmine's의 많은 마늘, 큰 공유 음식, 6인 이상 예약처럼 경험 자체가 다음 날 대화의 소재가
      되어야 한다.
    </Body>
    <div
      style={{
        marginTop: 76,
        height: 180,
        borderTop: `1px solid ${accent}`,
        borderBottom: `1px solid ${line}`,
        display: 'flex',
        alignItems: 'center',
        gap: 44,
      }}
    >
      {['특별한 경험', '기억되는 차이', '전달 가능한 이야기'].map((item) => (
        <span
          key={item}
          style={{ fontSize: 38, color: text, fontFamily: 'var(--osd-font-display)' }}
        >
          {item}
        </span>
      ))}
    </div>
  </Shell>
);

const AiStrategy: Page = () => (
  <Shell page={7} section="AI Strategy">
    <Eyebrow>06 · AI 시대의 선택</Eyebrow>
    <Title>AI를 더 싸게 쓰는 팀과 더 좋게 쓰는 팀은 다른 미래를 만든다.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, marginTop: 78 }}>
      <div style={{ padding: 44, background: surface }}>
        <div style={{ fontSize: 48, fontFamily: 'var(--osd-font-display)', color: muted }}>
          Race to the bottom
        </div>
        <p style={{ fontSize: 32, lineHeight: 1.5, color: '#b7aa96' }}>
          AI로 비용만 줄이면 누구나 따라 하는 평준화 경쟁에 들어간다.
        </p>
      </div>
      <div style={{ padding: 44, background: soft, borderTop: `2px solid ${accent}` }}>
        <div style={{ fontSize: 48, fontFamily: 'var(--osd-font-display)', color: accent }}>
          Race to the better
        </div>
        <p style={{ fontSize: 32, lineHeight: 1.5, color: '#b7aa96' }}>
          AI로 고객 경험을 더 정확하고 개인적이며 가치 있게 만든다.
        </p>
      </div>
    </div>
  </Shell>
);

const FalseProxies: Page = () => (
  <Shell page={8} section="False Proxies">
    <Eyebrow>07 · 가짜 지표</Eyebrow>
    <Title>쉽게 측정되는 것을 중요하게 여기면, 중요한 것을 잃는다.</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 82 }}>
      <Metric value="메일 수" label="쉽게 재지만 스팸을 만들 수 있다" />
      <Metric value="구독자·오픈률" label="더 어렵지만 관계의 질을 보게 한다" />
    </div>
    <Body>지표는 행동을 설계한다. 그래서 무엇을 재는지가 곧 어떤 조직이 되는지를 결정한다.</Body>
  </Shell>
);

const CustomerChoice: Page = () => (
  <Shell page={9} section="Customer Choice">
    <Eyebrow>08 · 고객 선택</Eyebrow>
    <Title>당신이 고객을 선택하면, 그 고객이 당신의 미래를 선택한다.</Title>
    <Body maxWidth={1180}>
      더 크게가 아니라 더 좋게. 모든 사람을 잡으려는 브랜드는 약속을 흐리고, 특정한 사람을 돕는
      브랜드는 미래를 선명하게 만든다.
    </Body>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, marginTop: 78 }}>
      {['누구를 돕는가', '무엇을 약속하는가', '무엇을 거절하는가'].map((item, i) => (
        <div
          key={item}
          style={{
            borderTop: `2px solid ${i === 1 ? accent : line}`,
            paddingTop: 28,
            color: i === 1 ? accent : text,
            fontSize: 36,
            fontFamily: 'var(--osd-font-display)',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </Shell>
);

const Closing: Page = () => (
  <Shell page={10} section="Closing">
    <Eyebrow>마지막 질문</Eyebrow>
    <Title size={92}>나는 광고를 하고 있는가, 아니면 사람들이 말할 약속을 만들고 있는가?</Title>
    <div style={{ marginTop: 86, display: 'grid', gap: 28, maxWidth: 1220 }}>
      {[
        '마케팅 = 사람들이 이야기하게 만드는 조건',
        '브랜드 = 매번 지켜지는 약속',
        '성공 = 내가 선택한 고객이 만든 미래',
      ].map((item) => (
        <div
          key={item}
          style={{
            color: '#b7aa96',
            fontSize: 37,
            lineHeight: 1.35,
            borderBottom: `1px solid ${line}`,
            paddingBottom: 24,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </Shell>
);

export const meta: SlideMeta = {
  title: '세스 고딘 — 마케팅의 미래와 브랜드 구축',
};

export default [
  Cover,
  Definition,
  Permission,
  BrandPromise,
  Consistency,
  Remarkable,
  AiStrategy,
  FalseProxies,
  CustomerChoice,
  Closing,
] satisfies Page[];
