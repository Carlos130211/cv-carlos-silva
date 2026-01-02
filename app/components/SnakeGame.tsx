"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };
const GRID = 15;
const TICK_MS = 140;

function same(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

function randFood(exclude: Point[]) {
  while (true) {
    const p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!exclude.some((s) => same(s, p))) return p;
  }
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Point>({ x: 3, y: 5 });
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);
  const [showMobileControls, setShowMobileControls] = useState(false);

  const dirRef = useRef(dir);
  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  const reset = () => {
    const start = [{ x: 7, y: 7 }];
    setSnake(start);
    setFood(randFood(start));
    setDir({ x: 1, y: 0 });
    setAlive(true);
    setScore(0);
  };

  // Detectar si es móvil/touch
  useEffect(() => {
    const checkIfMobile = () => {
      return window.innerWidth < 768 || 'ontouchstart' in window;
    };
    
    if (checkIfMobile()) {
      setShowMobileControls(true);
    }
    
    const handleResize = () => {
      setShowMobileControls(checkIfMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Controles teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = dirRef.current;

      if (e.key === "ArrowUp" && d.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && d.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && d.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && d.x !== -1) setDir({ x: 1, y: 0 });

      if (e.key.toLowerCase() === "r") reset();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Game loop
  useEffect(() => {
    if (!alive) return;

    const tick = setInterval(() => {
      setSnake((prev) => {
        const d = dirRef.current;
        const head = prev[0];

        const newHead: Point = {
          x: (head.x + d.x + GRID) % GRID,
          y: (head.y + d.y + GRID) % GRID,
        };

        // choque con cuerpo
        if (prev.some((p) => same(p, newHead))) {
          setAlive(false);
          return prev;
        }

        let next = [newHead, ...prev];

        // comer
        if (same(newHead, food)) {
          setScore((s) => s + 10);
          const nf = randFood(next);
          setFood(nf);
        } else {
          next.pop();
        }

        return next;
      });
    }, TICK_MS);

    return () => clearInterval(tick);
  }, [alive, food]);

  // Función para controles móviles
  const handleMobileDirection = (newDir: Point) => {
    const d = dirRef.current;
    
    // Prevenir movimiento inverso
    if (newDir.x === 1 && d.x !== -1) setDir({ x: 1, y: 0 });
    if (newDir.x === -1 && d.x !== 1) setDir({ x: -1, y: 0 });
    if (newDir.y === 1 && d.y !== -1) setDir({ x: 0, y: 1 });
    if (newDir.y === -1 && d.y !== 1) setDir({ x: 0, y: -1 });
  };

  const cells = useMemo(() => Array.from({ length: GRID * GRID }), []);

  return (
    <div className="mt-4 rounded-xl sm:rounded-2xl bg-black/40 p-3 sm:p-4 ring-1 ring-cyan-300/30">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h3 className="font-black tracking-widest text-base sm:text-lg">🐍 SNAKE</h3>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            {!alive && <span className="text-fuchsia-300 font-bold">GAME OVER • </span>}
            Score: <span className="text-cyan-200 font-bold">{score}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="btn-arcade !px-3 !py-2 text-xs"
            onClick={() => setShowMobileControls(!showMobileControls)}
          >
            {showMobileControls ? "🎮 OCULTAR CONTROLES" : "🎮 MOSTRAR CONTROLES"}
          </button>
          <button className="btn-arcade !px-3 !py-2 text-xs" onClick={reset}>
            🔁 RESET
          </button>
        </div>
      </div>

      {/* Instrucciones responsive */}
      <div className="mt-2 text-xs sm:text-sm text-white/70">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 sm:gap-3">
          <span className="flex items-center gap-1">
            <span className="text-cyan-200 font-bold">⬆️⬇️⬅️➡️</span> Moverse
          </span>
          <span className="flex items-center gap-1">
            <span className="text-cyan-200 font-bold">R</span> Reset
          </span>
          {showMobileControls && (
            <span className="col-span-2 text-cyan-200/80 font-bold">
              Usa los botones ↓ para controlar
            </span>
          )}
        </div>
      </div>

      {/* Grid del juego - Responsive */}
      <div className="mt-3 sm:mt-4 grid gap-0.5 sm:gap-1 mx-auto max-w-[320px] sm:max-w-none"
           style={{ 
             gridTemplateColumns: `repeat(${GRID}, 1fr)`,
             width: 'min(100%, 320px)'
           }}>
        {cells.map((_, i) => {
          const x = i % GRID;
          const y = Math.floor(i / GRID);

          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                aspect-square
                ${isSnake ? "bg-cyan-300" : isFood ? "bg-fuchsia-400 animate-pulse" : "bg-white/10"}
                rounded-[2px] sm:rounded-[3px]
                w-full max-w-[20px] sm:max-w-none
                ${isSnake && alive ? 'animate-pulse' : ''}
              `}
            />
          );
        })}
      </div>

      {/* Controles móviles - Solo visible en móvil o cuando se activa */}
      {(showMobileControls || window.innerWidth < 768) && (
        <div className="mt-4 sm:mt-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-[280px] mx-auto">
            {/* Espacio vacío */}
            <div></div>
            
            {/* Botón arriba */}
            <button
              className="btn-arcade !py-3 !px-0 text-lg sm:text-xl"
              onClick={() => handleMobileDirection({ x: 0, y: -1 })}
              disabled={!alive}
            >
              ⬆️
            </button>
            
            {/* Espacio vacío */}
            <div></div>
            
            {/* Botón izquierda */}
            <button
              className="btn-arcade !py-3 !px-0 text-lg sm:text-xl"
              onClick={() => handleMobileDirection({ x: -1, y: 0 })}
              disabled={!alive}
            >
              ⬅️
            </button>
            
            {/* Botón centro (reset) */}
            <button
              className="btn-arcade !py-3 !px-0 text-lg sm:text-xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30"
              onClick={reset}
            >
              🔁
            </button>
            
            {/* Botón derecha */}
            <button
              className="btn-arcade !py-3 !px-0 text-lg sm:text-xl"
              onClick={() => handleMobileDirection({ x: 1, y: 0 })}
              disabled={!alive}
            >
              ➡️
            </button>
            
            {/* Espacio vacío */}
            <div></div>
            
            {/* Botón abajo */}
            <button
              className="btn-arcade !py-3 !px-0 text-lg sm:text-xl col-start-2"
              onClick={() => handleMobileDirection({ x: 0, y: 1 })}
              disabled={!alive}
            >
              ⬇️
            </button>
          </div>
          
          {/* Botones adicionales */}
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <button
              className="btn-arcade !px-4 !py-2 text-sm bg-cyan-500/20 hover:bg-cyan-500/30"
              onClick={() => handleMobileDirection({ x: 0, y: -1 })}
              disabled={!alive}
            >
              ARRIBA
            </button>
            <button
              className="btn-arcade !px-4 !py-2 text-sm bg-cyan-500/20 hover:bg-cyan-500/30"
              onClick={() => handleMobileDirection({ x: 0, y: 1 })}
              disabled={!alive}
            >
              ABAJO
            </button>
            <button
              className="btn-arcade !px-4 !py-2 text-sm bg-fuchsia-500/20 hover:bg-fuchsia-500/30"
              onClick={reset}
            >
              REINICIAR JUEGO
            </button>
          </div>
        </div>
      )}

      {/* Estado del juego */}
      {!alive && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl bg-black/50 border border-fuchsia-500/30">
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-fuchsia-300 animate-pulse">
              🎮 GAME OVER 🎮
            </p>
            <p className="text-sm sm:text-base text-white/80 mt-1">
              Puntuación final: <span className="text-cyan-200 font-bold">{score}</span>
            </p>
            <button
              className="btn-arcade mt-2 !px-6 !py-3 text-sm sm:text-base bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30"
              onClick={reset}
            >
              🔄 JUGAR DE NUEVO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}