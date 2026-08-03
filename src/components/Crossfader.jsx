import { useDeckStore } from '../store/useDeckStore'

function Crossfader() {
  const crossfader = useDeckStore((s) => s.crossfader)
  const setCrossfader = useDeckStore((s) => s.setCrossfader)

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="flex justify-between w-full max-w-md font-lcd text-sm text-taupe tracking-widest">
        <span className={crossfader < 0.4 ? 'text-phosphor' : ''}>A</span>
        <span className={crossfader > 0.6 ? 'text-phosphor' : ''}>B</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={crossfader}
        onChange={(e) => setCrossfader(Number(e.target.value))}
        className="w-full max-w-md h-2 accent-phosphor cursor-pointer"
      />
    </div>
  )
}

export default Crossfader