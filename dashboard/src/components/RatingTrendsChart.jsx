import { useState, useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './RatingTrendsChart.css'

export default function RatingTrendsChart({ reviews }) {
  const [viewMode, setViewMode] = useState('month') // 'month' or 'week'

  const chartData = useMemo(() => {
    const grouped = {}

    reviews.forEach(review => {
      if (!review.iso_date) return

      const date = new Date(review.iso_date)
      let key

      if (viewMode === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      } else {
        // Week view - get ISO week
        const startOfYear = new Date(date.getFullYear(), 0, 1)
        const weekNum = Math.ceil(((date - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
        key = `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
      }

      if (!grouped[key]) {
        grouped[key] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
      grouped[key][review.rating]++
    })

    // Convert to sorted array
    const sortedPeriods = Object.keys(grouped).sort()

    // Get last 24 months or 52 weeks
    const maxPeriods = viewMode === 'month' ? 24 : 52
    const recentPeriods = sortedPeriods.slice(-maxPeriods)

    return {
      categories: recentPeriods,
      series: [
        {
          name: '5 Star',
          data: recentPeriods.map(period => grouped[period][5]),
          color: '#10b981'
        },
        {
          name: '4 Star',
          data: recentPeriods.map(period => grouped[period][4]),
          color: '#84cc16'
        },
        {
          name: '3 Star',
          data: recentPeriods.map(period => grouped[period][3]),
          color: '#fbbf24'
        },
        {
          name: '2 Star',
          data: recentPeriods.map(period => grouped[period][2]),
          color: '#fb923c'
        },
        {
          name: '1 Star',
          data: recentPeriods.map(period => grouped[period][1]),
          color: '#ef4444'
        }
      ],
      averages: recentPeriods.map(period => {
        const counts = grouped[period]
        const total = counts[1] + counts[2] + counts[3] + counts[4] + counts[5]
        const sum = counts[1] * 1 + counts[2] * 2 + counts[3] * 3 + counts[4] * 4 + counts[5] * 5
        return total > 0 ? (sum / total).toFixed(2) : 0
      })
    }
  }, [reviews, viewMode])

  const chartOptions = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 500
    },
    title: {
      text: `Rating Trends Over Time (${viewMode === 'month' ? 'Monthly' : 'Weekly'})`,
      style: {
        color: '#1f2937',
        fontSize: '24px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: chartData.categories,
      title: {
        text: viewMode === 'month' ? 'Month' : 'Week'
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: '11px'
        }
      }
    },
    yAxis: [
      {
        min: 0,
        title: {
          text: 'Number of Reviews'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: '#666'
          }
        }
      },
      {
        title: {
          text: 'Average Rating',
          style: {
            color: '#6366f1'
          }
        },
        opposite: true,
        min: 0,
        max: 5,
        labels: {
          style: {
            color: '#6366f1'
          }
        }
      }
    ],
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal'
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        let tooltip = `<b>${this.x}</b><br/>`
        let total = 0
        this.points.forEach(point => {
          if (point.series.name !== 'Average Rating') {
            tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: ${point.y}<br/>`
            total += point.y
          }
        })
        tooltip += `<b>Total: ${total}</b><br/>`
        const avgPoint = this.points.find(p => p.series.name === 'Average Rating')
        if (avgPoint) {
          tooltip += `<span style="color:${avgPoint.color}">\u25CF</span> Average: ${avgPoint.y}<br/>`
        }
        return tooltip
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false
        }
      }
    },
    series: [
      ...chartData.series,
      {
        name: 'Average Rating',
        type: 'line',
        yAxis: 1,
        data: chartData.averages.map(v => parseFloat(v)),
        color: '#6366f1',
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 4
        }
      }
    ],
    credits: {
      enabled: false
    }
  }

  return (
    <div className="rating-trends-chart">
      <div className="chart-controls">
        <button
          className={viewMode === 'month' ? 'active' : ''}
          onClick={() => setViewMode('month')}
        >
          Monthly View
        </button>
        <button
          className={viewMode === 'week' ? 'active' : ''}
          onClick={() => setViewMode('week')}
        >
          Weekly View
        </button>
      </div>

      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  )
}
