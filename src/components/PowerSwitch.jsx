function PowerSwitch({ isOn, onToggle }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className="switch-groove relative w-11 h-6 rounded-full flex items-center px-0.5 transition-colors"
      >
        <span
          className={`w-5 h-5 rounded-full transition-all duration-200 ${
            isOn
              ? 'translate-x-5 bg-phosphor shadow-[0_0_8px_rgba(107,255,143,0.8)]'
              : 'translate-x-0 bg-taupe'
          }`}
        />
      </button>
      <span className="font-lcd text-sm tracking-widest text-taupe">
        {isOn ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

export default PowerSwitch