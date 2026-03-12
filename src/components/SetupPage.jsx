import { useState, useCallback, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { buildPlayerList, formatDate } from '../utils/helpers'

export default function SetupPage({ onStart, showToast }) {
  const { session, startSession, resetSession } = useStore()

  // Initialize from existing session or defaults
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(session?.date || today)
  const [totalPlayers, setTotalPlayers] = useState(session?.totalPlayers || '')
  const [courts, setCourts] = useState(session?.courts || '')
  // playerNames is a simple array of strings, index-stable
  const [playerNames, setPlayerNames] = useState(() => {
    if (session?.players) return session.players.map(p => p.raw)
    return []
  })

  // When totalPlayers changes, resize the array
  useEffect(() => {
    const n = parseInt(totalPlayers)
    if (!n || n < 1 || n > 50) return
    setPlayerNames(prev => {
      if (prev.length === n) return prev
      if (prev.length < n) return [...prev, ...Array(n - prev.length).fill('')]
      return prev.slice(0, n)
    })
  }, [totalPlayers])

  // Stable change handler — does NOT cause full re-render of siblings
  const handleNameChange = useCallback((idx, value) => {
    setPlayerNames(prev => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }, [])

  const addPlayer = () => {
    setPlayerNames(prev => [...prev, ''])
    setTotalPlayers(prev => {
      const n = parseInt(prev) || 0
      return String(n + 1)
    })
  }

  const removePlayer = (idx) => {
    setPlayerNames(prev => {
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
    setTotalPlayers(prev => {
      const n = parseInt(prev) || 1
      return String(Math.max(1, n - 1))
    })
  }

  // Build numbered preview list
  const builtPlayers = buildPlayerList(playerNames)
  const computedTotal = builtPlayers.reduce((s, p) => s + p.count, 0)

  const handleStart = () => {
    if (!date) { showToast('Chọn ngày đánh!', 'error'); return }
    const c = parseInt(courts)
    if (!c || c < 1) { showToast('Nhập số sân!', 'error'); return }
    const validPlayers = builtPlayers
    if (validPlayers.length === 0) { showToast('Thêm ít nhất 1 người!', 'error'); return }

    startSession({
      date,
      totalPlayers: parseInt(totalPlayers) || computedTotal,
      courts: c,
      players: validPlayers,
    })
    showToast('✅ Bắt đầu buổi đánh!', 'success')
    onStart()
  }

  const handleReset = () => {
    if (!confirm('Reset toàn bộ session? Dữ liệu round sẽ bị xóa.')) return
    resetSession()
    setDate(today)
    setTotalPlayers('')
    setCourts('')
    setPlayerNames([])
    showToast('↺ Đã reset!', 'success')
  }

  return (
    <div className="animate-in" style={{ padding: '16px', maxWidth: 600, margin: '0 auto' }}>

      {/* Session Info Card */}
      <div className="card mb-4">
        <div className="card-title">
          <span>📋</span> THÔNG TIN BUỔI ĐÁNH
        </div>

        <div style={{ marginBottom: 14 }}>
          <label>Ngày đánh</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="grid-2">
          <div>
            <label>Tổng số người</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="VD: 10"
              min="1"
              max="50"
              value={totalPlayers}
              onChange={e => setTotalPlayers(e.target.value)}
            />
          </div>
          <div>
            <label>Số sân đặt</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="VD: 2"
              min="1"
              max="10"
              value={courts}
              onChange={e => setCourts(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Player List Card */}
      <div className="card mb-4">
        <div className="card-title">
          <span>👥</span> DANH SÁCH NGƯỜI CHƠI
          {builtPlayers.length > 0 && (
            <span style={{
              marginLeft: 'auto', fontSize: 12,
              color: 'var(--c-muted)',
              fontFamily: 'var(--font-body)', fontWeight: 600,
            }}>
              {computedTotal} người
            </span>
          )}
        </div>

        {playerNames.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '20px 0',
            color: 'var(--c-muted)', fontSize: 14,
          }}>
            Nhập tổng số người để tự điền ô, hoặc nhấn + THÊM NGƯỜI
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {playerNames.map((name, idx) => (
            <PlayerRow
              key={idx}
              idx={idx}
              allPlayers={playerNames}
              value={name}
              onChange={handleNameChange}
              onRemove={removePlayer}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={addPlayer}>
            + THÊM NGƯỜI
          </button>
          {playerNames.length > 0 && (
            <button
              className="btn btn-outline-red btn-sm"
              onClick={() => { setPlayerNames([]); setTotalPlayers(''); }}
            >
              🗑 XÓA HẾT
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      {builtPlayers.length > 0 && (
        <div className="card mb-4">
          <div className="card-title" style={{ marginBottom: 12 }}>
            <span>👁</span> XEM TRƯỚC
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {builtPlayers.map((p, i) => (
              <div key={i} className="chip">
                <span style={{ color: 'var(--c-muted)', fontSize: 11, marginRight: 5 }}>
                  {p.num}.
                </span>
                {p.raw}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Button */}
      <button
        className="btn btn-primary btn-full"
        style={{ padding: '16px', fontSize: 17, marginBottom: 10 }}
        onClick={handleStart}
      >
        🚀 BẮT ĐẦU BUỔI ĐÁNH
      </button>

      <button
        className="btn btn-outline-red btn-full btn-sm"
        onClick={handleReset}
      >
        ↺ RESET SESSION
      </button>
    </div>
  )
}

// -----------------------------------------------
// PlayerRow — isolated component to prevent re-render lag
// Uses uncontrolled input trick via defaultValue + ref
// -----------------------------------------------
import { useRef, memo } from 'react'
import { parsePlayerEntry } from '../utils/helpers'

const PlayerRow = memo(function PlayerRow({ idx, allPlayers, value, onChange, onRemove }) {
  // Calculate number position
  let num = 1
  for (let i = 0; i < idx; i++) {
    const { count } = parsePlayerEntry(allPlayers[i] || '')
    num += count
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      animation: 'animIn 0.18s ease',
    }}>
      <div style={{
        minWidth: 30, height: 30,
        background: 'var(--c-surface)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: 'var(--c-green)',
        flexShrink: 0,
      }}>
        {num}
      </div>

      <input
        type="text"
        defaultValue={value}
        placeholder='VD: Phú Quí hoặc Việt Anh 2'
        style={{ margin: 0 }}
        onBlur={e => onChange(idx, e.target.value)}
        onChange={e => onChange(idx, e.target.value)}
      />

      <button
        onClick={() => onRemove(idx)}
        style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.2)',
          color: 'var(--c-red)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, transition: 'all 0.15s',
        }}
      >
        ×
      </button>
    </div>
  )
})
