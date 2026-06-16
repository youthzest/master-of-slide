import React from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

// 1. Unified design system token
export const design: DesignSystem = {
  palette: { bg: '#0b132b', text: '#f4f5f6', accent: '#00b4d8', secondary: '#8d99ae' },
  fonts: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif'
  },
  typeScale: {
    hero: 120,
    title: 72,
    subtitle: 48,
    heading: 42,
    body: 28,
    small: 20
  },
  radius: 12
};

// 2. Styling for smooth animations
const keyframes = `
@keyframes lFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.l-fadeup { animation: lFadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes lFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
.l-fadein { animation: lFadeIn 800ms ease-out both; }

@keyframes lScaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.l-scalein { animation: lScaleIn 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }
`;

const Style = () => <style>{keyframes}</style>;

// Helper component for slide content wrapper
const SlideWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
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
    className={className}
  >
    <Style />
    {children}
  </div>
);

// Helper for list items with consistent styling
const ListItem: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <li
    className="l-fadeup"
    style={{
      fontSize: design.typeScale.body,
      marginBottom: 20,
      paddingLeft: 20,
      position: 'relative',
      animationDelay: `${delay * 200}ms`
    }}
  >
    <span
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        color: design.palette.accent,
        fontSize: design.typeScale.body * 1.2,
        lineHeight: 1
      }}
    >
      •
    </span>
    {children}
  </li>
);

// 3. Create a set of distinct Page components

const Cover: Page = () => (
  <SlideWrapper>
    <h1
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.hero,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 1.1
      }}
    >
      하나님 나라의 분배원리
    </h1>
    <p
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.title,
        fontFamily: design.fonts.display,
        textAlign: 'center',
        color: design.palette.secondary,
        animationDelay: '200ms'
      }}
    >
      추상적 신앙을 넘어선 구체적 삶의 원리
    </p>
  </SlideWrapper>
);

const BigIdea: Page = () => (
  <SlideWrapper>
    <h2
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.title,
        color: design.palette.accent,
        marginBottom: 60,
        textAlign: 'center',
        fontFamily: design.fonts.display
      }}
    >
      왜 "부칙"이 필요할까?
    </h2>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <ListItem delay={1}>신앙 이론 ➡️ 실제 삶의 구현: 구체적인 지침과 마인드</ListItem>
        <ListItem delay={2}>탁월함의 비결: 세밀한 "부칙"을 가진 신앙인</ListItem>
        <ListItem delay={3}>사냥꾼의 비유: 사냥감처럼 생각하라</ListItem>
        <ListItem delay={4}>명인의 비유: 자신의 분야에 세밀한 규칙을 만들라</ListItem>
      </ul>
    </div>
  </SlideWrapper>
);

const ImportanceOfBylaws: Page = () => (
  <SlideWrapper>
    <h2
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.title,
        color: design.palette.accent,
        marginBottom: 60,
        textAlign: 'center',
        fontFamily: design.fonts.display
      }}
    >
      믿음의 "정통"은 세칙에서 온다
    </h2>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <ListItem delay={1}>단순한 원칙을 넘어선 구체적인 삶의 적용</ListItem>
        <ListItem delay={2}>추상적인 신앙을 현실로 만드는 실질적인 지혜</ListItem>
        <ListItem delay={3}>우리의 삶을 변화시키는 세밀한 "부칙"의 중요성</ListItem>
      </ul>
    </div>
  </SlideWrapper>
);

const SacrificialSystemIntro: Page = () => (
  <SlideWrapper>
    <h2
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.title,
        color: design.palette.accent,
        marginBottom: 40,
        textAlign: 'center',
        fontFamily: design.fonts.display
      }}
    >
      하나님 나라의 분배원리
    </h2>
    <p
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.subtitle,
        color: design.palette.secondary,
        textAlign: 'center',
        animationDelay: '200ms'
      }}
    >
      구약 제사 제도에서 찾다:
    </p>
    <div
      className="l-scalein"
      style={{
        display: 'flex',
        gap: 80,
        marginTop: 80,
        animationDelay: '400ms'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: design.radius,
          padding: '40px 60px',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        }}
      >
        <h3
          style={{
            fontSize: design.typeScale.heading,
            color: design.palette.accent,
            marginBottom: 20,
            fontFamily: design.fonts.display
          }}
        >
          속건제 (Guilt Offering)
        </h3>
        <p style={{ fontSize: design.typeScale.body, color: design.palette.text }}>
          "균등하게 분배하라"
        </p>
      </div>
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: design.radius,
          padding: '40px 60px',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        }}
      >
        <h3
          style={{
            fontSize: design.typeScale.heading,
            color: design.palette.accent,
            marginBottom: 20,
            fontFamily: design.fonts.display
          }}
        >
          화목제 (Peace Offering)
        </h3>
        <p style={{ fontSize: design.typeScale.body, color: design.palette.text }}>
          "그날에 먹으라"
        </p>
      </div>
    </div>
  </SlideWrapper>
);

const GuiltOffering: Page = () => (
  <SlideWrapper>
    <h2
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.title,
        color: design.palette.accent,
        marginBottom: 60,
        textAlign: 'center',
        fontFamily: design.fonts.display
      }}
    >
      속건제: 균등한 분배의 원리
    </h2>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <ListItem delay={1}>돈으로 배상 ➡️ "은혜의 원리"로 확장</ListItem>
        <ListItem delay={2}>하나님이 더 주시는 이유: 우리가 독점 아닌 '통로' 되라</ListItem>
        <ListItem delay={3}>포도원 품꾼 비유: 약한 자들에게 은혜를 베푸는 마음</ListItem>
        <ListItem delay={4}>자발적인 나눔 강조: 국가 개입을 넘어선 본질적인 정신</ListItem>
      </ul>
    </div>
  </SlideWrapper>
);

const PeaceOffering: Page = () => (
  <SlideWrapper>
    <h2
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.title,
        color: design.palette.accent,
        marginBottom: 60,
        textAlign: 'center',
        fontFamily: design.fonts.display
      }}
    >
      화목제: "오늘 다 쏟아 부으라"
    </h2>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <ListItem delay={1}>서원제/감사제 남은 것 소각 명령: 쌓아두지 말라</ListItem>
        <ListItem delay={2}>세상의 "불신앙" (재물 축적)과 대비되는 삶</ListItem>
        <ListItem delay={3}>급진적인 믿음: 하나님이 매일 새롭게 공급하실 것을 신뢰</ListItem>
        <ListItem delay={4}>탐욕 경고: 어리석은 부자의 비유</ListItem>
        <ListItem delay={5}>진정한 분배: 당일 소비하고 나누는 삶</ListItem>
      </ul>
    </div>
  </SlideWrapper>
);

const Closing: Page = () => (
  <SlideWrapper>
    <h2
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.title,
        color: design.palette.accent,
        marginBottom: 60,
        textAlign: 'center',
        fontFamily: design.fonts.display
      }}
    >
      하나님의 분배원리, 나의 삶에 적용하기
    </h2>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <ListItem delay={1}>"균등하게" 나누는 은혜의 통로가 되십시오.</ListItem>
        <ListItem delay={2}>"오늘"을 신뢰하며 누리고 나누는 삶을 사십시오.</ListItem>
        <ListItem delay={3}>물질을 넘어선 삶의 태도 변화로 하나님 나라를 경험하십시오.</ListItem>
      </ul>
    </div>
    <p
      className="l-fadein"
      style={{
        fontSize: design.typeScale.small,
        color: design.palette.secondary,
        marginTop: 80,
        animationDelay: '1000ms'
      }}
    >
      출처: 원본_6월 14일 하나님 나라의 분배원리
    </p>
  </SlideWrapper>
);

// 4. Export slides as default
export default [
  Cover,
  BigIdea,
  ImportanceOfBylaws,
  SacrificialSystemIntro,
  GuiltOffering,
  PeaceOffering,
  Closing
] satisfies Page[];

// 5. Provide metadata export
export const meta: SlideMeta = {
  title: "하나님 나라의 분배원리"
};