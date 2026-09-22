export default function WavesBackground() {
  return (
    <div className="dw-waves" aria-hidden="true">
      <svg className="dw-wave-svg" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path
          className="dw-wave-path"
          d="M0,96 C240,180 480,20 720,80 C960,140 1200,40 1440,100 L1440,220 L0,220 Z"
          fill="url(#dwWaveGrad1)"
          opacity="0.35"
        />
        <path
          className="dw-wave-path"
          d="M0,140 C300,60 600,180 900,110 C1100,70 1300,140 1440,120 L1440,220 L0,220 Z"
          fill="url(#dwWaveGrad2)"
          opacity="0.25"
          style={{ animationDelay: '1.5s' }}
        />
        <defs>
          <linearGradient id="dwWaveGrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--dw-primary)" />
            <stop offset="100%" stopColor="var(--dw-secondary)" />
          </linearGradient>
          <linearGradient id="dwWaveGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--dw-secondary)" />
            <stop offset="100%" stopColor="var(--dw-accent)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
