import { useMemo } from "react";

interface Props {
  decorationType: string;
  animationType: string;
  isRamadan?: boolean;
}

const FestivalDecorations = ({ decorationType, animationType, isRamadan }: Props) => {
  const elements = useMemo(() => {
    const count = 12;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 8.3) + Math.random() * 5}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 4}s`,
      size: 8 + Math.random() * 12,
    }));
  }, []);

  if (decorationType === "none" && animationType === "none") return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" aria-hidden>
      {/* Glow overlay for Ramadan */}
      {isRamadan && (
        <div className="absolute inset-0 animate-soft-glow opacity-30 bg-gradient-to-b from-yellow-500/10 via-transparent to-yellow-500/5" />
      )}

      {/* Lanterns */}
      {decorationType === "lanterns" && elements.slice(0, 8).map((el) => (
        <div
          key={el.id}
          className="absolute animate-float"
          style={{ left: el.left, top: "-20px", animationDelay: el.delay, animationDuration: el.duration }}
        >
          <svg width={el.size} height={el.size * 1.5} viewBox="0 0 24 36" fill="none">
            <rect x="8" y="0" width="8" height="3" rx="1" fill="hsl(25 100% 50% / 0.8)" />
            <ellipse cx="12" cy="18" rx="10" ry="14" fill="hsl(25 100% 50% / 0.6)" />
            <ellipse cx="12" cy="18" rx="6" ry="10" fill="hsl(45 100% 70% / 0.4)" />
          </svg>
        </div>
      ))}

      {/* Stars */}
      {(decorationType === "stars" || isRamadan) && elements.map((el) => (
        <div
          key={el.id}
          className="absolute animate-float opacity-60"
          style={{ left: el.left, top: `${10 + Math.random() * 60}%`, animationDelay: el.delay, animationDuration: el.duration }}
        >
          <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill="hsl(45 100% 70% / 0.7)">
            <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" />
          </svg>
        </div>
      ))}

      {/* Lights / twinkling */}
      {decorationType === "lights" && elements.map((el) => (
        <div
          key={el.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: el.left,
            top: `${5 + Math.random() * 30}%`,
            width: el.size * 0.5,
            height: el.size * 0.5,
            backgroundColor: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6b6b"][el.id % 5],
            animationDelay: el.delay,
            animationDuration: el.duration,
          }}
        />
      ))}

      {/* Confetti */}
      {decorationType === "confetti" && elements.map((el) => (
        <div
          key={el.id}
          className="absolute animate-confetti-fall"
          style={{
            left: el.left,
            top: "-10px",
            width: el.size * 0.4,
            height: el.size * 0.8,
            backgroundColor: ["hsl(25 100% 50%)", "hsl(195 75% 37%)", "hsl(45 100% 50%)", "hsl(340 80% 55%)", "hsl(120 60% 50%)"][el.id % 5],
            animationDelay: el.delay,
            animationDuration: `${6 + Math.random() * 4}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Alpana - corner patterns */}
      {decorationType === "alpana" && (
        <>
          <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
            <svg viewBox="0 0 100 100" fill="none" stroke="hsl(0 80% 50% / 0.6)" strokeWidth="1.5">
              <circle cx="0" cy="0" r="30" /><circle cx="0" cy="0" r="50" />
              <circle cx="0" cy="0" r="70" /><circle cx="0" cy="0" r="90" />
              <path d="M0 0 L100 100 M0 50 L50 0 M50 0 L100 50" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 rotate-180">
            <svg viewBox="0 0 100 100" fill="none" stroke="hsl(0 80% 50% / 0.6)" strokeWidth="1.5">
              <circle cx="0" cy="0" r="30" /><circle cx="0" cy="0" r="50" />
              <circle cx="0" cy="0" r="70" /><circle cx="0" cy="0" r="90" />
              <path d="M0 0 L100 100 M0 50 L50 0 M50 0 L100 50" />
            </svg>
          </div>
        </>
      )}

      {/* Background glow animation */}
      {animationType === "glow" && (
        <div className="absolute inset-0 animate-soft-glow opacity-20 bg-radial-gradient" />
      )}
    </div>
  );
};

export default FestivalDecorations;
