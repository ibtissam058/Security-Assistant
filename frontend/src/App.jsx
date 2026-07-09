import { useState } from "react"

function App() {
  const [email, setEmail] = useState("")
  const [url, setUrl] = useState("")
  const [breachResult, setBreachResult] = useState(null)
  const [urlResult, setUrlResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkBreach = async () => {
    setLoading(true)
    const res = await fetch(`http://localhost:8000/check-breach/${email}`)
    const data = await res.json()
    setBreachResult(data)
    setLoading(false)
  }

  const checkUrl = async () => {
    setLoading(true)
    const res = await fetch("http://localhost:8000/check-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })
    const data = await res.json()
    setUrlResult(data)
    setLoading(false)
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "600px" }}>
      <h1>🛡️ Security Assistant</h1>

      {/* Breach Checker */}
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

        {breachResult && (
          <div style={{ marginTop: "15px" }}>
            {breachResult.breached ? (
              <div style={{ color: "red" }}>
                <p>⚠️ Breached in {breachResult.count} databases!</p>
                <ul>{breachResult.breaches.map(b => <li key={b}>{b}</li>)}</ul>
              </div>
            ) : (
              <p style={{ color: "green" }}>✅ {breachResult.message}</p>
            )}
          </div>
        )}
      </div>

      {/* URL Scanner */}
      <div>
        <h2>🔗 URL Scanner</h2>
        <input
          type="text"
          placeholder="Enter a URL to scan"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button onClick={checkUrl} style={{ padding: "10px 20px" }}>
          {loading ? "Scanning..." : "Scan"}
        </button>

        {urlResult && (
          <div style={{ marginTop: "15px" }}>
            {urlResult.error ? (
              <p style={{ color: "orange" }}>⚠️ {urlResult.error}</p>
            ) : urlResult.safe ? (
              <p style={{ color: "green" }}>✅ URL is safe!</p>
            ) : (
              <div style={{ color: "red" }}>
                <p>🚨 Dangerous URL detected!</p>
                <p>Malicious engines: {urlResult.malicious}</p>
                <p>Suspicious engines: {urlResult.suspicious}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App