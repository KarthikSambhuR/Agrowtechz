"use client";
import { motion } from "framer-motion";

export function DoodleLeaf({ size = 100, color = "var(--accent-primary)", delay = 0, style = {} }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", ...style }}
      animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.path
        d="M 50 90 C 50 90, 20 60, 20 30 C 20 10, 50 10, 50 10 C 50 10, 80 10, 80 30 C 80 60, 50 90, 50 90 Z"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay }}
      />
      <motion.path
        d="M 50 90 L 50 20"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.5 }}
      />
      <motion.path
        d="M 50 60 L 35 45 M 50 45 L 65 30"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: delay + 1.2 }}
      />
    </motion.svg>
  );
}

export function DoodleWheat({ size = 100, color = "var(--accent-primary)", delay = 0, style = {} }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", ...style }}
      animate={{ rotate: [-2, 2, -2], x: [0, 5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.path
        d="M 30 90 Q 60 50, 70 10"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay }}
      />
      {[
        { d: "M 45 70 Q 30 65, 35 55 Q 45 60, 50 65", del: 0.5 },
        { d: "M 52 55 Q 65 55, 65 45 Q 55 45, 57 52", del: 0.7 },
        { d: "M 58 40 Q 45 40, 48 30 Q 55 35, 62 38", del: 0.9 },
        { d: "M 66 28 Q 80 25, 75 15 Q 68 20, 68 25", del: 1.1 },
      ].map((leaf, i) => (
        <motion.path
          key={i}
          d={leaf.d}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: delay + leaf.del }}
        />
      ))}
    </motion.svg>
  );
}

export function DoodleDrop({ size = 100, color = "#4285F4", delay = 0, style = {} }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", ...style }}
      animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.path
        d="M 50 15 C 50 15, 20 50, 20 65 C 20 81.5, 33.5 95, 50 95 C 66.5 95, 80 81.5, 80 65 C 80 50, 50 15, 50 15 Z"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay }}
      />
      <motion.path
        d="M 65 65 Q 65 80, 50 85"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: delay + 1.5 }}
      />
    </motion.svg>
  );
}

export function DoodleSun({ size = 100, color = "#F59E0B", delay = 0, style = {} }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", ...style }}
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
      <motion.circle
        cx="50" cy="50" r="20"
        fill="none"
        stroke={color}
        strokeWidth={8}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "backOut", delay }}
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.line
          key={i}
          x1="50" y1="20" x2="50" y2="5"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          style={{ transformOrigin: "50px 50px", transform: `rotate(${i * 45}deg)` }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: delay + 1 + (i * 0.1) }}
        />
      ))}
    </motion.svg>
  );
}

export function DoodleStar({ size = 100, color = "#F59E0B", delay = 0, style = {} }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", ...style }}
      animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.path
        d="M 50 10 L 59 38 L 88 43 L 64 61 L 73 89 L 50 73 L 27 89 L 36 61 L 12 43 L 41 38 Z"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 2, ease: "easeOut", delay }}
      />
    </motion.svg>
  );
}

export function DoodleLine({ width = 200, color = "var(--border-line)", delay = 0, style = {} }) {
  return (
    <motion.svg
      width={width}
      height="10"
      viewBox={`0 0 ${width} 10`}
      style={{ overflow: "visible", ...style }}
    >
      <motion.path
        d={`M 0 5 Q ${width/4} 0, ${width/2} 5 T ${width} 5`}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="12 12"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 2, ease: "easeInOut", delay }}
      />
    </motion.svg>
  );
}
