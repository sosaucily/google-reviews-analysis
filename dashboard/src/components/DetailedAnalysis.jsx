import './DetailedAnalysis.css'

export default function DetailedAnalysis({ data }) {
  const lowRatings = data.reviews.filter(r => r.rating <= 2)
  const positiveReviews = data.reviews.filter(r => r.rating >= 4)

  // Count words in positive reviews
  const getTopWords = (reviews, count = 10) => {
    const wordCount = {}
    const stopWords = new Set([
      'that', 'with', 'this', 'from', 'were', 'have', 'been', 'they', 'very',
      'there', 'their', 'about', 'would', 'which', 'also', 'when', 'room',
      'rooms', 'karaoke', 'vibe', 'budapest', 'place', 'here', 'was', 'had',
      'for', 'and', 'the', 'our', 'we', 'it', 'to', 'in', 'a', 'of', 'at'
    ])

    reviews.forEach(review => {
      const words = review.snippet
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length >= 4 && !stopWords.has(word))

      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1
      })
    })

    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
  }

  const positiveTopics = getTopWords(positiveReviews, 10)
  const negativeTopics = lowRatings.length > 0 ? getTopWords(lowRatings, 10) : []

  return (
    <div className="detailed-analysis">
      <div className="topics-sections">
        <div className="section positive-topics">
          <h2>Top Topics in Positive Reviews (4-5 ⭐)</h2>
          <p className="section-description">
            Most mentioned words in {positiveReviews.length} positive reviews
          </p>
          <div className="topics-grid">
            {positiveTopics.map(([word, count], index) => (
              <div key={index} className="topic-card positive">
                <div className="topic-rank">#{index + 1}</div>
                <div className="topic-keyword">{word}</div>
                <div className="topic-mentions">{count} mentions</div>
              </div>
            ))}
          </div>
        </div>

        {negativeTopics.length > 0 && (
          <div className="section negative-topics">
            <h2>Top Topics in Negative Reviews (1-2 ⭐)</h2>
            <p className="section-description">
              Most mentioned words in {lowRatings.length} negative reviews
            </p>
            <div className="topics-grid">
              {negativeTopics.map(([word, count], index) => (
                <div key={index} className="topic-card negative">
                  <div className="topic-rank">#{index + 1}</div>
                  <div className="topic-keyword">{word}</div>
                  <div className="topic-mentions">{count} mentions</div>
                </div>
              ))}
            </div>
          </div>
        )}
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
