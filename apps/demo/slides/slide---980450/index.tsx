import React from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

// 1. Define a unified design system token
export const design: DesignSystem = {
  palette: { bg: '#0b132b', text: '#f4f5f6', accent: '#00b4d8', primary: '#bb0072', secondary: '#ef476f' }, // Dark neon palette with extended colors
  fonts: {
    display: '"Inter", "Noto Sans KR", system-ui, sans-serif', // Added Noto Sans KR for better Korean display
    body: '"Inter", "Noto Sans KR", system-ui, sans-serif'
  },
  typeScale: { hero: 120, heading1: 80, heading2: 60, body: 28, small: 20 },
  radius: 12
};

// 2. Add styling for smooth animations
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
.l-slidein-left { animation: lSlideInLeft 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes lScaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.l-scalein { animation: lScaleIn 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }
`;
const Style = () => <style>{keyframes}</style>;

// Helper component for consistent slide container styling
const SlideWrapper: React.FC<{ children: React.ReactNode; justifyContent?: string; alignItems?: string }> = ({ children, justifyContent = 'center', alignItems = 'center' }) => (
  <div style={{
    backgroundColor: design.palette.bg,
    height: 1080,
    width: 1920,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: justifyContent,
    alignItems: alignItems,
    padding: '80px 120px', // Ample padding for content
    boxSizing: 'border-box',
    fontFamily: design.fonts.body,
    color: design.palette.text,
    fontSize: design.typeScale.body,
    lineHeight: 1.5,
  }}>
    <Style />
    {children}
  </div>
);

// --- 5. Create a set of distinct Page components ---

// Cover Slide
const Cover: Page = () => (
  <SlideWrapper>
    <div className="l-fadeup" style={{ textAlign: 'center' }}>
      <h1 style={{
        fontSize: design.typeScale.hero,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        marginBottom: '20px',
        lineHeight: 1.1,
        textShadow: `0 0 15px ${design.palette.accent}66` // Neon glow effect
      }}>
        하나님 나라의 분배원리
      </h1>
      <p style={{
        fontSize: design.typeScale.heading2,
        color: design.palette.text,
        opacity: 0.8,
        letterSpacing: '2px'
      }}>
        추상적 신앙을 넘어, 삶의 구체적 원리로
      </p>
    </div>
  </SlideWrapper>
);

// Introduction / Big Idea Slide
const Intro: Page = () => (
  <SlideWrapper>
    <div className="l-fadeup" style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{
        fontSize: design.typeScale.heading1,
        fontFamily: design.fonts.display,
        color: design.palette.primary,
        marginBottom: '60px',
        textShadow: `0 0 10px ${design.palette.primary}44`
      }}>
        신앙, 추상에서 구체적 삶으로
      </h2>
      <p className="l-fadeup" style={{ animationDelay: '200ms', fontSize: design.typeScale.heading2, marginBottom: '30px', opacity: 0.9 }}>
        우리의 신앙은 단지 고상한 이론이 아닙니다.
      </p>
      <p className="l-fadeup" style={{ animationDelay: '400ms', fontSize: design.typeScale.heading2, color: design.palette.accent }}>
        실제 삶 속에서 어떻게 구현되고 적용되어야 할까요?
      </p>
      <p className="l-fadeup" style={{ animationDelay: '600ms', fontSize: design.typeScale.body, marginTop: '80px', opacity: 0.7 }}>
        이 설교는 추상적인 신앙이 아닌 실제적 삶에서의 구체적인 적용을 강조합니다.
      </p>
    </div>
  </SlideWrapper>
);

// Section 1: "부칙이 있는 이유" (Why are there bylaws?)
const Section1_Bylaws: Page = () => (
  <SlideWrapper justifyContent="flex-start" alignItems="flex-start">
    <h2 className="l-fadeup" style={{
      fontSize: design.typeScale.heading1,
      fontFamily: design.fonts.display,
      color: design.palette.secondary,
      marginBottom: '60px',
      textShadow: `0 0 10px ${design.palette.secondary}44`
    }}>
      부칙이 있는 이유
    </h2>

    <div style={{ display: 'flex', gap: '80px', width: '100%', flexGrow: 1 }}>
      <div className="l-slidein-left" style={{ flex: 1, animationDelay: '200ms' }}>
        <p style={{ fontSize: design.typeScale.heading2, color: design.palette.accent, marginBottom: '40px' }}>
          신앙 이론이 실제 삶에 구현되려면?
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="l-fadeup" style={{ animationDelay: '400ms', marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: design.palette.primary, fontSize: '1.2em' }}>‣</span>
            구체적인 지침과 마인드가 필요합니다.
          </li>
          <li className="l-fadeup" style={{ animationDelay: '600ms', paddingLeft: '30px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: design.palette.primary, fontSize: '1.2em' }}>‣</span>
            탁월함은 세밀한 규칙에서 나옵니다.
          </li>
        </ul>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div className="l-fadeup" style={{ animationDelay: '800ms', background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: design.radius, borderLeft: `5px solid ${design.palette.accent}` }}>
          <h3 style={{ fontSize: design.typeScale.heading2, color: design.palette.accent, marginBottom: '15px' }}>
            <span style={{ marginRight: '15px', color: design.palette.primary }}>✦</span> 사냥꾼의 비유
          </h3>
          <p>
            사냥꾼이 사냥감처럼 생각하고 움직이듯,
            탁월한 신앙인은 삶의 세부 원칙을 가집니다.
          </p>
        </div>
        <div className="l-fadeup" style={{ animationDelay: '1000ms', background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: design.radius, borderLeft: `5px solid ${design.palette.primary}` }}>
          <h3 style={{ fontSize: design.typeScale.heading2, color: design.palette.primary, marginBottom: '15px' }}>
            <span style={{ marginRight: '15px', color: design.palette.accent }}>✦</span> 명인의 지혜
          </h3>
          <p>
            명인이 자신의 분야에 세밀한 규칙을 만들듯,
            믿음의 "정통"은 단순한 원칙을 넘어선 "세칙"에 있습니다.
          </p>
        </div>
      </div>
    </div>
  </SlideWrapper>
);

// Section 2: 구약의 제사 제도 (Old Testament Sacrificial System) - Transition
const Section2_SacrificeIntro: Page = () => (
  <SlideWrapper>
    <div className="l-fadeup" style={{ textAlign: 'center', maxWidth: 1400 }}>
      <h2 style={{
        fontSize: design.typeScale.heading1,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        marginBottom: '60px',
        textShadow: `0 0 15px ${design.palette.accent}66`
      }}>
        하나님 나라의 분배원리
      </h2>
      <p className="l-fadeup" style={{ animationDelay: '200ms', fontSize: design.typeScale.heading2, color: design.palette.text, opacity: 0.9 }}>
        구약의 제사 제도를 통해 구체적으로 살펴봅니다.
      </p>
      <div className="l-fadeup" style={{ animationDelay: '600ms', display: 'flex', justifyContent: 'center', gap: '100px', marginTop: '80px' }}>
        <span style={{ fontSize: design.typeScale.hero * 0.8, color: design.palette.primary }}>속건제</span>
        <span style={{ fontSize: design.typeScale.hero * 0.8, color: design.palette.secondary }}>화목제</span>
      </div>
    </div>
  </SlideWrapper>
);

// Section 3: 속건제 (Guilt Offering) - "균등하게 분배하라"
const Section3_GuiltOffering: Page = () => (
  <SlideWrapper justifyContent="flex-start" alignItems="flex-start">
    <h2 className="l-fadeup" style={{
      fontSize: design.typeScale.heading1,
      fontFamily: design.fonts.display,
      color: design.palette.primary,
      marginBottom: '60px',
      textShadow: `0 0 10px ${design.palette.primary}44`
    }}>
      속건제: "균등하게 분배하라"
    </h2>

    <div style={{ display: 'flex', gap: '80px', width: '100%', flexGrow: 1 }}>
      <div className="l-slidein-left" style={{ flex: 1, animationDelay: '200ms' }}>
        <p style={{ fontSize: design.typeScale.heading2, color: design.palette.accent, marginBottom: '40px' }}>
          의미와 본질
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="l-fadeup" style={{ animationDelay: '400ms', marginBottom: '25px', paddingLeft: '30px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: design.palette.secondary, fontSize: '1.2em' }}>▸</span>
            돈으로 배상하는 것을 넘어선
            <strong style={{ color: design.palette.accent, marginLeft: '10px' }}>"은혜의 원리"</strong>
          </li>
          <li className="l-fadeup" style={{ animationDelay: '600ms', marginBottom: '25px', paddingLeft: '30px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: design.palette.secondary, fontSize: '1.2em' }}>▸</span>
            하나님이 더 많이 주시는 이유: <br/>
            독점이 아닌, 약한 자들에게 은혜를 베푸는 <strong style={{ color: design.palette.accent, marginLeft: '10px' }}>통로</strong>가 되라는 뜻
          </li>
        </ul>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div className="l-fadeup" style={{ animationDelay: '800ms', background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: design.radius, borderLeft: `5px solid ${design.palette.accent}` }}>
          <h3 style={{ fontSize: design.typeScale.heading2, color: design.palette.accent, marginBottom: '15px' }}>
            <span style={{ marginRight: '15px', color: design.palette.secondary }}>✔</span> 포도원 품꾼 비유
          </h3>
          <p>
            늦게 온 자나 먼저 온 자나 동일하게 은혜를 누리듯,
            우리의 풍요는 나누기 위함입니다.
          </p>
        </div>
        <div className="l-fadeup" style={{ animationDelay: '1000ms', background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: design.radius, borderLeft: `5px solid ${design.palette.primary}` }}>
          <h3 style={{ fontSize: design.typeScale.heading2, color: design.palette.primary, marginBottom: '15px' }}>
            <span style={{ marginRight: '15px', color: design.palette.accent }}>✔</span> 자발적 나눔의 정신
          </h3>
          <p>
            국가 개입보다 더 본질적인,
            마음에서 우러나오는 나눔을 촉구합니다.
          </p>
        </div>
      </div>
    </div>
  </SlideWrapper>
);

// Section 4: 화목제 (Peace Offering) - "그날에 먹으라"
const Section4_PeaceOffering: Page = () => (
  <SlideWrapper justifyContent="flex-start" alignItems="flex-start">
    <h2 className="l-fadeup" style={{
      fontSize: design.typeScale.heading1,
      fontFamily: design.fonts.display,
      color: design.palette.secondary,
      marginBottom: '60px',
      textShadow: `0 0 10px ${design.palette.secondary}44`
    }}>
      화목제: "그날에 먹으라"
    </h2>

    <div style={{ display: 'flex', gap: '80px', width: '100%', flexGrow: 1 }}>
      <div className="l-slidein-left" style={{ flex: 1, animationDelay: '200ms' }}>
        <p style={{ fontSize: design.typeScale.heading2, color: design.palette.accent, marginBottom: '40px' }}>
          의미와 본질
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="l-fadeup" style={{ animationDelay: '400ms', marginBottom: '25px', paddingLeft: '30px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: design.palette.primary, fontSize: '1.2em' }}>▸</span>
            서원제/감사제 남은 것을 태우는 명령:
            세상이 재물을 쌓아두는 <strong style={{ color: design.palette.accent, marginLeft: '10px' }}>"불신앙"과 대비</strong>
          </li>
          <li className="l-fadeup" style={{ animationDelay: '600ms', marginBottom: '25px', paddingLeft: '30px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: design.palette.primary, fontSize: '1.2em' }}>▸</span>
            하나님이 매일 새롭게 공급하실 것을 신뢰하는 <br/>
            <strong style={{ color: design.palette.accent, marginLeft: '10px' }}>"오늘 다 쏟아 부으라"는 급진적 믿음</strong>
          </li>
        </ul>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div className="l-fadeup" style={{ animationDelay: '800ms', background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: design.radius, borderLeft: `5px solid ${design.palette.accent}` }}>
          <h3 style={{ fontSize: design.typeScale.heading2, color: design.palette.accent, marginBottom: '15px' }}>
            <span style={{ marginRight: '15px', color: design.palette.primary }}>✖</span> 탐욕에 대한 경고
          </h3>
          <p>
            어리석은 부자의 비유처럼,
            쌓아두는 삶은 허무함을 지적합니다.
          </p>
        </div>
        <div className="l-fadeup" style={{ animationDelay: '1000ms', background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: design.radius, borderLeft: `5px solid ${design.palette.secondary}` }}>
          <h3 style={{ fontSize: design.typeScale.heading2, color: design.palette.secondary, marginBottom: '15px' }}>
            <span style={{ marginRight: '15px', color: design.palette.accent }}>✔</span> 당일 소비, 당일 나눔
          </h3>
          <p>
            진정한 하나님의 분배원리는
            오늘의 것을 오늘 소비하고 나누는 삶에 있습니다.
          </p>
        </div>
      </div>
    </div>
  </SlideWrapper>
);

// Closing Slide
const Closing: Page = () => (
  <SlideWrapper>
    <div className="l-fadeup" style={{ textAlign: 'center', maxWidth: 1400 }}>
      <h2 style={{
        fontSize: design.typeScale.hero,
        fontFamily: design.fonts.display,
        color: design.palette.accent,
        marginBottom: '40px',
        textShadow: `0 0 20px ${design.palette.accent}88`
      }}>
        하나님 나라의 분배원리 요약
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto', textAlign: 'left', maxWidth: 1200 }}>
        <li className="l-fadeup" style={{ animationDelay: '200ms', marginBottom: '30px', padding: '30px', borderRadius: design.radius, background: `linear-gradient(90deg, ${design.palette.primary}33, transparent)`, borderLeft: `8px solid ${design.palette.primary}` }}>
          <h3 style={{ fontSize: design.typeScale.heading2, color: design.palette.primary, marginBottom: '15px' }}>
            1. 속건제: 균등하게 분배하라
          </h3>
          <p style={{ fontSize: design.typeScale.body }}>
            우리가 가진 것은 은혜의 통로이며, 약한 자와 나누는 자발적인 나눔의 정신이 본질입니다.
          </p>
        </li>
        <li className="l-fadeup" style={{ animationDelay: '400ms', marginBottom: '30px', padding: '30px', borderRadius: design.radius, background: `linear-gradient(90deg, ${design.palette.secondary}33, transparent)`, borderLeft: `8px solid ${design.palette.secondary}` }}>
          <h3 style={{ fontSize: design.typeScale.heading2, color: design.palette.secondary, marginBottom: '15px' }}>
            2. 화목제: 그날에 먹으라
          </h3>
          <p style={{ fontSize: design.typeScale.body }}>
            매일 공급하실 하나님을 신뢰하며, 탐욕을 버리고 오늘의 것을 소비하고 나누는 급진적 믿음입니다.
          </p>
        </li>
      </ul>
      <p className="l-fadeup" style={{ animationDelay: '600ms', fontSize: design.typeScale.body, color: design.palette.text, opacity: 0.7, marginTop: '60px' }}>
        이 원리들이 우리의 삶 속에서 살아 숨 쉬기를 소망합니다.
      </p>
    </div>
  </SlideWrapper>
);

// 8. The slides must be exported as default
export default [
  Cover,
  Intro,
  Section1_Bylaws,
  Section2_SacrificeIntro,
  Section3_GuiltOffering,
  Section4_PeaceOffering,
  Closing,
] satisfies Page[];

// 9. Provide metadata export
export const meta: SlideMeta = {
  title: "서사_하나님 나라의 분배원리",
};