
import { useEffect, useState } from 'react'

const tarotCards = [
  '0 愚者',
  '1 魔術師',
  '2 女教皇',
  '3 女帝',
  '4 皇帝',
  '5 教皇',
  '6 恋愛',
  '7 戦車',
  '8 正義',
  '9 隠者',
  '10 運命',
  '11 剛毅',
  '12 形死者',
  '13 死神',
  '14 節制',
  '15 悪魔',
  '16 塔',
  '17 星',
  '18 月',
  '19 太陽',
  '20 審判',
  '20 永劫',
  '21 世界',
  '信念',
  '1 顧問官',
  '0 道化師',
]

type Counter = {
  id: string
  card: string
  count: number
}

type CounterGroup = {
  [key: number]: Counter[]
}

const STORAGE_KEY = 'tarot-counter-groups'

function loadGroups(): CounterGroup {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed: unknown = JSON.parse(saved)

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const groups = parsed as CounterGroup

        return {
          1: Array.isArray(groups[1]) ? groups[1] : [],
          2: Array.isArray(groups[2]) ? groups[2] : [],
          3: Array.isArray(groups[3]) ? groups[3] : [],
        }
      }
    }
  } catch {
    // 保存データを読み込めない場合は初期設定を使用
  }

  const createCounters = (cards: string[]): Counter[] =>
    cards.map((card) => ({
      id: crypto.randomUUID(),
      card,
      count: 0,
    }))

  return {
    1: createCounters([
      '0 愚者',
      '2 女教皇',
      '3 女帝',
      '6 恋愛',
      '8 正義',
      '13 死神',
      '20 審判',
    ]),

    2: createCounters([
      '0 愚者',
      '1 魔術師',
      '2 女教皇',
      '6 恋愛',
      '7 戦車',
      '8 正義',
      '10 運命',
      '20 永劫',
    ]),

    3: createCounters([
      '0 愚者',
      '1 魔術師',
      '6 恋愛',
      '7 戦車',
      '8 正義',
      '9 隠者',
      '13 死神',
      '14 節制',
      '17 星',
      '信念',
    ]),
  }
}

function App() {
  const [groups, setGroups] = useState<CounterGroup>(loadGroups)
  const [activeGroup, setActiveGroup] = useState(1)

  const counters = groups[activeGroup] ?? []

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
  }, [groups])

  const availableCards = tarotCards.filter(
    (card) => !counters.some((counter) => counter.card === card),
  )
  
  function resetGroup(group: number) {
    const initialCards: Record<number, string[]> = {
      1: [
        '0 愚者',
        '2 女教皇',
        '3 女帝',
        '6 恋愛',
        '8 正義',
        '13 死神',
        '20 審判',
        '20 永劫',
      ],
      2: [
        '0 愚者',
        '1 魔術師',
        '2 女教皇',
        '6 恋愛',
        '7 戦車',
        '8 正義',
        '10 運命',
        '20 永劫',
      ],
      3: [
        '0 愚者',
        '1 魔術師',
        '6 恋愛',
        '7 戦車',
        '8 正義',
        '9 隠者',
        '13 死神',
        '14 節制',
        '17 星',
        '信念',
      ],
    }

    const cards = initialCards[group]
    if (!cards) return

    setGroups((current) => ({
      ...current,
      [group]: cards.map((card) => ({
        id: crypto.randomUUID(),
        card,
        count: 0,
      })),
    }))
  }

  function addCounter() {
    const card = availableCards[0]
    if (!card) return

    setGroups((current) => ({
      ...current,
      [activeGroup]: [
        ...(current[activeGroup] ?? []),
        { id: crypto.randomUUID(), card, count: 0 },
      ],
    }))
  }

  function changeCount(id: string, amount: number) {
    setGroups((current) => ({
      ...current,
      [activeGroup]: (current[activeGroup] ?? []).map((counter) =>
        counter.id === id
          ? {
              ...counter,
              count: Math.min(3, Math.max(0, counter.count + amount)),
            }
          : counter,
      ),
    }))
  }

  function changeCard(id: string, card: string) {
    setGroups((current) => {
      const currentCounters = current[activeGroup] ?? []

      if (
        !tarotCards.includes(card) ||
        currentCounters.some(
          (counter) => counter.id !== id && counter.card === card,
        )
      ) {
        return current
      }

      return {
        ...current,
        [activeGroup]: currentCounters.map((counter) =>
          counter.id === id ? { ...counter, card } : counter,
        ),
      }
    })
  }

  function removeCounter(id: string) {
    setGroups((current) => ({
      ...current,
      [activeGroup]: (current[activeGroup] ?? []).filter(
        (counter) => counter.id !== id,
      ),
    }))
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-xl">
        <header className="mb-8 text-center">
          <p className="mb-2 text-xl tracking-[0.3em] text-violet-300">
            アルカナカウントツール
          </p>
          <p className="mt-3 text-sm text-slate-400">
            カウントは0〜3。カードごとに管理できます。
          </p>
        </header>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((group) => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`rounded-xl px-3 py-3 font-semibold transition ${
                activeGroup === group
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              P{group+2}
            </button>
          ))}
        </div>

        
<div className="mb-5 flex items-center justify-between gap-3">
  <p className="text-sm text-slate-300">
    登録中：{counters.length} / {tarotCards.length}
  </p>

  <div className="flex shrink-0 gap-2">
    <button
      onClick={() => resetGroup(activeGroup)}
      className="rounded-xl border border-red-900 bg-slate-900 px-3 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-950"
    >
      リセット
    </button>

    <button
      onClick={addCounter}
      disabled={availableCards.length === 0}
      className="rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      ＋ カウンター追加
    </button>
  </div>
</div>


        {counters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 px-5 py-12 text-center">
            <p className="text-lg font-semibold">カウンターはまだありません</p>
            <p className="mt-2 text-sm text-slate-400">
              「カウンター追加」から始めよう！
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {counters.map((counter) => (
              <section
                key={counter.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-lg"
              >
                <div className="mb-4 flex items-center gap-3">
                  <select
                    value={counter.card}
                    onChange={(event) =>
                      changeCard(counter.id, event.target.value)
                    }
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-base"
                    aria-label="タロットカード"
                  >
                    {tarotCards
                      .filter(
                        (card) =>
                          card === counter.card ||
                          !counters.some((item) => item.card === card),
                      )
                      .map((card) => (
                        <option key={card} value={card}>
                          {card}
                        </option>
                      ))}
                  </select>

                  <button
                    onClick={() => removeCounter(counter.id)}
                    className="rounded-lg px-3 py-3 text-sm text-red-300 transition hover:bg-red-950"
                    aria-label={`${counter.card}を削除`}
                  >
                    削除
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => changeCount(counter.id, -1)}
                    disabled={counter.count === 0}
                    className="h-14 w-16 rounded-xl bg-slate-800 text-2xl font-bold transition hover:bg-slate-700 disabled:opacity-30"
                    aria-label="カウントを減らす"
                  >
                    −
                  </button>

                  <div className="text-center">
                    <p className="text-xs text-slate-400">COUNT</p>
                    <p className="text-4xl font-bold tabular-nums">
                      {counter.count}
                    </p>
                  </div>

                  <button
                    onClick={() => changeCount(counter.id, 1)}
                    disabled={counter.count === 3}
                    className="h-14 w-16 rounded-xl bg-violet-600 text-2xl font-bold transition hover:bg-violet-500 disabled:opacity-30"
                    aria-label="カウントを増やす"
                  >
                    ＋
                  </button>
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          データはこのブラウザ内に保存されます。
        </p>
      </div>
    </main>
  )
}

export default App
