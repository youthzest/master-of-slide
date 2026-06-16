import React from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

// 1. Define a unified design system token
export const design: DesignSystem = {
  palette: { bg: '#0b132b', text: '#f4f5f6', accent: '#00b4d8' }, // Dark neon palette
  fonts: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif'
  },
  typeScale: {
    hero: 120,
    h1: 80,
    h2: 60,
    h3: 44,
    body: 28,
    listItem: 32,
    quote: 36
  },
  radius: 12
};

// 2. Add styling for smooth animations
const keyframes = `
@keyframes lFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.l-fadeup { animation: lFadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }
`;
const Style = () => <style>{keyframes}</style>;

// Helper component for base slide structure
const BaseSlide: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      backgroundColor: design.palette.bg,
      height: 1080,
      width: 1920,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: design.fonts.body,
      color: design.palette.text,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 120px',
      boxSizing: 'border-box'
    }}
  >
    <Style />
    {children}
  </div>
);

// Helper component for list items with consistent styling and animations
const ListItem: React.FC<{ children: React.ReactNode; delay?: number; isQuote?: boolean }> = ({ children, delay = 0, isQuote = false }) => (
  <li
    className="l-fadeup"
    style={{
      fontSize: isQuote ? design.typeScale.quote : design.typeScale.listItem,
      lineHeight: isQuote ? 1.6 : 1.5,
      marginBottom: '1.2rem',
      display: 'flex',
      alignItems: 'flex-start',
      animationDelay: `${delay * 100}ms`, // Stagger animation
      fontStyle: isQuote ? 'italic' : 'normal',
      color: isQuote ? design.palette.accent : design.palette.text, // Quote specific color
      textAlign: isQuote ? 'center' : 'left',
      width: '100%',
      justifyContent: isQuote ? 'center' : 'flex-start'
    }}
  >
    {!isQuote && <span style={{ color: design.palette.accent, marginRight: '1rem', lineHeight: 1 }}>&#x2022;</span>} {/* Custom bullet */}
    <span style={{ flex: isQuote ? 'none' : 1, color: isQuote ? design.palette.accent : design.palette.text }}>{children}</span>
  </li>
);


// 3. Create a set of distinct Page components
const Cover: Page = () => (
  <BaseSlide>
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        maxWidth: '1200px',
      }}
    >
      <h1
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.hero,
          color: design.palette.accent,
          fontFamily: design.fonts.display,
          lineHeight: 1.1,
          animationDelay: '0ms'
        }}
      >
        하나님 나라의 분배원리
      </h1>
      <p
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h2,
          color: design.palette.text,
          animationDelay: '200ms'
        }}
      >
        신앙인의 삶의 방식과 하나님에 대한 태도
      </p>
    </div>
  </BaseSlide>
);

const BigIdea: Page = () => (
  <BaseSlide>
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        maxWidth: '1400px',
        padding: '0 100px'
      }}
    >
      <h2
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h1,
          color: design.palette.accent,
          fontFamily: design.fonts.display,
          lineHeight: 1.2,
          animationDelay: '0ms'
        }}
      >
        단순한 물질적 분배를 넘어선
      </h2>
      <p
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h2,
          color: design.palette.text,
          lineHeight: 1.4,
          animationDelay: '200ms'
        }}
      >
        <strong style={{ color: design.palette.accent }}>신앙인의 삶의 방식</strong>과
        <br />
        <strong style={{ color: design.palette.accent }}>하나님에 대한 태도</strong>를 포함하는
        <br />
        <span style={{ fontSize: design.typeScale.h1 * 0.8, fontWeight: 'bold' }}>핵심 신학적 개념입니다.</span>
      </p>
    </div>
  </BaseSlide>
);

// Generic Section Title Page component
const SectionTitle: React.FC<{ title: string; subtitle: string; delayOffset?: number }> = ({ title, subtitle, delayOffset = 0 }) => (
  <BaseSlide>
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h3,
          color: design.palette.text,
          animationDelay: `${delayOffset * 100}ms`
        }}
      >
        {subtitle}
      </p>
      <h2
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h1,
          color: design.palette.accent,
          fontFamily: design.fonts.display,
          animationDelay: `${(delayOffset + 1) * 100}ms`
        }}
      >
        {title}
      </h2>
    </div>
  </BaseSlide>
);

const Section1Title: Page = () => (
  <SectionTitle
    title="신앙의 실천적 구체성 (부칙의 신학)"
    subtitle="첫 번째 원리"
  />
);

const Section1Content: Page = () => (
  <BaseSlide>
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <h3
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h2,
          color: design.palette.accent,
          marginBottom: '2.5rem',
          textAlign: 'center',
          animationDelay: '0ms'
        }}
      >
        부칙의 신학: 삶의 세부 원칙
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <ListItem delay={2}>참된 신앙은 막연한 이론에 그치지 않고, <strong style={{ color: design.palette.accent }}>삶의 모든 영역에서 구체적인 적용과 세부적인 "부칙"</strong>을 요구합니다.</ListItem>
        <ListItem delay={3}>이는 기도만으로는 부족하며, <strong style={{ color: design.palette.accent }}>실제적이고 상세한 계획과 행동이 동반</strong>되어야 함을 의미합니다.</ListItem>
        <ListItem delay={4}>삶의 세부 원칙들을 통해 <strong style={{ color: design.palette.accent }}>신앙이 견고해지고, 이는 하나님 나라의 시민으로서 탁월한 삶</strong>을 살아가는 증거가 됩니다.</ListItem>
        <ListItem delay={5}>단순한 원칙만 고수하는 것은 "꼴통"이 될 수 있으나, <strong style={{ color: design.palette.accent }}>구체적인 "부칙"을 이해하고 적용하는 것이야말로 "정통" 신앙의 핵심</strong>입니다.</ListItem>
      </ul>
    </div>
  </BaseSlide>
);


const Section2Title: Page = () => (
  <SectionTitle
    title="은혜의 통로로서의 분배 (속건제의 은혜 원리)"
    subtitle="두 번째 원리"
  />
);

const Section2Content: Page = () => (
  <BaseSlide>
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <h3
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h2,
          color: design.palette.accent,
          marginBottom: '2.5rem',
          textAlign: 'center',
          animationDelay: '0ms'
        }}
      >
        속건제의 은혜 원리: 은혜의 흐름
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <ListItem delay={2}>하나님께서 우리에게 재물을 더 주시는 목적은 개인의 축적이나 탐욕을 위함이 아니라, <strong style={{ color: design.palette.accent }}>"은혜의 흐름"을 만들어 약한 자들에게까지 흘러가게 하기 위함</strong>입니다.</ListItem>
        <ListItem delay={3}>속건제가 균등한 배상을 요구하는 것과 같이, 하나님은 우리가 받은 은혜를 <strong style={{ color: design.palette.accent }}>필요한 곳에 공의롭게 나누기를 기대</strong>하십니다.</ListItem>
        <ListItem delay={4}>포도원 품꾼 비유에서 주인의 마음이 그러하듯, <strong style={{ color: design.palette.accent }}>더 받은 자는 더 나눌 힘을 부여받은 것</strong>이며, 이는 자발적인 나눔과 기부 문화를 통해 하나님 나라의 정의를 실현하는 방식입니다.</ListItem>
        <ListItem delay={5}><strong style={{ color: design.palette.accent }}>국가의 강제적인 개입(공산주의)이 아닌, 자원하는 마음으로 나누는 것</strong>이 하나님 나라의 분배원리입니다.</ListItem>
      </ul>
    </div>
  </BaseSlide>
);


const Section3Title: Page = () => (
  <SectionTitle
    title="매일의 공급을 신뢰하는 급진적 신앙 (화목제의 즉시 소비 원리)"
    subtitle="세 번째 원리"
  />
);

const Section3Content: Page = () => (
  <BaseSlide>
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <h3
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h2,
          color: design.palette.accent,
          marginBottom: '2.5rem',
          textAlign: 'center',
          animationDelay: '0ms'
        }}
      >
        화목제의 즉시 소비 원리: 매일의 공급 신뢰
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <ListItem delay={2}>화목제의 <strong style={{ color: design.palette.accent }}>"그날에 먹으라"는 명령과 남은 것을 태우라는 규정</strong>은 재물을 쌓아두는 세상의 방식과 완전히 대조됩니다.</ListItem>
        <ListItem delay={3}>이는 미래에 대한 염려로 재물을 축적하려는 <strong style={{ color: design.palette.accent }}>"불신앙"을 거부</strong>하고, 하나님께서 매일 필요한 것을 공급해주실 것이라는 <strong style={{ color: design.palette.accent }}>급진적인 신뢰</strong>를 요구합니다.</ListItem>
        <ListItem delay={4} isQuote>{"“오늘 다 쏟아 부으라 그러면 또 다시 주실것이다”"}</ListItem>
        <ListItem delay={5}>탐욕은 징벌로 이어지며, 어리석은 부자의 비유처럼 <strong style={{ color: design.palette.accent }}>쌓아두는 삶은 결국 허무</strong>합니다.</ListItem>
        <ListItem delay={6}><strong style={{ color: design.palette.accent }}>지금 가진 것을 나누고 소비하며, 매일 하나님의 새로운 공급을 경험</strong>하는 것이 진정한 하나님 나라의 분배원리입니다.</ListItem>
        <ListItem delay={7}>이는 곧 <strong style={{ color: design.palette.accent }}>하나님에 대한 온전한 신뢰의 표현</strong>입니다.</ListItem>
      </ul>
    </div>
  </BaseSlide>
);

const Closing: Page = () => (
  <BaseSlide>
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        maxWidth: '1200px',
      }}
    >
      <h2
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h1,
          color: design.palette.accent,
          fontFamily: design.fonts.display,
          lineHeight: 1.2,
          animationDelay: '0ms'
        }}
      >
        하나님 나라의 분배원리
      </h2>
      <p
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.h2,
          color: design.palette.text,
          lineHeight: 1.4,
          animationDelay: '200ms'
        }}
      >
        신뢰, 나눔, 실천
      </p>
      <p
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.p,
          color: design.palette.text,
          marginTop: '60px',
          animationDelay: '400ms'
        }}
      >
        출처: [[원본_6월 14일 하나님 나라의 분배원리]]
      </p>
    </div>
  </BaseSlide>
);

// 4. Export the slides as default
export default [
  Cover,
  BigIdea,
  Section1Title,
  Section1Content,
  Section2Title,
  Section2Content,
  Section3Title,
  Section3Content,
  Closing
] satisfies Page[];

// 5. Provide metadata export
export const meta: SlideMeta = { title: "신학_하나님 나라의 분배원리" };