import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

interface Analysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  confidence: number
  timestamp: string
}

const COLORS = { positive: '#00ff88', negative: '#ff4757', neutral: '#74b9ff' }

export function PieDistribution({ history }: { history: Analysis[] }) {
  const counts = { positive: 0, negative: 0, neutral: 0 }
  history.forEach((h) => counts[h.sentiment]++)

  const data = [
    { name: 'Позитивный', value: counts.positive, color: COLORS.positive },
    { name: 'Негативный', value: counts.negative, color: COLORS.negative },
    { name: 'Нейтральный', value: counts.neutral, color: COLORS.neutral },
  ].filter((d) => d.value > 0)

  if (data.length === 0) return <div className="text-slate-500 text-sm text-center py-8">Нет данных</div>

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#12121a', border: '1px solid #22223a', borderRadius: 8 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ScoreTimeline({ history }: { history: Analysis[] }) {
  const data = history.slice().reverse().map((h, i) => ({
    name: `#${i + 1}`,
    score: h.score,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#22223a" />
        <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11 }} />
        <YAxis domain={[-1, 1]} stroke="#475569" tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#12121a', border: '1px solid #22223a', borderRadius: 8 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Line type="monotone" dataKey="score" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
