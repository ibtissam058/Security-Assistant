import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import BreachChecker from "./components/BreachChecker"
import UrlScanner from "./components/UrlScanner"
import Chatbot from "./components/Chatbot"
import History from "./components/History"
import SecurityScore from "./components/SecurityScore"
import EmailAnalyzer from "./components/EmailAnalyzer"

function Dashboard() {
  const username = localStorage.getItem("username")

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    window.location.href = "/login"
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "650px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>🛡️ Security Assistant</h1>
        <div>
          <span style={{ color: "#888", marginRight: "1rem" }}>Hi, {username}</span>
          <button onClick={logout} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #555", color: "#888", borderRadius: "6px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>
      <BreachChecker />
      <UrlScanner />
      <Chatbot />
      <History />
      <SecurityScore />
      <EmailAnalyzer />
    </div>
  )
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App