import Navbar from "./Navbar"
import Portfolio from "./pages/Portfolio"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import TransactionHistory from "./pages/TransactionHistory"
import Admin from "./pages/Admin"
import Wallet from "./pages/Wallet"
import { Route, Routes } from "react-router-dom"
import { getCookie } from "./helpers/helper"

function App() {


  return (
    <>
        { getCookie('UserID') && <Navbar /> }
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/transactionhistory" element={<TransactionHistory />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
    </>
  )
}

export default App
