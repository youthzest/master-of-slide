import React from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

// 1. Design System Tokens
export const design: DesignSystem = {
  palette: { bg: '#0b132b', text: '#f4f5f6', accent: '#00b4d8' }, // Dark neon palette
  fonts: {
    display: '"Inter", "Noto Sans KR", system-ui, sans-serif', // Added Noto Sans KR for Korean
    body: '"Inter", "Noto Sans KR", system-ui, sans-serif'
  },
  typeScale: { hero: 120, heading: 64, subheading: 48, body: 28, small: 20 }, // More granular type scale
  radius: 12
};

// 2. Metadata Export
export const meta: SlideMeta = {
  title: "하나님 나라의 분배원리"
};

// 3. Keyframes for smooth animations
const keyframes = `
@keyframes lFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.l-fadeup { animation: lFadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes lScaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.l-scalein { animation: lScaleIn 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }

/* Further animations can be added if needed, e.g., for specific elements */
`;
const Style = () => <style>{keyframes}</style>;

// Helper components for consistent styling and animations
const Title: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => (
  <h1
    className="l-fadeup"
    style={{
      fontSize: design.typeScale.heading,
      fontWeight: 700,
      color: design.palette.text,
      marginBottom: 40,
      animationDelay: `${delay}ms`,
    }}
  >
    {children}
  </h1>
);

const Subheading: React.FC<{ children: React.ReactNode, accent?: boolean, delay?: number }> = ({ children, accent = false, delay = 0 }) => (
  <h2
    className="l-fadeup"
    style={{
      fontSize: design.typeScale.subheading,
      fontWeight: 600,
      color: accent ? design.palette.accent : design.palette.text,
      marginBottom: 30,
      animationDelay: `${delay}ms`,
    }}
  >
    {children}
  </h2>
);

const BodyText: React.FC<{ children: React.ReactNode, delay?: number, style?: React.CSSProperties }> = ({ children, delay = 0, style }) => (
  <p
    className="l-fadeup"
    style={{
      fontSize: design.typeScale.body,
      color: design.palette.text,
      lineHeight: 1.6,
      animationDelay: `${delay}ms`,
      ...style
    }}
  >
    {children}
  </p>
);

const ListItem: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => (
  <li
    className="l-fadeup"
    style={{
      fontSize: design.typeScale.body,
      color: design.palette.text,
      lineHeight: 1.8,
      marginBottom: 16,
      display: 'flex',
      alignItems: 'flex-start',
      animationDelay: `${delay}ms`,
    }}
  >
    <span
      style={{
        color: design.palette.accent,
        fontSize: design.typeScale.body * 1.1, // Slightly larger bullet
        marginRight: 15,
        lineHeight: 1,
        fontWeight: 700,
      }}
    >
      ◆
    </span>
    <span style={{ flex: 1 }}>{children}</span>
  </li>
);

// Common slide wrapper with background, dimensions, and base styles
const SlideWrapper: React.FC<{ children: React.ReactNode, style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: design.palette.bg,
      height: 1080,
      width: 1920,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: design.fonts.body,
      color: design.palette.text,
      ...style
    }}
  >
    <Style />
    {children}
  </div>
);

// --- Slide Components ---

const Cover: Page = () => (
  <SlideWrapper>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 100,
        textAlign: 'center',
      }}
    >
      <h1
        className="l-scalein" // Using scale-in for the main title for a grander entrance
        style={{
          fontSize: design.typeScale.hero,
          fontWeight: 800,
          color: design.palette.accent,
          marginBottom: 30,
          lineHeight: 1.1,
          textShadow: `0 0 25px ${design.palette.accent}80`, // Enhanced neon glow
        }}
      >
        하나님 나라의 분배원리
      </h1>
      <BodyText delay={600} style={{ fontSize: design.typeScale.subheading * 0.7, maxWidth: 1200, color: design.palette.text + 'e0' }}>
        단순한 물질적 분배를 넘어선 <span style={{ color: design.palette.accent, fontWeight: 700 }}>신앙인의 삶의 방식</span>과 <span style={{ color: design.palette.accent, fontWeight: 700 }}>하나님에 대한 태도</span>를 포함하는 핵심 신학적 개념입니다.
      </BodyText>
    </div>
  </SlideWrapper>
);

const Introduction: Page = () => (
  <SlideWrapper>
    <div
      style={{
        padding: 120,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Title>핵심 원리 이해</Title>
      <Subheading delay={400}>신앙인의 삶과 하나님의 정의</Subheading>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 40 }}>
        <ListItem delay={800}>
          재물의 분배를 통해 <span style={{ color: design.palette.accent, fontWeight: 700 }}>하나님 나라의 정의와 공의</span>를 실현합니다.
        </ListItem>
        <ListItem delay={1200}>
          <span style={{ color: design.palette.accent, fontWeight: 700 }}>자발적인 나눔</span>과 <span style={{ color: design.palette.accent, fontWeight: 700 }}>급진적인 신뢰</span>를 바탕으로 한 '은혜의 흐름'을 지향합니다.
        </ListItem>
        <ListItem delay={1600}>
          막연한 이론이 아닌, <span style={{ color: design.palette.accent, fontWeight: 700 }}>삶의 모든 영역에서 구체적인 적용</span>을 요구합니다.
        </ListItem>
      </ul>
    </div>
  </SlideWrapper>
);

const Section1: Page = () => (
  <SlideWrapper>
    <div
      style={{
        padding: 120,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Title>1. 신앙의 실천적 구체성</Title>
      <Subheading accent delay={400}>부칙의 신학: 삶의 세부 원칙</Subheading>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 40 }}>
        <ListItem delay={800}>
          참된 신앙은 막연한 이론에 그치지 않고, <span style={{ color: design.palette.accent, fontWeight: 700 }}>삶의 모든 영역에서 구체적인 적용과 세부적인 "부칙"</span>을 요구합니다.
        </ListItem>
        <ListItem delay={1200}>
          이는 기도만으로는 부족하며, <span style={{ color: design.palette.accent, fontWeight: 700 }}>실제적이고 상세한 계획과 행동</span>이 동반되어야 함을 의미합니다.
        </ListItem>
        <ListItem delay={1600}>
          삶의 세부 원칙들을 통해 신앙이 견고해지고, 이는 <span style={{ color: design.palette.accent, fontWeight: 700 }}>하나님 나라의 시민으로서 탁월한 삶</span>을 살아가는 증거가 됩니다.
        </ListItem>
        <ListItem delay={2000}>
          단순한 원칙만 고수하는 것은 "꼴통"이 될 수 있으나, <span style={{ color: design.palette.accent, fontWeight: 700 }}>구체적인 "부칙"을 이해하고 적용하는 것</span>이야말로 "정통" 신앙의 핵심입니다.
        </ListItem>
      </ul>
    </div>
  </SlideWrapper>
);

const Section2: Page = () => (
  <SlideWrapper>
    <div
      style={{
        padding: 120,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Title>2. 은혜의 통로로서의 분배</Title>
      <Subheading accent delay={400}>속건제의 은혜 원리: 공의로운 나눔</Subheading>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 40 }}>
        <ListItem delay={800}>
          하나님께서 우리에게 재물을 더 주시는 목적은 <span style={{ color: design.palette.accent, fontWeight: 700 }}>개인의 축적이나 탐욕을 위함이 아닙니다.</span>
        </ListItem>
        <ListItem delay={1200}>
          "은혜의 흐름"을 만들어 <span style={{ color: design.palette.accent, fontWeight: 700 }}>약한 자들에게까지 흘러가게 하기 위함</span>입니다.
        </ListItem>
        <ListItem delay={1600}>
          속건제가 균등한 배상을 요구하는 것과 같이, 하나님은 우리가 받은 은혜를 <span style={{ color: design.palette.accent, fontWeight: 700 }}>필요한 곳에 공의롭게 나누기를 기대</span>하십니다.
        </ListItem>
        <ListItem delay={2000}>
          포도원 품꾼 비유에서 주인의 마음이 그러하듯, <span style={{ color: design.palette.accent, fontWeight: 700 }}>더 받은 자는 더 나눌 힘을 부여</span>받은 것입니다.
        </ListItem>
        <ListItem delay={2400}>
          <span style={{ color: design.palette.accent, fontWeight: 700 }}>국가의 강제적인 개입(공산주의)이 아닌, 자원하는 마음으로 나누는 것</span>이 하나님 나라의 분배원리입니다.
        </ListItem>
      </ul>
    </div>
  </SlideWrapper>
);

const Section3: Page = () => (
  <SlideWrapper>
    <div
      style={{
        padding: 120,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Title>3. 매일의 공급을 신뢰하는 급진적 신앙</Title>
      <Subheading accent delay={400}>화목제의 즉시 소비 원리: 쌓아두지 않는 삶</Subheading>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 40 }}>
        <ListItem delay={800}>
          화목제의 "그날에 먹으라"는 명령과 남은 것을 태우라는 규정은 <span style={{ color: design.palette.accent, fontWeight: 700 }}>재물을 쌓아두는 세상의 방식과 완전히 대조</span>됩니다.
        </ListItem>
        <ListItem delay={1200}>
          이는 미래에 대한 염려로 재물을 축적하려는 <span style={{ color: design.palette.accent, fontWeight: 700 }}>"불신앙"을 거부</span>합니다.
        </ListItem>
        <ListItem delay={1600}>
          하나님께서 <span style={{ color: design.palette.accent, fontWeight: 700 }}>매일 필요한 것을 공급해주실 것이라는 급진적인 신뢰</span>를 요구합니다. (오늘 다 쏟아 부으라 그러면 또 다시 주실것이다)
        </ListItem>
        <ListItem delay={2000}>
          탐욕은 징벌로 이어지며, 어리석은 부자의 비유처럼 <span style={{ color: design.palette.accent, fontWeight: 700 }}>쌓아두는 삶은 결국 허무</span>합니다.
        </ListItem>
        <ListItem delay={2400}>
          <span style={{ color: design.palette.accent, fontWeight: 700 }}>지금 가진 것을 나누고 소비하며, 매일 하나님의 새로운 공급을 경험</span>하는 것이 진정한 하나님 나라의 분배원리이며, 이는 곧 하나님에 대한 온전한 신뢰의 표현입니다.
        </ListItem>
      </ul>
    </div>
  </SlideWrapper>
);

const Closing: Page = () => (
  <SlideWrapper>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 100,
        textAlign: 'center',
      }}
    >
      <Title delay={0}>하나님 나라의 분배원리: 실천적 삶</Title>
      <BodyText delay={600} style={{ maxWidth: 1400, marginBottom: 40, fontSize: design.typeScale.body * 1.2 }}>
        하나님 나라의 분배원리는 단순한 물질적 분배를 넘어,
        <br />
        <span className="l-highlight" style={{ color: design.palette.accent, fontWeight: 700, padding: '0 8px', borderRadius: design.radius / 2 }}>신앙인의 구체적인 삶의 실천</span>과
        <br />
        <span className="l-highlight" style={{ color: design.palette.accent, fontWeight: 700, padding: '0 8px', borderRadius: design.radius / 2, animationDelay: '1000ms' }}>은혜의 자발적인 나눔</span>,
        <br />
        그리고 <span className="l-highlight" style={{ color: design.palette.accent, fontWeight: 700, padding: '0 8px', borderRadius: design.radius / 2, animationDelay: '1400ms' }}>매일의 공급에 대한 급진적인 신뢰</span>를 통해
        <br />
        하나님과의 관계와 세상 속에서의 정의를 구현하는 전인적인 신학입니다.
      </BodyText>
      <BodyText delay={2000} style={{ fontSize: design.typeScale.small, color: design.palette.text + '80', marginTop: 30 }}>
        출처: [[원본_6월 14일 하나님 나라의 분배원리]]
      </BodyText>
    </div>
  </SlideWrapper>
);

// 4. Export the slide deck as default
export default [
  Cover,
  Introduction,
  Section1,
  Section2,
  Section3,
  Closing,
] satisfies Page[];