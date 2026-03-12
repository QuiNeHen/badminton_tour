const TABS = [
  { id: 'setup', icon: '⚙️', label: 'SETUP' },
  { id: 'teams', icon: '🏟️', label: 'XẾP ĐỘI' },
  { id: 'payment', icon: '💰', label: 'TÍNH TIỀN' },
]

export default function TabBar({ active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(8,14,26,0.9)',
      borderBottom: '1px solid var(--c-border)',
      position: 'sticky',
      top: 64,
      zIndex: 99,
      overflowX: 'auto',
    }}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1,
            padding: '11px 8px',
            background: 'none',
            border: 'none',
            borderBottom: active === t.id ? '3px solid var(--c-green)' : '3px solid transparent',
            color: active === t.id ? 'var(--c-green)' : 'var(--c-muted)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            letterSpacing: 0.8,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            minWidth: 80,
          }}
        >
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  )
}
