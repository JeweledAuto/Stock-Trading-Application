import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { getCookie } from "./helpers/helper";

export default function Navbar() {

  const admins = ['Bross'];

  return (
    <nav className="nav">
      <ul>
      <CustomLink to="/Home">Market</CustomLink>
      <CustomLink to="/portfolio">Portfolio</CustomLink>
      <CustomLink to="/transactionhistory">Transaction History</CustomLink>
      </ul>
      <ul>
        {admins.includes(getCookie('UserID')) && <CustomLink to="/admin">Admin</CustomLink>}
        <CustomLink to="/wallet">Wallet</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}
