const seeds = [
  { top: '10%', left: '15%', size: 6, delay: '0s' },
  { top: '25%', left: '80%', size: 10, delay: '1s' },
  { top: '60%', left: '10%', size: 5, delay: '2s' },
  { top: '75%', left: '65%', size: 8, delay: '0.5s' },
  { top: '40%', left: '45%', size: 4, delay: '3s' },
  { top: '85%', left: '30%', size: 7, delay: '1.5s' },
];

export default function Particles() {
  return (
    <div className="dw-particles" aria-hidden="true">
      {seeds.map((s, i) => (
        <span
          key={i}
          className="dw-particle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
    </div>
  );
}
