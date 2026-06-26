import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  id,
  delay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Mouse positions within the card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt values
  const springConfig = { damping: 25, stiffness: 180, mass: 0.8 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  // Glare overlay positions
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  // Depth push-back (scale and translation into Z-space)
  // When clicked, it sinks back into the screen (scale 0.95, TranslateZ negative)
  const scale = useSpring(isPressed ? 0.94 : isHovered ? 1.02 : 1, springConfig);
  const translateZ = useSpring(isPressed ? -30 : isHovered ? 15 : 0, springConfig);
  const shadowOpacity = useSpring(isPressed ? 0.04 : isHovered ? 0.12 : 0.03, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate relative cursor position from -0.5 to 0.5
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <div
      style={{ perspective: '1200px' }}
      className="w-full h-full"
    >
      <motion.div
        ref={cardRef}
        id={id}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={onClick}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX,
          rotateY,
          scale,
          z: translateZ,
          transformStyle: 'preserve-3d',
          boxShadow: useTransform(
            shadowOpacity,
            (opacity) => `0 ${isHovered ? '24px' : '10px'} ${isHovered ? '48px' : '20px'} rgba(0, 0, 0, ${opacity}), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)`
          ),
          background: 'rgba(255, 255, 255, 0.42)',
          backdropFilter: 'blur(28px) saturate(210%)',
          WebkitBackdropFilter: 'blur(28px) saturate(210%)',
        }}
        className={`relative overflow-hidden cursor-pointer rounded-3xl border border-white/55 ${className}`}
      >
        {/* Dynamic Sheen/Glare Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle 280px at ${gx}% ${gy}%, rgba(255, 255, 255, 0.65), transparent)`
            ),
          }}
        />

        {/* Floating Ambient Highlights */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-brand-green/5 rounded-full blur-xl pointer-events-none" />

        {/* Content wrapper with layer offset for parallax effect */}
        <div 
          style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
          className="relative z-20 w-full h-full"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};


