"use client";

import { useEffect, useMemo, useState } from "react";
import SnakeGame from "./components/SnakeGame";

type Screen = "menu" | "about" | "skills" | "projects" | "contact";

const SFX = {
  beep: () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 740;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 70);
    } catch {}
  },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ArcadeCV() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [muted, setMuted] = useState(false);
  const [coins, setCoins] = useState(7);
  const [xp, setXp] = useState(1200);
  const [lvl, setLvl] = useState(12);

  const profile = useMemo(
    () => ({
      arcadeName: 'CARLOS SILVA CALDERON',
      realName: "Carlos Francisco Silva Calderón",
      title: "Arquitecto Digital & Constructor de Ecosistemas Educativos",
      tagline:
        "De la construcción física a la construcción digital: CRM, Aula Virtual, Automatización.",
      location: "Perú",
      sites: ["EducaEmprendedor.pe", "Escuela.EducaEmprendedor.pe"],
    }),
    []
  );

  const skills = [
    { k: "Next.js", v: 85 },
    { k: "Tailwind", v: 90 },
    { k: "Diseño UI/UX", v: 78 },
    { k: "Arquitectura Web", v: 82 },
    { k: "Sistemas Educativos (LMS/CRM)", v: 88 },
  ];

  const projects = [
    {
      name: "EducaEmprendedor.pe",
      desc: "Construcción y diseño del sitio principal del ecosistema EDUCA.",
      tags: ["Next.js", "UI/UX", "Landing", "Negocio"],
    },
    {
      name: "Escuela.EducaEmprendedor.pe",
      desc: "Plataforma educativa para cursos, experiencia de alumno y crecimiento.",
      tags: ["LMS", "Cursos", "Experiencia", "Escalabilidad"],
    },
    {
      name: "CV Arcade + Snake",
      desc: "Presentación interactiva estilo juego para destacar perfil y proyectos.",
      tags: ["Branding", "Gamificación", "Portafolio"],
    },
  ];

  const routes: { id: Screen; label: string; hint: string }[] = [
    { id: "about", label: "1) ABOUT", hint: "Historia real + propuesta" },
    { id: "skills", label: "2) SKILLS", hint: "Stats tipo RPG" },
    { id: "projects", label: "3) PROJECTS", hint: "Misiones construidas" },
    { id: "contact", label: "4) CONTACT", hint: "Conecta conmigo" },
  ];

  const go = (to: Screen) => {
    if (!muted) SFX.beep();
    setCoins((c) => clamp(c + 1, 0, 99));
    setXp((x) => x + 45);
    const newLvl = 10 + Math.floor((xp + 45) / 250);
    setLvl(newLvl);
    setScreen(to);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") go("menu");
      if (e.key.toLowerCase() === "m") setMuted((m) => !m);

      if (screen === "menu") {
        if (e.key === "1") go("about");
        if (e.key === "2") go("skills");
        if (e.key === "3") go("projects");
        if (e.key === "4") go("contact");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, muted, xp]);

  return (
    <main className="min-h-screen px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="pixel-border crt rounded-xl sm:rounded-2xl bg-[#0b0b1b]/70 p-3 sm:p-4 md:p-5 lg:p-6">
          {/* HUD - Responsive */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col xs:flex-row items-start gap-3 sm:gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-300/25 to-fuchsia-400/20 shadow-neon ring-1 ring-cyan-300/40 flex items-center justify-center animate-floaty overflow-hidden mx-auto xs:mx-0">
                <img 
                  src="/carlos-sticker.webp" 
                  alt="Carlos Sticker" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center xs:text-left">
                <div
                  className="glitch text-xl sm:text-2xl lg:text-3xl font-black tracking-wide sm:tracking-widest"
                  data-text={profile.arcadeName}
                >
                  {profile.arcadeName}
                </div>
                <p className="text-white/80 text-xs sm:text-sm md:text-base mt-1">
                  {profile.title} • <span className="text-cyan-200/90">{profile.location}</span>
                </p>
                <p className="text-white/60 text-xs sm:text-sm mt-1">{profile.realName}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center xs:justify-start lg:justify-end mt-3 lg:mt-0">
              <div className="flex gap-2 sm:gap-3">
                <HudChip label="LVL" value={lvl} />
                <HudChip label="XP" value={xp} />
                <HudChip label="COINS" value={coins} />
              </div>
              <button
                onClick={() => setMuted((m) => !m)}
                className="btn-arcade !px-3 !py-2 text-xs mt-2 sm:mt-0"
              >
                {muted ? "🔇 MUTE" : "🔊 SFX"}
              </button>
            </div>
          </div>

          {/* Content Grid - Responsive */}
          <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 lg:grid-cols-1 xl:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-xl sm:rounded-2xl bg-black/30 p-3 sm:p-4 md:p-5 ring-1 ring-white/10">
              {screen === "menu" && <Menu routes={routes} onGo={go} sites={profile.sites} />}
              {screen === "about" && (
                <ScreenWrap title="ABOUT" subtitle="De la construcción a construir EDUCA">
                  <p className="text-white/85 leading-relaxed text-sm sm:text-base">
                    Soy <span className="text-cyan-200 font-bold">{profile.realName}</span>,
                    Inicié mi camino en el sector <strong>construcción</strong>, donde aprendí ejecución real,
                    control y resultados.
                  </p>

                  <p className="mt-2 sm:mt-3 text-white/80 leading-relaxed text-sm sm:text-base">
                    Hoy construyo <strong>ecosistemas digitales educativos</strong>.
                    He trabajado en la <strong>construcción y diseño</strong> de{" "}
                    <span className="text-cyan-200 font-bold">{profile.sites[0]}</span> y{" "}
                    <span className="text-cyan-200 font-bold">{profile.sites[1]}</span>,
                    integrando experiencia, UI/UX y visión de negocio.
                  </p>

                  <p className="mt-2 sm:mt-3 text-white/70 text-sm sm:text-base">
                    No hago "páginas". Construyo sistemas para crecer.
                  </p>

                  {/* Snake Game Container */}
                  <div className="mt-4 sm:mt-5">
                    <SnakeGame />
                  </div>

                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                    <button className="btn-arcade text-xs sm:text-sm" onClick={() => go("projects")}>
                      ▶ VER PROYECTOS
                    </button>
                    <button className="btn-arcade text-xs sm:text-sm" onClick={() => go("contact")}>
                      ✉ CONTACTAR
                    </button>
                  </div>
                </ScreenWrap>
              )}

              {screen === "skills" && (
                <ScreenWrap title="SKILLS" subtitle="Stats tipo RPG">
                  <div className="space-y-3 sm:space-y-4">
                    {skills.map((s) => (
                      <div key={s.k}>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-white/80">
                          <span className="font-bold tracking-wide sm:tracking-widest break-words pr-2">{s.k}</span>
                          <span className="text-white/60 whitespace-nowrap">{s.v}/100</span>
                        </div>
                        <div className="mt-1 sm:mt-2 h-2 sm:h-3 rounded-full bg-white/10 ring-1 ring-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300/70 to-fuchsia-400/60"
                            style={{ width: `${s.v}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScreenWrap>
              )}

              {screen === "projects" && (
                <ScreenWrap title="PROJECTS" subtitle="Misiones construidas">
                  <div className="grid gap-2 sm:gap-3">
                    {projects.map((p) => (
                      <div
                        key={p.name}
                        className="rounded-xl sm:rounded-2xl bg-black/35 p-3 sm:p-4 ring-1 ring-white/10 hover:ring-cyan-300/30 transition"
                      >
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                          <h3 className="font-black tracking-wide sm:tracking-widest text-base sm:text-lg">{p.name}</h3>
                          <span className="text-xs text-white/60 animate-flicker whitespace-nowrap">READY</span>
                        </div>
                        <p className="mt-1 text-white/75 text-xs sm:text-sm">{p.desc}</p>
                        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                          {p.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full px-2 py-1 text-xs bg-white/5 ring-1 ring-white/10 text-white/75"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                    <button className="btn-arcade text-xs sm:text-sm" onClick={() => go("contact")}>
                      🎯 QUIERO TRABAJAR CONTIGO
                    </button>
                    <button className="btn-arcade text-xs sm:text-sm" onClick={() => go("menu")}>
                      ⬅ BACK
                    </button>
                  </div>
                </ScreenWrap>
              )}

              {screen === "contact" && (
                <ScreenWrap title="CONTACT" subtitle="Conecta conmigo">
                  <div className="rounded-xl sm:rounded-2xl bg-black/35 p-3 sm:p-4 ring-1 ring-white/10">
                    <p className="text-white/85 text-sm sm:text-base">
                      Contacta conmigo para proyectos, colaboraciones o conversaciones sobre tecnología y educación.
                    </p>

                    <div className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 md:grid-cols-2">
                      <ContactCard 
                        label="WhatsApp" 
                        value="+51 955 919 939" 
                        hint="Mándame un WhatsApp" 
                      />
                      <ContactCard 
                        label="Email" 
                        value="silvacalderoncarlos13@gmail.com" 
                        hint="Mándame un correo" 
                      />
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                    <button className="btn-arcade text-xs sm:text-sm" onClick={() => go("menu")}>
                      ⬅ MENÚ
                    </button>
                    <button
                      className="btn-arcade text-xs sm:text-sm"
                      onClick={() => navigator.clipboard?.writeText("Hola Carlos, vi tu CV Arcade. Quiero conversar sobre un proyecto.")}
                    >
                      📋 COPIAR MENSAJE
                    </button>
                  </div>
                </ScreenWrap>
              )}
            </div>

            {/* Side Panel - Oculto en móviles, visible en xl+ */}
            <aside className="hidden xl:block rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <h2 className="font-black tracking-widest text-lg">ARCADE PANEL</h2>
                <span className="text-xs text-white/60">v1.0</span>
              </div>

              <div className="mt-4 space-y-3">
                <PanelBox title="CONTROLES">
                  <p className="text-white/70 text-sm">
                    <span className="text-cyan-200 font-bold">1-4</span> navegar (en menú) <br />
                    <span className="text-cyan-200 font-bold">ESC</span> volver <br />
                    <span className="text-cyan-200 font-bold">M</span> mute
                  </p>
                </PanelBox>

                <PanelBox title="LOG">
                  <p className="text-white/70 text-sm">
                    Estado: <span className="text-cyan-200 font-bold">{screen.toUpperCase()}</span>
                  </p>
                </PanelBox>
              </div>

              <div className="mt-4 rounded-2xl bg-gradient-to-br from-cyan-300/10 to-fuchsia-400/10 p-4 ring-1 ring-white/10">
                <p className="text-sm text-white/80">
                  "Construyo sistemas que convierten conocimiento en negocio."
                </p>
                <p className="mt-2 text-xs text-white/60">— Carlos Silva Calderon</p>
              </div>
            </aside>
          </div>

          {/* Mobile Controls Panel */}
          <div className="xl:hidden mt-4 rounded-xl sm:rounded-2xl bg-black/30 p-3 sm:p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <h2 className="font-black tracking-widest text-base sm:text-lg">ARCADE PANEL</h2>
              <span className="text-xs text-white/60">v1.0</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              <PanelBox title="CONTROLES">
                <p className="text-white/70 text-xs sm:text-sm">
                  <span className="text-cyan-200 font-bold">1-4</span> navegar<br />
                  <span className="text-cyan-200 font-bold">ESC</span> volver<br />
                  <span className="text-cyan-200 font-bold">M</span> mute
                </p>
              </PanelBox>

              <PanelBox title="LOG">
                <p className="text-white/70 text-xs sm:text-sm">
                  Estado: <span className="text-cyan-200 font-bold">{screen.toUpperCase()}</span>
                </p>
              </PanelBox>
            </div>

            <div className="mt-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-300/10 to-fuchsia-400/10 p-3 sm:p-4 ring-1 ring-white/10">
                <p className="text-xs sm:text-sm text-white/80">
                  "Construyo sistemas que convierten conocimiento en negocio."
                </p>
                <p className="mt-1 sm:mt-2 text-xs text-white/60">— Carlos Silva Calderon</p>
              </div>
          </div>
        </div>

        <p className="mt-4 sm:mt-6 text-center text-xs text-white/45 px-2">
          Hecho con Next.js + Tailwind • estilo CRT/arcade • Snake incluido
        </p>
      </div>
    </main>
  );
}

function HudChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg sm:rounded-xl bg-black/35 px-2 sm:px-3 py-1 sm:py-2 ring-1 ring-white/10 min-w-[60px] sm:min-w-[70px]">
      <div className="text-[9px] sm:text-[10px] text-white/55 tracking-widest">{label}</div>
      <div className="text-xs sm:text-sm font-black tracking-widest text-cyan-200">{value}</div>
    </div>
  );
}

function Menu({
  routes,
  onGo,
  sites,
}: {
  routes: { id: Screen; label: string; hint: string }[];
  onGo: (s: Screen) => void;
  sites: string[];
}) {
  return (
    <div>
      <div className="rounded-xl sm:rounded-2xl bg-black/35 p-3 sm:p-4 ring-1 ring-white/10">
        <p className="text-white/70 text-xs sm:text-sm">
          <span className="text-cyan-200 font-bold">INSERT COIN</span> → Bienvenido a mi CV Arcade
          <br />
          Sitios: <span className="text-cyan-200 font-bold">{sites[0]}</span> •{" "}
          <span className="text-cyan-200 font-bold">{sites[1]}</span>
        </p>
      </div>

      <div className="mt-3 sm:mt-4 grid gap-2 sm:gap-3">
        {routes.map((r) => (
          <button
            key={r.id}
            onClick={() => onGo(r.id)}
            className="rounded-xl sm:rounded-2xl bg-black/35 p-3 sm:p-4 ring-1 ring-white/10 hover:ring-cyan-300/30 transition text-left"
          >
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <span className="font-black tracking-wide sm:tracking-widest text-sm sm:text-base">{r.label}</span>
              <span className="text-xs text-white/50 whitespace-nowrap">PRESS ▶</span>
            </div>
            <div className="mt-1 text-xs sm:text-sm text-white/70">{r.hint}</div>
          </button>
        ))}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
        <button className="btn-arcade text-xs sm:text-sm" onClick={() => onGo("about")}>
          ▶ START
        </button>
        <button className="btn-arcade text-xs sm:text-sm" onClick={() => onGo("contact")}>
          ☎ CO-OP
        </button>
      </div>
    </div>
  );
}

function ScreenWrap({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-black/35 p-3 sm:p-4 md:p-5 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div>
          <h2 className="font-black tracking-widest text-lg sm:text-xl">{title}</h2>
          <p className="text-white/65 text-xs sm:text-sm mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs text-white/55 animate-flicker whitespace-nowrap hidden sm:inline">
          PRESS ESC
        </span>
      </div>
      <div className="mt-3 sm:mt-4">{children}</div>
    </div>
  );
}

function PanelBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-black/35 p-3 sm:p-4 ring-1 ring-white/10">
      <div className="text-xs sm:text-sm text-white/55 tracking-widest font-bold">{title}</div>
      <div className="mt-1 sm:mt-2">{children}</div>
    </div>
  );
}

function ContactCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white/5 p-3 sm:p-4 ring-1 ring-white/10">
      <div className="text-xs sm:text-sm text-white/55 tracking-widest font-bold">{label}</div>
      <div className="mt-1 text-xs sm:text-sm text-cyan-200 font-bold sm:font-black break-all">{value}</div>
      <div className="mt-1 sm:mt-2 text-xs text-white/55">{hint}</div>
    </div>
  );
}