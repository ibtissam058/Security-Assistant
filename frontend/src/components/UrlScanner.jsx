import { useState } from "react"

function UrlScanner() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkUrl = async () => {
    setLoading(true)
    const res = await fetch("http://localhost:8000/check-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ marginBottom: "40px" }}>
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

      {result && (
        <div style={{ marginTop: "15px" }}>
          {result.error ? (
            <p style={{ color: "orange" }}>⚠️ {result.error}</p>
          ) : result.safe ? (
            <p style={{ color: "green" }}>✅ URL is safe!</p>
          ) : (
            <div style={{ color: "red" }}>
              <p>🚨 Dangerous URL detected!</p>
              <p>Malicious engines: {result.malicious}</p>
              <p>Suspicious engines: {result.suspicious}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UrlScanner