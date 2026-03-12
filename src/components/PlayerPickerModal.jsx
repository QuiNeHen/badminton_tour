export default function PlayerPickerModal({ session, usedPlayers, currentPlayer, target, onPick, onClear, onClose }) {
  if (!target) return null

  const { courtIdx, team } = target

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, letterSpacing: 1,
          }}>
            SÂN {courtIdx + 1} · TEAM {team}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: 'var(--c-muted)', fontSize: 22, cursor: 'pointer', padding: '0 4px',
            }}
          >✕</button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 8,
        }}>
          {session.players.map((p, i) => {
            const isUsed = usedPlayers.has(p.name) && p.name !== currentPlayer
            const isCurrent = p.name === currentPlayer
            return (
              <button
                key={i}
                disabled={isUsed}
                onClick={() => onPick(p.name)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 10,
                  fontSize: 13, fontWeight: 600,
                  background: isCurrent
                    ? 'rgba(0,229,160,0.15)'
                    : isUsed
                    ? 'rgba(255,255,255,0.03)'
                    : 'var(--c-card2)',
                  border: isCurrent
                    ? '1px solid rgba(0,229,160,0.5)'
                    : '1px solid var(--c-border)',
                  color: isCurrent
                    ? 'var(--c-green)'
                    : isUsed
                    ? 'var(--c-muted2)'
                    : 'var(--c-text)',
                  cursor: isUsed ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'center',
                  opacity: isUsed ? 0.4 : 1,
                }}
              >
                {p.name}
              </button>
            )
          })}
        </div>

        {currentPlayer && (
          <button
            className="btn btn-outline-red btn-full btn-sm"
            style={{ marginTop: 14 }}
            onClick={onClear}
          >
            ✕ Bỏ trống vị trí này
          </button>
        )}

        <button
          className="btn btn-ghost btn-full btn-sm"
          style={{ marginTop: 8 }}
          onClick={onClose}
        >
          HỦY
        </button>
      </div>
    </div>
  )
}
