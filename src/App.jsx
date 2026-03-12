import { useState } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import SetupPage from './components/SetupPage'
import TeamsPage from './components/TeamsPage'
import PaymentPage from './components/PaymentPage'
import ToastContainer from './components/Toast'
import { useToast } from './hooks/useToast'
import './styles/global.css'

export default function App() {
  const [tab, setTab] = useState('setup')
  const { toasts, show: showToast } = useToast()

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="bg-glow" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        <TabBar active={tab} onChange={setTab} />

        {tab === 'setup' && (
          <SetupPage
            onStart={() => setTab('teams')}
            showToast={showToast}
          />
        )}
        {tab === 'teams' && (
          <TeamsPage showToast={showToast} />
        )}
        {tab === 'payment' && (
          <PaymentPage showToast={showToast} />
        )}
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  )
}
