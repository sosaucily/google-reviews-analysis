import './OverallStats.css'

export default function OverallStats({ data }) {
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  data.reviews.forEach(review => {
    ratingCounts[review.rating]++
  })

  const categoryStats = {}
  const categories = ['service', 'atmosphere', 'food']

  data.reviews.forEach(review => {
    if (review.details) {
      categories.forEach(cat => {
        if (review.details[cat]) {
          if (!categoryStats[cat]) {
            categoryStats[cat] = { sum: 0, count: 0 }
          }
          categoryStats[cat].sum += review.details[cat]
          categoryStats[cat].count++
        }
      })
    }
  })

  return (
    <div className="overall-stats">
      <h2>Overall Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-value">{data.place_info.rating}</div>
          <div className="stat-label">Overall Rating</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{data.total_reviews}</div>
          <div className="stat-label">Total Reviews</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{ratingCounts[5]}</div>
          <div className="stat-label">5-Star Reviews</div>
          <div className="stat-percentage">
            {((ratingCounts[5] / data.total_reviews) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{ratingCounts[1] + ratingCounts[2]}</div>
          <div className="stat-label">Low Ratings (1-2 ⭐)</div>
          <div className="stat-percentage">
            {(((ratingCounts[1] + ratingCounts[2]) / data.total_reviews) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="rating-distribution">
        <h3>Rating Distribution</h3>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = ratingCounts[rating]
          const percentage = (count / data.total_reviews) * 100
          return (
            <div key={rating} className="rating-bar">
              <div className="rating-label">{rating} ⭐</div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="rating-count">{count}</div>
            </div>
          )
        })}
      </div>

      {Object.keys(categoryStats).length > 0 && (
        <div className="category-ratings">
          <h3>Average Ratings by Category</h3>
          <div className="categories">
            {categories.map(cat => {
              if (categoryStats[cat]) {
                const avg = (categoryStats[cat].sum / categoryStats[cat].count).toFixed(2)
                return (
                  <div key={cat} className="category">
                    <div className="category-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                    <div className="category-value">{avg} / 5</div>
                    <div className="category-count">({categoryStats[cat].count} reviews)</div>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
