import React, { useEffect, useRef } from 'react';

const BinaryRain = () => {
  console.log("BinaryRain rendering");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 20);
    const drops = new Array(columns).fill(0);
    const chars = "01$#@!%&*()_+-=[]{}|;:,.<>?/¥§¶ΔΩΘ";

    const draw = () => {
      if (!ctx) return;
    // Slightly more transparent background for better trail visibility
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Randomly choose between primary neon cyan and a secondary neon purple
        const isCyan = Math.random() > 0.1;
        const baseColor = isCyan ? "#00f2ff" : "#7000ff";
        
        // Vary font size slightly for depth
        const fontSize = 14 + Math.random() * 6;
        ctx.font = `bold ${fontSize}px JetBrains Mono`;

        // Highlight the "head" of the drop
        // We use a white color and stronger glow for the most recent character
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#ffffff";
        } else {
          ctx.fillStyle = baseColor + "aa"; // 0.66 opacity
          ctx.shadowBlur = 8;
          ctx.shadowColor = baseColor;
        }

        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
        
        // Reset shadow for performance in next iterations
        ctx.shadowBlur = 0;
      }
    };

    let animationId;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-100 z-[-10]"
    />
  );
};

export default BinaryRain;
