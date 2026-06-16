import type { Page, DesignSystem } from '@open-slide/core';
import React from 'react';

// Import images
import coverHero from './assets/cover_hero_1779246745730.png';
import fallingUpward from './assets/falling_upward_1779246759914.png';
import easyRestoration from './assets/easy_restoration_1779246779020.png';
import gatheringPeople from './assets/gathering_people_1779246793160.png';
import glowingCrown from './assets/glowing_crown_1779246808223.png';

export const design: DesignSystem = {
  palette: {
    bg: '#f5f5f5',
    text: '#222222',
    accent: '#0056b3',
  },
  fonts: {
    display: "'Pretendard', 'Noto Sans KR', sans-serif",
    body: "'Pretendard', 'Noto Sans KR', sans-serif",
  },
  typeScale: {
    hero: 100,
    body: 32,
  },
  radius: 16,
};

const styles = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
body { font-family: 'Pretendard', 'Noto Sans KR', sans-serif; }
`;

const Title = ({ title, highlight, subtitle }: { title: string; highlight: string; subtitle?: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 160 }}>
    <h1 style={{
      fontSize: 90,
      fontWeight: 700,
      color: '#222222',
      margin: 0,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      wordBreak: 'keep-all',
    }}>
      {title}
      <br />
      <span style={{ color: '#0047a5', fontSize: 110 }}>{highlight}</span>
    </h1>
    {subtitle && (
      <div style={{ marginTop: 24 }}>
        <div style={{ height: 1, backgroundColor: '#caced6', marginBottom: 24, width: '80%' }} />
        <div style={{ fontSize: 26, color: '#666666', lineHeight: 1.6, wordBreak: 'keep-all' }}>
          {subtitle}
        </div>
      </div>
    )}
  </div>
);

const Footer = ({ pageNum, total }: { pageNum: number; total: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 60,
      right: 60,
      bottom: 40,
      backgroundColor: '#0047a5',
      borderRadius: 16,
      color: '#ffffff',
      fontSize: 20,
      padding: '24px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span style={{ opacity: 0.9 }}>
      라라나 마케팅 1팀 이수진 &nbsp;|&nbsp; www.reallygreatsite.com &nbsp;|&nbsp; 2060.06.29
    </span>
    <span style={{ opacity: 0.9 }}>
      {String(pageNum).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </span>
  </div>
);

const SectionTab = ({ num }: { num: string }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 80,
      backgroundColor: '#0047a5',
      color: '#ffffff',
      padding: '16px 40px',
      fontSize: 40,
      fontWeight: 700,
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      boxShadow: '0 4px 12px rgba(0,71,165,0.2)'
    }}
  >
    {num}
  </div>
);

const BaseLayout = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#f5f5f5',
      color: '#222222',
      padding: '80px 100px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      boxSizing: 'border-box',
    }}
  >
    <style>{styles}</style>
    {children}
  </div>
);

const Page1: Page = () => (
  <BaseLayout>
    <Title 
      title="변함없는 능력으로" 
      highlight="회복시키시는 하나님"
      subtitle={
        <>
          <strong style={{ color: '#222' }}>스가랴 8장 6-11절</strong><br/>
          모든 피조물은 변하지만, 만군의 주 하나님은 그의 말씀과 능력에 있어 변함이 없으십니다.
        </>
      }
    />
    <img 
      src={coverHero} 
      style={{ 
        position: 'absolute',
        right: 100,
        top: 200,
        width: 600, 
        height: 600, 
        objectFit: 'cover', 
        borderRadius: 24,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }} 
    />
    <Footer pageNum={1} total={5} />
  </BaseLayout>
);

const ContentSlide = ({ 
  num, 
  title, 
  desc, 
  imgSrc, 
  pageNum, 
  total 
}: { 
  num: string; 
  title: string; 
  desc: React.ReactNode; 
  imgSrc: string; 
  pageNum: number; 
  total: number;
}) => (
  <BaseLayout>
    <SectionTab num={num} />
    <div style={{ marginLeft: 160, marginTop: 40 }}>
      <h2 style={{ fontSize: 60, fontWeight: 800, margin: '0 0 20px 0', color: '#222222' }}>
        {title}
      </h2>
    </div>
    <div style={{ display: 'flex', gap: 60, marginTop: 60, flex: 1, paddingLeft: 160, paddingRight: 60, paddingBottom: 140 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <p style={{ 
          fontSize: 32, 
          lineHeight: 1.6, 
          margin: 0, 
          wordBreak: 'keep-all', 
          color: '#555555' 
        }}>
          {desc}
        </p>
      </div>
      <img 
        src={imgSrc} 
        style={{ 
          width: 500, 
          height: 500, 
          objectFit: 'cover', 
          borderRadius: 24,
          boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
        }} 
      />
    </div>
    <Footer pageNum={pageNum} total={total} />
  </BaseLayout>
);

const Page2: Page = () => (
  <ContentSlide
    num="01"
    title="위쪽으로 떨어지다"
    desc={
      <>
        인생을 끝없는 상승으로 생각하지만, 진정한 성숙은 때로 <strong style={{ color: '#0047a5' }}>'떨어지는 것'</strong>처럼 보이는 과정을 통해 찾아옵니다. 
        이 '붕괴'는 단순한 실패가 아니라, 자기 중심에서 벗어나 하나님께 삶을 온전히 맡기게 하는 필수적인 통과의례입니다.
      </>
    }
    imgSrc={fallingUpward}
    pageNum={2}
    total={5}
  />
);

const Page3: Page = () => (
  <ContentSlide
    num="02"
    title="기이한 하나님의 능력"
    desc={
      <>
        사람의 눈에는 기이하나, 철저히 멸망한 이스라엘을 회복시키는 것은 하나님의 능력에는 <strong style={{ color: '#0047a5' }}>너무도 쉬운 일</strong>입니다. 성도들의 담대함은 능히 죽은 자 가운데서도 살리시는 하나님의 능력을 믿기 때문입니다.
      </>
    }
    imgSrc={easyRestoration}
    pageNum={3}
    total={5}
  />
);

const Page4: Page = () => (
  <ContentSlide
    num="03"
    title="구원과 안식을 주시는 분"
    desc={
      <>
        동방과 서방에서 백성을 부르시며, 원수의 손에서 구원하실 뿐만 아니라 <strong style={{ color: '#0047a5' }}>영원한 안식처</strong>를 예비하십니다. 이 우주적 구원의 선포는 눈물과 근심이 없는 영원한 평안으로 우리를 초대합니다.
      </>
    }
    imgSrc={gatheringPeople}
    pageNum={4}
    total={5}
  />
);

const Page5: Page = () => (
  <ContentSlide
    num="04"
    title="존귀한 자의 면류관"
    desc={
      <>
        하나님은 우리를 <strong style={{ color: '#0047a5' }}>"내 백성"</strong>으로 부르시고 구원을 보증하시며 가장 존귀한 자의 면류관을 씌우십니다. 어떤 환난 속에서도 절망하지 않고 오직 하나님 안에서 소망을 가질 수 있습니다.
      </>
    }
    imgSrc={glowingCrown}
    pageNum={5}
    total={5}
  />
);

export default [Page1, Page2, Page3, Page4, Page5];
