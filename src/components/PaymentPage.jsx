import { useState } from 'react'
import { useStore } from '../store/useStore'
import { formatDate } from '../utils/helpers'

export default function PaymentPage({ showToast }) {
  const session = useStore(s => s.session)

  // Pre-fill from session
  const getDefaultDate = () => {
    if (!session?.date) return ''
    const d = new Date(session.date + 'T00:00:00')
    const days = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7']
    return `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
  }

  const [payDate, setPayDate] = useState(getDefaultDate)
  const [courtFee, setCourtFee] = useState('')
  const [shuttlePrice, setShuttlePrice] = useState('')
  const [shuttleCount, setShuttleCount] = useState('')
  const [people, setPeople] = useState(session?.totalPlayers?.toString() || '')
  const [receiver, setReceiver] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const cf = parseFloat(courtFee) || 0
    const sp = parseFloat(shuttlePrice) || 0
    const sc = parseInt(shuttleCount) || 0
    const p = parseInt(people) || 0

    if (!p) { showToast('Nhập số người!', 'error'); return }

    const shuttleFee = sp * sc
    const total = cf + shuttleFee
    const perPerson = Math.ceil(total / p)

    setResult({ cf, sp, sc, shuttleFee, total, perPerson, p })
    showToast('💰 Đã tính xong!', 'success')
  }

  const buildExportText = () => {
    if (!result) return ''
    const { cf, sp, sc, shuttleFee, total, perPerson, p } = result
    const rec = receiver.trim().toUpperCase() || 'NGƯỜI THU TIỀN'
    const players = session?.players || []
    const playerList = players.map(pl => `${pl.num}. ${pl.raw}`).join('\n')

    return `@All CẦU LÔNG ${payDate}

Tiền sân nước: ${cf}k
Tiền cầu: ${sc} x ${sp} = ${shuttleFee}k

Tổng ${total} / ${p} ≈ ${perPerson}k/người

${playerList}

CK BANH ${rec} !!!`
  }

  const copyResult = async () => {
    const text = buildExportText()
    try {
      await navigator.clipboard.writeText(text)
      showToast('📋 Đã copy!', 'success')
    } catch {
      showToast('Không copy được, thử lại!', 'error')
    }
  }

  return (
    <div className="animate-in" style={{ padding: '16px', maxWidth: 600, margin: '0 auto' }}>

      <div className="card mb-4">
        <div className="card-title"><span>🧾</span> THÔNG TIN THANH TOÁN</div>

        <div style={{ marginBottom: 14 }}>
          <label>Ngày đánh</label>
          <input
            type="text"
            value={payDate}
            onChange={e => setPayDate(e.target.value)}
            placeholder="VD: Thứ 3, 10/06/2025"
          />
        </div>

        <div className="grid-2" style={{ marginBottom: 14 }}>
          <div>
            <label>Tiền sân + nước (k)</label>
            <input
              type="number" inputMode="decimal"
              value={courtFee} onChange={e => setCourtFee(e.target.value)}
              placeholder="120"
            />
          </div>
          <div>
            <label>Giá 1 quả cầu (k)</label>
            <input
              type="number" inputMode="decimal"
              value={shuttlePrice} onChange={e => setShuttlePrice(e.target.value)}
              placeholder="6"
            />
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 14 }}>
          <div>
            <label>Số quả cầu</label>
            <input
              type="number" inputMode="numeric"
              value={shuttleCount} onChange={e => setShuttleCount(e.target.value)}
              placeholder="26"
            />
          </div>
          <div>
            <label>Tổng số người</label>
            <input
              type="number" inputMode="numeric"
              value={people} onChange={e => setPeople(e.target.value)}
              placeholder="9"
            />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label>Tên người nhận chuyển khoản</label>
          <input
            type="text"
            value={receiver}
            onChange={e => setReceiver(e.target.value)}
            placeholder="Phú Quí"
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <button className="btn btn-primary btn-full" onClick={calculate}>
          🧮 TÍNH TIỀN
        </button>
      </div>

      {result && (
        <>
          {/* Breakdown */}
          <div className="card mb-4">
            <div className="card-title"><span>📊</span> KẾT QUẢ</div>

            {[
              { label: 'Tiền sân + nước', val: `${result.cf}k` },
              { label: `Tiền cầu (${result.sc} × ${result.sp}k)`, val: `${result.shuttleFee}k` },
              { label: 'Tổng cộng', val: `${result.total}k`, bold: true },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--c-border)',
                fontWeight: row.bold ? 700 : 500,
                fontSize: row.bold ? 17 : 15,
              }}>
                <span style={{ color: 'var(--c-muted)' }}>{row.label}</span>
                <span>{row.val}</span>
              </div>
            ))}

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '16px 0 4px',
              fontWeight: 800, fontSize: 26,
            }}>
              <span>Mỗi người</span>
              <span style={{
                color: 'var(--c-green)',
                textShadow: '0 0 20px var(--c-green-glow)',
                fontFamily: 'var(--font-display)',
                letterSpacing: 1,
              }}>~{result.perPerson}k</span>
            </div>
          </div>

          {/* Export */}
          <div className="card">
            <div className="card-title"><span>📤</span> XUẤT KẾT QUẢ</div>
            <div style={{
              background: 'var(--c-surface)',
              border: '1px solid var(--c-green)',
              borderRadius: 10,
              padding: 16,
              fontFamily: 'monospace',
              fontSize: 14,
              lineHeight: 1.9,
              whiteSpace: 'pre-wrap',
              color: 'var(--c-text)',
              marginBottom: 12,
            }}>
              {buildExportText()}
            </div>
            <button className="btn btn-primary btn-full" onClick={copyResult}>
              📋 COPY RESULT
            </button>
          </div>
        </>
      )}
    </div>
  )
}
