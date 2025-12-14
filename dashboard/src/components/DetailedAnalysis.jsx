import { useState, useEffect } from 'react'
import './DetailedAnalysis.css'

export default function DetailedAnalysis({ data }) {
  const [sentimentData, setSentimentData] = useState(null)
  const lowRatings = data.reviews.filter(r => r.rating <= 2)

  useEffect(() => {
    fetch('/sentiment-analysis.json')
      .then(response => response.json())
      .then(data => setSentimentData(data))
      .catch(err => console.error('Failed to load sentiment analysis:', err))
  }, [])

  if (!sentimentData) {
    return <div className="loading">Loading sentiment analysis...</div>
  }

  return (
    <div className="detailed-analysis">
      <div className="topics-sections">
        <div className="section positive-topics">
          <h2>What Customers Love (4-5 ⭐)</h2>
          <p className="section-description">
            Top themes from {sentimentData.positive_reviews_analyzed} positive reviews
          </p>
          <div className="sentiment-topics">
            {sentimentData.top_positive_topics.map((item, index) => (
              <div key={index} className="sentiment-card positive">
                <div className="sentiment-header">
                  <span className="sentiment-rank">#{index + 1}</span>
                  <h3 className="sentiment-topic">{item.topic}</h3>
                </div>
                <div className="sentiment-stats">
                  <span className="sentiment-count">{item.count} mentions</span>
                  <span className="sentiment-percentage">{item.percentage}% of reviews</span>
                </div>
                {item.examples.length > 0 && (
                  <div className="sentiment-example">
                    <p>"{item.examples[0].text.substring(0, 120)}..."</p>
                    <span className="example-author">- {item.examples[0].user}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="section negative-topics">
          <h2>Areas for Improvement (1-2 ⭐)</h2>
          <p className="section-description">
            Top issues from {sentimentData.negative_reviews_analyzed} negative reviews
          </p>
          <div className="sentiment-topics">
            {sentimentData.top_negative_topics.map((item, index) => (
              <div key={index} className="sentiment-card negative">
                <div className="sentiment-header">
                  <span className="sentiment-rank">#{index + 1}</span>
                  <h3 className="sentiment-topic">{item.topic}</h3>
                </div>
                <div className="sentiment-stats">
                  <span className="sentiment-count">{item.count} mentions</span>
                  <span className="sentiment-percentage">{item.percentage}% of reviews</span>
                </div>
                {item.examples.length > 0 && (
                  <div className="sentiment-example">
                    <p>"{item.examples[0].text.substring(0, 120)}..."</p>
                    <span className="example-author">- {item.examples[0].user}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Recent Reviews</h2>
        <div className="reviews-list">
          {data.reviews.slice(0, 10).map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <div className="review-rating">
                  {"⭐".repeat(review.rating)}
                </div>
                <div className="review-meta">
                  <span className="review-author">{review.user?.name || 'Anonymous'}</span>
                  <span className="review-date">{review.date || 'Unknown date'}</span>
                </div>
              </div>
              <div className="review-snippet">{review.snippet || 'No review text'}</div>
            </div>
          ))}
        </div>
      </div>

      {lowRatings.length > 0 && (
        <div className="section low-ratings-section">
          <h2>Areas for Improvement (Low Ratings)</h2>
          <p className="section-description">
            {lowRatings.length} reviews with 1-2 stars ({((lowRatings.length / data.total_reviews) * 100).toFixed(1)}%)
          </p>
          <div className="reviews-list">
            {lowRatings.slice(0, 5).map((review, index) => (
              <div key={index} className="review-card low-rating">
                <div className="review-header">
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <div className="review-meta">
                    <span className="review-author">{review.user?.name || 'Anonymous'}</span>
                    <span className="review-date">{review.date || 'Unknown date'}</span>
                  </div>
                </div>
                <div className="review-snippet">{review.snippet || 'No review text'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
