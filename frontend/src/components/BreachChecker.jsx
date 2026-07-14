import { useState } from "react"

function BreachChecker() {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkBreach = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:8000/check-breach/${email}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>📧 Breach Checker</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={checkBreach} style={{ padding: "10px 20px" }}>
        {loading ? "Checking..." : "Check"}
      </button>

      {result && (
        <div style={{ marginTop: "15px" }}>
          {result.breached ? (
            <div style={{ color: "red" }}>
              <p>⚠️ Breached in {result.count} databases!</p>
              <ul>{result.breaches.map(b => <li key={b}>{b}</li>)}</ul>
            </div>
          ) : (
            <p style={{ color: "green" }}>✅ {result.message}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default BreachChecker