import React from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

// 1. Design System
export const design: DesignSystem = {
  palette: { bg: '#0b132b', text: '#f4f5f6', accent: '#00b4d8' },
  fonts: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif'
  },
  typeScale: { hero: 120, body: 28 },
  radius: 12
};

// 4. Smooth Animations
const keyframes = `
@keyframes lFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.l-fadeup { animation: lFadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes lSlideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}
.l-slidein-left { animation: lSlideInLeft 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes lScaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.l-scale-in { animation: lScaleIn 1000ms cubic-bezier(0.16, 1, 0.3, 1) both; }
`;
const Style = () => <style>{keyframes}</style>;

// Helper for consistent slide wrapper
interface SlideWrapperProps {
  design: DesignSystem;
  children: React.ReactNode;
  align?: 'flex-start' | 'center';
  justify?: 'flex-start' | 'center';
  padding?: string;
  gap?: string;
}

const SlideWrapper: React.FC<SlideWrapperProps> = ({ design, children, align = 'center', justify = 'center', padding = '80px', gap = '0px' }) => (
  <div
    style={{
      backgroundColor: design.palette.bg,
      color: design.palette.text,
      fontFamily: design.fonts.body,
      height: 1080,
      width: 1920,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: align,
      justifyContent: justify,
      padding: padding,
      boxSizing: 'border-box',
      gap: gap
    }}
  >
    <Style />
    {children}
  </div>
);

// 5. Create distinct Page components

// Cover Slide
const Cover: Page = ({ design }) => (
  <SlideWrapper design={design} justify="center">
    <h1
      className="l-scale-in"
      style={{
        fontSize: design.typeScale.hero,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        textAlign: 'center',
        marginBottom: '40px',
        lineHeight: 1.1,
        textShadow: `0 0 15px ${design.palette.accent}50`
      }}
    >
      하나님 나라의 분배원리
    </h1>
    <p
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.body * 1.5,
        textAlign: 'center',
        maxWidth: '1200px',
        lineHeight: 1.4,
        animationDelay: '0.4s'
      }}
    >
      우리의 일상과 신앙생활에 깊은 적용점을 제공합니다.
    </p>
  </SlideWrapper>
);

// Section 1 Slide
const Section1: Page = ({ design }) => (
  <SlideWrapper design={design} align="flex-start" justify="flex-start" padding="100px">
    <h2
      className="l-slidein-left"
      style={{
        fontSize: design.typeScale.hero * 0.5,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        marginBottom: '60px',
        alignSelf: 'flex-start',
        borderBottom: `4px solid ${design.palette.accent}`,
        paddingBottom: '10px'
      }}
    >
      추상적 믿음에서 구체적 삶으로 전환
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxWidth: '1400px' }}>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.2s' }}>
          막연한 다짐을 넘어{' '}
          <strong style={{ color: design.palette.accent }}>"이렇게 이렇게 하겠다"는 구체적인 행동 계획</strong>을 세웁니다.
        </div>
      </li>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.4s' }}>
          재정 관리, 시간 사용, 관계 맺음 등{' '}
          <strong style={{ color: design.palette.accent }}>모든 영역에서 세부적인 "부칙"</strong>을 마련하고 실천합니다.
        </div>
      </li>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.6s' }}>
          자신의 직업 분야 전문가처럼, 신앙 영역에서도{' '}
          <strong style={{ color: design.palette.accent }}>구체적인 실천 원리를 개발하고 적용</strong>하여 탁월한 신앙인으로 성장합니다.
        </div>
      </li>
    </ul>
  </SlideWrapper>
);

// Section 2 Slide
const Section2: Page = ({ design }) => (
  <SlideWrapper design={design} align="flex-start" justify="flex-start" padding="100px">
    <h2
      className="l-slidein-left"
      style={{
        fontSize: design.typeScale.hero * 0.5,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        marginBottom: '60px',
        alignSelf: 'flex-start',
        borderBottom: `4px solid ${design.palette.accent}`,
        paddingBottom: '10px'
      }}
    >
      은혜의 흐름을 위한 자원적 나눔 실천
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxWidth: '1400px' }}>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.2s' }}>
          하나님께서 주신 <strong style={{ color: design.palette.accent }}>"더 많은 것"은 은혜의 흐름을 위한 통로</strong>입니다.
        </div>
      </li>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.4s' }}>
          자신의 물질, 시간, 재능 등을 이웃과 공동체에{' '}
          <strong style={{ color: design.palette.accent }}>균등하게 나누는 통로</strong>가 되어야 합니다.
        </div>
      </li>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.6s' }}>
          의무감이 아닌{' '}
          <strong style={{ color: design.palette.accent }}>자발적으로 어려운 이들을 돕고 약한 자들을 돌보는 행동</strong>으로 나타납니다.
        </div>
      </li>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.8s' }}>
          사회 복지 시스템을 넘어, 개인이{' '}
          <strong style={{ color: design.palette.accent }}>하나님의 마음으로 능동적인 분배자</strong>가 되어야 합니다.
        </div>
      </li>
    </ul>
  </SlideWrapper>
);

// Section 3 Slide
const Section3: Page = ({ design }) => (
  <SlideWrapper design={design} align="flex-start" justify="flex-start" padding="100px">
    <h2
      className="l-slidein-left"
      style={{
        fontSize: design.typeScale.hero * 0.5,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        marginBottom: '60px',
        alignSelf: 'flex-start',
        borderBottom: `4px solid ${design.palette.accent}`,
        paddingBottom: '10px'
      }}
    >
      재물에 대한 불신앙적 태도 극복 및 매일의 신뢰
    </h2>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxWidth: '1400px' }}>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.2s' }}>
          재물을 쌓아두고 미래를 불안해하는{' '}
          <strong style={{ color: design.palette.accent }}>세상의 방식("불신앙")에서 벗어나</strong>, 하나님을 신뢰합니다.
        </div>
      </li>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.4s' }}>
          <strong style={{ color: design.palette.accent }}>하나님이 매일 필요한 것을 공급해주실 것이라는 급진적인 믿음</strong>을 실천합니다.
        </div>
      </li>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.6s' }}>
          탐욕과 소유욕을 버리고, <strong style={{ color: design.palette.accent }}>물질에 대한 집착에서 자유로워지는 훈련</strong>이 필요합니다.
        </div>
      </li>
      <li
        className="l-fadeup"
        style={{
          fontSize: design.typeScale.body * 1.1,
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1.5
        }}
      >
        <span style={{ color: design.palette.accent, fontSize: '1.2em', marginRight: '20px' }}>▪</span>
        <div style={{ animationDelay: '0.8s' }}>
          "어리석은 부자"처럼 쟁여두는 삶이 아니라, <strong style={{ color: design.palette.accent }}>만나를 매일 먹었던 이스라엘 백성처럼</strong>
          {' '}하나님의 일용할 양식을 신뢰합니다.
        </div>
      </li>
    </ul>
  </SlideWrapper>
);

// Closing Slide - Summarize and mention source
const Closing: Page = ({ design }) => (
  <SlideWrapper design={design} justify="center">
    <h2
      className="l-scale-in"
      style={{
        fontSize: design.typeScale.hero * 0.6,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        marginBottom: '40px',
        textAlign: 'center',
        textShadow: `0 0 10px ${design.palette.accent}40`
      }}
    >
      하나님 나라의 분배원리:
      <br />
      적용과 실천
    </h2>
    <p
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.body * 1.2,
        textAlign: 'center',
        maxWidth: '1200px',
        lineHeight: 1.6,
        animationDelay: '0.4s',
        marginBottom: '60px'
      }}
    >
      추상적인 믿음에서 구체적인 삶의 변화로,
      <br />
      은혜의 통로가 되어 이웃을 섬기며,
      <br />
      하나님의 공급하심을 매일 신뢰하는 삶을 살아갑니다.
    </p>
    <p
      className="l-fadeup"
      style={{
        fontSize: design.typeScale.body * 0.8,
        textAlign: 'center',
        animationDelay: '0.8s',
        color: design.palette.text + '99' // Slightly faded for source
      }}
    >
      출처: 원본_6월 14일 하나님 나라의 분배원리
    </p>
  </SlideWrapper>
);

// 8. Export slides as default
export default [Cover, Section1, Section2, Section3, Closing] satisfies Page[];

// 9. Provide metadata export
export const meta: SlideMeta = { title: "적용_하나님 나라의 분배원리" };