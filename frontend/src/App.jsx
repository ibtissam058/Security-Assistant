import { useState } from "react"

function App() {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkBreach = async () => {
    setLoading(true)
    const res = await fetch(`http://localhost:8000/check-breach/${email}`)
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Security Assistant</h1>
      <h2>Breach Checker</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button
        onClick={checkBreach}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Checking..." : "Check"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          {result.breached ? (
            <div style={{ color: "red" }}>
              <p>⚠️ Breached in {result.count} databases!</p>
              <ul>
                {result.breaches.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ) : (
            <p style={{ color: "green" }}>✅ {result.message}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default App