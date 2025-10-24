/* Roda sem build via index.html:
   - Usa React/FramerMotion globais (UMD)
   - Exporta window.App
*/
const React = (window as any).React;
const { motion } = (window as any).framerMotion;

// Badge PNG local
const BADGE_SRC = "./delta_badge.png";

// Tipos só onde o editor reclamava de 'implicit any'
type SpeedLine = {
  id: number;
  left: string;
  dur: number;
  delay: number;
  opacity: number;
};

const PILOTOS = [
  "01 - Marcel Di'marolla",
  "02 - Dean Cavalcante",
  "03 - Denver Gucci",
  "04 - Guilherme F",
  "05 - Lorena Lovatelli",
  "06 - Luck Davies",
  "07 - Marco Selinger",
  "08 - Rodrigo Di'marolla",
  "09 - Jhony Bravo",
  "10 - Anthony Leal",
  "11 - Vitor Barbosa",
  "12 - Victor Salazar",
  "13 - Bell Di'marolla",
  "14 - Rodrigo Versone",
  "15 - Geras Ares",
  "16 - Luan Balakov",
];

export default function IntroProtocoloDelta({ showSeconds = 8 }) {
  const [visibleCount, setVisibleCount] = React.useState(0);
  const finalState = visibleCount > PILOTOS.length;

  // generate speed lines once (sem generic)
  const speedLines = React.useMemo(() => {
    const arr: SpeedLine[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${Math.round(Math.random() * 100)}%`,
      dur: 1 + Math.random() * 1.6,
      delay: Math.random() * 1.2,
      opacity: 0.12 + Math.random() * 0.18,
    }));
    return arr;
  }, []);

  React.useEffect(() => {
    let t: number = 0;

    t = (window as any).setTimeout(function showNext() {
      setVisibleCount((c: number) => {
        const next = c + 1;
        if (next < PILOTOS.length) {
          t = (window as any).setTimeout(showNext, 380);
        } else {
          // trigger final reveal after short delay
          (window as any).setTimeout(() => setVisibleCount((c2: number) => c2 + 1), 500);
        }
        return next;
      });
    }, 1100);

    return () => {
      (window as any).clearTimeout(t);
    };
  }, []);

  // basic styles (kept inline so no external deps are required)
  const styles = {
    root: {
      width: "100%",
      height: "100vh",
      background: "linear-gradient(180deg,#000000 0%, #021a0e 60%)",
      color: "#7AFF00",
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
      overflow: "hidden",
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      position: "absolute" as const,
      top: 18,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 40,
      textAlign: "center" as const,
    },
    pmBox: {
      width: 40,
      height: 40,
      borderRadius: 6,
      background: "rgba(6,70,40,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid rgba(80,200,120,0.08)",
    },
    title: {
      fontSize: 34,
      fontWeight: 800,
      letterSpacing: -0.5,
      zIndex: 30,
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    subtitle: { fontSize: 12, color: "rgba(190,255,170,0.9)", marginTop: 6 },
    panel: {
      width: "min(920px,88%)",
      padding: 18,
      borderRadius: 10,
      background: "rgba(0,0,0,0.55)",
      border: "1px solid rgba(30,90,50,0.1)",
      zIndex: 30,
    },
    listBox: {
      marginTop: 12,
      padding: 10,
      borderRadius: 8,
      background: "rgba(0,0,0,0.45)",
      border: "1px solid rgba(12,50,30,0.08)",
      height: 360,
      maxHeight: 360,
      overflow: "hidden",
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "6px 8px",
      borderBottom: "1px solid rgba(8,40,26,0.06)",
    },
    badgeWrap: {
      position: "absolute" as const,
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 50,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      pointerEvents: "none" as const,
    },
    badgeImg: { width: 300, filter: "drop-shadow(0 0 14px #7aff00)" },
    finalMsg: { marginTop: 12, color: "#bfffa0", fontWeight: 800, textShadow: "0 0 12px #7aff00" },
    sirenLeft: {
      position: "absolute" as const,
      top: 14,
      left: 14,
      width: 140,
      height: 8,
      borderRadius: 999,
      background: "rgba(255,30,30,0.6)",
      boxShadow: "0 0 8px rgba(255,60,60,0.3)",
      animation: "pulse 1s infinite",
    },
    sirenRight: {
      position: "absolute" as const,
      top: 14,
      right: 14,
      width: 140,
      height: 8,
      borderRadius: 999,
      background: "rgba(40,80,255,0.55)",
      boxShadow: "0 0 8px rgba(50,100,255,0.25)",
      animation: "pulse 1s infinite",
    },
  };

  return (
    <div style={styles.root as any}>
      <style>{`
        @keyframes pulse { 0%{opacity:1}50%{opacity:0.35}100%{opacity:1} }
        .speed-line { position:absolute; height:2px; background:linear-gradient(90deg, transparent, rgba(120,255,160,0.9), transparent); }
      `}</style>

      {/* sirenes */}
      <div style={styles.sirenLeft as any} aria-hidden />
      <div style={styles.sirenRight as any} aria-hidden />

      {/* speed lines */}
      {speedLines.map((s: SpeedLine) => (
        <motion.div
          key={s.id}
          className="speed-line"
          style={{ left: s.left, width: "55%", opacity: s.opacity }}
          initial={{ y: -40 }}
          animate={{ y: "110%" }}
          transition={{ repeat: Infinity, duration: s.dur, delay: s.delay, ease: "linear" }}
        />
      ))}

      {/* radar (SVG) placed behind content */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 10,
          pointerEvents: "none",
          opacity: finalState ? 0.06 : 0.14,
        }}
      >
        <svg width={420} height={420} viewBox="0 0 200 200">
          <defs>
            <radialGradient id="g2" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#8ef08a" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#05673b" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#013a1f" stopOpacity="0.01" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#g2)" />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <path d="M100 100 L190 100" stroke="#6ee08c" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <circle cx="100" cy="100" r="6" fill="#9ff09b" />
            <g opacity="0.45">
              <circle cx="100" cy="100" r="40" stroke="#2fa46a" strokeWidth="1" fill="none" />
              <circle cx="100" cy="100" r="64" stroke="#1f7f54" strokeWidth="1" fill="none" />
            </g>
          </motion.g>
        </svg>
      </div>

      {/* header */}
      <header style={styles.header as any}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={styles.pmBox as any}>PM</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, letterSpacing: 1.6 }}>POLÍCIA MILITAR DA CAPITAL</div>
            <div style={styles.subtitle as any}>UNIDADE DELTA • PROTOCOLO DE ACOMPANHAMENTO</div>
          </div>
        </div>
      </header>

      {/* main content */}
      <main style={{ zIndex: 30, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={styles.title as any}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              background: "linear-gradient(90deg,#cfffbe,#eaffd2)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            INICIANDO
          </div>
          <div
            style={{
              marginLeft: 12,
              padding: "6px 10px",
              fontSize: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(40,90,50,0.08)",
              color: "#dfffc6",
            }}
          >
            PROTOCOLO DELTA
          </div>
        </div>

        <div style={styles.panel as any}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14 }}>RASTREAMENTO ATIVO</div>
            <div style={{ fontSize: 12 }}>VELOCIDADE SINCRONIZADA &gt; 180 KM/H</div>
          </div>

          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 10, borderRadius: 8, background: "rgba(0,0,0,0.6)", overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: "linear-gradient(90deg,#7ffea0,#40c070)" }}
                initial={{ width: 0 }}
                animate={{
                  width: finalState
                    ? "100%"
                    : Math.min(100, (visibleCount / PILOTOS.length) * 100 + 20) + "%",
                }}
                transition={{ duration: Math.max(3, showSeconds), ease: "linear" }}
              />
            </div>
            <div style={{ width: 50, textAlign: "right", fontSize: 12 }}>{showSeconds}s</div>
          </div>

          <div style={styles.listBox as any} aria-live="polite">
            {PILOTOS.map((p, i) => (
              <div key={p} style={{ ...(styles as any).listItem, opacity: i < visibleCount ? 1 : 0.25 }}>
                <div>{p}</div>
                <div style={{ color: i < visibleCount ? "#a8ff9a" : "transparent", fontWeight: 800 }}>
                  {i < visibleCount ? "OK" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* final badge (revealed only at the end) */}
      <motion.div
        style={styles.badgeWrap as any}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={finalState ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.9 }}
      >
        <img src={BADGE_SRC} alt="Unidade Delta" style={styles.badgeImg as any} />
        <div style={styles.finalMsg as any}>PROTOCOLO DELTA ATIVO ✅</div>
      </motion.div>

      {/* footer */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 12,
          color: "rgba(150,220,150,0.35)",
        }}
      >
        UNIDADE DELTA • SISTEMA DE RASTREAMENTO
      </div>
    </div>
  );
}

// expõe para o index.html montar
;(window as any).App = IntroProtocoloDelta;