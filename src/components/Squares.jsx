import { useRef, useEffect, useState } from "react";

const Squares = ({
  direction = "right",
  speed = 1,
  borderColor = "rgba(255, 255, 255, 0.1)",
  squareSize = 40,
  hoverFillColor = "rgba(255, 255, 255, 0.05)",
  gradientColorStart = "#000428",
  gradientColorEnd = "#002545ff"
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquareRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTime = useRef(0);
  const [isActive, setIsActive] = useState(true);

  // Refs untuk nilai props agar bisa diakses di dalam loop tanpa restart effect
  const gradientStartRef = useRef(gradientColorStart);
  const gradientEndRef = useRef(gradientColorEnd);
  const hoverFillRef = useRef(hoverFillColor);
  const borderRef = useRef(borderColor);

  // Update refs saat props berubah
  useEffect(() => {
    gradientStartRef.current = gradientColorStart;
    gradientEndRef.current = gradientColorEnd;
    hoverFillRef.current = hoverFillColor;
    borderRef.current = borderColor;
  }, [gradientColorStart, gradientColorEnd, hoverFillColor, borderColor]);

  // Pause animation saat tab tidak terlihat
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const draw = (timestamp) => {
      if (!ctx) return;

      // Throttle ke 30 FPS
      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed < 33) { // ~30fps
        return; // Just return, let the main loop handle the next frame
      }
      lastFrameTime.current = timestamp - (elapsed % 33);

      timeRef.current = timestamp / 5000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const angle = timeRef.current;
      const r = canvas.width * 0.75;

      const x1 = canvas.width / 2 + Math.cos(angle) * r;
      const y1 = canvas.height / 2 + Math.sin(angle) * r;
      const x2 = canvas.width / 2 - Math.cos(angle) * r;
      const y2 = canvas.height / 2 - Math.sin(angle) * r;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      // Gunakan ref.current untuk warna dinamis
      gradient.addColorStop(0, gradientStartRef.current);
      gradient.addColorStop(1, gradientEndRef.current);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillRef.current;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderRef.current;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      // Move grid update logic here to sync with throttled FPS
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }
    };

    const updateAnimation = (timestamp) => {
      if (!isActive) return; // Stop if not active
      draw(timestamp);
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    // Ambil posisi mouse dari window, bukan dari canvas
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Jika mouse di luar canvas, jangan highlight
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        hoveredSquareRef.current = null;
        return;
      }

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    // Ganti event listener ke window
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [direction, speed, squareSize, isActive]); // Colors removed from dependencies

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full border-none block"
    ></canvas>
  );
};

export default Squares;