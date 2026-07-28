function EqualizerBars({ isPlaying = false, barCount = 9 }) {
  const bars = Array.from({ length: barCount })

  return (
    <div className="flex items-end gap-[3px] h-8">
      {bars.map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-sm ${isPlaying ? 'animate-eq' : ''}`}
          style={{
            height: isPlaying ? undefined : '4px',
            background: 'linear-gradient(to top, #4ADE80, #FBBF24 60%, #F87171)',
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}

export default EqualizerBars