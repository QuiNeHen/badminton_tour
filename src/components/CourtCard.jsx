import { getWarnings } from '../utils/helpers'

export default function CourtCard({ rounds, roundIdx, courtIdx, onSlotClick }) {
  const court = rounds[roundIdx]?.courts[courtIdx]
  if (!court) return null
  const warnings = getWarnings(rounds, roundIdx, courtIdx)

  const SlotButton = ({ team, slotIdx }) => {
    const arr = team === 'A' ? court.teamA : court.teamB
    const player = arr[slotIdx]
    const color = team === 'A' ? 'var(--c-green)' : 'var(--c-blue)'

    return (
      <button
        onClick={() => onSlotClick(courtIdx, team, slotIdx)}
        style={{
          width: '100%',
          minHeight: 40,
          padding: '8px 12px',
          marginBottom: 6,
          borderRadius: 8,
          background: player ? 'var(--c-card2)' : 'var(--c-surface)',
          border: player
            ? `1px solid ${color}40`
            : '1px dashed var(--c-border)',
          borderLeft: player ? `3px solid ${color}` : undefined,
          color: player ? 'var(--c-text)' : 'var(--c-muted2)',
          fontSize: player ? 14 : 12,
          fontWeight: player ? 600 : 400,
          textAlign: 'left',
          transition: 'all 0.15s',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}
      >
        {player || 'Chạm để chọn'}
      </button>
    )
  }

  return (
    <div style={{
      background: 'var(--c-card)',
      border: '1px solid var(--c-border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,229,160,0.08), rgba(56,189,248,0.06))',
        borderBottom: '1px solid var(--c-border)',
        padding: '11px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--font-display)',
        fontSize: 18, letterSpacing: 1.5,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: 'var(--c-green)',
          boxShadow: '0 0 8px var(--c-green)',
        }} />
        SÂN {courtIdx + 1}
      </div>

      {/* Warnings */}
      {warnings.map((w, i) => (
        <div key={i} style={{
          margin: '8px 10px 0',
          padding: '8px 12px',
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.25)',
          borderRadius: 8,
          fontSize: 12, color: 'var(--c-amber)',
          display: 'flex', gap: 6,
        }}>
          ⚠️ {w}
        </div>
      ))}

      {/* Teams */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Team A */}
        <div style={{
          padding: 14,
          borderRight: '1px solid var(--c-border)',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13, letterSpacing: 1,
            color: 'var(--c-green)',
            marginBottom: 10,
          }}>TEAM A 🟢</div>
          <SlotButton team="A" slotIdx={0} />
          <SlotButton team="A" slotIdx={1} />
        </div>

        {/* Team B */}
        <div style={{ padding: 14 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13, letterSpacing: 1,
            color: 'var(--c-blue)',
            marginBottom: 10,
          }}>TEAM B 🔵</div>
          <SlotButton team="B" slotIdx={0} />
          <SlotButton team="B" slotIdx={1} />
        </div>
      </div>
    </div>
  )
}
