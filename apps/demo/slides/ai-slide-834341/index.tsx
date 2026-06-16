import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import React from 'react';

export const design: DesignSystem = {
  palette: { bg: '#f5f2eb', text: '#292524', accent: '#b91c1c' },
  fonts: {
    display: '"Georgia", serif',
    body: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
  },
  typeScale: { hero: 96, body: 28 },
  radius: 12,
};

const Style = () => (
  <style>{`
    .slide-container {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 80px 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #f5f2eb;
      color: #292524;
      font-family: var(--osd-font-body);
      position: relative;
      overflow: hidden;
    }
    .slide-eyebrow {
      font-size: 18px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #b91c1c;
      font-weight: 600;
    }
    .slide-title {
      font-family: var(--osd-font-display);
      font-size: 54px;
      font-weight: 800;
      color: #b91c1c;
      margin: 0 0 24px 0;
      line-height: 1.25;
      word-break: keep-all;
      overflow-wrap: anywhere;
    }
    .slide-subtitle {
      font-family: var(--osd-font-body);
      font-size: 28px;
      color: #4b5563;
      margin: 0;
      font-weight: 400;
    }
    .bullets-list {
      font-size: 24px;
      line-height: 1.6;
      margin: 0;
      padding-left: 30px;
      color: #292524;
      word-break: keep-all;
      overflow-wrap: anywhere;
    }
    .bullets-list li {
      margin-bottom: 12px;
      font-weight: 400;
    }
    .slide-footer {
      position: absolute;
      bottom: 50px;
      left: 100px;
      right: 100px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #9ca3af;
      border-top: 1px solid #e7e5e4;
      padding-top: 15px;
    }
    .brutal-border {
      border: 6px solid #000;
      box-sizing: border-box;
    }
  `}</style>
);

export const meta: SlideMeta = {
  title: '시편묵상_과제_정현승',
};

export const narration: (string | undefined)[] = [
  '발표 자료 \"시편묵상_과제_정현승\"를 시작하도록 하겠습니다.',
  '슬라이드 1',
  '슬라이드 2',
  '슬라이드 3',
  '슬라이드 4',
  '슬라이드 5'
];

const pages: Page[] = [
  // Cover Page
  () => (
    <div className="slide-container ">
      <Style />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="slide-eyebrow">Presentation</div>
        <h1 className="slide-title" style={{ fontSize: '72px', marginTop: '20px' }}>
          시편묵상_과제_정현승
        </h1>
        <div style={{ height: '4px', width: '200px', background: '#b91c1c', margin: '40px 0 20px' }} />
        <p className="slide-subtitle">AI Generated Slide Deck</p>
      </div>
      <div className="slide-footer">
        <span>Ollama Slide Generator</span>
        <span>01 / 06</span>
      </div>
    </div>
  ),
  // Page 2
  () => (
    <div className="slide-container ">
      <Style />
      <h2 className="slide-title">슬라이드 1</h2>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ul className="bullets-list">
        </ul>
      </div>
      <div className="slide-footer">
        <span>Ollama Slide Generator</span>
        <span>02 / 06</span>
      </div>
    </div>
  ),
  // Page 3
  () => (
    <div className="slide-container ">
      <Style />
      <h2 className="slide-title">슬라이드 2</h2>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ul className="bullets-list">
        </ul>
      </div>
      <div className="slide-footer">
        <span>Ollama Slide Generator</span>
        <span>03 / 06</span>
      </div>
    </div>
  ),
  // Page 4
  () => (
    <div className="slide-container ">
      <Style />
      <h2 className="slide-title">슬라이드 3</h2>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ul className="bullets-list">
        </ul>
      </div>
      <div className="slide-footer">
        <span>Ollama Slide Generator</span>
        <span>04 / 06</span>
      </div>
    </div>
  ),
  // Page 5
  () => (
    <div className="slide-container ">
      <Style />
      <h2 className="slide-title">슬라이드 4</h2>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ul className="bullets-list">
        </ul>
      </div>
      <div className="slide-footer">
        <span>Ollama Slide Generator</span>
        <span>05 / 06</span>
      </div>
    </div>
  ),
  // Page 6
  () => (
    <div className="slide-container ">
      <Style />
      <h2 className="slide-title">슬라이드 5</h2>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ul className="bullets-list">
        </ul>
      </div>
      <div className="slide-footer">
        <span>Ollama Slide Generator</span>
        <span>06 / 06</span>
      </div>
    </div>
  ),

];

export default pages;
