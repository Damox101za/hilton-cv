import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Explosion particles ───────────────────────────────────────────────────────

function Explosion({ style }) {
  const sparks = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    dx: Math.floor(Math.random() * 80 - 40),
    dy: Math.floor(Math.random() * -50 - 10),
    dur: Math.random() * 1.2 + 0.5,
  }));

  return (
    <div className="absolute z-50 h-2 w-2 pointer-events-none" style={style}>
      {/* horizontal flash */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute -inset-x-10 top-0 m-auto h-px w-20 rounded-full blur-sm"
        style={{ background: 'linear-gradient(to right, transparent, #00d4ff, transparent)' }}
      />
      {/* sparks */}
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: s.dx, y: s.dy, opacity: 0 }}
          transition={{ duration: s.dur, ease: 'easeOut' }}
          className="absolute h-1 w-1 rounded-full"
          style={{ background: 'linear-gradient(to bottom, #00d4ff, #0060a0)' }}
        />
      ))}
    </div>
  );
}

// ── Single beam + collision detection ────────────────────────────────────────

function Beam({ options, containerRef, parentRef }) {
  const beamRef  = useRef(null);
  const [key, setKey] = useState(0);
  const [collision, setCollision] = useState(null);
  const detected = useRef(false);

  // Poll for collision
  useEffect(() => {
    detected.current = false;
    const id = setInterval(() => {
      if (!beamRef.current || !containerRef.current || !parentRef.current) return;
      if (detected.current) return;

      const bRect = beamRef.current.getBoundingClientRect();
      const cRect = containerRef.current.getBoundingClientRect();
      const pRect = parentRef.current.getBoundingClientRect();

      if (bRect.bottom >= cRect.top) {
        detected.current = true;
        setCollision({
          x: bRect.left - pRect.left + bRect.width / 2,
          y: bRect.bottom - pRect.top,
        });
        // clear explosion after 1.5 s
        setTimeout(() => setCollision(null), 1500);
        // restart beam after repeatDelay
        setTimeout(
          () => { setKey(k => k + 1); detected.current = false; },
          ((options.repeatDelay ?? 0) + 1) * 1000,
        );
      }
    }, 40);
    return () => clearInterval(id);
  }, [key, containerRef, parentRef, options.repeatDelay]);

  return (
    <>
      <motion.div
        key={key}
        ref={beamRef}
        style={{ left: options.x ?? 0 }}
        className="absolute top-0"
        initial={{ translateY: '-10%', opacity: 1 }}
        animate={{ translateY: '110%', opacity: 1 }}
        transition={{
          duration:    options.duration    ?? 8,
          delay:       options.delay       ?? 0,
          ease:        'linear',
          repeat:      0,
        }}
      >
        {/* beam body */}
        <div
          style={{
            width:      options.width ?? 2,
            height:     options.height ?? 80,
            background: `linear-gradient(to bottom, transparent, ${options.color ?? '#00d4ff'}, transparent)`,
            boxShadow:  `0 0 8px 1px ${options.color ?? '#00d4ff'}`,
            borderRadius: 9999,
          }}
        />
      </motion.div>

      <AnimatePresence>
        {collision && (
          <Explosion
            key={`${collision.x}-${collision.y}`}
            style={{
              left:      collision.x,
              top:       collision.y,
              transform: 'translate(-50%, -50%)',
              position:  'absolute',
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

export default function BackgroundBeamsWithCollision({ children, className = '' }) {
  const parentRef    = useRef(null);
  const containerRef = useRef(null);

  const beams = [
    { x:  60,  duration: 6,  delay: 0,   repeatDelay: 4, height: 90,  width: 2,   color: '#00d4ff' },
    { x: 200,  duration: 9,  delay: 1.5, repeatDelay: 3, height: 60,  width: 1.5, color: '#a855f7' },
    { x: 380,  duration: 7,  delay: 0.5, repeatDelay: 5, height: 100, width: 2,   color: '#00d4ff' },
    { x: 560,  duration: 5,  delay: 3,   repeatDelay: 6, height: 70,  width: 1.5, color: '#60a5fa' },
    { x: 720,  duration: 10, delay: 1,   repeatDelay: 2, height: 120, width: 2,   color: '#a855f7' },
    { x: 900,  duration: 6,  delay: 2.5, repeatDelay: 5, height: 80,  width: 1.5, color: '#00d4ff' },
    { x: 1080, duration: 8,  delay: 0.8, repeatDelay: 4, height: 90,  width: 2,   color: '#60a5fa' },
    { x: 1240, duration: 5,  delay: 3.5, repeatDelay: 3, height: 60,  width: 1.5, color: '#00d4ff' },
  ];

  return (
    <div
      ref={parentRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {beams.map((b, i) => (
        <Beam
          key={i}
          options={b}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {/* content sits above the beams */}
      <div className="relative z-10">{children}</div>

      {/* collision surface — beams explode when they reach this */}
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
      />
    </div>
  );
}
