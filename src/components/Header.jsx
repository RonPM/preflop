export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <Logo />
        <span className="brand-name">Preflop</span>
      </div>
      <span className="badge">Calcul exact</span>
    </header>
  );
}

// Logo : deux cartes, une par joueur, aux couleurs de chacun.
function Logo() {
  return (
    <svg className="logo" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="7" y="9" width="15" height="21" rx="3" fill="var(--p1)" transform="rotate(-10 14 20)" />
      <rect x="18" y="9" width="15" height="21" rx="3" fill="var(--p2)" transform="rotate(10 26 20)" />
      <text x="25.5" y="25" fontSize="11" fontWeight="700" fill="var(--bg)" textAnchor="middle">%</text>
    </svg>
  );
}
