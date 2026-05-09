import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import type { CSSProperties } from 'react';
import coverHero from './assets/cover-hero_001.jpg';
import ladderArt from './assets/ladder_001.jpg';

/* ─────────────────────────────────────────────────────────────
 * 주식 리치고 — 서비스 전략 보고서 (유료화 vs 오픈소스 vs 하이브리드)
 * Theme: research-brief (auto-selected)
 * 14 pages · 2 image placeholders
 * Source: 2026-05-08_주식리치고_서비스전략보고서_유료화vs오픈소스.md
 * ──────────────────────────────────────────────────────────── */

export const design: DesignSystem = {
  palette: { bg: '#f7f5f0', text: '#1a1814', accent: '#6d4cff' },
  fonts: {
    display: '"Times New Roman", "Georgia", serif',
    body: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", system-ui, sans-serif',
  },
  typeScale: { hero: 196, body: 28 },
  radius: 16,
};

export const meta: SlideMeta = {
  title: '주식 리치고 — 유료화 vs 오픈소스 전략 메모',
  description:
    '30년 투자 인사이트 SaaS의 출시 결정. 오픈 코어 + 단계적 분리 출시 권고와 90일 로드맵, 검증 KPI를 14장으로 정리.',
};

/* ────── tokens ────── */
const C = {
  bg: '#f7f5f0',
  surface: '#ffffff',
  text: '#1a1814',
  muted: '#6b6660',
  faint: '#a8a29a',
  line: '#e4e0d8',
  accent: '#6d4cff',
  accentSoft: 'rgba(109, 76, 255, 0.10)',
  warm: '#c2410c',
  warmSoft: 'rgba(194, 65, 12, 0.10)',
  green: '#15803d',
  greenSoft: 'rgba(21, 128, 61, 0.10)',
  red: '#b91c1c',
  redSoft: 'rgba(185, 28, 28, 0.10)',
};
const F = {
  serif: '"Times New Roman", "Georgia", serif',
  sans: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", system-ui, sans-serif',
  mono: '"SF Mono", "JetBrains Mono", "Menlo", monospace',
};
const PAD_X = 100;
const PAD_Y = 84;
const TOTAL = 14;
const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  fontFamily: F.sans,
  color: C.text,
  background: C.bg,
  position: 'relative',
  overflow: 'hidden',
};

const keyframes = `
@keyframes rFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rFade   { from { opacity: 0; } to { opacity: 1; } }
@keyframes rLineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes rBarGrow  { from { transform: scaleX(0); } to { transform: scaleX(var(--scale, 1)); } }
.r-fadeup { animation: rFadeUp 900ms ${ease} both; }
.r-fade   { animation: rFade 1000ms ${ease} both; }
.r-line   { animation: rLineGrow 800ms ${ease} both; transform-origin: left center; }
.r-bar    { animation: rBarGrow 1100ms ${ease} both; transform-origin: left center; }
`;
const Style = () => <style>{keyframes}</style>;

/* ────── primitives ────── */
const Eyebrow = ({
  children,
  color = C.accent,
  delay = 0,
}: {
  children: React.ReactNode;
  color?: string;
  delay?: number;
}) => (
  <div
    className="r-fadeup"
    style={{
      animationDelay: `${delay}ms`,
      fontFamily: F.sans,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

const Footer = ({ pageNum, section }: { pageNum: number; section: string }) => (
  <div
    style={{
      position: 'absolute',
      left: PAD_X,
      right: PAD_X,
      bottom: 56,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: F.sans,
      fontSize: 18,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: C.muted,
      borderTop: `1px solid ${C.line}`,
      paddingTop: 18,
    }}
  >
    <span>{section}</span>
    <span>주식 리치고 · 전략 메모</span>
    <span>
      {String(pageNum).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
    </span>
  </div>
);

const Heading = ({ children, size = 84 }: { children: React.ReactNode; size?: number }) => (
  <h2
    className="r-fadeup"
    style={{
      fontFamily: F.serif,
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: '-0.015em',
      margin: 0,
      color: C.text,
    }}
  >
    {children}
  </h2>
);

const Body = ({
  children,
  size = 26,
  color = C.text,
  maxWidth = 1500,
  delay = 200,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  maxWidth?: number;
  delay?: number;
}) => (
  <p
    className="r-fadeup"
    style={{
      animationDelay: `${delay}ms`,
      fontFamily: F.sans,
      fontSize: size,
      lineHeight: 1.55,
      color,
      margin: 0,
      maxWidth,
    }}
  >
    {children}
  </p>
);

const Rule = ({ width = 220, delay = 100 }: { width?: number; delay?: number }) => (
  <div
    className="r-line"
    style={{ animationDelay: `${delay}ms`, height: 1, width, background: C.text }}
  />
);

const Pill = ({
  children,
  color = C.accent,
  fill = C.accentSoft,
}: {
  children: React.ReactNode;
  color?: string;
  fill?: string;
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 14px',
      borderRadius: 999,
      border: `1px solid ${color}`,
      background: fill,
      color,
      fontFamily: F.sans,
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '0.04em',
    }}
  >
    {children}
  </span>
);

/* ─────────────── 1. Cover ─────────────── */
const Cover: Page = () => (
  <div style={fill}>
    <Style />
    {/* hero photo */}
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 720,
        background: `linear-gradient(180deg, ${C.bg} 0%, transparent 12%, transparent 88%, ${C.bg} 100%)`,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 720, opacity: 0.95 }}>
      <img
        src={coverHero}
        alt=""
        aria-hidden="true"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>

    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: `${PAD_Y}px ${PAD_X}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 36,
        maxWidth: 1180,
      }}
    >
      <Eyebrow>Strategy Memo · 2026-05-08</Eyebrow>
      <h1
        className="r-fadeup"
        style={{
          fontFamily: F.serif,
          fontSize: 168,
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          margin: 0,
          color: C.text,
          animationDelay: '120ms',
        }}
      >
        Next Finance
      </h1>
      <Heading size={56}>유료화 vs 오픈소스 vs 하이브리드</Heading>
      <Rule width={300} delay={300} />
      <Body size={28} maxWidth={920} delay={400}>
        30년 투자 인사이트 SaaS의 출시 결정. <strong>이분법은 잘못된 프레임</strong>이며, 오픈 코어
        + 단계적 분리 출시가 30년 평판 자산을 가장 안전하게 확장한다.
      </Body>
      <div
        className="r-fadeup"
        style={{ animationDelay: '600ms', display: 'flex', gap: 12, marginTop: 12 }}
      >
        <Pill>14 pages</Pill>
        <Pill color={C.warm} fill={C.warmSoft}>
          의사결정-준비
        </Pill>
        <Pill color={C.muted} fill="transparent">
          parent: richgo.ai
        </Pill>
      </div>
    </div>
    <Footer pageNum={1} section="Cover" />
  </div>
);

/* ─────────────── 2. TL;DR ─────────────── */
const TLDR: Page = () => {
  const points = [
    {
      n: '01',
      title: '이분법은 잘못된 프레임',
      body: '"완전 유료 vs 완전 오픈소스" 양자택일은 30년 평판 자산을 가장 비효율적으로 사용하는 길이다.',
    },
    {
      n: '02',
      title: '오픈 코어 + 단계적 분리',
      body: '철학·기본 지표·백테스팅 = 공개 / 30년 노하우의 실시간 스코어링 엔진 = 블랙박스 유료화.',
    },
    {
      n: '03',
      title: '출시 전 두 가지 필수',
      body: '① 자본시장법 자문 + 별도 법인 분리 (평판 격벽). ② 100~300명 유료 파일럿 — 매출이 아닌 재결제율·리텐션 검증.',
    },
    {
      n: '04',
      title: 'MAU 100만은 잠재력이지 매출이 아님',
      body: '핀테크 SaaS 평균 freemium 전환율 1~5% (top-quartile 8~15%). 부동산→주식 자동전이 가설은 미검증.',
    },
    {
      n: '05',
      title: '첫 90일은 행동이 아닌 검증의 시간',
      body: '검증·분리설계·평판자산화. 이 시간을 견딘 자만이 다음 30년을 얻는다.',
    },
  ];
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        <Eyebrow>TL;DR · 30초 요약</Eyebrow>
        <Heading size={92}>다섯 줄 결론.</Heading>
        <Rule width={260} />
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, marginTop: 24 }}
        >
          {points.map((p, i) => (
            <div
              key={p.n}
              className="r-fadeup"
              style={{
                animationDelay: `${200 + i * 120}ms`,
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderRadius: 16,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: F.serif,
                  fontSize: 44,
                  fontWeight: 700,
                  color: C.accent,
                  lineHeight: 1,
                }}
              >
                {p.n}
              </div>
              <div
                style={{
                  fontFamily: F.serif,
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: C.text,
                }}
              >
                {p.title}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 17, lineHeight: 1.55, color: C.muted }}>
                {p.body}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer pageNum={2} section="TL;DR" />
    </div>
  );
};

/* ─────────────── 3. Assets ─────────────── */
const Assets: Page = () => {
  const rows = [
    {
      k: '🏢 부동산 리치고 운영',
      v: 'MAU 100만',
      note: '검증된 데이터 리터러시 사용자 · 결제·CS·법무 인프라 보유',
    },
    {
      k: '📈 주식투자 트랙레코드',
      v: '30년 + 점수화 알고리즘',
      note: 'out-of-sample 외부 검증은 미완료',
    },
    { k: '🛠 운영 노하우', v: '데이터 SaaS · 결제·CS·법무', note: '한계비용 낮음' },
    { k: '🧠 평판 자본', v: '부동산 데이터 분석 권위', note: '⚠️ 확장 시 희석 위험 동시 존재' },
  ];
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <Eyebrow>§1 · 의사결정 맥락</Eyebrow>
        <Heading>사용자가 가진 자산.</Heading>
        <Rule width={280} />
        <Body size={28} maxWidth={1500}>
          한국 핀테크 슈퍼앱 비교군 — 토스 MAU 약 1,977만 (2025), 카카오페이 305만 (1년 만에 3배).
          리치고의 100만은 의미 있지만, <strong>주식 SaaS 자동 전이는 검증되지 않은 가설</strong>
          이다.
        </Body>

        <div
          style={{
            marginTop: 12,
            background: C.surface,
            border: `1px solid ${C.line}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {rows.map((r, i) => (
            <div
              key={r.k}
              className="r-fadeup"
              style={{
                animationDelay: `${200 + i * 100}ms`,
                display: 'grid',
                gridTemplateColumns: '380px 380px 1fr',
                padding: '24px 32px',
                borderTop: i === 0 ? 'none' : `1px solid ${C.line}`,
                gap: 24,
                alignItems: 'center',
              }}
            >
              <div style={{ fontFamily: F.sans, fontSize: 22, fontWeight: 600, color: C.text }}>
                {r.k}
              </div>
              <div style={{ fontFamily: F.serif, fontSize: 32, fontWeight: 700, color: C.accent }}>
                {r.v}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 20, color: C.muted, lineHeight: 1.5 }}>
                {r.note}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Pill color={C.muted} fill="transparent">
            자료: 모바일인덱스 2025 상반기
          </Pill>
          <Pill color={C.muted} fill="transparent">
            FirstPageSage SaaS 전환율 2026
          </Pill>
          <Pill color={C.muted} fill="transparent">
            SPIVA 2024 (S&P DJI)
          </Pill>
        </div>
      </div>
      <Footer pageNum={3} section="§1 자산" />
    </div>
  );
};

/* ─────────────── 4. Surface vs Essence Question ─────────────── */
const Question: Page = () => {
  const items = [
    {
      label: '본질 1',
      q: '평판 보존이 우선인가, 확장이 우선인가?',
      sub: '30년 부동산 평판 자산 — 보호할 것인가, 새 시장으로 끌고 갈 것인가.',
    },
    {
      label: '본질 2',
      q: '무엇을 공개하고 무엇을 봉인할 것인가?',
      sub: 'Spectrum 문제 — 철학·지표·코드는 어디까지, 스코어링은 어디부터.',
    },
    {
      label: '본질 3',
      q: '평판을 SaaS 변동성에 연결할 것인가, 격벽으로 분리할 것인가?',
      sub: '단일 통합 브랜드 vs 별도 법인·도메인. 한쪽 행정처분의 전이 가능성.',
    },
  ];
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <Eyebrow>§1.3 · 진짜 질문</Eyebrow>
        <Heading>표면 질문 → 본질 질문.</Heading>
        <Rule width={280} />

        <div
          style={{
            marginTop: 8,
            padding: '20px 28px',
            border: `1px dashed ${C.warm}`,
            background: C.warmSoft,
            color: C.warm,
            fontFamily: F.sans,
            fontSize: 24,
            borderRadius: 12,
            maxWidth: 1500,
          }}
        >
          ❌ <strong>표면 질문</strong>: "유료화? 오픈소스?" — 양자택일 프레임은 결정의 진짜 축을
          놓친다.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 8 }}>
          {items.map((it, i) => (
            <div
              key={it.label}
              className="r-fadeup"
              style={{
                animationDelay: `${300 + i * 150}ms`,
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderLeft: `4px solid ${C.accent}`,
                borderRadius: 12,
                padding: '24px 32px',
                gap: 28,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: F.sans,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: C.accent,
                }}
              >
                {it.label}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: F.serif,
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: C.text,
                  }}
                >
                  {it.q}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: F.sans,
                    fontSize: 20,
                    color: C.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {it.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer pageNum={4} section="§1 본질 질문" />
    </div>
  );
};

/* ─────────────── 5. Three Options ─────────────── */
const ThreeOptions: Page = () => {
  const dims = [
    '단기 매출',
    '시장 파급력',
    '평판 효과',
    'IP 유출 리스크',
    '법적 리스크',
    'CAC 효율',
    '확장성 (B2B)',
    '30년 평판 보호',
  ];
  const grid: Array<{ label: string; tone: 'red' | 'amber' | 'green' }>[] = [
    // A 완전 유료
    [
      { label: '🟢 빠름', tone: 'green' },
      { label: '🔴 작음', tone: 'red' },
      { label: '🟡 폐쇄적', tone: 'amber' },
      { label: '🟢 낮음', tone: 'green' },
      { label: '🔴 직접 노출', tone: 'red' },
      { label: '🔴 8~12만원', tone: 'red' },
      { label: '🟡 가능', tone: 'amber' },
      { label: '🟡 단일 실패점', tone: 'amber' },
    ],
    // B 완전 오픈소스
    [
      { label: '🔴 없음', tone: 'red' },
      { label: '🟢 폭발적', tone: 'green' },
      { label: '🟢 학술 권위', tone: 'green' },
      { label: '🔴 높음', tone: 'red' },
      { label: '🟡 회색지대', tone: 'amber' },
      { label: '🟢 콘텐츠 유입', tone: 'green' },
      { label: '🟢 표준화', tone: 'green' },
      { label: '🟢 안전', tone: 'green' },
    ],
    // C 오픈 코어 ⭐
    [
      { label: '🟡 점진적', tone: 'amber' },
      { label: '🟢 큼', tone: 'green' },
      { label: '🟢 권위+상업', tone: 'green' },
      { label: '🟡 통제 가능', tone: 'amber' },
      { label: '🟡 분리 설계', tone: 'amber' },
      { label: '🟢 낮음', tone: 'green' },
      { label: '🟢 가장 유리', tone: 'green' },
      { label: '🟢 격벽 안전', tone: 'green' },
    ],
  ];
  const cols = [
    { name: 'A. 완전 유료 SaaS', case: '예: TradingView', accent: false },
    { name: 'B. 완전 오픈소스', case: '예: scikit-learn류', accent: false },
    { name: 'C. 오픈 코어 ⭐', case: '예: GitLab · Elastic · Red Hat', accent: true },
  ];
  const tones = {
    green: { color: C.green, bg: C.greenSoft },
    amber: { color: C.warm, bg: C.warmSoft },
    red: { color: C.red, bg: C.redSoft },
  };
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <Eyebrow>§2 · 옵션 매트릭스</Eyebrow>
        <Heading size={68}>세 가지 길, 한 페이지에서 비교.</Heading>
        <Rule width={260} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px repeat(3, 1fr)',
            gap: 0,
            marginTop: 16,
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            background: C.surface,
            overflow: 'hidden',
          }}
        >
          {/* header row */}
          <div
            style={{ padding: '18px 20px', borderRight: `1px solid ${C.line}`, background: C.bg }}
          />
          {cols.map((c) => (
            <div
              key={c.name}
              style={{
                padding: '18px 20px',
                borderRight: `1px solid ${C.line}`,
                borderBottom: `2px solid ${c.accent ? C.accent : C.line}`,
                background: c.accent ? C.accentSoft : C.bg,
              }}
            >
              <div
                style={{
                  fontFamily: F.serif,
                  fontSize: 24,
                  fontWeight: 700,
                  color: c.accent ? C.accent : C.text,
                }}
              >
                {c.name}
              </div>
              <div style={{ marginTop: 4, fontFamily: F.sans, fontSize: 16, color: C.muted }}>
                {c.case}
              </div>
            </div>
          ))}
          {/* dim rows */}
          {dims.map((d, i) => (
            <>
              <div
                key={`dim-${d}`}
                style={{
                  padding: '14px 20px',
                  borderRight: `1px solid ${C.line}`,
                  borderTop: `1px solid ${C.line}`,
                  fontFamily: F.sans,
                  fontSize: 17,
                  fontWeight: 600,
                  color: C.text,
                  background: C.bg,
                }}
              >
                {d}
              </div>
              {grid.map((col, ci) => {
                const cell = col[i];
                const t = tones[cell.tone];
                return (
                  <div
                    key={`${ci}-${i}`}
                    style={{
                      padding: '14px 20px',
                      borderRight: `1px solid ${C.line}`,
                      borderTop: `1px solid ${C.line}`,
                      background: ci === 2 ? 'rgba(109,76,255,0.04)' : C.surface,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: 999,
                        background: t.bg,
                        color: t.color,
                        fontFamily: F.sans,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {cell.label}
                    </span>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
      <Footer pageNum={5} section="§2 옵션 매트릭스" />
    </div>
  );
};

/* ─────────────── 6. Recommended: Open Core ─────────────── */
const Recommended: Page = () => {
  const evidence = [
    {
      metric: '5×',
      label: '오픈 코어 단가 분리 시 매출 잠재력',
      src: 'GitLab buyer-based open core',
    },
    { metric: '69%', label: 'GitLab YoY 매출 성장 (2022)', src: 'FourWeekMBA 2026' },
    { metric: '10–15%', label: '단가 분리 시 추가 매출 (vs 단순 가격)', src: 'Gartner research' },
    { metric: '$66.84B', label: '오픈소스 서비스 시장 규모 (2026)', src: 'Statista' },
  ];
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <Eyebrow>§3 · 권고 전략</Eyebrow>
        <Heading size={92}>오픈 코어 하이브리드.</Heading>
        <Rule width={280} />
        <Body size={28} maxWidth={1500}>
          이미 검증된 패턴이다. <strong>GitLab · Elastic · Red Hat · MongoDB</strong>는 모두 핵심을
          공개해 학술적 권위를 얻고, 자동화·운영·보안을 유료화로 회수한다. 한국 핀테크 SaaS 영역에서
          같은 구조를 처음 도입하는 자가 시장 표준이 된다.
        </Body>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 12 }}
        >
          {evidence.map((e, i) => (
            <div
              key={e.label}
              className="r-fadeup"
              style={{
                animationDelay: `${300 + i * 120}ms`,
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderRadius: 16,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: F.serif,
                  fontSize: 56,
                  fontWeight: 700,
                  color: C.accent,
                  lineHeight: 1,
                }}
              >
                {e.metric}
              </div>
              <div
                style={{
                  fontFamily: F.sans,
                  fontSize: 19,
                  lineHeight: 1.4,
                  color: C.text,
                  fontWeight: 600,
                }}
              >
                {e.label}
              </div>
              <div
                style={{
                  marginTop: 'auto',
                  fontFamily: F.sans,
                  fontSize: 14,
                  color: C.muted,
                  letterSpacing: '0.04em',
                }}
              >
                {e.src}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 12,
            padding: '24px 32px',
            background: C.accentSoft,
            borderLeft: `4px solid ${C.accent}`,
            borderRadius: 8,
            maxWidth: 1500,
          }}
        >
          <div style={{ fontFamily: F.sans, fontSize: 22, color: C.text, lineHeight: 1.55 }}>
            <strong>4대 설계 원칙</strong> — ① 공개·폐쇄 분리선 / ② 법적 격벽(Firewall) / ③ 반증
            가능한 가설 (실패 조건 사전 명시) / ④ B2C → B2B 순서 (B2C로 데이터 만들고 화이트레이블로
            회수)
          </div>
        </div>
      </div>
      <Footer pageNum={6} section="§3 권고" />
    </div>
  );
};

/* ─────────────── 7. Open / Closed Ladder ─────────────── */
const Ladder: Page = () => {
  const layers = [
    {
      tier: 'L1',
      name: '🟢 무료 공개 (평판 자본)',
      bg: C.greenSoft,
      stroke: C.green,
      items: [
        '투자 철학·방법론 백서',
        '백테스팅 프레임워크 (MIT/BSL)',
        '기본 지표 정의',
        '샘플 시각화',
      ],
    },
    {
      tier: 'L2',
      name: '🟡 무료 콘텐츠 (관계 자본)',
      bg: C.warmSoft,
      stroke: C.warm,
      items: [
        '주간 무료 리서치 뉴스레터',
        '월간 열린 라이브 Q&A',
        '정정·시행착오 공개',
        '백서 업데이트',
      ],
    },
    {
      tier: 'L3',
      name: '🔵 유료 구독 (수익 코어)',
      bg: 'rgba(37, 99, 235, 0.08)',
      stroke: '#2563eb',
      items: [
        '실시간 스코어링 엔진 API',
        '유료 멤버 슬랙 커뮤니티',
        '개인화 리포트·알림',
        '월 1~3만원 / 연 25만원',
      ],
    },
    {
      tier: 'L4',
      name: '🟣 B2B / 생태계 (확장 자본)',
      bg: C.accentSoft,
      stroke: C.accent,
      items: [
        '증권사 화이트레이블 라이선스',
        '광고·제휴 네트워크',
        '데이터 벤더 제휴',
        '인덱스·지표 공급',
      ],
    },
  ];
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 540px',
          gap: 56,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Eyebrow>§3.2 · 공개·폐쇄 분리선</Eyebrow>
          <Heading size={68}>4층 가치 사다리.</Heading>
          <Rule width={240} />
          <Body size={22} maxWidth={1100}>
            아래로 갈수록 가치가 응축되고 가격이 붙는다. <strong>1층은 평판 자본</strong>,
            <strong> 2층은 관계 자본</strong>, <strong>3층은 수익 코어</strong>,
            <strong> 4층은 확장 자본</strong>. 각 층 사이에 분리선이 명확해야 IP 유출과 법적
            회색지대가 정리된다.
          </Body>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {layers.map((l, i) => (
              <div
                key={l.tier}
                className="r-fadeup"
                style={{
                  animationDelay: `${300 + i * 120}ms`,
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr',
                  background: l.bg,
                  border: `1px solid ${l.stroke}`,
                  borderRadius: 12,
                  padding: '14px 20px',
                  gap: 18,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 700, color: l.stroke }}
                >
                  {l.tier}
                </div>
                <div>
                  <div style={{ fontFamily: F.sans, fontSize: 19, fontWeight: 700, color: C.text }}>
                    {l.name}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: F.sans,
                      fontSize: 15,
                      color: C.muted,
                      lineHeight: 1.5,
                    }}
                  >
                    {l.items.join(' · ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={ladderArt}
            alt=""
            aria-hidden="true"
            style={{
              width: '100%',
              maxWidth: 500,
              height: 'auto',
              maxHeight: 720,
              objectFit: 'contain',
              borderRadius: 16,
              boxShadow: `0 1px 0 ${C.line}, 0 24px 60px rgba(20, 18, 14, 0.08)`,
            }}
          />
        </div>
      </div>
      <Footer pageNum={7} section="§3.2 공개·폐쇄" />
    </div>
  );
};

/* ─────────────── 8. Positioning ─────────────── */
const Positioning: Page = () => {
  const noList = [
    '"수익을 보장하는 투자 신호 서비스"',
    '"내 지표대로 사면 돈 번다"',
    '"월 1억 매출 가능한 핀테크"',
    '"고수 매매 알림 / 리딩방"',
  ];
  const yesList = [
    '"30년 데이터로 검증된 투자 의사결정 프레임워크 멤버십"',
    '"투자 판단력을 길러주는 데이터 분석 인프라"',
    '"체계·규율·루틴을 위한 종합 자산 분석 도구"',
    '"수익률을 약속하지 않고, 의사결정 품질을 약속한다"',
  ];
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <Eyebrow>§3.3 · 포지셔닝 재정의</Eyebrow>
        <Heading size={84}>수익률을 팔지 마라. 의사결정을 팔라.</Heading>
        <Rule width={280} />
        <Body size={22} maxWidth={1500}>
          <strong>2024.8.14부터 자본시장법이 양방향 영업을 금지</strong>했다. VIP 채팅·리딩방·실시간
          종목 추천은 유사투자자문업 등록 대상이자 집단소송의 직접 표적이다. 30년 평판이라는 고유
          자산을 단타 마케팅에 태우는 것은 가장 비효율적인 사용이다.
        </Body>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 16 }}>
          <div
            className="r-fadeup"
            style={{
              animationDelay: '200ms',
              background: C.redSoft,
              border: `1px dashed ${C.red}`,
              borderRadius: 16,
              padding: 32,
            }}
          >
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 22,
                fontWeight: 700,
                color: C.red,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              ❌ 절대 금지
            </div>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {noList.map((t) => (
                <div
                  key={t}
                  style={{ fontFamily: F.sans, fontSize: 22, color: C.text, lineHeight: 1.4 }}
                >
                  · {t}
                </div>
              ))}
            </div>
          </div>

          <div
            className="r-fadeup"
            style={{
              animationDelay: '350ms',
              background: C.greenSoft,
              border: `1px solid ${C.green}`,
              borderRadius: 16,
              padding: 32,
            }}
          >
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 22,
                fontWeight: 700,
                color: C.green,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              ✅ 권장 포지셔닝
            </div>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {yesList.map((t) => (
                <div
                  key={t}
                  style={{ fontFamily: F.sans, fontSize: 22, color: C.text, lineHeight: 1.4 }}
                >
                  · {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="r-fadeup"
          style={{
            animationDelay: '500ms',
            marginTop: 4,
            padding: '18px 28px',
            border: `1px solid ${C.line}`,
            background: C.surface,
            borderRadius: 12,
            fontFamily: F.sans,
            fontSize: 20,
            color: C.muted,
            maxWidth: 1500,
          }}
        >
          <strong style={{ color: C.text }}>1면 박스 권장</strong> · 홈페이지/백서/뉴스레터 1면에
          고정: “종목 추천 / 매수·매도 시그널 / 수익률 보장 / 리딩방 연계 —{' '}
          <em>우리는 다음을 하지 않습니다.</em>”
        </div>
      </div>
      <Footer pageNum={8} section="§3.3 포지셔닝" />
    </div>
  );
};

/* ─────────────── 9. Brand Firewall ─────────────── */
const Firewall: Page = () => {
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <Eyebrow>§3.4 · 브랜드 격벽</Eyebrow>
        <Heading size={84}>별도 법인. 별도 도메인. 별도 책임.</Heading>
        <Rule width={280} />
        <Body size={24} maxWidth={1500}>
          한쪽의 행정처분이 다른 쪽으로 전이되지 않도록 회계·책임을 통합하지 말 것. 마케팅 제휴만
          허용 — 단일 통합 브랜드 금지.
        </Body>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px 1fr',
            gap: 32,
            marginTop: 24,
            alignItems: 'stretch',
          }}
        >
          <div
            className="r-fadeup"
            style={{
              animationDelay: '200ms',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid #2563eb',
              borderRadius: 16,
              padding: 36,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#2563eb',
                textTransform: 'uppercase',
              }}
            >
              기존 법인
            </div>
            <div
              style={{
                fontFamily: F.serif,
                fontSize: 40,
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.2,
              }}
            >
              🏢 (주)리치고
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 19, color: C.text, lineHeight: 1.5 }}>
              · 부동산 리치고 운영 (richgo.ai)
              <br />· MAU 100만
              <br />· 부동산 도메인 평판
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: C.muted,
                textTransform: 'uppercase',
              }}
            >
              firewall
            </div>
            <div
              style={{
                width: 4,
                flex: 1,
                background: `repeating-linear-gradient(180deg, ${C.warm} 0 8px, transparent 8px 16px)`,
              }}
            />
            <div style={{ fontFamily: F.sans, fontSize: 16, color: C.warm, fontWeight: 600 }}>
              제휴 마케팅만 ✓
              <br />
              회계·책임 통합 ✗
            </div>
            <div
              style={{
                width: 4,
                flex: 1,
                background: `repeating-linear-gradient(180deg, ${C.warm} 0 8px, transparent 8px 16px)`,
              }}
            />
          </div>

          <div
            className="r-fadeup"
            style={{
              animationDelay: '300ms',
              background: C.warmSoft,
              border: `1px solid ${C.warm}`,
              borderRadius: 16,
              padding: 36,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: C.warm,
                textTransform: 'uppercase',
              }}
            >
              신설 법인 (예시)
            </div>
            <div
              style={{
                fontFamily: F.serif,
                fontSize: 40,
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.2,
              }}
            >
              📈 StockGo · 인사이트고
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 19, color: C.text, lineHeight: 1.5 }}>
              · B2C 멤버십 100~300명 파일럿
              <br />· B2B 화이트레이블
              <br />· 전문배상책임보험 별도
            </div>
          </div>
        </div>

        <div
          className="r-fadeup"
          style={{
            animationDelay: '500ms',
            marginTop: 8,
            padding: '18px 28px',
            background: C.redSoft,
            border: `1px dashed ${C.red}`,
            borderRadius: 12,
            color: C.red,
            fontFamily: F.sans,
            fontSize: 20,
            maxWidth: 1500,
          }}
        >
          ❌ 단일 통합 브랜드 금지 · ❌ 회계·책임 통합 금지 · ✅ 마케팅 제휴만 허용
        </div>
      </div>
      <Footer pageNum={9} section="§3.4 격벽" />
    </div>
  );
};

/* ─────────────── 10. 90-Day Roadmap ─────────────── */
const Roadmap: Page = () => {
  const phases = [
    {
      tag: 'Phase 0',
      time: '0–2주',
      label: '법적 게이트',
      crit: true,
      items: [
        '자본시장법 전문 변호사 1차 자문 (50–150만원)',
        '유사투자자문업 등록 필요 여부 확정',
        '광고·카피 금지선 + 면책 약관 + 보험 견적',
        '별도 법인 설립 검토 (변리사·세무사 합동)',
      ],
    },
    {
      tag: 'Phase 1',
      time: '2–6주',
      label: '검증 · 평판자산화',
      crit: false,
      items: [
        '30년 트랙레코드의 외부 통계 검증 (Walk-Forward, p-value)',
        '백서(White Paper) 학술 형식 공개',
        '베타 대기자 모집 — 가격 민감도·핵심 기능 측정',
      ],
    },
    {
      tag: 'Phase 2',
      time: '6–12주',
      label: '분리형 출시',
      crit: false,
      items: [
        'GitHub 오픈소스 공개 (MIT/BSL)',
        '유료 SaaS 베타 — 50무료 + 50유료 (1~2만원/월)',
        '검증 KPI: 4주 리텐션, NPS, 재결제 의사, 코호트 행동 변화',
      ],
    },
    {
      tag: 'Phase 3',
      time: '12주~6개월',
      label: 'GO / NO-GO',
      crit: false,
      items: [
        '코호트 데이터 분석 → 의사결정',
        'GO: B2B 화이트레이블 영업 (증권사 MTS 통합)',
        'NO-GO: 가설 수정 + 피벗 (백서 자산은 보존)',
      ],
    },
  ];
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <Eyebrow>§4 · 단계적 실행 로드맵</Eyebrow>
        <Heading size={84}>첫 90일은 검증의 시간.</Heading>
        <Rule width={280} />

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 16 }}
        >
          {phases.map((p, i) => (
            <div
              key={p.tag}
              className="r-fadeup"
              style={{
                animationDelay: `${200 + i * 140}ms`,
                background: C.surface,
                border: p.crit ? `2px solid ${C.red}` : `1px solid ${C.line}`,
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                position: 'relative',
              }}
            >
              {p.crit && (
                <span
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: 16,
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: C.red,
                    color: '#fff',
                    fontFamily: F.sans,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                  }}
                >
                  CRITICAL
                </span>
              )}
              <div
                style={{
                  fontFamily: F.sans,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: C.accent,
                  textTransform: 'uppercase',
                }}
              >
                {p.tag} · {p.time}
              </div>
              <div
                style={{
                  fontFamily: F.serif,
                  fontSize: 30,
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1.2,
                }}
              >
                {p.label}
              </div>
              <div style={{ height: 1, background: C.line, margin: '4px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.items.map((it) => (
                  <div
                    key={it}
                    style={{
                      fontFamily: F.sans,
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.5,
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.accent, fontWeight: 700 }}>·</span>
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 8,
            display: 'flex',
            gap: 12,
            color: C.muted,
            fontFamily: F.sans,
            fontSize: 16,
          }}
        >
          <span>2026-05-08</span>
          <span style={{ flex: 1, height: 1, background: C.line, alignSelf: 'center' }} />
          <span>+ 2주</span>
          <span style={{ flex: 1, height: 1, background: C.line, alignSelf: 'center' }} />
          <span>+ 6주</span>
          <span style={{ flex: 1, height: 1, background: C.line, alignSelf: 'center' }} />
          <span>+ 12주</span>
          <span style={{ flex: 1, height: 1, background: C.line, alignSelf: 'center' }} />
          <span>+ 6개월</span>
        </div>
      </div>
      <Footer pageNum={10} section="§4 로드맵" />
    </div>
  );
};

/* ─────────────── 11. KPI · 100-person Pilot ─────────────── */
const KPIs: Page = () => {
  const benchmarks = [
    { metric: '1–5%', label: 'SaaS freemium 평균 전환율', src: 'FirstPageSage 2026 / Pulseahead' },
    { metric: '8–15%', label: 'top-quartile freemium 전환', src: 'Guru Startups 2025' },
    {
      metric: '65%',
      label: '액티브 펀드 언더퍼폼 (US large-cap, 2024)',
      src: 'SPIVA 2024 (S&P DJI)',
    },
    { metric: '94.1%', label: '20년 누적 액티브 펀드 패배율', src: 'SPIVA 2005–2024' },
  ];
  const kpis = [
    { name: '3개월 리텐션', threshold: '< 40% → 중단', tone: 'red' as const },
    { name: 'LTV / CAC', threshold: '< 2.0 (6개월) → 중단', tone: 'red' as const },
    { name: '코호트 평균 수익률', threshold: 'KOSPI 미달 → 피벗', tone: 'amber' as const },
    { name: 'NPS', threshold: '< 30 → 가설 수정', tone: 'amber' as const },
    { name: '재결제 의사', threshold: '< 50% → 중단', tone: 'red' as const },
    { name: '외부 통계 검증', threshold: 'p > 0.05 → 출시 보류', tone: 'red' as const },
  ];
  const tones = {
    amber: { color: C.warm, bg: C.warmSoft },
    red: { color: C.red, bg: C.redSoft },
  };
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Eyebrow>§5 · 시장 벤치마크</Eyebrow>
          <Heading size={64}>외부 데이터로 본 현실.</Heading>
          <Rule width={220} />
          <Body size={22} maxWidth={780}>
            "월 1억 매출"은 핀테크 freemium 단가에서 수학적으로 성립하기 어렵다. 액티브 운용은
            장기적으로 패시브를 못 이긴다는 SPIVA의 결론은
            <strong> "수익률을 팔지 말고 의사결정을 팔라"</strong>는 본 보고서의 포지셔닝 근거.
          </Body>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            {benchmarks.map((b, i) => (
              <div
                key={b.label}
                className="r-fadeup"
                style={{
                  animationDelay: `${300 + i * 100}ms`,
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: F.serif,
                    fontSize: 38,
                    fontWeight: 700,
                    color: C.accent,
                    lineHeight: 1,
                  }}
                >
                  {b.metric}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: F.sans,
                    fontSize: 16,
                    color: C.text,
                    lineHeight: 1.4,
                  }}
                >
                  {b.label}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: F.sans,
                    fontSize: 12,
                    color: C.muted,
                    letterSpacing: '0.04em',
                  }}
                >
                  {b.src}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Eyebrow color={C.warm}>§5.2 · 실패 조건</Eyebrow>
          <Heading size={64}>100명 파일럿 임계점.</Heading>
          <Rule width={220} />
          <Body size={22} maxWidth={780}>
            출시 전에 <strong>"성공 조건이 아닌 실패 조건"</strong>을 문서화한다. 확신을 측정으로
            바꾸는 유일한 방법.
          </Body>

          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.line}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {kpis.map((k, i) => {
              const t = tones[k.tone];
              return (
                <div
                  key={k.name}
                  className="r-fadeup"
                  style={{
                    animationDelay: `${300 + i * 90}ms`,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '14px 20px',
                    borderTop: i === 0 ? 'none' : `1px solid ${C.line}`,
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div style={{ fontFamily: F.sans, fontSize: 18, fontWeight: 600, color: C.text }}>
                    {k.name}
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '6px 14px',
                        borderRadius: 999,
                        background: t.bg,
                        color: t.color,
                        fontFamily: F.sans,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {k.threshold}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer pageNum={11} section="§5 KPI · 벤치마크" />
    </div>
  );
};

/* ─────────────── 12. Risk Matrix ─────────────── */
const RiskMatrix: Page = () => {
  const risks = [
    {
      name: '유사투자자문업 미등록 제재',
      prob: '높음',
      impact: '치명적',
      mit: 'Phase 0 법무 게이트 + 별도 법인',
      critical: true,
    },
    {
      name: '고객 손실 → 집단 소송',
      prob: '중간',
      impact: '치명적',
      mit: '면책 + 전문배상책임보험 + 포지셔닝 재정의',
      critical: true,
    },
    {
      name: '부동산 평판 → 주식 평판 전이 손실',
      prob: '중간',
      impact: '큼',
      mit: '별도 법인·도메인 (격벽 §3.4)',
      critical: false,
    },
    {
      name: 'CAC > LTV (단위경제 붕괴)',
      prob: '높음',
      impact: '큼',
      mit: '100~300명 파일럿 사전 검증',
      critical: false,
    },
    {
      name: '알파 희석 (1만 명 사용 시 슬리피지)',
      prob: '높음',
      impact: '중간',
      mit: '"신호" → "프레임워크" 재정의',
      critical: false,
    },
    {
      name: '30년 트랙레코드 = 운(luck)',
      prob: '중간',
      impact: '큼',
      mit: 'Walk-Forward · p-value 외부 검증',
      critical: false,
    },
    {
      name: '오픈소스 IP 유출 → 경쟁사 활용',
      prob: '중간',
      impact: '중간',
      mit: '핵심 엔진은 폐쇄 + BSL 라이선스',
      critical: false,
    },
  ];
  const probColor = (p: string) => (p === '높음' ? C.red : p === '중간' ? C.warm : C.green);
  const impactColor = (i: string) => (i === '치명적' ? C.red : i === '큼' ? C.warm : C.green);
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <Eyebrow color={C.red}>§5 · 리스크 매트릭스</Eyebrow>
        <Heading size={76}>치명적 리스크는 두 가지뿐.</Heading>
        <Rule width={280} />
        <Body size={22} maxWidth={1500}>
          나머지 다섯 가지는 모두 통제 가능하다. 단, <strong>법무 자문</strong>과
          <strong> 면책·보험 구조</strong>가 출시 전에 갖춰져야만 통제권이 손에 들어온다.
        </Body>

        <div
          style={{
            marginTop: 8,
            background: C.surface,
            border: `1px solid ${C.line}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 130px 130px 1.6fr',
              padding: '16px 24px',
              background: C.bg,
              borderBottom: `1px solid ${C.line}`,
              fontFamily: F.sans,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.muted,
            }}
          >
            <span>리스크</span>
            <span>발생 확률</span>
            <span>영향도</span>
            <span>완화 전략</span>
          </div>
          {risks.map((r, i) => (
            <div
              key={r.name}
              className="r-fadeup"
              style={{
                animationDelay: `${200 + i * 80}ms`,
                display: 'grid',
                gridTemplateColumns: '2fr 130px 130px 1.6fr',
                padding: '14px 24px',
                borderTop: i === 0 ? 'none' : `1px solid ${C.line}`,
                alignItems: 'center',
                gap: 16,
                background: r.critical ? 'rgba(185, 28, 28, 0.04)' : 'transparent',
              }}
            >
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 18,
                  fontWeight: r.critical ? 700 : 500,
                  color: C.text,
                }}
              >
                {r.critical && <span style={{ color: C.red, marginRight: 8 }}>●</span>}
                {r.name}
              </span>
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 16,
                  fontWeight: 700,
                  color: probColor(r.prob),
                }}
              >
                {r.prob}
              </span>
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 16,
                  fontWeight: 700,
                  color: impactColor(r.impact),
                }}
              >
                {r.impact}
              </span>
              <span style={{ fontFamily: F.sans, fontSize: 16, color: C.muted, lineHeight: 1.4 }}>
                {r.mit}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Footer pageNum={12} section="§5 리스크" />
    </div>
  );
};

/* ─────────────── 13. Immediate Actions ─────────────── */
const Actions: Page = () => {
  const actions = [
    {
      n: '01',
      title: '법무 자문 의뢰',
      body: '자본시장법 전문 변호사 컨택. 등록 필요 여부 확정 전까진 마케팅·랜딩·결제 모두 정지.',
      tag: 'this week',
    },
    {
      n: '02',
      title: '100명 파일럿 설계서',
      body: '무료 50 + 유료 50 병행. 가격 1~2만원/월. KPI 4개 명시 (리텐션·신뢰·재결제·NPS).',
      tag: 'this week',
    },
    {
      n: '03',
      title: '실패 조건 문서화',
      body: '§5.2 표를 자신의 숫자로 채워서 .md로 저장. 외부 1인에게 공유하여 자기검열 방지.',
      tag: 'this week',
    },
    {
      n: '04',
      title: '백서 목차 1페이지',
      body: '제목 + 키 메시지 + 근거 연구 5개. 학술 톤. 평판 자본화의 첫 트리거.',
      tag: '+1주',
    },
    {
      n: '05',
      title: '무료 뉴스레터 1호',
      body: '"30년 데이터로 본 평균 회귀의 환상" 같은 학술 톤 1편 (편당 10시간+).',
      tag: '+1주',
    },
    {
      n: '06',
      title: '"하지 않는 것 4가지" 박스',
      body: '종목 추천 / 시그널 / 수익률 보장 / 리딩방 — 홈 1면에 박는다.',
      tag: '+1주',
    },
    {
      n: '07',
      title: '1인 vs VC형 결정 메모',
      body: '검로드·레니 사례 인용해서 가족·공동창업자에게 공유 후 합의.',
      tag: '+2주',
    },
  ];
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <Eyebrow color={C.green}>§7 · 다음 7~14일</Eyebrow>
        <Heading size={84}>이번 주 안에 시작할 7가지.</Heading>
        <Rule width={280} />

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 12 }}
        >
          {actions.map((a, i) => (
            <div
              key={a.n}
              className="r-fadeup"
              style={{
                animationDelay: `${200 + i * 90}ms`,
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderLeft: `4px solid ${C.green}`,
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <div
                  style={{
                    fontFamily: F.serif,
                    fontSize: 36,
                    fontWeight: 700,
                    color: C.accent,
                    lineHeight: 1,
                  }}
                >
                  {a.n}
                </div>
                <div
                  style={{
                    fontFamily: F.sans,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.green,
                    background: C.greenSoft,
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  {a.tag}
                </div>
              </div>
              <div
                style={{
                  fontFamily: F.serif,
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1.3,
                }}
              >
                {a.title}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
                {a.body}
              </div>
            </div>
          ))}
        </div>

        <div
          className="r-fadeup"
          style={{
            animationDelay: '1000ms',
            marginTop: 12,
            padding: '20px 28px',
            background: C.accentSoft,
            borderLeft: `4px solid ${C.accent}`,
            borderRadius: 8,
            fontFamily: F.sans,
            fontSize: 19,
            color: C.text,
            maxWidth: 1500,
          }}
        >
          <strong>"성공을 확신한다"</strong>를 <strong>"다음 조건 시 멈춘다"</strong>로 변환. 이것이
          던닝-크루거 정점에서 측정 가능한 영역으로 내려오는 유일한 다리다.
        </div>
      </div>
      <Footer pageNum={13} section="§7 즉시 액션" />
    </div>
  );
};

/* ─────────────── 14. Final Question ─────────────── */
const Final: Page = () => {
  return (
    <div style={fill}>
      <Style />
      <div
        style={{
          padding: `${PAD_Y}px ${PAD_X}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 36,
          maxWidth: 1500,
        }}
      >
        <Eyebrow>§6 · 마지막 질문</Eyebrow>
        <Heading size={68}>두 가지에 답할 수 있는가.</Heading>
        <Rule width={280} />

        <div
          className="r-fadeup"
          style={{
            animationDelay: '200ms',
            padding: '32px 40px',
            background: C.surface,
            border: `1px solid ${C.line}`,
            borderLeft: `4px solid ${C.accent}`,
            borderRadius: 12,
          }}
        >
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.accent,
            }}
          >
            질문 1 · Steelman
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: F.serif,
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.35,
              color: C.text,
            }}
          >
            "나는 이 사업의 <span style={{ color: C.warm }}>실패 조건</span>을 명시할 수 있는가?
            그리고 그 조건이 발생했을 때, 확신을 접고 멈출 수 있는가?"
          </div>
        </div>

        <div
          className="r-fadeup"
          style={{
            animationDelay: '350ms',
            padding: '32px 40px',
            background: C.surface,
            border: `1px solid ${C.line}`,
            borderLeft: `4px solid ${C.warm}`,
            borderRadius: 12,
          }}
        >
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.warm,
            }}
          >
            질문 2 · 6 Hats
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: F.serif,
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.35,
              color: C.text,
            }}
          >
            "내가 만든 점수가 시장 하락기에 고객 손실을 만들었을 때,
            <span style={{ color: C.warm }}> 30년의 부동산 평판까지 잃을 각오</span>로 출시할 준비가
            되어 있는가?"
          </div>
        </div>

        <div
          className="r-fadeup"
          style={{
            animationDelay: '550ms',
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <Body size={22} color={C.muted}>
            답이 막연하다면 — <strong style={{ color: C.text }}>그 답부터 만드는 것</strong>이 첫
            번째 작업이다.
          </Body>
          <Body size={22} color={C.muted}>
            구체적 숫자·기한·기준으로 답할 수 있다면 —{' '}
            <strong style={{ color: C.green }}>이미 측정 가능한 영역에 진입</strong>한 것이다.
          </Body>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Pill>외부 출처: SPIVA 2024 · S&P DJI</Pill>
          <Pill color={C.warm} fill={C.warmSoft}>
            FirstPageSage SaaS 2026
          </Pill>
          <Pill color={C.green} fill={C.greenSoft}>
            FourWeekMBA · GitLab/Elastic open core
          </Pill>
          <Pill color={C.muted} fill="transparent">
            금감원 자본시장법 제17·101조의2·444조
          </Pill>
        </div>
      </div>
      <Footer pageNum={14} section="§6 마지막 질문" />
    </div>
  );
};

const pages: Page[] = [
  Cover,
  TLDR,
  Assets,
  Question,
  ThreeOptions,
  Recommended,
  Ladder,
  Positioning,
  Firewall,
  Roadmap,
  KPIs,
  RiskMatrix,
  Actions,
  Final,
];

/* ─────────────────────────────────────────────────────────────
 * Narration scripts — 페이지당 30~45초, 모건 하우절 톤.
 * (수익률 약속 X / 의사결정 품질 약속 O · TTS 친화)
 * ──────────────────────────────────────────────────────────── */
export const narration: string[] = [
  // 01 · Cover
  '안녕하세요. 오늘은 30년 동안 쌓아온 주식 투자 인사이트를 SaaS로 출시할 때, 유료화와 오픈소스 사이에서 어떻게 결정해야 하는지 정리한 전략 메모를 함께 보겠습니다. 결론부터 말씀드리면, 이분법은 잘못된 프레임이고, 오픈 코어 모델이 30년이라는 평판 자산을 가장 안전하게 확장하는 길입니다. 본격적으로 살펴보시죠.',

  // 02 · TL;DR
  '30초 안에 다섯 줄로 요약하겠습니다. 첫째, 완전 유료냐 완전 오픈소스냐는 잘못된 프레임입니다. 둘째, 결론은 오픈 코어와 단계적 분리 출시입니다. 셋째, 출시 전에 자본시장법 자문과 100명에서 300명 규모 유료 파일럿이 반드시 필요합니다. 넷째, 부동산 앱의 백만 MAU는 잠재력일 뿐 매출이 아닙니다. 다섯째, 첫 90일은 행동이 아니라 검증의 시간이어야 합니다.',

  // 03 · Assets
  '먼저 사용자가 가진 자산부터 정리하겠습니다. 부동산 리치고는 검증된 데이터 리터러시 사용자 100만 명을 보유하고 있고, 결제와 고객 지원, 법무 인프라까지 갖추고 있습니다. 30년 트랙레코드와 점수화 알고리즘은 핵심 무형 자산이지만, 외부 통계 검증이 아직 남아 있습니다. 그리고 평판 자본은 확장 시 희석될 위험을 동시에 갖는다는 점을 잊지 말아야 합니다.',

  // 04 · Question
  '이 시점에서 표면 질문과 본질 질문을 구분해야 합니다. 표면 질문인 유료화냐 오픈소스냐는 결정의 진짜 축을 놓치게 만듭니다. 진짜 물어야 할 본질 질문은 세 가지입니다. 첫째, 평판 보존이 우선인가 확장이 우선인가. 둘째, 무엇을 공개하고 무엇을 봉인할 것인가. 셋째, 부동산 평판을 주식 SaaS의 변동성에 연결할 것인가, 별도의 격벽으로 분리할 것인가입니다.',

  // 05 · Three Options
  '세 가지 옵션을 한 페이지에서 비교해 보겠습니다. A안 완전 유료 SaaS는 단기 매출은 빠르지만 단일 실패점을 만듭니다. B안 완전 오픈소스는 학술적 권위는 얻을 수 있지만 현금 흐름이 없습니다. C안 오픈 코어는 점진적이지만 권위와 상업성을 동시에 가져가고, 30년 평판을 격벽으로 보호할 수 있습니다. 이미 검증된 사례는 GitLab, Elastic, Red Hat, MongoDB입니다.',

  // 06 · Recommended
  '권고 전략은 오픈 코어 하이브리드입니다. GitLab은 단가 분리만으로 매출 잠재력을 다섯 배 끌어올렸고, 2022년에는 전년 대비 69퍼센트 성장했습니다. Gartner에 따르면 단가 분리는 평균 10에서 15퍼센트의 추가 매출을 만들어냅니다. 오픈소스 서비스 시장 자체가 2026년 668억 달러 규모로 성장할 것으로 예상됩니다. 이 모델 위에 네 가지 설계 원칙을 얹습니다. 공개와 폐쇄의 분리선, 법적 격벽, 반증 가능한 가설, 그리고 B2C에서 B2B로 가는 순서입니다.',

  // 07 · Ladder
  '공개와 폐쇄의 분리선을 4층 가치 사다리로 정리했습니다. 1층은 무료 공개로 평판 자본을 만듭니다. 백서와 GitHub 백테스팅 프레임워크, 기본 지표 정의가 여기에 들어갑니다. 2층은 무료 콘텐츠로 관계 자본을 쌓습니다. 주간 리서치 뉴스레터와 정정 코너가 대표적입니다. 3층은 유료 구독, 즉 수익 코어입니다. 실시간 스코어링 엔진과 멤버 전용 슬랙 커뮤니티가 여기에 위치합니다. 4층은 B2B 화이트레이블로 확장 자본을 만듭니다.',

  // 08 · Positioning
  '포지셔닝을 다시 정의해야 합니다. 2024년 8월 14일부터 자본시장법은 양방향 영업을 금지했습니다. VIP 채팅, 리딩방, 실시간 종목 추천은 유사투자자문업 등록 대상이자 집단소송의 직접 표적입니다. 따라서 수익을 보장한다는 표현, 월 1억 매출 같은 카피, 고수 매매 알림은 절대 금지입니다. 대신 30년 데이터로 검증된 의사결정 프레임워크 멤버십이라는 톤으로 나아갑니다. 수익률을 약속하지 않고, 의사결정 품질을 약속합니다.',

  // 09 · Firewall
  '브랜드는 별도 법인, 별도 도메인, 별도 책임으로 격벽을 만듭니다. 기존 주식회사 리치고는 부동산 사업을 그대로 유지하고, 신설 법인이 주식 SaaS를 운영합니다. 두 회사를 연결하는 것은 마케팅 제휴까지만 허용하고, 회계와 책임은 절대 통합하지 않습니다. 한쪽에서 행정 처분이 나와도 다른 쪽으로 전이되지 않도록 설계해야, 30년 부동산 평판을 안전하게 지킬 수 있습니다.',

  // 10 · Roadmap
  '실행 로드맵은 네 단계입니다. 페이즈 0은 0주에서 2주, 법적 게이트입니다. 자본시장법 자문이 끝나기 전에는 마케팅도 결제도 시작하지 않습니다. 페이즈 1은 2주에서 6주로, 외부 통계 검증과 백서 공개를 진행합니다. 페이즈 2는 6주에서 12주로, GitHub 오픈소스 공개와 100명 파일럿 출시입니다. 페이즈 3은 12주 이후 GO 또는 NO-GO를 결정합니다. GO일 경우 증권사 화이트레이블로 확장하고, NO-GO일 경우 가설을 수정하고 피벗합니다.',

  // 11 · KPIs
  '외부 데이터로 본 현실은 냉정합니다. 핀테크 SaaS의 freemium 평균 전환율은 1에서 5퍼센트, 상위 4분의 1도 8에서 15퍼센트입니다. 월 1억 매출 가설은 이 단가 구조 위에서 수학적으로 성립하기 어렵습니다. 한편 SPIVA 2024 보고서는 미국 대형주 액티브 펀드의 65퍼센트가 지수에 패배했고, 20년 누적으로는 94.1퍼센트가 졌다고 말합니다. 액티브 운용은 장기적으로 패시브를 못 이긴다는 것이, 우리 포지셔닝의 가장 강한 근거입니다. 100명 파일럿의 실패 조건은 여섯 개 임계점으로 사전에 문서화합니다.',

  // 12 · Risk Matrix
  '리스크 매트릭스를 보면 치명적 위협은 두 가지뿐입니다. 첫째는 유사투자자문업 미등록 제재. 둘째는 고객 손실로 인한 집단 소송입니다. 나머지 다섯 가지는 모두 통제 가능합니다. 단, 법무 자문과 면책, 보험 구조가 출시 전에 갖춰져야만 통제권이 손에 들어옵니다. 이 두 가지 치명적 리스크를 페이즈 0에서 닫지 못하면, 다음 단계로 넘어가지 않는 것이 가장 합리적인 결정입니다.',

  // 13 · Actions
  '이번 주 안에 시작할 일곱 가지를 정리합니다. 첫째, 자본시장법 전문 변호사에게 1차 자문을 의뢰합니다. 둘째, 100명 파일럿 설계서를 작성합니다. 셋째, 실패 조건을 문서로 박아 둡니다. 넷째, 백서 목차 한 페이지를 만듭니다. 다섯째, 무료 뉴스레터 1호를 작성합니다. 여섯째, 우리는 다음을 하지 않습니다 박스 카피를 확정합니다. 일곱째, 1인 기업과 VC형 사이에서 어느 쪽으로 갈지 한 페이지 메모로 정리합니다. 성공을 확신한다는 문장을, 다음 조건이 발생하면 멈춘다는 문장으로 변환하는 것이 핵심입니다.',

  // 14 · Final
  '마지막으로 두 가지 질문에 답할 수 있는지 자문해 보시기 바랍니다. 첫 번째 스틸맨 질문은, 나는 이 사업의 실패 조건을 명시할 수 있는가, 그리고 그 조건이 발생했을 때 확신을 접고 멈출 수 있는가입니다. 두 번째 식스 햇 질문은, 시장 하락기에 고객 손실이 발생했을 때 30년의 부동산 평판까지 잃을 각오로 출시할 준비가 되어 있는가입니다. 두 질문에 구체적인 숫자와 기한과 기준으로 답할 수 있다면, 이미 측정 가능한 영역에 진입한 것입니다. 답이 막연하다면, 그 답을 만드는 일이 가장 첫 번째 작업입니다. 감사합니다.',
];

export default pages;
