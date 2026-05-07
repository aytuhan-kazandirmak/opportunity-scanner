"use client";

import { useRef, useEffect } from "react";

const CONTINENTS = [
  "............................................................",
  "............................................................",
  "...........#####.#####....##########........................",
  ".........#############..##############......................",
  "........###############################...................##",
  ".......##############################.....................##",
  "........############################......................##",
  ".........##########################.........###............#",
  "..........#######################...........###.............",
  "...........####################..............##.............",
  "..............##############...##.............#.............",
  "................##########....####...........###............",
  "..................######....######............##............",
  "...................####...########............##............",
  "....................##....########.............#............",
  ".....................#....########..........................",
  "...........................#######..........................",
  "............................######...........###............",
  ".............................#####...........####...........",
  "..............................####...........####...........",
  "...............................##.............##............",
  "................................#...........................",
  "............................................................",
  ".......######...........................................###.",
  ".....##########.......................................######",
  "...##############...................................########",
  "..################................................##########",
  "...##############..................................#########",
  ".....##########.......................................######",
  "............................................................",
];

const HOTSPOTS = [
  { lat: 37, lon: -122 },
  { lat: 40, lon: -74 },
  { lat: 51, lon: -1 },
  { lat: 41, lon: 29 },
  { lat: 35, lon: 139 },
  { lat: 1, lon: 103 },
  { lat: -23, lon: -46 },
  { lat: 19, lon: 77 },
  { lat: 52, lon: 13 },
  { lat: -33, lon: 151 },
];

const MAP_W = 60;
const MAP_H = CONTINENTS.length;

type PixelGlobeProps = {
  size?: number;
  speed?: number;
  accent?: string;
  theme?: "light" | "dark";
  style?: "pixel" | "modern" | "minimal";
};

export function PixelGlobe({
  size = 400,
  speed = 0.25,
  accent = "#00c87a",
  theme = "light",
  style = "pixel",
}: PixelGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const PIXEL_SIZE = style === "pixel" ? 8 : style === "minimal" ? 4 : 6;
    const RES = Math.floor(size / PIXEL_SIZE);
    const R = RES / 2 - 1;
    const cx = RES / 2;
    const cy = RES / 2;

    canvas.width = size;
    canvas.height = size;

    const isLight = theme === "light";
    const landDark = isLight ? "#1a1814" : "#f0e9dc";
    const landLight = isLight ? "#3a352c" : "#cfc6b4";
    const seaDot = isLight ? "#bfb6a3" : "#3a352c";
    const outline = isLight ? "#1a1814" : "#f0e9dc";

    let last = performance.now();

    const sample = (lat: number, lon: number): boolean => {
      const u = ((lon + Math.PI) / (2 * Math.PI)) * MAP_W;
      const v = ((Math.PI / 2 - lat) / Math.PI) * MAP_H;
      const ix = Math.floor(u) % MAP_W;
      const iy = Math.max(0, Math.min(MAP_H - 1, Math.floor(v)));
      const row = CONTINENTS[iy];
      return row[ix < 0 ? ix + MAP_W : ix] === "#";
    };

    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      rotRef.current += dt * speed;
      const rot = rotRef.current;

      ctx.clearRect(0, 0, size, size);

      for (let py = 0; py < RES; py++) {
        for (let px = 0; px < RES; px++) {
          const dx = px - cx + 0.5;
          const dy = py - cy + 0.5;
          const d2 = dx * dx + dy * dy;
          const r2 = R * R;

          if (d2 > r2) {
            if (style !== "minimal" && (px + py) % 7 === 0 && d2 < r2 * 1.25) {
              ctx.fillStyle = seaDot;
              ctx.fillRect(px * PIXEL_SIZE, py * PIXEL_SIZE, 1, 1);
            }
            continue;
          }

          const nx = dx / R;
          const ny = dy / R;
          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          const lat = Math.asin(ny);
          const lonRaw = Math.atan2(nx, nz) + rot;
          let lonN = (lonRaw + Math.PI) % (2 * Math.PI);
          if (lonN < 0) lonN += 2 * Math.PI;
          lonN -= Math.PI;

          const isLand = sample(lat, lonN);
          const light = nz * 0.6 + (1 - Math.abs(ny)) * 0.4;

          if (isLand) {
            ctx.fillStyle = light > 0.55 ? landDark : landLight;
            ctx.fillRect(
              px * PIXEL_SIZE,
              py * PIXEL_SIZE,
              PIXEL_SIZE,
              PIXEL_SIZE,
            );
          } else {
            if (style === "pixel") {
              if ((px + py) % 2 === 0) {
                ctx.fillStyle = seaDot;
                ctx.fillRect(px * PIXEL_SIZE + 1, py * PIXEL_SIZE + 1, 1, 1);
              }
            } else if (style === "modern") {
              if (px % 2 === 0 && py % 2 === 0) {
                ctx.fillStyle = seaDot;
                ctx.fillRect(px * PIXEL_SIZE + 1, py * PIXEL_SIZE + 1, 2, 2);
              }
            }
          }
        }
      }

      ctx.strokeStyle = outline;
      ctx.lineWidth = PIXEL_SIZE;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, R * PIXEL_SIZE, 0, Math.PI * 2);
      ctx.stroke();

      HOTSPOTS.forEach((h, i) => {
        const hlat = (h.lat * Math.PI) / 180;
        const hlon = (h.lon * Math.PI) / 180 - rot;
        const hx = Math.cos(hlat) * Math.sin(hlon);
        const hy = -Math.sin(hlat);
        const hz = Math.cos(hlat) * Math.cos(hlon);
        if (hz < 0.05) return;

        const sxR = size / 2 + hx * R * PIXEL_SIZE;
        const syR = size / 2 + hy * R * PIXEL_SIZE;
        const sx = Math.round(sxR / PIXEL_SIZE) * PIXEL_SIZE;
        const sy = Math.round(syR / PIXEL_SIZE) * PIXEL_SIZE;

        const phase = now / 600 + i * 0.7;
        const ring = Math.floor(phase % 4);

        if (ring > 0) {
          const r = ring * PIXEL_SIZE;
          const alpha = 1 - ring / 4;
          const hex = Math.floor(alpha * 200)
            .toString(16)
            .padStart(2, "0");
          ctx.fillStyle = accent + hex;
          ctx.fillRect(sx - r, sy - r, r * 2 + PIXEL_SIZE, PIXEL_SIZE);
          ctx.fillRect(sx - r, sy + r, r * 2 + PIXEL_SIZE, PIXEL_SIZE);
          ctx.fillRect(sx - r, sy - r, PIXEL_SIZE, r * 2 + PIXEL_SIZE);
          ctx.fillRect(sx + r, sy - r, PIXEL_SIZE, r * 2 + PIXEL_SIZE);
        }

        const grad = ctx.createRadialGradient(
          sx + PIXEL_SIZE / 2,
          sy + PIXEL_SIZE / 2,
          0,
          sx + PIXEL_SIZE / 2,
          sy + PIXEL_SIZE / 2,
          PIXEL_SIZE * 4,
        );
        grad.addColorStop(0, accent + "cc");
        grad.addColorStop(0.5, accent + "44");
        grad.addColorStop(1, accent + "00");
        ctx.fillStyle = grad;
        ctx.fillRect(
          sx - PIXEL_SIZE * 4,
          sy - PIXEL_SIZE * 4,
          PIXEL_SIZE * 9,
          PIXEL_SIZE * 9,
        );

        ctx.fillStyle = accent;
        ctx.fillRect(
          sx - PIXEL_SIZE,
          sy - PIXEL_SIZE,
          PIXEL_SIZE * 2,
          PIXEL_SIZE * 2,
        );
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
          sx - PIXEL_SIZE / 2,
          sy - PIXEL_SIZE / 2,
          PIXEL_SIZE,
          PIXEL_SIZE,
        );
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, speed, accent, theme, style]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        display: "block",
      }}
    />
  );
}
