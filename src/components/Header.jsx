import { useStore } from '../store/useStore'

export default function Header() {
  const session = useStore(s => s.session)

  return (
    <header style={{
      background: 'rgba(8,14,26,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--c-border)',
      padding: '12px 16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, var(--c-green), #0ea5e9)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          boxShadow: '0 0 20px var(--c-green-glow)',
        }}>🏸</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          letterSpacing: 2,
          background: 'linear-gradient(90deg, var(--c-green), var(--c-blue))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          CẦU LÔNG MGR
        </div>
      </div>

      {session && (
        <div className="badge badge-green badge-pulse">
          ĐANG CHƠI
        </div>
      )}
    </header>
  )
}
