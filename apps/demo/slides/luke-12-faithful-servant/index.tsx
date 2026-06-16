import type { Page, DesignSystem } from '@open-slide/core';
import React from 'react';

export const design: DesignSystem = {
  palette: {
    bg: '#111111',
    text: '#ffffff',
    accent: '#ffffff',
  },
  fonts: {
    display: "'Pretendard', 'Noto Sans KR', sans-serif",
    body: "'Pretendard', 'Noto Sans KR', sans-serif",
  },
  typeScale: {
    hero: 100,
    body: 32,
  },
  radius: 0,
};

const styles = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
body { font-family: 'Pretendard', 'Noto Sans KR', sans-serif; word-break: keep-all; overflow-wrap: anywhere; }
`;

// Base layout with black-and-white stock photo background
const PhotoBackgroundLayout = ({ imageUrl, children, align = 'left' }: { imageUrl: string, children: React.ReactNode, align?: 'left' | 'center' }) => (
  <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
    <style>{styles}</style>
    {/* Background Image with Grayscale & Darken filter */}
    <img 
      src={imageUrl} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'grayscale(100%) brightness(0.3) contrast(1.2)',
        zIndex: 0
      }} 
    />
    
    {/* Content Container */}
    <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: '100%',
      padding: '100px 120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align === 'center' ? 'center' : 'left',
      color: '#ffffff'
    }}>
      {children}
    </div>
  </div>
);

const Footer = ({ pageNum, total }: { pageNum: number; total: number }) => (
  <div style={{
    position: 'absolute',
    bottom: 50,
    right: 80,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 24,
    fontFamily: "'Pretendard', sans-serif",
    letterSpacing: '0.1em',
    zIndex: 2
  }}>
    {String(pageNum).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);

export const narration = [
  "누가복음 12장 말씀, '맡길 만한 자가 되라'라는 주제로 오늘 말씀을 나누겠습니다.",
  "예수님께서는 지혜 있고 진실한 청지기를 찾으십니다. 주인이 그 모든 소유를 맡길 수 있는 사람 말입니다.",
  "때로 우리가 선택받지 못하는 이유는, 능력이 없어서가 아니라 아직 '맡길 만한 자격'을 갖추지 못했기 때문일 수 있습니다.",
  "그렇다면 지혜란 무엇일까요? 마태복음 25장의 열 처녀 비유를 보면, 지혜는 단순히 깨어있는 지식을 의미하지 않습니다.",
  "지혜로운 자도, 어리석은 자도 모두 졸며 잤습니다. 중요한 것은 '기름을 준비하고 졸았는가' 하는 점입니다.",
  "기름은 곧 신앙의 내용입니다. 형식적인 직분이나 예배 참석이 아니라, 내 안에 십자가 보혈의 능력과 진짜 믿음이 있느냐가 중요합니다.",
  "위기가 오면 신앙의 민낯이 드러납니다. 내용이 있는 사람은 고난을 견뎌내지만, 형식만 있는 사람은 쉽게 무너집니다.",
  "42절에 등장하는 '진실함'이란 곧 '믿음직함'을 뜻합니다. 뛰어난 재능이나 학벌보다 중요한 것은 신뢰입니다.",
  "회사든 교회든, 결국 끝까지 쓰임 받는 사람은 실력이 뛰어난 자가 아니라 변함없이 믿고 맡길 수 있는 진실된 사람입니다.",
  "작은 실수나 잘못을 은폐하려 하지 마십시오. 하나님 앞에서 진실성을 회복하고, 온전히 쓰임 받는 종이 되시기를 축복합니다."
];

const Page1: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/church,dark" align="center">
    <h3 style={{ fontSize: 40, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)', marginBottom: 30 }}>누가복음 12:42-44</h3>
    <h1 style={{ fontSize: 110, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>맡길 만한 자가 되라</h1>
    <div style={{ width: 100, height: 2, backgroundColor: '#ffffff', margin: '50px 0' }} />
    <p style={{ fontSize: 32, color: 'rgba(255,255,255,0.8)' }}>신학, 지혜와 진실함</p>
    <Footer pageNum={1} total={10} />
  </PhotoBackgroundLayout>
);

const Page2: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/hands,prayer">
    <h2 style={{ fontSize: 80, fontWeight: 700, marginBottom: 40, lineHeight: 1.3 }}>하나님께서 찾으시는<br/>청지기</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000 }}>
      청지기란 주인의 소유를 맡아서 관리하는 사람입니다.<br/><br/>
      하나님은 오늘도 당신의 일을 <strong>'맡길 만한 일꾼'</strong>을 찾고 계십니다.
    </p>
    <Footer pageNum={2} total={10} />
  </PhotoBackgroundLayout>
);

const Page3: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/empty,chair">
    <h2 style={{ fontSize: 80, fontWeight: 700, marginBottom: 40, lineHeight: 1.3 }}>선택받지 못하는 이유</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000 }}>
      교회나 세상에서 쓰임 받지 못할 때, 우리는 남들의 눈이 없다고 탓합니다.<br/><br/>
      하지만 근본적인 이유는 나에게 아직 <strong>'맡을 만한 자격'</strong>이 준비되지 않았기 때문입니다.
    </p>
    <Footer pageNum={3} total={10} />
  </PhotoBackgroundLayout>
);

const Page4: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/lamp,oil">
    <h2 style={{ fontSize: 80, fontWeight: 700, marginBottom: 40, lineHeight: 1.3 }}>지혜란 무엇인가?</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000 }}>
      마태복음 25장의 열 처녀 비유에서, 지혜는 단순한 지식이나 깨어있음을 뜻하지 않습니다.<br/><br/>
      결혼식의 신랑이 늦어지자 슬기로운 자나 어리석은 자나 모두 졸며 잤습니다.
    </p>
    <Footer pageNum={4} total={10} />
  </PhotoBackgroundLayout>
);

const Page5: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/sleeping,people">
    <h2 style={{ fontSize: 80, fontWeight: 700, marginBottom: 40, lineHeight: 1.3 }}>졸아도 준비하고 졸라</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000 }}>
      예수님을 믿어도 남들이 겪는 고난과 피로를 똑같이 겪습니다.<br/><br/>
      그러나 지혜로운 종은 기름을 <strong>미리 준비하고</strong> 졸았고, 어리석은 종은 아무런 준비 없이 졸았다는 것이 결정적 차이입니다.
    </p>
    <Footer pageNum={5} total={10} />
  </PhotoBackgroundLayout>
);

const Page6: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/bible,cross">
    <h2 style={{ fontSize: 80, fontWeight: 700, marginBottom: 40, lineHeight: 1.3 }}>신앙의 '내용'을 준비하라</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000 }}>
      형식적인 주일 예배 참석이나 직분이 구원을 보장하지 않습니다.<br/><br/>
      마음 깊은 곳에 십자가 보혈의 능력과 예수님에 대한 <strong>진짜 믿음의 내용</strong>이 있어야 합니다.
    </p>
    <Footer pageNum={6} total={10} />
  </PhotoBackgroundLayout>
);

const Page7: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/storm,waves">
    <h2 style={{ fontSize: 80, fontWeight: 700, marginBottom: 40, lineHeight: 1.3 }}>위기 때 드러나는 신앙</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000 }}>
      가짜 가방은 비가 오면 물을 흡수하지만, 진짜 가방은 방수가 됩니다.<br/><br/>
      환난이 닥치면 형식이 부서지고 내용이 드러납니다. <strong>내용이 있는 사람만이</strong> 문제를 이겨냅니다.
    </p>
    <Footer pageNum={7} total={10} />
  </PhotoBackgroundLayout>
);

const Page8: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/handshake,trust">
    <h2 style={{ fontSize: 80, fontWeight: 700, marginBottom: 40, lineHeight: 1.3 }}>진실함, 곧 믿음직함</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000 }}>
      재능이나 학벌이 없어서 쓰임 받지 못하는 것이 아닙니다.<br/><br/>
      하나님은 <strong>충성스럽고 진실한 사람</strong>, 목숨 걸고 순종할 믿을 만한 사람을 찾으십니다.
    </p>
    <Footer pageNum={8} total={10} />
  </PhotoBackgroundLayout>
);

const Page9: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/architecture,pillars">
    <h2 style={{ fontSize: 80, fontWeight: 700, marginBottom: 40, lineHeight: 1.3 }}>재능보다 신뢰</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000 }}>
      요셉이 보디발의 가정 총무로 모든 것을 위임받은 이유는 그가 재능이 뛰어나서가 아니라 철저히 <strong>믿음직한 사람</strong>이었기 때문입니다.<br/><br/>
      결국 권한은 배신하지 않을 신뢰할 수 있는 사람에게 주어집니다.
    </p>
    <Footer pageNum={9} total={10} />
  </PhotoBackgroundLayout>
);

const Page10: Page = () => (
  <PhotoBackgroundLayout imageUrl="https://loremflickr.com/1920/1080/light,window" align="center">
    <h2 style={{ fontSize: 90, fontWeight: 800, marginBottom: 40, lineHeight: 1.3 }}>진실성을 회복하라</h2>
    <p style={{ fontSize: 36, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 1000, margin: '0 auto' }}>
      아무것도 아닌 실수나 허물을 은폐하려다 신뢰를 잃지 마십시오.<br/><br/>
      하나님 앞과 사람 앞에서 투명한 진실성을 회복할 때, 주님의 모든 소유를 맡은 착하고 충성된 종이 될 것입니다.
    </p>
    <Footer pageNum={10} total={10} />
  </PhotoBackgroundLayout>
);

export default [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10];
