import { motion } from 'framer-motion'
import { BarChart2, Github, Zap } from 'lucide-react'
import { Dashboard } from './pages/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center">
              <BarChart2 size={24} className="text-[#00d4ff]" />
            </div>
            <h1 className="text-4xl font-black">
              Sentiment<span className="text-[#00d4ff]">Dash</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Real-time анализ тональности текстов.{' '}
            <span className="text-[#00d4ff]">WebSocket</span> + Gemini AI.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            {['WebSocket', 'Batch Analysis', 'Charts', 'CSV Export', 'Gemini AI'].map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-[#12121a] border border-slate-800 text-slate-400">
                <Zap size={10} className="text-[#00d4ff]" />
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Dashboard />
        </motion.div>

        <footer className="mt-16 text-center text-slate-600 text-sm flex items-center justify-center gap-4">
          <span>SentimentDash — FastAPI + WebSocket + Gemini</span>
          <a href="https://github.com/3xfap2/sentimentdash" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-slate-400 transition-colors">
            <Github size={14} /> GitHub
          </a>
        </footer>
      </div>
    </div>
  )
}
