import { useState } from "react"

function Chatbot() {
  const [message, setMessage] = useState("")
  const [reply, setReply] = useState(null)
  const [loading, setLoading] = useState(false)

  const askChatbot = async () => {
    setLoading(true)
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    })
    const data = await res.json()
    setReply(data.reply)
    setLoading(false)
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>🤖 Security Chatbot</h2>
      <textarea
        placeholder="Paste a suspicious email or ask a security question..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={5}
        style={{ padding: "10px", width: "400px", display: "block", marginBottom: "10px" }}
      />
      <button onClick={askChatbot} style={{ padding: "10px 20px" }}>
        {loading ? "Analyzing..." : "Ask"}
      </button>

      {reply && (
        <div style={{ marginTop: "15px", padding: "15px", background: "#1a1a2e", borderRadius: "8px" }}>
          <p style={{ whiteSpace: "pre-wrap" }}>{reply}</p>
        </div>
      )}
    </div>
  )
}

export default Chatbot