import { formatCurrency } from '../utils/duplicates'

interface DailyRevenueChartProps {
  daily: { date: string; revenue: number }[]
  dropDate: string
}

// A tiny CSS bar chart: enough for ten data points, no charting library needed.
export function DailyRevenueChart({ daily, dropDate }: DailyRevenueChartProps) {
  const maxRevenue = Math.max(...daily.map((day) => day.revenue), 1)

  return (
    <div className="card">
      <h3 className="chart-title">Daily revenue</h3>
      <div className="revenue-chart" role="img" aria-label="Bar chart of daily revenue">
        {daily.map((day) => (
          <div key={day.date} className="revenue-col" title={`${day.date}: ${formatCurrency(day.revenue)}`}>
            <span className="revenue-value">{Math.round(day.revenue)}</span>
            <div className="revenue-track">
              <div
                className={`revenue-bar ${day.date >= dropDate ? 'revenue-bar-low' : ''}`}
                style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <span className="revenue-date">{day.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
