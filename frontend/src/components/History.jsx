import { useState, useEffect } from "react"

function History() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/history", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await res.json()
      setScans(data)
      setLoading(false)
    }
    fetchHistory()
  }, [])

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>📋 Scan History</h2>

      {loading ? (
        <p style={{ color: "#888" }}>Loading...</p>
      ) : scans.length === 0 ? (
        <p style={{ color: "#888" }}>No scans yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333" }}>
              <th style={{ textAlign: "left", padding: "8px", color: "#888", fontSize: "13px" }}>Type</th>
              <th style={{ textAlign: "left", padding: "8px", color: "#888", fontSize: "13px" }}>Input</th>
              <th style={{ textAlign: "left", padding: "8px", color: "#888", fontSize: "13px" }}>Result</th>
              <th style={{ textAlign: "left", padding: "8px", color: "#888", fontSize: "13px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {scans.map(scan => (
              <tr key={scan.id} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "8px", fontSize: "13px", textTransform: "capitalize" }}>{scan.scan_type}</td>
                <td style={{ padding: "8px", fontSize: "13px", color: "#aaa", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{scan.input_data}</td>
                <td style={{ padding: "8px", fontSize: "13px" }}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    background: scan.threat_found === "true" ? "#3d1a1a" : "#1a3d1a",
                    color: scan.threat_found === "true" ? "#ff6b6b" : "#6bff6b"
                  }}>
                    {scan.threat_found === "true" ? "⚠️ Threat" : "✅ Safe"}
                  </span>
                </td>
                <td style={{ padding: "8px", fontSize: "13px", color: "#888" }}>{scan.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default History