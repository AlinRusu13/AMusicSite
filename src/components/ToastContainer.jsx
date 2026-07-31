import { useToastStore } from '../store/useToastStore'

function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] flex flex-col-reverse gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="metal-panel-raised border border-black/50 rounded-full px-4 py-2 font-lcd text-phosphor text-lg tracking-wide [text-shadow:0_0_6px_rgba(255,59,59,0.5)] shadow-[0_8px_20px_rgba(0,0,0,0.5)] animate-toast-in"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default ToastContainer