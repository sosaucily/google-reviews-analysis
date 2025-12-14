import './DetailedAnalysis.css'

export default function DetailedAnalysis({ data }) {
  const lowRatings = data.reviews.filter(r => r.rating <= 2)

  return (
    <div className="detailed-analysis">
      <div className="section">
        <h2>Top Mentioned Topics</h2>
        <div className="topics-grid">
          {data.topics.slice(0, 10).map((topic, index) => (
            <div key={index} className="topic-card">
              <div className="topic-rank">#{index + 1}</div>
              <div className="topic-keyword">{topic.keyword}</div>
              <div className="topic-mentions">{topic.mentions} mentions</div>
            </div>
          ))}
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
                  <span className="review-author">{review.user.name}</span>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
              <div className="review-snippet">{review.snippet}</div>
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
                    <span className="review-author">{review.user.name}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
                <div className="review-snippet">{review.snippet}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
