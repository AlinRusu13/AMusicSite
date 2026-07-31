function MixtapeIcon({ trackCount = 0, size = 48 }) {
  const fill = Math.min(1, trackCount / 10)
  const leftRadius = 4 + (1 - fill) * 7
  const rightRadius = 4 + fill * 7

  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 100 62" className="flex-shrink-0">
      <rect x="1" y="1" width="98" height="60" rx="4" fill="#1A1918" stroke="#000" strokeWidth="1" />
      <rect x="8" y="8" width="84" height="30" rx="2" fill="#0B0B0A" opacity="0.6" />
      <circle cx="30" cy="23" r={leftRadius} fill="none" stroke="#7A756C" strokeWidth="1.5" />
      <circle cx="30" cy="23" r="2" fill="#7A756C" />
      <circle cx="70" cy="23" r={rightRadius} fill="none" stroke="#FF3B3B" strokeWidth="1.5" />
      <circle cx="70" cy="23" r="2" fill="#FF3B3B" />
      <rect x="8" y="44" width="84" height="10" rx="1" fill="#E8E4DC" opacity="0.08" />
    </svg>
  )
}

export default MixtapeIcon