import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react'

type Sentiment = 'positive' | 'negative' | 'neutral'

const CONFIG = {
  positive: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)', icon: ThumbsUp, label: 'Позитивный' },
  negative: { color: '#ff4757', bg: 'rgba(255,71,87,0.1)', border: 'rgba(255,71,87,0.3)', icon: ThumbsDown, label: 'Негативный' },
  neutral: { color: '#74b9ff', bg: 'rgba(116,185,255,0.1)', border: 'rgba(116,185,255,0.3)', icon: Minus, label: 'Нейтральный' },
}

export function SentimentBadge({ sentiment, score }: { sentiment: Sentiment; score: number }) {
  const cfg = CONFIG[sentiment]
  const Icon = cfg.icon

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
      style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      <Icon size={15} />
      {cfg.label}
      <span className="opacity-60 font-normal">({score > 0 ? '+' : ''}{score.toFixed(2)})</span>
    </div>
  )
}
