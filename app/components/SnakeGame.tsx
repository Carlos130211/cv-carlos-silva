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

  // Controles
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const cells = useMemo(() => Array.from({ length: GRID * GRID }), []);

  return (
    <div className="mt-4 rounded-2xl bg-black/40 p-4 ring-1 ring-cyan-300/30">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black tracking-widest">🐍 SNAKE</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">
            Score: <span className="text-cyan-200 font-bold">{score}</span>
          </span>
          <button className="btn-arcade !px-3 !py-2 text-xs" onClick={reset}>
            🔁 RESET (R)
          </button>
        </div>
      </div>

      <p className="mt-1 text-xs text-white/60">
        Controles: ⬅️⬆️⬇️➡️ | Reset: <span className="text-cyan-200 font-bold">R</span>
        {!alive && <span className="text-fuchsia-300 font-bold"> — GAME OVER</span>}
      </p>

      <div className="mt-3 grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
        {cells.map((_, i) => {
          const x = i % GRID;
          const y = Math.floor(i / GRID);

          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-4 h-4 rounded-[3px] ${
                isSnake ? "bg-cyan-300" : isFood ? "bg-fuchsia-400" : "bg-white/10"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
