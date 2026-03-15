import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Zap, Trash2, Download } from 'lucide-react'
import axios from 'axios'
import { SentimentBadge } from '../components/SentimentBadge'
import { PieDistribution, ScoreTimeline } from '../components/SentimentChart'

interface Analysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  confidence: number
  emotions: string[]
  keywords: string[]
  summary: string
  language: string
  text: string
  timestamp: string
}

export function Dashboard() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState<Analysis | null>(null)
  const [history, setHistory] = useState<Analysis[]>([])
  const [batchText, setBatchText] = useState('')
  const [tab, setTab] = useState<'single' | 'batch'>('single')
  const wsRef = useRef<WebSocket | null>(null)

  // Connect WebSocket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/api/ws/analyze`)
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.status === 'done') {
        setCurrent(data.result)
        setHistory((h) => [data.result, ...h].slice(0, 50))
        setLoading(false)
      } else if (data.status === 'error') {
        setLoading(false)
      }
    }
    ws.onerror = () => { /* fallback to HTTP */ }
    wsRef.current = ws
    return () => ws.close()
  }, [])

  const analyze = useCallback(async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setCurrent(null)

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }))
    } else {
      // HTTP fallback
      try {
        const { data } = await axios.post<Analysis>('/api/analyze', { text })
        setCurrent(data)
        setHistory((h) => [data, ...h].slice(0, 50))
      } finally {
        setLoading(false)
      }
    }
  }, [text, loading])

  const batchAnalyze = useCallback(async () => {
    const texts = batchText.split('\n').map((t) => t.trim()).filter(Boolean)
    if (!texts.length) return
    setLoading(true)
    try {
      const { data } = await axios.post<Analysis[]>('/api/batch', { texts })
      setHistory((h) => [...data, ...h].slice(0, 50))
    } finally {
      setLoading(false)
    }
  }, [batchText])

  const exportCSV = () => {
    const rows = [
      ['timestamp', 'sentiment', 'score', 'confidence', 'text'],
      ...history.map((h) => [h.timestamp, h.sentiment, h.score, h.confidence, `"${h.text.replace(/"/g, '""')}"`]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'sentiment_results.csv'
    a.click()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input panel */}
      <div className="lg:col-span-2 space-y-4">
        {/* Tab switcher */}
        <div className="flex bg-[#12121a] rounded-2xl p-1.5 border border-slate-800 max-w-xs">
          {(['single', 'batch'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all
                ${tab === t ? 'bg-[#00d4ff] text-[#0a0a0f]' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {t === 'single' ? 'Один текст' : 'Батч'}
            </button>
          ))}
        </div>

        {tab === 'single' ? (
          <>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) analyze() }}
                placeholder="Введи текст для анализа тональности..."
                rows={6}
                className="w-full bg-[#12121a] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#00d4ff]/50 resize-none"
              />
              <span className="absolute bottom-3 right-3 text-xs text-slate-600">{text.length}/5000 · Ctrl+Enter</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={analyze}
              disabled={!text.trim() || loading}
              className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00bcd4] disabled:opacity-40 text-[#0a0a0f] font-bold px-6 py-3 rounded-xl transition-all"
            >
              {loading ? <span className="w-4 h-4 border-2 border-[#0a0a0f] border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
              Анализировать
            </motion.button>
          </>
        ) : (
          <>
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder={"Каждый текст с новой строки:\nПервый текст\nВторой текст\nТретий текст"}
              rows={8}
              className="w-full bg-[#12121a] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#00d4ff]/50 resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={batchAnalyze}
              disabled={!batchText.trim() || loading}
              className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00bcd4] disabled:opacity-40 text-[#0a0a0f] font-bold px-6 py-3 rounded-xl transition-all"
            >
              <Zap size={16} />
              Анализ батча
            </motion.button>
          </>
        )}

        {/* Current result */}
        <AnimatePresence>
          {current && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12121a] rounded-2xl p-5 border-glow space-y-4"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <SentimentBadge sentiment={current.sentiment} score={current.score} />
                <span className="text-xs text-slate-500">
                  Уверенность: {Math.round(current.confidence * 100)}% · {current.language.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-300 text-sm">{current.summary}</p>

              {current.emotions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {current.emotions.map((e) => (
                    <span key={e} className="px-2.5 py-1 rounded-full text-xs bg-[#22223a] text-slate-400">{e}</span>
                  ))}
                </div>
              )}

              {current.keywords.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Ключевые слова:</p>
                  <div className="flex flex-wrap gap-2">
                    {current.keywords.map((k) => (
                      <span key={k} className="px-2.5 py-1 rounded-full text-xs bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20">{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats panel */}
      <div className="space-y-4">
        <div className="bg-[#12121a] rounded-2xl p-4 border-glow">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Распределение</p>
          <PieDistribution history={history} />
        </div>

        {history.length > 1 && (
          <div className="bg-[#12121a] rounded-2xl p-4 border-glow">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Скор по времени</p>
            <ScoreTimeline history={history} />
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-[#12121a] rounded-2xl p-4 border-glow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest">История ({history.length})</p>
              <div className="flex gap-2">
                <button onClick={exportCSV} className="p-1.5 hover:bg-[#22223a] rounded-lg transition-colors" title="Экспорт CSV">
                  <Download size={13} className="text-slate-400" />
                </button>
                <button onClick={() => setHistory([])} className="p-1.5 hover:bg-[#22223a] rounded-lg transition-colors" title="Очистить">
                  <Trash2 size={13} className="text-slate-400" />
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.slice(0, 15).map((h, i) => {
                const colors = { positive: '#00ff88', negative: '#ff4757', neutral: '#74b9ff' }
                return (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: colors[h.sentiment] }} />
                    <p className="text-slate-400 leading-relaxed line-clamp-2">{h.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
