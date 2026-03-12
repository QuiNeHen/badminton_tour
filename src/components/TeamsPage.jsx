import { useState } from 'react'
import { useStore } from '../store/useStore'
import { getUsedInRound, formatDate } from '../utils/helpers'
import CourtCard from './CourtCard'
import PlayerPickerModal from './PlayerPickerModal'

export default function TeamsPage({ showToast }) {
  const {
    session, rounds, currentRound,
    addRound, setCurrentRound, resetRounds, randomTeams,
    assignPlayer, clearSlot,
  } = useStore()

  const [pickerTarget, setPickerTarget] = useState(null)
  // pickerTarget = { courtIdx, team, slotIdx }

  if (!session) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--c-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏸</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Cần setup session trước!</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Qua tab Setup → Nhấn BẮT ĐẦU</div>
      </div>
    )
  }

  const d = new Date(session.date + 'T00:00:00')
  const days = ['CN','T2','T3','T4','T5','T6','T7']
  const dateLabel = `${days[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`

  const round = rounds[currentRound]
  const usedInRound = round ? getUsedInRound(round) : new Set()

  const handleSlotClick = (courtIdx, team, slotIdx) => {
    setPickerTarget({ courtIdx, team, slotIdx })
  }

  const handlePick = (playerName) => {
    if (!pickerTarget) return
    const { courtIdx, team, slotIdx } = pickerTarget
    assignPlayer(currentRound, courtIdx, team, slotIdx, playerName)
    setPickerTarget(null)
    showToast(`✅ Đã chọn ${playerName}`, 'success')
  }

  const handleClear = () => {
    if (!pickerTarget) return
    const { courtIdx, team, slotIdx } = pickerTarget
    clearSlot(currentRound, courtIdx, team, slotIdx)
    setPickerTarget(null)
  }

  const handleAddRound = () => {
    addRound()
    showToast(`✅ Đã thêm Round ${rounds.length + 1}`, 'success')
  }

  const handleRandom = () => {
    randomTeams()
    showToast('🎲 Đã random đội ngẫu nhiên!', 'success')
  }

  const handleReset = () => {
    if (!confirm('Xóa hết round? Giữ danh sách người chơi.')) return
    resetRounds()
    showToast('↺ Đã reset round!', 'success')
  }

  // Current player in the target slot
  const currentSlotPlayer = pickerTarget && round
    ? round.courts[pickerTarget.courtIdx]?.[pickerTarget.team === 'A' ? 'teamA' : 'teamB']?.[pickerTarget.slotIdx]
    : null

  return (
    <div className="animate-in" style={{ padding: '16px', maxWidth: 600, margin: '0 auto' }}>

      {/* Session Info Strip */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
        marginBottom: 14, padding: '10px 14px',
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        borderRadius: 'var(--radius-sm)',
      }}>
        {[
          { icon: '📅', val: dateLabel },
          { icon: '👥', val: `${session.totalPlayers} người` },
          { icon: '🏸', val: `${session.courts} sân` },
        ].map((item, i) => (
          <div key={i} style={{ fontSize: 13, color: 'var(--c-muted)', display: 'flex', gap: 5 }}>
            <span>{item.icon}</span><span>{item.val}</span>
          </div>
        ))}
      </div>

      {/* Round Nav */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        marginBottom: 12, paddingBottom: 4,
      }}>
        {rounds.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentRound(i)}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--font-display)',
              letterSpacing: 0.5,
              background: i === currentRound
                ? 'rgba(0,229,160,0.12)'
                : 'var(--c-card2)',
              border: i === currentRound
                ? '1px solid rgba(0,229,160,0.4)'
                : '1px solid var(--c-border)',
              color: i === currentRound ? 'var(--c-green)' : 'var(--c-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Round {i + 1}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <button className="btn btn-outline-green btn-sm" onClick={handleAddRound}>+ ROUND</button>
        <button className="btn btn-outline-blue btn-sm" onClick={handleRandom}>🎲 RANDOM</button>
        <button className="btn btn-outline-amber btn-sm" onClick={handleReset}>↺ RESET</button>
      </div>

      {/* Round Title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 28, letterSpacing: 2,
        color: 'var(--c-green)',
        marginBottom: 14,
        textShadow: '0 0 30px var(--c-green-glow)',
      }}>
        ROUND {currentRound + 1}
      </div>

      {/* Courts */}
      {round?.courts.map((_, ci) => (
        <CourtCard
          key={ci}
          rounds={rounds}
          roundIdx={currentRound}
          courtIdx={ci}
          onSlotClick={handleSlotClick}
        />
      ))}

      {/* Player Pool */}
      <div className="card" style={{ marginTop: 4 }}>
        <div className="card-title" style={{ marginBottom: 12 }}>
          <span>🃏</span> NGƯỜI CHƠI
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 8 }}>
          {session.players.map((p, i) => (
            <div
              key={i}
              className={`chip ${usedInRound.has(p.name) ? 'chip-used' : 'chip-green'}`}
            >
              {p.name}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>
          Nhấn vào ô trong sân để chọn người
        </div>
      </div>

      {/* Round History */}
      {rounds.length > 1 && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16, letterSpacing: 1,
            color: 'var(--c-muted)',
            marginBottom: 10,
          }}>LỊCH SỬ ROUND</div>
          {rounds.map((r, ri) => {
            if (ri === currentRound) return null
            const isEmpty = r.courts.every(c =>
              c.teamA.every(p => !p) && c.teamB.every(p => !p)
            )
            if (isEmpty) return null
            return (
              <div key={ri} style={{ marginBottom: 12 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: 'var(--c-muted)',
                  borderLeft: '3px solid var(--c-green)',
                  paddingLeft: 10, marginBottom: 8,
                }}>Round {ri + 1}</div>
                {r.courts.map((c, ci) => {
                  const teamA = c.teamA.filter(Boolean)
                  const teamB = c.teamB.filter(Boolean)
                  if (!teamA.length && !teamB.length) return null
                  return (
                    <div key={ci} style={{
                      background: 'var(--c-card)',
                      border: '1px solid var(--c-border)',
                      borderRadius: 10,
                      padding: '10px 14px',
                      marginBottom: 6,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ fontSize: 12, color: 'var(--c-muted)', fontWeight: 700, minWidth: 40 }}>
                        Sân {ci + 1}
                      </span>
                      <span style={{ color: 'var(--c-green)', fontWeight: 700, fontSize: 14 }}>
                        {teamA.join(' + ') || '—'}
                      </span>
                      <span style={{
                        background: 'rgba(251,191,36,0.12)',
                        border: '1px solid rgba(251,191,36,0.25)',
                        color: 'var(--c-amber)',
                        padding: '2px 8px', borderRadius: 6,
                        fontSize: 11, fontWeight: 700,
                      }}>VS</span>
                      <span style={{ color: 'var(--c-blue)', fontWeight: 700, fontSize: 14 }}>
                        {teamB.join(' + ') || '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {pickerTarget && (
        <PlayerPickerModal
          session={session}
          usedPlayers={usedInRound}
          currentPlayer={currentSlotPlayer}
          target={pickerTarget}
          onPick={handlePick}
          onClear={handleClear}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  )
}
