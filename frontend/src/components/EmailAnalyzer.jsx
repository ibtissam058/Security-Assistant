import { useState } from "react"

function EmailAnalyzer() {
  const [emailContent, setEmailContent] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeEmail = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8000/analyze-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email_content: emailContent })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>📨 Email Analyzer</h2>
      <p style={{ color: "#888", fontSize: "13px", marginBottom: "10px" }}>
        Paste a suspicious email to analyze it for phishing attempts.
      </p>
      <textarea
        placeholder="Paste the full email content here..."
        value={emailContent}
        onChange={e => setEmailContent(e.target.value)}
        rows={6}
        style={{
          width: "100%", padding: "10px",
          background: "#1a1a2e", color: "white",
          border: "1px solid #333", borderRadius: "6px",
          fontFamily: "Arial", fontSize: "13px",
          marginBottom: "10px"
        }}
      />
      <button
        onClick={analyzeEmail}
        style={{
          padding: "10px 20px", background: "#2E86C1",
          color: "white", border: "none",
          borderRadius: "6px", cursor: "pointer"
        }}
      >
        {loading ? "Analyzing..." : "Analyze Email"}
      </button>

      {result && (
        <div style={{
          marginTop: "15px", padding: "15px",
          background: result.threat_found ? "#3d1a1a" : "#1a3d1a",
          border: `1px solid ${result.threat_found ? "#ff6b6b" : "#6bff6b"}`,
          borderRadius: "8px"
        }}>
          <p style={{
            fontWeight: "bold", marginBottom: "10px",
            color: result.threat_found ? "#ff6b6b" : "#6bff6b"
          }}>
            {result.threat_found ? "⚠️ Threat Detected" : "✅ Looks Legitimate"}
          </p>
          <p style={{ fontSize: "13px", color: "#ccc", whiteSpace: "pre-wrap" }}>
            {result.analysis}
          </p>
        </div>
      )}
    </div>
  )
}

export default EmailAnalyzer