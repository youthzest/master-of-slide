import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#f4efe6', text: '#111111', accent: '#ff4f1a' },
  fonts: {
    display:
      '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
    body: '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
  },
  typeScale: { hero: 154, body: 38 },
  radius: 8,
};

const ink = '#111111';
const paper = '#f4efe6';
const cream = '#fffaf0';
const purple = '#6d4cff';
const mint = '#1fd1a5';
const blue = '#1b78ff';
const yellow = '#ffd84d';
const red = '#ff4f1a';
const muted = '#675f55';

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

const mono: CSSProperties = {
  fontFamily: '"JetBrains Mono", "SF Mono", Menlo, Consolas, "Apple SD Gothic Neo", monospace',
};

const gridBg: CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(17,17,17,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(17,17,17,0.08) 2px, transparent 2px)',
  backgroundSize: '64px 64px',
};

function PageShell({
  children,
  label,
  section,
  bg = paper,
}: {
  children: ReactNode;
  label: string;
  section?: string;
  bg?: string;
}) {
  return (
    <div style={{ ...fill, ...gridBg, backgroundColor: bg, padding: 92 }}>
      <div
        style={{
          position: 'absolute',
          top: 34,
          left: 92,
          ...mono,
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        GPT IMAGE 2 / PROMPT CHEATSHEET
      </div>
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 92,
          border: `4px solid ${ink}`,
          background: cream,
          padding: '10px 18px',
          boxShadow: `8px 8px 0 ${ink}`,
          ...mono,
          fontSize: 22,
          fontWeight: 900,
        }}
      >
        {label}
      </div>
      {section && (
        <div
          style={{
            position: 'absolute',
            left: 92,
            bottom: 44,
            ...mono,
            color: muted,
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          {section}
        </div>
      )}
      {children}
    </div>
  );
}

function Stamp({ children, color = yellow }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        border: `5px solid ${ink}`,
        background: color,
        color: ink,
        padding: '12px 22px',
        boxShadow: `8px 8px 0 ${ink}`,
        transform: 'rotate(-2deg)',
        ...mono,
        fontSize: 28,
        fontWeight: 900,
      }}
    >
      {children}
    </span>
  );
}

function Card({
  title,
  body,
  color = cream,
  accent = red,
}: {
  title: string;
  body: string;
  color?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        border: `5px solid ${ink}`,
        background: color,
        boxShadow: `12px 12px 0 ${ink}`,
        padding: 30,
        minHeight: 178,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: accent,
          color: accent === ink ? cream : ink,
          border: `4px solid ${ink}`,
          padding: '8px 14px',
          ...mono,
          fontSize: 22,
          fontWeight: 900,
          marginBottom: 18,
        }}
      >
        {title}
      </div>
      <p style={{ margin: 0, fontSize: 31, lineHeight: 1.42, fontWeight: 750 }}>{body}</p>
    </div>
  );
}

function PromptChip({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        border: `4px solid ${ink}`,
        background: color,
        boxShadow: `8px 8px 0 ${ink}`,
        padding: '20px 24px',
        fontSize: 30,
        fontWeight: 900,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
}

const Cover: Page = () => (
  <PageShell label="01" bg="#fff5db">
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 150,
          width: 390,
          height: 390,
          border: `8px solid ${ink}`,
          background: purple,
          boxShadow: `20px 20px 0 ${ink}`,
          transform: 'rotate(7deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 240,
          top: 280,
          width: 430,
          height: 260,
          border: `8px solid ${ink}`,
          background: mint,
          boxShadow: `18px 18px 0 ${ink}`,
          transform: 'rotate(-6deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 190,
          top: 650,
          width: 310,
          height: 130,
          border: `8px solid ${ink}`,
          background: yellow,
          boxShadow: `14px 14px 0 ${ink}`,
          transform: 'rotate(3deg)',
        }}
      />
    </div>
    <div style={{ position: 'relative', width: 1180, paddingTop: 140 }}>
      <Stamp>실전 구조집</Stamp>
      <h1
        style={{
          margin: '58px 0 34px',
          fontFamily: 'var(--osd-font-display)',
          fontSize: 150,
          lineHeight: 0.98,
          letterSpacing: '-0.045em',
          fontWeight: 950,
          textAlign: 'justify',
        }}
      >
        GPT Image 2
        <br />
        프롬프트 치트시트
      </h1>
      <p style={{ width: 980, margin: 0, fontSize: 43, lineHeight: 1.42, fontWeight: 760 }}>
        긴 아카이브를 매번 읽지 않고, 이미지 생성 직전에 바로 꺼내 쓰는
        <span style={{ color: red }}> 카테고리 기반 프롬프트 조립법</span>.
      </p>
    </div>
  </PageShell>
);

const Why: Page = () => (
  <PageShell label="02" section="왜 필요한가">
    <div style={{ paddingTop: 112 }}>
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 104,
          lineHeight: 1.06,
          letterSpacing: '-0.035em',
          fontWeight: 950,
          width: 1300,
        }}
      >
        사용자는 느낌만 말하고,
        <br />
        에이전트가 구조를 채운다.
      </h2>
      <div
        style={{
          marginTop: 72,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 34,
        }}
      >
        <Card
          title="문제"
          body="원본 아카이브는 길다. 매번 전체를 읽으면 느리고 비싸다."
          accent={red}
        />
        <Card
          title="해결"
          body="카테고리를 고르고, 검증된 구조에 변수만 채워 빠르게 만든다."
          accent={yellow}
        />
        <Card
          title="효과"
          body="짧은 요구도 히어로 이미지, 인포그래픽, 포스터 프롬프트로 확장된다."
          accent={mint}
        />
      </div>
    </div>
  </PageShell>
);

const Formula: Page = () => {
  const parts = [
    ['subject', red],
    ['composition', yellow],
    ['style', mint],
    ['environment', blue],
    ['lighting', purple],
    ['typography', '#ff9fd6'],
    ['details', '#b8f35a'],
    ['aspect ratio', cream],
  ];
  return (
    <PageShell label="03" section="프롬프트 조립식">
      <div style={{ paddingTop: 120 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 94,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            fontWeight: 950,
            width: 1180,
          }}
        >
          8개의 슬롯만 채우면 이미지 프롬프트가 된다.
        </h2>
        <div
          style={{
            marginTop: 64,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 26,
          }}
        >
          {parts.map(([text, color]) => (
            <PromptChip key={text} text={text} color={color} />
          ))}
        </div>
        <div
          style={{
            marginTop: 56,
            border: `5px solid ${ink}`,
            background: ink,
            color: cream,
            boxShadow: `12px 12px 0 ${red}`,
            padding: '34px 42px',
            ...mono,
            fontSize: 32,
            lineHeight: 1.45,
            fontWeight: 800,
          }}
        >
          [주제] + [구도] + [스타일] + [배경] + [조명] + [텍스트 영역] + [질감] + [비율]
        </div>
      </div>
    </PageShell>
  );
};

const Categories: Page = () => {
  const cats = [
    ['프로필 / 아바타', '대표 이미지, 페르소나 카드', red],
    ['YouTube 썸네일', '강한 주목성, 표지 슬라이드', yellow],
    ['인포그래픽', '단계, 도해, 라벨, 콜아웃', mint],
    ['제품 마케팅', '브랜드 포스터, 캠페인 비주얼', purple],
    ['E-commerce', '상세페이지 메인컷, 제품 단독샷', blue],
    ['UI 목업', '앱 화면, 대시보드, 서비스 컨셉', '#ff9fd6'],
    ['스토리보드', '캐릭터, 장면, 여정 시각화', '#b8f35a'],
  ];
  return (
    <PageShell label="04" section="카테고리 선택">
      <div style={{ paddingTop: 112 }}>
        <h2 style={{ margin: 0, fontSize: 96, lineHeight: 1.08, fontWeight: 950 }}>
          먼저 “무슨 유형의 이미지인가?”를 정한다.
        </h2>
        <div
          style={{
            marginTop: 56,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 26,
          }}
        >
          {cats.map(([title, body, color], i) => (
            <div
              key={title}
              style={{
                minHeight: i === 6 ? 150 : 190,
                border: `5px solid ${ink}`,
                background: color,
                color: ink,
                boxShadow: `10px 10px 0 ${ink}`,
                padding: 26,
              }}
            >
              <div style={{ ...mono, fontSize: 24, fontWeight: 950, marginBottom: 16 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 36, fontWeight: 950, marginBottom: 12 }}>{title}</div>
              <div style={{ fontSize: 25, lineHeight: 1.35, fontWeight: 740 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

const Recipe: Page = () => (
  <PageShell label="05" section="추천 레시피">
    <div style={{ paddingTop: 112 }}>
      <h2 style={{ margin: 0, fontSize: 92, lineHeight: 1.08, fontWeight: 950 }}>
        슬라이드에서는 이 세 가지가 가장 자주 쓰인다.
      </h2>
      <div
        style={{
          marginTop: 58,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 34,
        }}
      >
        <Card
          title="표지"
          color="#fff2a8"
          accent={yellow}
          body="bold thumbnail + strong headline area + high contrast + landscape"
        />
        <Card
          title="설명"
          color="#d7fff1"
          accent={mint}
          body="clean infographic + labeled callouts + structured blocks + readable layout"
        />
        <Card
          title="제품"
          color="#e6ddff"
          accent={purple}
          body="premium poster + hero-centered composition + brand typography area"
        />
      </div>
      <div
        style={{
          marginTop: 54,
          border: `5px solid ${ink}`,
          background: cream,
          boxShadow: `12px 12px 0 ${ink}`,
          padding: 34,
          fontSize: 34,
          lineHeight: 1.45,
          fontWeight: 780,
        }}
      >
        원칙: 이미지는 “텍스트를 대신하는 장식”이 아니라, 한 장의 슬라이드가 말할 아이디어를 더 빨리
        이해시키는 시각 장치다.
      </div>
    </div>
  </PageShell>
);

const Examples: Page = () => {
  const examples = [
    [
      '한국 투자회사 느낌의 고급 포스터',
      'premium venture capital poster, Korean financial brand aesthetic...',
    ],
    [
      '눈에 띄는 AI 자동화 유튜브 썸네일',
      'bold YouTube thumbnail about AI automation, dramatic focal subject...',
    ],
    [
      '귀엽고 따뜻한 가족 일러스트',
      'heartwarming family illustration, soft pastel palette, cozy domestic background...',
    ],
  ];
  return (
    <PageShell label="06" section="빠른 변환 예시">
      <div style={{ paddingTop: 104 }}>
        <h2 style={{ margin: 0, fontSize: 90, lineHeight: 1.08, fontWeight: 950 }}>
          짧은 말도 생성 가능한 프롬프트로 바뀐다.
        </h2>
        <div style={{ marginTop: 52, display: 'grid', gap: 28 }}>
          {examples.map(([input, output], i) => (
            <div
              key={input}
              style={{
                display: 'grid',
                gridTemplateColumns: '530px 1fr',
                gap: 28,
                alignItems: 'stretch',
              }}
            >
              <div
                style={{
                  border: `5px solid ${ink}`,
                  background: [red, yellow, mint][i],
                  boxShadow: `8px 8px 0 ${ink}`,
                  padding: 24,
                  fontSize: 34,
                  lineHeight: 1.32,
                  fontWeight: 920,
                }}
              >
                {input}
              </div>
              <div
                style={{
                  border: `5px solid ${ink}`,
                  background: cream,
                  boxShadow: `8px 8px 0 ${ink}`,
                  padding: 24,
                  ...mono,
                  fontSize: 26,
                  lineHeight: 1.38,
                  fontWeight: 760,
                }}
              >
                {output}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

const AgentFlow: Page = () => {
  const steps = [
    ['1', '문서 읽기', 'Markdown / Obsidian 원문에서 핵심 구조 추출'],
    ['2', '슬라이드 설계', '한 페이지에 한 아이디어만 배치'],
    ['3', '이미지 판단', '표지, 도해, 목업처럼 필요한 곳만 생성'],
    ['4', 'assets 저장', '생성 또는 복사한 이미지를 슬라이드 폴더에 배치'],
  ];
  return (
    <PageShell label="07" section="Master Of Slide 연결">
      <div style={{ paddingTop: 108 }}>
        <h2 style={{ margin: 0, fontSize: 92, lineHeight: 1.08, fontWeight: 950, width: 1330 }}>
          `/slide`는 문서와 이미지 프롬프트를 한 흐름으로 묶는다.
        </h2>
        <div
          style={{ marginTop: 60, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}
        >
          {steps.map(([n, title, body], i) => (
            <div
              key={title}
              style={{
                border: `5px solid ${ink}`,
                background: [yellow, mint, '#e6ddff', '#dcecff'][i],
                boxShadow: `10px 10px 0 ${ink}`,
                padding: 26,
                minHeight: 320,
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  border: `5px solid ${ink}`,
                  background: ink,
                  color: cream,
                  display: 'grid',
                  placeItems: 'center',
                  ...mono,
                  fontSize: 32,
                  fontWeight: 950,
                  marginBottom: 28,
                }}
              >
                {n}
              </div>
              <div style={{ fontSize: 38, fontWeight: 950, marginBottom: 18 }}>{title}</div>
              <div style={{ fontSize: 27, lineHeight: 1.4, fontWeight: 740 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

const Closing: Page = () => (
  <PageShell label="08" bg="#101010">
    <div
      style={{
        position: 'absolute',
        inset: 92,
        border: `6px solid ${cream}`,
        background: '#1c1c1c',
        boxShadow: `18px 18px 0 ${red}`,
        padding: 76,
        color: cream,
      }}
    >
      <Stamp color={red}>운영 원칙</Stamp>
      <h2
        style={{
          margin: '56px 0 42px',
          fontSize: 104,
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          fontWeight: 950,
          width: 1260,
        }}
      >
        원본 전체를 읽지 말고,
        <br />
        구조를 먼저 꺼내 쓴다.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, marginTop: 54 }}>
        {[
          '치트시트 기준으로 먼저 조립',
          '부족할 때만 원본 아카이브 탐색',
          '사용자는 느낌만 말하면 됨',
          '중요한 한글 텍스트는 React로 편집 가능하게',
        ].map((text, i) => (
          <div
            key={text}
            style={{
              border: `4px solid ${cream}`,
              background: i % 2 === 0 ? red : purple,
              color: cream,
              padding: '24px 28px',
              fontSize: 34,
              lineHeight: 1.32,
              fontWeight: 850,
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  </PageShell>
);

export const meta: SlideMeta = {
  title: 'GPT Image 2 프롬프트 실전 치트시트',
};

export const notes = [
  '치트시트의 목적과 발표의 핵심 약속을 소개한다.',
  '긴 아카이브 대신 구조화된 템플릿을 쓰는 이유를 설명한다.',
  '8개 슬롯이 프롬프트 조립의 기본 단위임을 강조한다.',
  '이미지 생성 요청을 먼저 카테고리로 분류하는 방식을 보여준다.',
  'Master Of Slide에서 가장 쓸모 있는 세 가지 이미지 유형을 설명한다.',
  '짧은 사용자 요청이 완성형 프롬프트로 확장되는 예시를 보여준다.',
  '/slide 워크플로가 문서, 슬라이드, 이미지 프롬프트를 연결하는 방식을 설명한다.',
  '실전 운영 원칙을 요약한다.',
];

export default [
  Cover,
  Why,
  Formula,
  Categories,
  Recipe,
  Examples,
  AgentFlow,
  Closing,
] satisfies Page[];
