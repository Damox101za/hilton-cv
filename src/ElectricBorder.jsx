import React, { useRef, useEffect } from 'react';

function turb(x, y) {
  return (
    Math.sin(x * 7.31 + y * 3.17) * Math.sin(x * 2.93 - y * 5.41) +
    Math.sin(x * 13.7 - y * 2.83) * 0.4
  );
}

function fbm(x, y, octaves = 5) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * turb(x * freq, y * freq);
    amp  *= 0.5;
    freq *= 2.13;
  }
  return v;
}

export default function ElectricBorder({
  children,
  color     = '#00d4ff',
  speed     = 1,
  chaos     = 0.3,
  thickness = 4,
  style,
  className,
}) {
  const wrapRef   = useRef(null);
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx   = canvas.getContext('2d');
    const PAD   = 28;
    const STEPS = 220;
    let W = 0, H = 0;

    const resize = () => {
      W = wrap.offsetWidth;
      H = wrap.offsetHeight;
      canvas.width  = W + PAD * 2;
      canvas.height = H + PAD * 2;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const draw = (ts) => {
      const t = ts * 0.001 * speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!W || !H) { rafRef.current = requestAnimationFrame(draw); return; }

      const perimeter = 2 * (W + H);
      const disp = chaos * 36;

      // Build one single path
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const prog = i / STEPS;
        const d    = prog * perimeter;
        let bx, by, nx = 0, ny = 0;

        if (d < W)              { bx = d;          by = 0;           ny = -1; }
        else if (d < W + H)     { bx = W;          by = d - W;       nx =  1; }
        else if (d < 2*W + H)   { bx = W-(d-W-H); by = H;           ny =  1; }
        else                    { bx = 0;          by = H-(d-2*W-H); nx = -1; }

        const nHi = fbm(prog * 20 + t * 4.0, t * 2.8);
        const nLo = fbm(prog *  3 + t * 1.2, t * 0.8);
        const n   = nHi * 0.65 + nLo * 0.35;

        const px = PAD + bx + nx * n * disp;
        const py = PAD + by + ny * n * disp;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();

      const flicker = 0.82 + 0.18 * Math.sin(t * 9.1) * Math.sin(t * 16.3);

      // Pass 1 — wide diffuse halo
      ctx.save();
      ctx.shadowBlur  = 24;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth   = thickness * 4;
      ctx.globalAlpha = 0.18 * flicker;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Pass 2 — solid glowing body
      ctx.save();
      ctx.shadowBlur  = 10;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth   = thickness;
      ctx.globalAlpha = 0.85 * flicker;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Pass 3 — bright white-hot core
      ctx.save();
      ctx.shadowBlur  = 3;
      ctx.shadowColor = '#fff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth   = thickness * 0.35;
      ctx.globalAlpha = 0.65 * flicker;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [color, speed, chaos, thickness]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: 'relative', isolation: 'isolate', ...style }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position     : 'absolute',
          top          : '-28px',
          left         : '-28px',
          pointerEvents: 'none',
          zIndex       : 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
