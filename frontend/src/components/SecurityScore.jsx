import { useState, useEffect } from "react"

function SecurityScore() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScore = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/security-score", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const result = await res.json()
      setData(result)
      setLoading(false)
    }
    fetchScore()
  }, [])

  if (loading) return <p style={{ color: "#888" }}>Calculating your score...</p>

  const { score, total_scans, threats_found, advice } = data

  const scoreColor = score >= 80 ? "#6bff6b" : score >= 50 ? "#ffd700" : "#ff6b6b"
  const scoreLabel = score >= 80 ? "Good" : score >= 50 ? "Moderate" : "At Risk"

  return (
    <div style={{ marginBottom: "40px", padding: "20px", background: "#1a1a2e", borderRadius: "12px", border: "1px solid #333" }}>
      <h2>🛡️ Security Score</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0" }}>
        <div style={{
          width: "100px", height: "100px", borderRadius: "50%",
          border: `4px solid ${scoreColor}`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontSize: "28px", fontWeight: "bold", color: scoreColor }}>{score}</span>
          <span style={{ fontSize: "11px", color: "#888" }}>/ 100</span>
        </div>

        <div>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: scoreColor, marginBottom: "4px" }}>{scoreLabel}</p>
          <p style={{ fontSize: "13px", color: "#888" }}>Total scans: {total_scans}</p>
          <p style={{ fontSize: "13px", color: "#888" }}>Threats found: {threats_found}</p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #333", paddingTop: "15px" }}>
        <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "10px", fontWeight: "bold" }}>
          💡 Personalized advice:
        </p>
        <ul style={{ paddingLeft: "20px" }}>
          {advice.map((tip, i) => (
            <li key={i} style={{ fontSize: "13px", color: "#ccc", marginBottom: "6px" }}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SecurityScore