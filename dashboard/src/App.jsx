import { useState, useEffect } from 'react'
import './App.css'
import RatingTrendsChart from './components/RatingTrendsChart'
import OverallStats from './components/OverallStats'
import DetailedAnalysis from './components/DetailedAnalysis'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/all-reviews.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load reviews data')
        }
        return response.json()
      })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="loading">Loading reviews...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>{data.place_info.title}</h1>
        <p className="subtitle">{data.place_info.type} • {data.place_info.address}</p>
      </header>

      <main className="main">
        <OverallStats data={data} />
        <RatingTrendsChart reviews={data.reviews} />
        <DetailedAnalysis data={data} />
      </main>

      <footer className="footer">
        <p>Last updated: {new Date(data.downloaded_at).toLocaleDateString()}</p>
      </footer>
    </div>
  )
}

export default App
