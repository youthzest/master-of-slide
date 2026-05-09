import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import closingImg from './assets/closing_001.jpg';
import coverImg from './assets/cover_001.jpg';
import cycleImg from './assets/cycle_001.jpg';
import doubleDiamondImg from './assets/double-diamond_001.jpg';
import fourTrapsImg from './assets/four-traps_001.jpg';
import palRouterImg from './assets/pal-router_001.jpg';

const imgFill = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  borderRadius: 14,
  display: 'block',
};

export const design: DesignSystem = {
  palette: { bg: 'var(--osd-bg)', text: 'var(--osd-text)', accent: 'var(--osd-accent)' },
  fonts: {
    display: 'var(--osd-font-body)',
    body: 'var(--osd-font-body)',
  },
  typeScale: { hero: 168, body: 36 },
  radius: 10,
};

const muted = '#8b8478';
const surface = '#141823';
const surface2 = '#1c2230';
const border = '#2a2f3d';
const ok = '#34d399';
const warn = '#f87171';
const cool = '#7dd3fc';
const accent2 = '#a78bfa';

const TOTAL = 40;

const fill = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
} as const;

const eyebrow = {
  fontSize: 24,
  letterSpacing: '0.24em',
  color: 'var(--osd-accent)',
  textTransform: 'uppercase' as const,
  fontWeight: 700,
};

const display = {
  fontFamily: 'var(--osd-font-display)',
  fontWeight: 800,
  letterSpacing: '-0.01em',
  margin: 0,
  lineHeight: 1.1,
};

const Footer = ({ section, page }: { section: string; page: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 100,
      right: 100,
      bottom: 48,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 22,
      color: muted,
      letterSpacing: '0.08em',
    }}
  >
    <span>{section}</span>
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {String(page).padStart(2, '0')} / {TOTAL}
    </span>
  </div>
);

const Pill = ({
  children,
  color = 'var(--osd-accent)',
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '6px 18px',
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.12em',
      color,
      border: `1.5px solid ${color}`,
      borderRadius: 999,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION A · Opening (1–5)
// ─────────────────────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <div style={{ ...fill, display: 'flex' }}>
    <div
      style={{
        flex: 1.05,
        padding: '120px 0 120px 140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ ...eyebrow, marginBottom: 28 }}>OUROBOROS · 2시간 워크숍</div>
      <h1
        style={{
          ...display,
          fontSize: 132,
          lineHeight: 1.02,
        }}
      >
        <span>Stop prompting.</span>
        <br />
        <span style={{ color: 'var(--osd-accent)' }}>Start specifying.</span>
      </h1>
      <p
        style={{
          fontSize: 36,
          color: muted,
          marginTop: 40,
          maxWidth: 820,
          lineHeight: 1.5,
        }}
      >
        막연한 프롬프트 대신 수학적으로 검증된 명세로 코딩하는 AI Agent OS.
      </p>
      <div
        style={{
          marginTop: 64,
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Pill>Spec-Driven</Pill>
        <Pill color={cool}>Claude Code 호환</Pill>
        <Pill color={accent2}>120분</Pill>
      </div>
    </div>
    <div
      style={{
        flex: 0.95,
        padding: '120px 140px 120px 40px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={coverImg}
        alt="Stylized golden ouroboros snake biting its tail"
        style={{ ...imgFill, width: 760, height: 840 }}
      />
    </div>
  </div>
);

const LearningGoals: Page = () => {
  const goals = [
    'Vibe coding보다 spec-driven이 강력한 이유를 설명한다',
    '5단계 사이클(Interview→Seed→Execute→Evaluate→Evolve)을 그린다',
    '3개의 게이트(Ambiguity / Convergence / PAL)를 이해한다',
    '실제 환경에서 한 사이클을 end-to-end로 실행해본다',
    '어떤 작업에 적합한지/오버킬인지 판단한다',
  ];
  return (
    <div style={{ ...fill, padding: '120px 120px 0 120px' }}>
      <div style={{ ...eyebrow, marginBottom: 24 }}>오늘의 도착점</div>
      <h2 style={{ ...display, fontSize: 96 }}>학습 목표</h2>
      <ol
        style={{
          marginTop: 64,
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {goals.map((g, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 32,
              fontSize: 36,
              lineHeight: 1.4,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--osd-font-display)',
                fontSize: 56,
                fontWeight: 800,
                color: 'var(--osd-accent)',
                width: 80,
                flexShrink: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{g}</span>
          </li>
        ))}
      </ol>
      <Footer section="A · Opening" page={2} />
    </div>
  );
};

const Timeline: Page = () => {
  const blocks = [
    { id: '0', label: 'Opening', min: 10, color: 'var(--osd-accent)' },
    { id: '1', label: '5단계 사이클', min: 15, color: 'var(--osd-accent)' },
    { id: '2', label: '수학 게이트', min: 15, color: 'var(--osd-accent)' },
    { id: '3', label: '환경 설치', min: 10, color: cool },
    { id: '4', label: '실습 1 · Seed', min: 30, color: cool },
    { id: '5', label: '실습 2 · Run', min: 20, color: cool },
    { id: '6', label: '실습 3 · Ralph', min: 15, color: cool },
    { id: '7', label: '회고', min: 5, color: accent2 },
  ];
  const total = 120;
  return (
    <div style={{ ...fill, padding: '120px 120px 0 120px' }}>
      <div style={{ ...eyebrow, marginBottom: 24 }}>120분 한눈에</div>
      <h2 style={{ ...display, fontSize: 96 }}>전체 타임라인</h2>
      <div
        style={{
          marginTop: 80,
          display: 'flex',
          width: '100%',
          height: 90,
          borderRadius: 12,
          overflow: 'hidden',
          border: `1px solid ${border}`,
        }}
      >
        {blocks.map((b) => (
          <div
            key={b.id}
            style={{
              flex: b.min,
              background: surface2,
              borderRight: `1px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 700,
              color: b.color,
            }}
          >
            {b.min}m
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          width: '100%',
          gap: 0,
        }}
      >
        {blocks.map((b) => (
          <div
            key={b.id}
            style={{
              flex: b.min,
              fontSize: 22,
              color: muted,
              padding: '0 8px',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            <div style={{ color: b.color, fontWeight: 700 }}>Block {b.id}</div>
            <div>{b.label}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 80,
          display: 'flex',
          gap: 64,
          fontSize: 28,
          color: muted,
        }}
      >
        <div>
          <span style={{ color: 'var(--osd-accent)', fontWeight: 700 }}>이론</span> 40m
        </div>
        <div>
          <span style={{ color: cool, fontWeight: 700 }}>실습</span> 75m
        </div>
        <div>
          <span style={{ color: accent2, fontWeight: 700 }}>회고</span> 5m
        </div>
        <div style={{ marginLeft: 'auto' }}>합계 {total}m</div>
      </div>
      <Footer section="A · Opening" page={3} />
    </div>
  );
};

const Hook: Page = () => (
  <div
    style={{
      ...fill,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '120px 160px',
    }}
  >
    <div style={{ ...eyebrow, marginBottom: 36 }}>Hook · 0:00–0:03</div>
    <p
      style={{
        ...display,
        fontSize: 88,
        lineHeight: 1.18,
        maxWidth: 1500,
      }}
    >
      “같은 요청을 5번 반복하면
      <br />
      5번 다 <span style={{ color: 'var(--osd-accent)' }}>다른 코드</span>가 나오는 경험,
      <br />
      있으시죠?”
    </p>
    <p
      style={{
        marginTop: 56,
        fontSize: 36,
        color: muted,
        lineHeight: 1.5,
        maxWidth: 1300,
      }}
    >
      왜냐하면 모호함이 명세로 결정되지 않은 채 코드가 생성되기 때문입니다.
    </p>
    <Footer section="A · Opening" page={4} />
  </div>
);

const FourTraps: Page = () => {
  const traps = [
    {
      icon: '🌫️',
      title: '모호함 누적',
      body: '매 프롬프트마다 가정이 달라집니다.',
    },
    {
      icon: '🔁',
      title: '재현 불가능',
      body: '같은 입력 ≠ 같은 출력.',
    },
    {
      icon: '🪜',
      title: '분해 부재',
      body: '"다 한 번에" → 빠진 게 발견될 때마다 재작성.',
    },
    {
      icon: '⚖️',
      title: '검증 부재',
      body: '"잘 동작해 보임" ≠ "스펙대로 동작함".',
    },
  ];
  return (
    <div style={{ ...fill, padding: '96px 100px 0 100px', display: 'flex' }}>
      <div style={{ flex: 1.1, paddingRight: 48 }}>
        <div style={{ ...eyebrow, marginBottom: 20 }}>왜 Ouroboros인가</div>
        <h2 style={{ ...display, fontSize: 88 }}>
          Vibe Coding의
          <br />
          <span style={{ color: warn }}>4가지 함정</span>
        </h2>
        <div
          style={{
            marginTop: 56,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 28,
          }}
        >
          {traps.map((t) => (
            <div
              key={t.title}
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: '28px 32px',
              }}
            >
              <div style={{ fontSize: 40 }}>{t.icon}</div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 32,
                  fontWeight: 800,
                  color: 'var(--osd-text)',
                }}
              >
                {t.title}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 24,
                  color: muted,
                  lineHeight: 1.5,
                }}
              >
                {t.body}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          flex: 0.9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 80,
        }}
      >
        <img
          src={fourTrapsImg}
          alt="Vibe coding chaos versus spec clarity infographic"
          style={{ ...imgFill, width: 780, height: 840 }}
        />
      </div>
      <Footer section="A · Opening" page={5} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION B · 5-stage cycle (6–12)
// ─────────────────────────────────────────────────────────────────────────────

const SectionDivider = ({
  num,
  title,
  subtitle,
  page,
  footerSection,
}: {
  num: string;
  title: string;
  subtitle: string;
  page: number;
  footerSection: string;
}): React.ReactElement => (
  <div
    style={{
      ...fill,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '120px 160px',
    }}
  >
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 280,
        fontWeight: 900,
        color: 'var(--osd-accent)',
        lineHeight: 1,
        opacity: 0.85,
      }}
    >
      {num}
    </div>
    <h2
      style={{
        ...display,
        fontSize: 120,
        marginTop: 24,
      }}
    >
      {title}
    </h2>
    <p
      style={{
        marginTop: 28,
        fontSize: 36,
        color: muted,
        maxWidth: 1400,
        lineHeight: 1.4,
      }}
    >
      {subtitle}
    </p>
    <Footer section={footerSection} page={page} />
  </div>
);

const SectionB: Page = () =>
  SectionDivider({
    num: '01',
    title: '5단계 사이클',
    subtitle:
      'Interview → Seed → Execute → Evaluate → Evolve. 모든 사이클이 다음 사이클의 입력이 된다.',
    page: 6,
    footerSection: 'B · 5-Stage Cycle',
  });

const CycleDiagram: Page = () => (
  <div style={{ ...fill, padding: '96px 100px 0 100px', display: 'flex' }}>
    <div style={{ flex: 1, paddingRight: 56 }}>
      <div style={{ ...eyebrow, marginBottom: 20 }}>The Loop</div>
      <h2 style={{ ...display, fontSize: 84 }}>
        진화하는
        <br />
        루프 한 장
      </h2>
      <ul
        style={{
          marginTop: 48,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          fontSize: 30,
        }}
      >
        {[
          ['💬', 'Interview', '가정 노출'],
          ['🌱', 'Seed', '명세 결정화'],
          ['⚙️', 'Execute', 'Double Diamond 분해'],
          ['✅', 'Evaluate', '3단계 검증'],
          ['🔄', 'Evolve', '수렴까지 진화'],
        ].map(([icon, name, desc]) => (
          <li
            key={name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '14px 20px',
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 32 }}>{icon}</span>
            <span style={{ fontWeight: 800, color: 'var(--osd-accent)', minWidth: 180 }}>
              {name}
            </span>
            <span style={{ color: muted }}>{desc}</span>
          </li>
        ))}
      </ul>
    </div>
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={cycleImg}
        alt="Five-stage Ouroboros cycle diagram"
        style={{ ...imgFill, width: 840, height: 840 }}
      />
    </div>
    <Footer section="B · 5-Stage Cycle" page={7} />
  </div>
);

const Stage1Interview: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Stage 1</div>
    <h2 style={{ ...display, fontSize: 100 }}>
      💬 Interview
      <span style={{ color: muted, fontWeight: 400, fontSize: 44 }}>
        {' · '}당신이 가정하는 게 뭔가요?
      </span>
    </h2>
    <div style={{ marginTop: 56, display: 'flex', gap: 48 }}>
      <div style={{ flex: 1.1 }}>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            fontSize: 32,
            lineHeight: 1.4,
          }}
        >
          <li>🎯 숨겨진 가정 12개+ 노출</li>
          <li>🧠 소크라테스식 — 절대 코드 안 씀</li>
          <li>
            ⚡ 명령: <code style={{ color: cool }}>ooo interview "..."</code>
          </li>
          <li>🚦 통과 기준: Ambiguity ≤ 0.2</li>
        </ul>
      </div>
      <div
        style={{
          flex: 1,
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 14,
          padding: 32,
          fontSize: 26,
          lineHeight: 1.6,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: 'var(--osd-accent)',
            letterSpacing: '0.16em',
            marginBottom: 14,
            textTransform: 'uppercase',
          }}
        >
          예시 — 할 일 CLI
        </div>
        <div style={{ color: muted, marginBottom: 18 }}>→ 삭제 vs 아카이빙?</div>
        <div style={{ color: muted, marginBottom: 18 }}>→ 개인용 vs 팀 협업?</div>
        <div style={{ color: muted, marginBottom: 18 }}>→ 우선순위 5단계 / 3단계?</div>
        <div style={{ color: muted, marginBottom: 18 }}>→ 마감일 필수 / 선택?</div>
        <div style={{ color: muted }}>→ 완료 후 자동 삭제?</div>
      </div>
    </div>
    <Footer section="B · 5-Stage Cycle" page={8} />
  </div>
);

const Stage2Seed: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Stage 2</div>
    <h2 style={{ ...display, fontSize: 100 }}>
      🌱 Seed
      <span style={{ color: muted, fontWeight: 400, fontSize: 44 }}>
        {' · '}모호함을 불변 스펙으로
      </span>
    </h2>
    <div style={{ marginTop: 56, display: 'flex', gap: 48 }}>
      <div style={{ flex: 1 }}>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            fontSize: 32,
            lineHeight: 1.4,
          }}
        >
          <li>📦 답변을 YAML 명세로 결정화</li>
          <li>🔒 게이트: Ambiguity Score ≤ 0.2</li>
          <li>📋 4섹션: goal · constraints · success · ontology</li>
          <li>♻️ 한 번 결정 = 불변 (다음 세대에서만 진화)</li>
        </ul>
      </div>
      <pre
        style={{
          flex: 1.1,
          margin: 0,
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 14,
          padding: 28,
          fontSize: 22,
          lineHeight: 1.55,
          fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
          color: 'var(--osd-text)',
          overflow: 'hidden',
        }}
      >
        {`goal: Personal task CLI with priority
constraints:
  - Single user
  - 3 priority levels: H/M/L
  - Response time < 200ms
success_criteria:
  - All CRUD ops covered by tests
  - Ambiguity ≤ 0.2
ontology:
  Task:
    id: UUID
    title: str (max 256)
    priority: enum[High, Med, Low]
    status: enum[todo, doing, done]`}
      </pre>
    </div>
    <Footer section="B · 5-Stage Cycle" page={9} />
  </div>
);

const Stage3Execute: Page = () => (
  <div style={{ ...fill, padding: '96px 100px 0 100px', display: 'flex' }}>
    <div style={{ flex: 1.05, paddingRight: 48 }}>
      <div style={{ ...eyebrow, marginBottom: 18 }}>Stage 3</div>
      <h2 style={{ ...display, fontSize: 92 }}>⚙️ Execute</h2>
      <p style={{ fontSize: 32, color: muted, marginTop: 18 }}>Double Diamond 분해로 단계별 구현</p>
      <ul
        style={{
          marginTop: 36,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          fontSize: 28,
          lineHeight: 1.5,
        }}
      >
        <li>
          <b style={{ color: 'var(--osd-accent)' }}>💎 Diamond 1 — 이해</b>
          <div style={{ color: muted }}>Wonder (발산) → Define (수렴: 온톨로지)</div>
        </li>
        <li>
          <b style={{ color: 'var(--osd-accent)' }}>💎 Diamond 2 — 구축</b>
          <div style={{ color: muted }}>Design (발산) → Deliver (수렴: 코드+테스트)</div>
        </li>
        <li>
          <b style={{ color: cool }}>⚡ 명령</b>
          <div style={{ color: muted }}>
            <code>ouroboros run seed.yaml</code>
          </div>
        </li>
      </ul>
    </div>
    <div
      style={{
        flex: 0.95,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={doubleDiamondImg}
        alt="Double Diamond design methodology diagram"
        style={{ ...imgFill, width: 820, height: 840 }}
      />
    </div>
    <Footer section="B · 5-Stage Cycle" page={10} />
  </div>
);

const Stage4Evaluate: Page = () => {
  const tiers = [
    {
      icon: '🤖',
      name: '기계적',
      cost: '무료',
      detail: '컴파일 · 테스트 · 타입체크',
      color: ok,
    },
    {
      icon: '🧠',
      name: '의미론적',
      cost: '1×',
      detail: 'LLM이 스펙 준수 검증',
      color: cool,
    },
    {
      icon: '🗳️',
      name: '합의',
      cost: '30×',
      detail: '3개+ 모델 동의 필요',
      color: accent2,
    },
  ];
  return (
    <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
      <div style={{ ...eyebrow, marginBottom: 18 }}>Stage 4</div>
      <h2 style={{ ...display, fontSize: 100 }}>
        ✅ Evaluate
        <span style={{ color: muted, fontWeight: 400, fontSize: 44 }}>{' · '}3단계 자동 검증</span>
      </h2>
      <div
        style={{
          marginTop: 64,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
        }}
      >
        {tiers.map((t) => (
          <div
            key={t.name}
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderTop: `4px solid ${t.color}`,
              borderRadius: 14,
              padding: '32px 30px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ fontSize: 44 }}>{t.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: t.color }}>{t.name}</div>
            <div
              style={{
                fontSize: 28,
                color: muted,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              비용 {t.cost}
            </div>
            <div
              style={{
                fontSize: 26,
                color: 'var(--osd-text)',
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              {t.detail}
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          marginTop: 56,
          fontSize: 28,
          color: muted,
          textAlign: 'center',
        }}
      >
        세 단계를 모두 통과해야 다음 사이클로 진입한다.
      </p>
      <Footer section="B · 5-Stage Cycle" page={11} />
    </div>
  );
};

const Stage5Evolve: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Stage 5</div>
    <h2 style={{ ...display, fontSize: 100 }}>
      🔄 Evolve <span style={{ color: muted, fontWeight: 400, fontSize: 44 }}>+ Ralph</span>
    </h2>
    <div style={{ marginTop: 48, display: 'flex', gap: 48 }}>
      <div style={{ flex: 1 }}>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            fontSize: 30,
            lineHeight: 1.45,
          }}
        >
          <li>📈 평가 결과 → 새 의문 → 다음 세대 Seed</li>
          <li>
            ♾️ <b style={{ color: 'var(--osd-accent)' }}>Ralph</b>는 세션을 넘어 지속 반복
          </li>
          <li>🎯 정지 신호: ontology 유사도 ≥ 95% (3세대 연속)</li>
          <li>🛑 안전장치: 30세대 도달 시 강제 종료</li>
        </ul>
      </div>
      <div
        style={{
          flex: 1.1,
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 14,
          padding: 28,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 24,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: muted }}>
          Gen 1 → 78% <span style={{ color: warn }}>continue</span>
        </div>
        <div style={{ color: muted }}>
          Gen 2 → 91% <span style={{ color: warn }}>continue</span>
        </div>
        <div style={{ color: muted }}>
          Gen 3 → 97% <span style={{ color: ok }}>✅ converged</span>
        </div>
        <div
          style={{
            marginTop: 28,
            padding: '14px 18px',
            borderLeft: `3px solid ${'var(--osd-accent)' as string}`,
            color: 'var(--osd-text)',
            fontFamily: 'var(--osd-font-body)',
            fontSize: 24,
            lineHeight: 1.55,
          }}
        >
          “언제 멈춰야 하는가”를 모델이 직접 결정하는 대신, 데이터가 스스로 답한다.
        </div>
      </div>
    </div>
    <Footer section="B · 5-Stage Cycle" page={12} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION C · Mathematical gates (13–18)
// ─────────────────────────────────────────────────────────────────────────────

const SectionC: Page = () =>
  SectionDivider({
    num: '02',
    title: '수학적 게이트',
    subtitle:
      'Ambiguity Score · Ontology Convergence · PAL Router. 진행과 중단을 코드가 아닌 숫자가 결정한다.',
    page: 13,
    footerSection: 'C · Gates',
  });

const Gate1Definition: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Gate 1</div>
    <h2 style={{ ...display, fontSize: 96 }}>Ambiguity Score</h2>
    <p style={{ marginTop: 24, fontSize: 32, color: muted }}>
      모호함을 정량화하는 수학적 게이트. <b style={{ color: 'var(--osd-accent)' }}>0.2 이하</b>
      에서만 Seed 생성.
    </p>
    <div
      style={{
        marginTop: 48,
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: 36,
        fontSize: 36,
        textAlign: 'center',
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      Ambiguity = 1 − Σ ({' '}
      <span style={{ color: cool }}>
        Clarity<sub>i</sub>
      </span>{' '}
      ×{' '}
      <span style={{ color: 'var(--osd-accent)' }}>
        Weight<sub>i</sub>
      </span>{' '}
      )
    </div>
    <div
      style={{
        marginTop: 48,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
      }}
    >
      {[
        { label: '목표 명확도', weight: '40%', q: '결과물이 구체적인가?' },
        { label: '제약 명확도', weight: '30%', q: '한계/조건이 정의됐나?' },
        { label: '성공 기준', weight: '30%', q: '측정 가능한가?' },
      ].map((d) => (
        <div
          key={d.label}
          style={{
            background: surface2,
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: '24px 26px',
          }}
        >
          <div style={{ fontSize: 26, color: 'var(--osd-accent)', fontWeight: 700 }}>{d.label}</div>
          <div style={{ fontSize: 56, fontWeight: 800, marginTop: 6 }}>{d.weight}</div>
          <div style={{ fontSize: 22, color: muted, marginTop: 6 }}>{d.q}</div>
        </div>
      ))}
    </div>
    <Footer section="C · Gates" page={14} />
  </div>
);

const Gate1Example: Page = () => (
  <div style={{ ...fill, padding: '96px 160px 0 160px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Worked example</div>
    <h2 style={{ ...display, fontSize: 80 }}>모호함 점수 계산</h2>
    <div
      style={{
        marginTop: 48,
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: '32px 40px',
        fontSize: 32,
        fontFamily: '"JetBrains Mono", monospace',
        lineHeight: 1.7,
      }}
    >
      <div>목표 0.9 × 40% = 0.36</div>
      <div>제약 0.8 × 30% = 0.24</div>
      <div>성공 0.7 × 30% = 0.21</div>
      <div style={{ borderTop: `1px solid ${border}`, marginTop: 14, paddingTop: 14 }}>
        명확도 합계 = <span style={{ color: cool }}>0.81</span>
      </div>
      <div>
        Ambiguity = 1 − 0.81 = <span style={{ color: 'var(--osd-accent)' }}>0.19</span>{' '}
        <span style={{ color: ok, marginLeft: 12 }}>✅ Pass</span>
      </div>
    </div>
    <p
      style={{
        marginTop: 36,
        fontSize: 28,
        color: muted,
        lineHeight: 1.5,
      }}
    >
      <b style={{ color: 'var(--osd-text)' }}>왜 0.2인가?</b> 80% 명확도면 남은 미지수는 코드
      수준에서 결정 가능합니다.
    </p>
    <Footer section="C · Gates" page={15} />
  </div>
);

const Gate2Convergence: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Gate 2</div>
    <h2 style={{ ...display, fontSize: 88 }}>Ontology Convergence</h2>
    <p style={{ marginTop: 18, fontSize: 30, color: muted }}>
      세대 간 ontology 유사도가 <b style={{ color: 'var(--osd-accent)' }}>≥ 95%</b>일 때 진화 종료.
    </p>
    <div style={{ marginTop: 48, display: 'flex', gap: 32 }}>
      <div style={{ flex: 1 }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 28,
          }}
        >
          <tbody>
            {[
              ['필드명 일치', '50%'],
              ['타입 일치', '30%'],
              ['정확 일치', '20%'],
              ['임계값', '≥ 95%'],
            ].map(([k, v], i) => (
              <tr
                key={k}
                style={{
                  borderBottom: `1px solid ${border}`,
                  background: i === 3 ? surface : 'transparent',
                }}
              >
                <td style={{ padding: '18px 4px', color: muted }}>{k}</td>
                <td
                  style={{
                    padding: '18px 4px',
                    textAlign: 'right',
                    color: i === 3 ? 'var(--osd-accent)' : 'var(--osd-text)',
                    fontWeight: i === 3 ? 800 : 600,
                  }}
                >
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          flex: 1.1,
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 14,
          padding: 28,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 22,
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: muted }}>Gen 1: {'{Task, Priority, Status}'}</div>
        <div style={{ color: muted }}>
          Gen 2: {'{Task, Priority, Status, DueDate}'} <span style={{ color: warn }}>78%</span>
        </div>
        <div style={{ color: 'var(--osd-text)' }}>
          Gen 3: {'{Task, Priority, Status, DueDate}'} <span style={{ color: ok }}>100% ✅</span>
        </div>
      </div>
    </div>
    <Footer section="C · Gates" page={16} />
  </div>
);

const Gate3PAL: Page = () => (
  <div style={{ ...fill, padding: '96px 100px 0 100px', display: 'flex' }}>
    <div style={{ flex: 1.1, paddingRight: 40 }}>
      <div style={{ ...eyebrow, marginBottom: 18 }}>Gate 3</div>
      <h2 style={{ ...display, fontSize: 80 }}>
        PAL Router
        <br />
        <span style={{ color: muted, fontSize: 36, fontWeight: 400 }}>비용 자동 조정 라우터</span>
      </h2>
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {[
          {
            tier: '1×',
            cost: '저렴',
            label: 'Haiku · GPT-4o-mini',
            use: '기본 / 성공 누적 시',
            color: ok,
          },
          {
            tier: '10×',
            cost: '중간',
            label: 'Sonnet',
            use: '표준 검증',
            color: cool,
          },
          {
            tier: '30×',
            cost: '비쌈',
            label: 'Opus · GPT-4',
            use: '합의 / 어려운 케이스',
            color: warn,
          },
        ].map((p) => (
          <div
            key={p.tier}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              background: surface,
              border: `1px solid ${border}`,
              borderLeft: `5px solid ${p.color}`,
              borderRadius: 12,
              padding: '20px 24px',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: p.color,
                width: 130,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {p.tier}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{p.label}</div>
              <div style={{ fontSize: 22, color: muted, marginTop: 4 }}>{p.use}</div>
            </div>
            <div style={{ fontSize: 24, color: muted }}>{p.cost}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 32, fontSize: 26, color: muted, lineHeight: 1.4 }}>
        성공 → 다운그레이드, 실패 → 업그레이드. 품질 유지 + 비용 최소화.
      </p>
    </div>
    <div
      style={{
        flex: 0.9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={palRouterImg}
        alt="PAL Router three-tier cost ladder"
        style={{ ...imgFill, width: 760, height: 840 }}
      />
    </div>
    <Footer section="C · Gates" page={17} />
  </div>
);

const Discussion1: Page = () => (
  <div
    style={{
      ...fill,
      padding: '120px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ ...eyebrow, marginBottom: 24 }}>Discussion · 5분</div>
    <h2 style={{ ...display, fontSize: 80, marginBottom: 56 }}>게이트, 어떻게 보세요?</h2>
    <ol
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        fontSize: 36,
        lineHeight: 1.4,
      }}
    >
      {[
        '회사에서 "스펙 명확도 0.81"인 요구사항이 들어온 적 있나요?',
        'Ontology 95% 일치는 너무 빡빡한가요? 너무 느슨한가요?',
        'PAL 같은 라우터를 직접 만든다면, 어떤 휴리스틱이 들어가야 할까요?',
      ].map((q, i) => (
        <li key={i} style={{ display: 'flex', gap: 28 }}>
          <span
            style={{
              color: 'var(--osd-accent)',
              fontWeight: 800,
              minWidth: 48,
            }}
          >
            Q{i + 1}.
          </span>
          <span>{q}</span>
        </li>
      ))}
    </ol>
    <Footer section="C · Gates" page={18} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION D · Setup (19–22)
// ─────────────────────────────────────────────────────────────────────────────

const SectionD: Page = () =>
  SectionDivider({
    num: '03',
    title: '환경 설치',
    subtitle: 'Python 3.12 · Claude Code · uv 한 번에 점검 후, 한 줄로 설치한다.',
    page: 19,
    footerSection: 'D · Setup',
  });

const Prereq: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Pre-flight</div>
    <h2 style={{ ...display, fontSize: 92 }}>사전 체크리스트</h2>
    <div
      style={{
        marginTop: 56,
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: 36,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 26,
        lineHeight: 1.8,
      }}
    >
      <div>
        <span style={{ color: muted }}># Python 3.12 이상</span>
      </div>
      <div>python3.12 --version</div>
      <div style={{ marginTop: 14 }}>
        <span style={{ color: muted }}># Claude Code</span>
      </div>
      <div>which claude</div>
      <div style={{ marginTop: 14 }}>
        <span style={{ color: muted }}># uv (권장)</span>
      </div>
      <div>which uv || brew install uv</div>
    </div>
    <div
      style={{
        marginTop: 36,
        padding: 24,
        borderLeft: `4px solid ${warn}`,
        background: surface2,
        borderRadius: 8,
        fontSize: 26,
        color: 'var(--osd-text)',
        lineHeight: 1.5,
      }}
    >
      <b style={{ color: warn }}>주의:</b> 시스템 기본 python3가 3.9면 거부됩니다.{' '}
      <code>brew install python@3.12</code>로 먼저 업그레이드하세요.
    </div>
    <Footer section="D · Setup" page={20} />
  </div>
);

const InstallCmd: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Install · Verify</div>
    <h2 style={{ ...display, fontSize: 80 }}>한 줄 설치 + 검증</h2>
    <div
      style={{
        marginTop: 40,
        background: surface,
        border: `1px solid ${border}`,
        borderLeft: `4px solid ${'var(--osd-accent)' as string}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.5,
        marginBottom: 22,
      }}
    >
      <div style={{ color: muted, fontSize: 22 }}># 옵션 A — 자동 감지</div>
      <div>OUROBOROS_INSTALL_RUNTIME=claude \</div>
      <div>
        {'  '}curl -fsSL https://raw.githubusercontent.com/Q00/ouroboros/main/scripts/install.sh |
        bash
      </div>
    </div>
    <div
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderLeft: `4px solid ${cool}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.5,
        marginBottom: 22,
      }}
    >
      <div style={{ color: muted, fontSize: 22 }}># 옵션 B — uv tool로 직접</div>
      <div>uv tool install "ouroboros-ai[mcp,claude]"</div>
      <div>ouroboros setup --runtime claude</div>
    </div>
    <div
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderLeft: `4px solid ${ok}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.5,
      }}
    >
      <div style={{ color: muted, fontSize: 22 }}># 검증</div>
      <div>ouroboros --version</div>
      <div>cat ~/.claude/mcp.json | grep ouroboros</div>
    </div>
    <Footer section="D · Setup" page={21} />
  </div>
);

const Troubleshoot: Page = () => {
  const rows = [
    ['Python 3.12+ required', 'brew install python@3.12 후 재설치'],
    ['command not found: ouroboros', 'export PATH=$HOME/.local/bin:$PATH'],
    ['MCP 도구 안 보임', 'Claude Code 세션 재시작'],
    ['uvx 캐시 문제', 'uv cache clean'],
    ['최후의 수단', 'rm -rf .ouroboros && ouroboros init start "..."'],
  ];
  return (
    <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
      <div style={{ ...eyebrow, marginBottom: 18 }}>When things break</div>
      <h2 style={{ ...display, fontSize: 84 }}>트러블슈팅</h2>
      <div
        style={{
          marginTop: 56,
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 14,
          padding: '8px 28px',
        }}
      >
        {rows.map(([sym, fix], i) => (
          <div
            key={sym}
            style={{
              display: 'grid',
              gridTemplateColumns: '0.9fr 1.1fr',
              gap: 32,
              padding: '22px 0',
              borderBottom: i < rows.length - 1 ? `1px solid ${border}` : 'none',
              fontSize: 28,
              alignItems: 'baseline',
            }}
          >
            <div style={{ color: warn, fontWeight: 700 }}>{sym}</div>
            <div
              style={{
                color: 'var(--osd-text)',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 24,
              }}
            >
              {fix}
            </div>
          </div>
        ))}
      </div>
      <Footer section="D · Setup" page={22} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION E · Lab 1 — Interview→Seed (23–28)
// ─────────────────────────────────────────────────────────────────────────────

const SectionE: Page = () =>
  SectionDivider({
    num: '04',
    title: '실습 1 · Interview → Seed',
    subtitle: '"개인용 할 일 CLI" 30분 안에 seed.yaml까지.',
    page: 23,
    footerSection: 'E · Lab 1',
  });

const Lab1Mission: Page = () => (
  <div
    style={{
      ...fill,
      padding: '96px 120px 0 120px',
      display: 'flex',
    }}
  >
    <div style={{ flex: 1.05, paddingRight: 56 }}>
      <div style={{ ...eyebrow, marginBottom: 20 }}>Mission</div>
      <h2 style={{ ...display, fontSize: 88 }}>
        개인용 <span style={{ color: 'var(--osd-accent)' }}>할 일 CLI</span>
        <br />
        Interview → Seed
      </h2>
      <p style={{ marginTop: 36, fontSize: 32, color: muted, lineHeight: 1.5 }}>
        목표: 30분 안에 ambiguity ≤ 0.2인 seed.yaml을 손에 쥔다.
      </p>
      <ul
        style={{
          marginTop: 36,
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          fontSize: 28,
        }}
      >
        <li>⏱ 시간 분배 — 폴더 2m / 시작 10m / 답변 15m / 검증 3m</li>
        <li>
          📋 산출물 — <code>.ouroboros/seed.yaml</code>
        </li>
        <li>🚦 통과 기준 — Ambiguity ≤ 0.2</li>
      </ul>
    </div>
    <div
      style={{
        flex: 0.95,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 720,
          height: 760,
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 14,
          boxShadow: `0 0 80px ${'var(--osd-accent)' as string}22`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 22px',
            borderBottom: `1px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ width: 14, height: 14, borderRadius: 7, background: '#f87171' }} />
          <span style={{ width: 14, height: 14, borderRadius: 7, background: '#fbbf24' }} />
          <span style={{ width: 14, height: 14, borderRadius: 7, background: '#34d399' }} />
          <span style={{ marginLeft: 16, color: muted, fontSize: 18 }}>~/todo-cli</span>
        </div>
        <div
          style={{
            flex: 1,
            padding: '32px 28px',
            fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
            fontSize: 22,
            lineHeight: 1.7,
            color: 'var(--osd-text)',
            overflow: 'hidden',
          }}
        >
          <div style={{ color: 'var(--osd-accent)' }}>$ ooo interview</div>
          <div style={{ color: muted, marginLeft: 0 }}>▸ 삭제 vs 아카이브?</div>
          <div style={{ color: cool, marginLeft: 24 }}>아카이브로 보존</div>
          <div style={{ color: muted }}>▸ 우선순위 단계 수?</div>
          <div style={{ color: cool, marginLeft: 24 }}>3단계 (H/M/L)</div>
          <div style={{ color: muted }}>▸ 마감일은 필수?</div>
          <div style={{ color: cool, marginLeft: 24 }}>선택</div>
          <div
            style={{
              marginTop: 24,
              color: ok,
              borderTop: `1px solid ${border}`,
              paddingTop: 18,
            }}
          >
            ✅ Ambiguity 0.19 → seed.yaml 생성
          </div>
        </div>
      </div>
    </div>
    <Footer section="E · Lab 1" page={24} />
  </div>
);

const Lab1Steps: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Step 1–2 · 12분</div>
    <h2 style={{ ...display, fontSize: 80 }}>폴더 + Interview 시작</h2>
    <div
      style={{
        marginTop: 40,
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.6,
        marginBottom: 24,
      }}
    >
      <div style={{ color: muted }}># 1. 작업 폴더</div>
      <div>mkdir -p ~/ouroboros-workshop/todo-cli && cd $_</div>
    </div>
    <div
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.6,
        marginBottom: 24,
      }}
    >
      <div style={{ color: muted }}># 2-A. Claude Code 안에서</div>
      <div>
        <span style={{ color: cool }}>{'>'}</span> ooo interview "개인용 할 일 관리 CLI..."
      </div>
    </div>
    <div
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.6,
      }}
    >
      <div style={{ color: muted }}># 2-B. 또는 터미널에서</div>
      <div>ouroboros init start "개인용 할 일 관리 CLI..."</div>
    </div>
    <Footer section="E · Lab 1" page={25} />
  </div>
);

const Lab1AnswerGuide: Page = () => (
  <div
    style={{
      ...fill,
      padding: '120px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ ...eyebrow, marginBottom: 24 }}>Step 3 · 답변 가이드</div>
    <h2 style={{ ...display, fontSize: 76, marginBottom: 48 }}>
      답할 때 <span style={{ color: 'var(--osd-accent)' }}>지킬 3가지</span>
    </h2>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        fontSize: 32,
        lineHeight: 1.5,
      }}
    >
      <div>
        <b style={{ color: ok }}>✅ 모르겠으면 "모르겠다"</b>
        <div style={{ color: muted, marginTop: 4 }}>
          Ouroboros가 이를 ambiguity로 측정합니다. 솔직함이 게이트를 빠르게 통과시킵니다.
        </div>
      </div>
      <div>
        <b style={{ color: warn }}>❌ 억지로 단정하지 마세요</b>
        <div style={{ color: muted, marginTop: 4 }}>
          잘못된 단정은 후속 진화에서 비싸게 수정됩니다.
        </div>
      </div>
      <div>
        <b style={{ color: cool }}>💡 기본은 단순하게</b>
        <div style={{ color: muted, marginTop: 4 }}>
          우선순위 3단계, 단일 사용자, 마감일 선택 — 첫 사이클은 가벼워야 합니다.
        </div>
      </div>
    </div>
    <Footer section="E · Lab 1" page={26} />
  </div>
);

const Lab1Checklist: Page = () => {
  const items = [
    '삭제 vs 아카이브?',
    '개인용 / 팀 공유?',
    '우선순위 단계 수?',
    '마감일 필수 / 선택?',
    '완료 후 자동 처리?',
    '검색/필터 필요?',
    '반복 작업 지원?',
    '태그/카테고리?',
    '알림 기능?',
    '동기화/백업?',
    'CLI 출력 포맷?',
    '응답시간 목표?',
  ];
  return (
    <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
      <div style={{ ...eyebrow, marginBottom: 18 }}>Step 3 · 12개 질문</div>
      <h2 style={{ ...display, fontSize: 84 }}>예상 질문 체크리스트</h2>
      <div
        style={{
          marginTop: 48,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 18,
        }}
      >
        {items.map((q, i) => (
          <div
            key={q}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: 10,
              padding: '16px 22px',
              fontSize: 26,
              lineHeight: 1.3,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: `2px solid ${muted}`,
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--osd-accent)', fontWeight: 700, minWidth: 36 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{q}</span>
          </div>
        ))}
      </div>
      <Footer section="E · Lab 1" page={27} />
    </div>
  );
};

const Lab1SeedExample: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Step 4 · 산출물</div>
    <h2 style={{ ...display, fontSize: 80 }}>좋은 seed.yaml의 모습</h2>
    <pre
      style={{
        marginTop: 36,
        background: surface,
        border: `1px solid ${border}`,
        borderLeft: `4px solid ${ok}`,
        borderRadius: 12,
        padding: 32,
        fontSize: 22,
        lineHeight: 1.55,
        fontFamily: '"JetBrains Mono", monospace',
        margin: 0,
      }}
    >
      {`goal: |
  Personal task CLI with 3-level priority and SQLite storage

constraints:
  - Single-user only
  - 3 priority levels: High, Medium, Low
  - Response time < 200ms

success_criteria:
  - All CRUD operations covered by tests
  - Ambiguity score ≤ 0.2

ontology:
  Task:
    id: UUID
    title: str (max 256)
    priority: enum[High, Medium, Low]
    status: enum[todo, in_progress, done, archived]
    created_at: ISO8601
    due_date: ISO8601 (optional)`}
    </pre>
    <Footer section="E · Lab 1" page={28} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION F · Lab 2 — Execute & Evaluate (29–32)
// ─────────────────────────────────────────────────────────────────────────────

const SectionF: Page = () =>
  SectionDivider({
    num: '05',
    title: '실습 2 · Execute & Evaluate',
    subtitle: 'Seed → 동작하는 코드 + 테스트 + 3단계 검증 결과까지.',
    page: 29,
    footerSection: 'F · Lab 2',
  });

const Lab2Run: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Step 1 · 10분</div>
    <h2 style={{ ...display, fontSize: 80 }}>Execute & 산출물</h2>
    <div
      style={{
        marginTop: 36,
        background: surface,
        border: `1px solid ${border}`,
        borderLeft: `4px solid ${cool}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.6,
        marginBottom: 28,
      }}
    >
      <div>ouroboros run .ouroboros/seed.yaml</div>
    </div>
    <div
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: 28,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.7,
      }}
    >
      <div style={{ color: 'var(--osd-accent)' }}>[Wonder]</div>
      <div style={{ color: muted, paddingLeft: 24 }}>SQLite vs in-memory · click vs typer</div>
      <div style={{ color: 'var(--osd-accent)' }}>[Define]</div>
      <div style={{ color: muted, paddingLeft: 24 }}>ontology 확정 — Task / Priority / Status</div>
      <div style={{ color: cool }}>[Design]</div>
      <div style={{ color: muted, paddingLeft: 24 }}>src/{'{models, commands, db}'}/ + tests/</div>
      <div style={{ color: ok }}>[Deliver]</div>
      <div style={{ color: muted, paddingLeft: 24 }}>✓ 7개 모듈, 14개 테스트 — pytest 통과</div>
    </div>
    <Footer section="F · Lab 2" page={30} />
  </div>
);

const Lab2Evaluate: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Step 2 · 3단계 결과</div>
    <h2 style={{ ...display, fontSize: 80 }}>Evaluate 결과 해석</h2>
    <div
      style={{
        marginTop: 56,
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {[
        ['🤖', '기계적', '모든 테스트 PASS', 'import 누락 · 타입 불일치', ok],
        ['🧠', '의미론적', '"Seed 준수 OK"', 'constraint 누락 (예: 응답시간 미측정)', cool],
        ['🗳️', '합의', '모델 3개 동의', 'edge case 처리 부족', accent2],
      ].map(([icon, name, ok_, fail, color], i, arr) => (
        <div
          key={name}
          style={{
            display: 'grid',
            gridTemplateColumns: '0.5fr 1fr 1.3fr 1.6fr',
            gap: 24,
            padding: '24px 32px',
            borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none',
            alignItems: 'center',
            fontSize: 26,
          }}
        >
          <div style={{ fontSize: 36 }}>{icon}</div>
          <div style={{ color: color as string, fontWeight: 800 }}>{name}</div>
          <div style={{ color: ok }}>✅ {ok_}</div>
          <div style={{ color: muted }}>❌ {fail}</div>
        </div>
      ))}
    </div>
    <p
      style={{
        marginTop: 32,
        fontSize: 26,
        color: muted,
        lineHeight: 1.5,
      }}
    >
      의미론적 단계가 "응답시간 검증 코드 없음"으로 떨어지면 → 다음 Seed에 자동으로 벤치 추가.
    </p>
    <Footer section="F · Lab 2" page={31} />
  </div>
);

const Lab2Discussion: Page = () => (
  <div
    style={{
      ...fill,
      padding: '120px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ ...eyebrow, marginBottom: 24 }}>Discussion · 3분</div>
    <h2 style={{ ...display, fontSize: 78, marginBottom: 56 }}>검증이 떨어지면?</h2>
    <p style={{ fontSize: 40, lineHeight: 1.5, color: 'var(--osd-text)', maxWidth: 1500 }}>
      "응답시간 &lt; 200ms" 제약을 만족하는 검증 코드가 없다는 평가가 나오면,
      <br />
      여러분은 이를 어떻게 다음 세대 Seed에 반영하시겠어요?
    </p>
    <div
      style={{
        marginTop: 56,
        padding: '24px 28px',
        borderLeft: `4px solid ${'var(--osd-accent)' as string}`,
        background: surface,
        borderRadius: 8,
        fontSize: 28,
        color: muted,
        lineHeight: 1.5,
        maxWidth: 1500,
      }}
    >
      💡 힌트: <b style={{ color: 'var(--osd-text)' }}>Evolve</b>가 자동으로 "벤치마크 테스트 추가"
      를 다음 Seed의 success_criteria에 넣습니다.
    </div>
    <Footer section="F · Lab 2" page={32} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION G · Lab 3 — Evolve / Ralph (33–36)
// ─────────────────────────────────────────────────────────────────────────────

const SectionG: Page = () =>
  SectionDivider({
    num: '06',
    title: '실습 3 · Evolve / Ralph',
    subtitle: '평가 실패를 다음 세대 Seed로 자동 진화시키고, 수렴까지 관찰한다.',
    page: 33,
    footerSection: 'G · Lab 3',
  });

const Lab3Evolve: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Step 1 · 5분</div>
    <h2 style={{ ...display, fontSize: 84 }}>Evolve 한 번 + 세대 비교</h2>
    <div
      style={{
        marginTop: 36,
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.6,
        marginBottom: 28,
      }}
    >
      <div>ouroboros run evolve</div>
      <div style={{ color: muted, marginTop: 12 }}># 그리고 세대 비교</div>
      <div>
        diff .ouroboros/history/seed-gen1.yaml \
        <br />
        {'     '}.ouroboros/history/seed-gen2.yaml
      </div>
    </div>
    <div
      style={{
        padding: '24px 28px',
        borderLeft: `4px solid ${cool}`,
        background: surface2,
        borderRadius: 8,
        fontSize: 28,
        lineHeight: 1.5,
      }}
    >
      <b style={{ color: cool }}>관찰 포인트</b>
      <ul
        style={{
          margin: '14px 0 0',
          paddingLeft: 28,
          color: muted,
          lineHeight: 1.5,
        }}
      >
        <li>ontology에 새 필드가 추가됐나?</li>
        <li>constraints가 더 구체화됐나?</li>
        <li>success_criteria에 측정 메트릭이 늘었나?</li>
      </ul>
    </div>
    <Footer section="G · Lab 3" page={34} />
  </div>
);

const Lab3Ralph: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Step 2 · 5분</div>
    <h2 style={{ ...display, fontSize: 80 }}>
      Ralph 자동 수렴
      <span style={{ color: muted, fontSize: 30, fontWeight: 400 }}>
        {' · '}--max-generations 3
      </span>
    </h2>
    <div
      style={{
        marginTop: 32,
        padding: '20px 24px',
        borderLeft: `4px solid ${warn}`,
        background: surface2,
        borderRadius: 8,
        fontSize: 24,
        color: 'var(--osd-text)',
        lineHeight: 1.5,
        marginBottom: 28,
      }}
    >
      <b style={{ color: warn }}>비용 주의:</b> 수렴까지 자동 반복 = 모델 호출 누적. 워크숍에서는
      반드시 세대 제한.
    </div>
    <div
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: '24px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24,
        lineHeight: 1.6,
        marginBottom: 28,
      }}
    >
      ouroboros run ralph --max-generations 3
    </div>
    <div
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: 28,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 26,
        lineHeight: 1.8,
      }}
    >
      <div>
        Gen 1 → 78% similarity <span style={{ color: warn }}>(continue)</span>
      </div>
      <div>
        Gen 2 → 91% similarity <span style={{ color: warn }}>(continue)</span>
      </div>
      <div>
        Gen 3 → 97% similarity <span style={{ color: ok }}>✅ converged</span>
      </div>
    </div>
    <Footer section="G · Lab 3" page={35} />
  </div>
);

const Lab3Deeper: Page = () => (
  <div
    style={{
      ...fill,
      padding: '120px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ ...eyebrow, marginBottom: 24 }}>Reflection · 5분</div>
    <h2 style={{ ...display, fontSize: 80, marginBottom: 56 }}>깊이 있는 질문</h2>
    <ol
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        fontSize: 36,
        lineHeight: 1.4,
      }}
    >
      {[
        '왜 95% 임계값일까? 99%가 더 안전하지 않나?',
        '30세대 안전장치는 왜 필요할까?',
        '"수렴했다 = 완벽하다" 인가?',
      ].map((q, i) => (
        <li key={i} style={{ display: 'flex', gap: 28 }}>
          <span style={{ color: 'var(--osd-accent)', fontWeight: 800, minWidth: 48 }}>
            Q{i + 1}.
          </span>
          <span>{q}</span>
        </li>
      ))}
    </ol>
    <Footer section="G · Lab 3" page={36} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION H · Wrap (37–40)
// ─────────────────────────────────────────────────────────────────────────────

const SectionH: Page = () =>
  SectionDivider({
    num: '07',
    title: '회고 & 다음 단계',
    subtitle: '오늘 배운 것을 내일 어디에 적용할 것인가.',
    page: 37,
    footerSection: 'H · Wrap',
  });

const FitVsOverkill: Page = () => (
  <div style={{ ...fill, padding: '96px 120px 0 120px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Use it / skip it</div>
    <h2 style={{ ...display, fontSize: 84 }}>적합 vs 오버킬</h2>
    <div
      style={{
        marginTop: 56,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 28,
      }}
    >
      <div
        style={{
          background: surface,
          border: `1px solid ${border}`,
          borderTop: `4px solid ${ok}`,
          borderRadius: 14,
          padding: '28px 32px',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: ok,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          ✅ 적합
        </div>
        <ul
          style={{
            margin: '24px 0 0',
            padding: 0,
            listStyle: 'none',
            fontSize: 28,
            lineHeight: 1.6,
          }}
        >
          <li>· 새 모듈/서비스 부트스트랩</li>
          <li>· 명세가 흐릿한 신규 기능</li>
          <li>· 데이터 모델 설계 동반</li>
          <li>· 다중 모델 합의가 필요한 결정</li>
        </ul>
      </div>
      <div
        style={{
          background: surface,
          border: `1px solid ${border}`,
          borderTop: `4px solid ${warn}`,
          borderRadius: 14,
          padding: '28px 32px',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: warn,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          ❌ 오버킬
        </div>
        <ul
          style={{
            margin: '24px 0 0',
            padding: 0,
            listStyle: 'none',
            fontSize: 28,
            lineHeight: 1.6,
          }}
        >
          <li>· 한 줄 버그 픽스</li>
          <li>· 명백한 리팩터링</li>
          <li>· 의존성 업그레이드</li>
          <li>· 문서 오타 수정</li>
        </ul>
      </div>
    </div>
    <Footer section="H · Wrap" page={38} />
  </div>
);

const NextSteps: Page = () => (
  <div style={{ ...fill, padding: '96px 160px 0 160px' }}>
    <div style={{ ...eyebrow, marginBottom: 18 }}>Where to go from here</div>
    <h2 style={{ ...display, fontSize: 80 }}>다음 단계 추천</h2>
    <ul
      style={{
        margin: '64px 0 0',
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        fontSize: 36,
        lineHeight: 1.45,
      }}
    >
      <li>
        <span style={{ color: 'var(--osd-accent)', fontWeight: 800, marginRight: 20 }}>01.</span>
        자기 프로젝트에서 작은 모듈 하나 골라 1사이클 실행
      </li>
      <li>
        <span style={{ color: 'var(--osd-accent)', fontWeight: 800, marginRight: 20 }}>02.</span>
        일주일 후 같은 요구사항으로 vibe coding과 결과 비교
      </li>
      <li>
        <span style={{ color: 'var(--osd-accent)', fontWeight: 800, marginRight: 20 }}>03.</span>
        Ouroboros 사용 일지 노트 시작 — 학습 누적
      </li>
      <li>
        <span style={{ color: 'var(--osd-accent)', fontWeight: 800, marginRight: 20 }}>04.</span>
        github.com/Q00/ouroboros — 직접 코드 읽어보기
      </li>
    </ul>
    <Footer section="H · Wrap" page={39} />
  </div>
);

const Closing: Page = () => (
  <div style={{ ...fill, display: 'flex' }}>
    <div
      style={{
        flex: 1.05,
        padding: '140px 0 140px 140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ ...eyebrow, marginBottom: 32 }}>Thanks for staying ↩</div>
      <h1
        style={{
          ...display,
          fontSize: 116,
          lineHeight: 1.05,
        }}
      >
        <span>코드가 아니라</span>
        <br />
        <span>
          <span style={{ color: 'var(--osd-accent)' }}>명세</span>
          <span>를 먼저.</span>
        </span>
      </h1>
      <p
        style={{
          marginTop: 40,
          fontSize: 34,
          color: muted,
          maxWidth: 900,
          lineHeight: 1.5,
        }}
      >
        그러면 LLM은 추측하는 대신 검증한다.
      </p>
      <div
        style={{
          marginTop: 64,
          fontSize: 26,
          color: muted,
          letterSpacing: '0.16em',
        }}
      >
        — OUROBOROS WORKSHOP · 끝 —
      </div>
    </div>
    <div
      style={{
        flex: 0.95,
        padding: '140px 140px 140px 40px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={closingImg}
        alt="Convergence visual: seed crystal transforming into code blocks"
        style={{ ...imgFill, width: 760, height: 800 }}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export const meta: SlideMeta = {
  title: 'Ouroboros 2시간 워크숍',
};

// 페이지별 TTS 내레이션 스크립트.
// Audio Studio에서 편집할 수 있고, MP4 export 시 .srt/.txt 자막/대본 생성에 사용됩니다.
// 비워두면 MP4 export가 페이지의 보이는 텍스트(h1/h2/p/li)에서 자동 추출합니다.
export const narration: (string | undefined)[] = [
  '안녕하세요. 우로보로스 2시간 워크숍에 오신 것을 환영합니다. 오늘 우리는 막연한 프롬프트 대신 수학적으로 검증된 명세로 코딩하는 AI 에이전트 OS, 우로보로스를 함께 다뤄봅니다.',
  '오늘 워크숍이 끝나면 다섯 가지를 손에 쥐게 됩니다. 명세 주도 접근이 왜 강력한지 설명하고, 5단계 사이클을 그리고, 세 게이트를 이해하고, 직접 한 사이클을 실행해보고, 어떤 작업에 적합한지 판단할 수 있게 됩니다.',
  '120분을 어떻게 쓰는지 한눈에 보겠습니다. 이론은 40분, 실습은 75분, 회고가 5분입니다. 가장 두꺼운 블록인 실습 1에 30분을 할애합니다.',
  '본격적으로 들어가기 전에 한 가지 질문. 같은 요청을 5번 반복하면 5번 다 다른 코드가 나오는 경험, 다들 있으시죠? 왜 그럴까요. 모호함이 명세로 결정되지 않은 채 코드가 생성되기 때문입니다.',
  '바이브 코딩에는 네 가지 함정이 있습니다. 모호함 누적, 재현 불가능, 분해 부재, 검증 부재. 우로보로스는 이 네 가지를 모두 명세화 단계로 끌어올립니다.',
  '첫 번째 블록입니다. 5단계 사이클을 살펴봅니다. Interview에서 시작해서 Seed, Execute, Evaluate, Evolve로 이어지는 진화적 루프입니다.',
  '사이클을 한 장으로 보겠습니다. Interview는 가정을 노출하고, Seed는 명세를 결정화하고, Execute는 더블 다이아몬드로 분해하고, Evaluate는 3단계 검증을 하고, Evolve는 수렴까지 진화합니다.',
  '첫 단계는 Interview입니다. 소크라테스식 질문으로 숨겨진 가정 12개 이상을 노출시킵니다. 이 단계에서는 절대 코드를 쓰지 않고, ooo interview 명령으로 시작하며, ambiguity 점수가 0.2 이하가 될 때까지 진행합니다.',
  '두 번째 단계 Seed에서는 인터뷰 답변을 불변의 YAML 명세로 결정화합니다. goal, constraints, success criteria, ontology 네 섹션이 핵심이고, 한 번 결정되면 다음 세대에서만 진화할 수 있습니다.',
  'Execute 단계는 더블 다이아몬드 모델로 분해됩니다. 첫 번째 다이아몬드는 이해 — Wonder로 발산했다가 Define으로 온톨로지에 수렴합니다. 두 번째 다이아몬드는 구축 — Design으로 발산했다가 Deliver에서 코드와 테스트로 수렴합니다.',
  'Evaluate는 세 단계 자동 검증입니다. 기계적 단계는 무료로 컴파일과 테스트를 돌리고, 의미론적 단계에서 LLM이 스펙 준수를 확인하며, 마지막 합의 단계에서 30배 비싼 모델 셋이 동의해야 합니다.',
  'Evolve와 Ralph가 마지막입니다. 평가 결과로 새 의문을 만들어 다음 세대 Seed로 넘기고, ontology 유사도가 95퍼센트 이상으로 3세대 연속 안정화되면 진화를 멈춥니다. 30세대가 안전장치입니다.',
  '두 번째 블록입니다. 진행과 중단을 결정하는 세 가지 수학적 게이트를 다룹니다. Ambiguity Score, Ontology Convergence, PAL Router입니다.',
  '첫 번째 게이트, Ambiguity Score. 모호함을 정량화한 값이 0.2 이하일 때만 Seed 생성으로 넘어갑니다. 목표 명확도 40퍼센트, 제약 명확도 30퍼센트, 성공 기준 30퍼센트의 가중 합산입니다.',
  '계산 예시를 보겠습니다. 목표 0.9, 제약 0.8, 성공 0.7이면 명확도 합계가 0.81이 되어 ambiguity는 0.19. 게이트 통과입니다. 80퍼센트 명확도에서 남은 미지수는 코드 수준에서 해결 가능하기 때문에 0.2를 임계값으로 잡았습니다.',
  '두 번째 게이트는 Ontology Convergence입니다. 세대 간 ontology 유사도가 95퍼센트 이상이면 진화를 종료합니다. 필드명 일치 50퍼센트, 타입 일치 30퍼센트, 정확 일치 20퍼센트의 가중치로 계산합니다.',
  '세 번째 게이트는 PAL Router. 비용을 자동으로 조정하는 라우터입니다. 1배 모델은 기본, 10배는 표준 검증, 30배는 합의에만 씁니다. 성공이 누적되면 다운그레이드, 실패하면 업그레이드. 품질을 유지하면서 비용을 최소화합니다.',
  '여기서 잠깐 토론. 게이트들을 어떻게 보세요? 회사에서 명확도 0.81인 요구사항을 받아본 적 있나요? 95퍼센트 일치 임계값이 너무 빡빡한가요 너무 느슨한가요? PAL 같은 라우터를 직접 만든다면 어떤 휴리스틱을 넣겠습니까?',
  '세 번째 블록은 환경 설치입니다. 파이썬 3.12 이상, 클로드 코드, uv를 한 번에 점검한 뒤 한 줄로 설치합니다.',
  '먼저 사전 체크리스트. 파이썬 3.12 이상이 필요합니다. 시스템 기본 python3가 3.9면 거부되므로 brew로 python@3.12를 먼저 설치하세요.',
  '설치는 한 줄 또는 uv 직접 두 가지가 있습니다. OUROBOROS_INSTALL_RUNTIME 환경변수를 claude로 설정해서 curl 한 줄을 실행하거나, uv tool install로 직접 깔고 ouroboros setup --runtime claude로 마무리합니다.',
  '문제가 생기면 트러블슈팅 표를 참고하세요. 파이썬 버전 문제는 brew install python@3.12, 명령을 못 찾으면 PATH 추가, MCP 도구가 안 보이면 클로드 코드 세션 재시작, 캐시 문제는 uv cache clean이 답입니다.',
  '실습 1입니다. 30분 동안 개인용 할 일 CLI의 Interview에서 Seed까지 직접 진행합니다.',
  '미션은 명확합니다. 30분 안에 ambiguity 0.2 이하인 seed.yaml 파일을 손에 쥐는 것. 시간 분배는 폴더 만들기 2분, 인터뷰 시작 10분, 답변 15분, 검증 3분입니다.',
  '먼저 작업 폴더를 만들고 인터뷰를 시작합니다. mkdir로 todo-cli 폴더를 만들고, 클로드 코드 안에서 ooo interview 또는 터미널에서 ouroboros init start로 인터뷰를 시작합니다.',
  '답변할 때 세 가지를 지키세요. 모르겠으면 모르겠다고 답하기, 억지로 단정하지 않기, 첫 사이클은 단순하게 시작하기. 솔직함이 게이트를 빠르게 통과시킵니다.',
  '예상 질문 12개를 체크리스트로 보세요. 삭제와 아카이브, 개인용과 팀 공유, 우선순위 단계 수, 마감일 필수와 선택, 자동 처리, 검색 필터, 반복 작업, 태그, 알림, 동기화, 출력 포맷, 응답시간 목표.',
  '좋은 seed.yaml의 모습입니다. goal, constraints, success_criteria, ontology 네 섹션이 모두 명확하고 측정 가능한 형태로 채워져 있습니다.',
  '실습 2로 넘어갑니다. 20분 동안 Seed에서 실제 동작하는 코드와 테스트를 생성하고 3단계 검증 결과까지 확인합니다.',
  'ouroboros run 명령으로 실행하면 더블 다이아몬드 단계가 보입니다. Wonder, Define, Design, Deliver 순으로 7개 모듈과 14개 테스트가 생성됩니다.',
  '검증 결과 해석법입니다. 기계적 단계가 통과하면 모든 테스트가 패스, 의미론적 단계가 통과하면 스펙 준수 확인, 합의 단계가 통과하면 모델 셋이 동의했다는 뜻입니다.',
  '여기서 짧은 토론. 응답시간 200밀리초 미만이라는 제약을 만족하는 검증 코드가 없다는 평가가 나오면, 이를 어떻게 다음 세대 Seed에 반영하시겠어요? Evolve가 자동으로 벤치마크 테스트 추가를 다음 success criteria에 넣어줍니다.',
  '실습 3은 Evolve와 Ralph입니다. 평가 실패를 다음 세대 Seed로 자동 진화시키고 수렴까지 관찰합니다.',
  'Evolve를 한 번만 돌려보고 세대를 비교합니다. ouroboros run evolve 후에 diff 명령으로 gen1과 gen2를 비교하면, 새 필드 추가, 제약 구체화, 측정 메트릭 증가를 관찰할 수 있습니다.',
  '본격적인 자동 수렴은 Ralph가 합니다. 비용이 누적되니 워크숍에서는 반드시 max-generations 3으로 제한하세요. 78퍼센트, 91퍼센트, 97퍼센트로 수렴해 갑니다.',
  '깊이 있는 질문 셋. 왜 95퍼센트 임계값일까요 99퍼센트가 더 안전하지 않을까요? 30세대 안전장치는 왜 필요할까요? 수렴했다는 것이 곧 완벽하다는 뜻일까요?',
  '마지막 블록 회고입니다. 오늘 배운 것을 내일 어디에 적용할 것인지 정리합니다.',
  '적합과 오버킬을 구분합시다. 새 모듈 부트스트랩, 명세가 흐릿한 신규 기능, 데이터 모델 동반 설계, 다중 모델 합의 결정에는 적합합니다. 한 줄 버그 픽스, 명백한 리팩터링, 의존성 업그레이드, 오타 수정에는 오버킬입니다.',
  '다음 단계 추천. 자기 프로젝트에서 작은 모듈 하나를 골라 한 사이클을 돌려보고, 일주일 후 같은 요구사항으로 바이브 코딩과 결과를 비교하세요. 우로보로스 사용 일지를 시작하면 학습이 누적됩니다.',
  '오늘의 마지막 메시지. 코드가 아니라 명세를 먼저 쓰자. 그러면 LLM은 추측하는 대신 검증한다. 우로보로스 워크숍을 끝까지 함께해주셔서 감사합니다.',
];

export default [
  Cover,
  LearningGoals,
  Timeline,
  Hook,
  FourTraps,
  SectionB,
  CycleDiagram,
  Stage1Interview,
  Stage2Seed,
  Stage3Execute,
  Stage4Evaluate,
  Stage5Evolve,
  SectionC,
  Gate1Definition,
  Gate1Example,
  Gate2Convergence,
  Gate3PAL,
  Discussion1,
  SectionD,
  Prereq,
  InstallCmd,
  Troubleshoot,
  SectionE,
  Lab1Mission,
  Lab1Steps,
  Lab1AnswerGuide,
  Lab1Checklist,
  Lab1SeedExample,
  SectionF,
  Lab2Run,
  Lab2Evaluate,
  Lab2Discussion,
  SectionG,
  Lab3Evolve,
  Lab3Ralph,
  Lab3Deeper,
  SectionH,
  FitVsOverkill,
  NextSteps,
  Closing,
] satisfies Page[];
