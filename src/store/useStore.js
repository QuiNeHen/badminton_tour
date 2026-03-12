import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const EMPTY_COURT = () => ({ teamA: [null, null], teamB: [null, null] })
const NEW_ROUND = (numCourts) => ({
  courts: Array.from({ length: numCourts }, EMPTY_COURT)
})

export const useStore = create(
  persist(
    (set, get) => ({
      // Session info
      session: null,
      rounds: [],
      currentRound: 0,

      setSession: (session) => set({ session }),

      startSession: (data) => {
        const { players, courts } = data
        set({
          session: data,
          rounds: [NEW_ROUND(courts)],
          currentRound: 0,
        })
      },

      resetSession: () => set({ session: null, rounds: [], currentRound: 0 }),

      // Round management
      addRound: () => {
        const { session, rounds } = get()
        if (!session) return
        const newRounds = [...rounds, NEW_ROUND(session.courts)]
        set({ rounds: newRounds, currentRound: newRounds.length - 1 })
      },

      setCurrentRound: (idx) => set({ currentRound: idx }),

      resetRounds: () => {
        const { session } = get()
        if (!session) return
        set({ rounds: [NEW_ROUND(session.courts)], currentRound: 0 })
      },

      // Assign player to slot
      assignPlayer: (roundIdx, courtIdx, team, slotIdx, playerName) => {
        const rounds = get().rounds.map((r, ri) => {
          if (ri !== roundIdx) return r
          return {
            ...r,
            courts: r.courts.map((c, ci) => {
              if (ci !== courtIdx) return c
              const arr = team === 'A' ? [...c.teamA] : [...c.teamB]
              arr[slotIdx] = playerName
              return team === 'A' ? { ...c, teamA: arr } : { ...c, teamB: arr }
            })
          }
        })
        set({ rounds })
      },

      clearSlot: (roundIdx, courtIdx, team, slotIdx) => {
        const rounds = get().rounds.map((r, ri) => {
          if (ri !== roundIdx) return r
          return {
            ...r,
            courts: r.courts.map((c, ci) => {
              if (ci !== courtIdx) return c
              const arr = team === 'A' ? [...c.teamA] : [...c.teamB]
              arr[slotIdx] = null
              return team === 'A' ? { ...c, teamA: arr } : { ...c, teamB: arr }
            })
          }
        })
        set({ rounds })
      },

      randomTeams: () => {
        const { session, rounds, currentRound } = get()
        if (!session) return
        const players = session.players.map(p => p.name)
        const shuffled = [...players].sort(() => Math.random() - 0.5)
        const newRounds = rounds.map((r, ri) => {
          if (ri !== currentRound) return r
          let idx = 0
          return {
            ...r,
            courts: r.courts.map(c => {
              const court = {
                teamA: [shuffled[idx] || null, shuffled[idx + 1] || null],
                teamB: [shuffled[idx + 2] || null, shuffled[idx + 3] || null],
              }
              idx += 4
              return court
            })
          }
        })
        set({ rounds: newRounds })
      },
    }),
    { name: 'caulong-v2' }
  )
)
