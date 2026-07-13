import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register() {
  const [form, setForm] = useState({ email: "", username: "", password: "" })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", data.username)
      navigate("/dashboard")
    } else {
      setError(data.detail)
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem", fontFamily: "Arial" }}>
      <h2>Create account</h2>
      <p style={{ color: "#888", marginBottom: "1.5rem" }}>Join Security Assistant</p>

      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #333", background: "#1a1a2e", color: "white" }}
      />
      <input
        placeholder="Username"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #333", background: "#1a1a2e", color: "white" }}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #333", background: "#1a1a2e", color: "white" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleSubmit}
        style={{ width: "100%", padding: "12px", background: "#2E86C1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginBottom: "10px" }}
      >
        Register
      </button>

      <p style={{ textAlign: "center", color: "#888" }}>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={{ color: "#2E86C1", cursor: "pointer" }}>
          Login
        </span>
      </p>
    </div>
  )
}

export default Register