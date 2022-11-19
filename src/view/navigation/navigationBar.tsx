import { Link } from "react-router-dom";

import './navigationBar.css';

/**
 * Nav bar component
 */
export default function NavBar() {
    return <div className="nav-bar">
        <span className="title">
            CACTUS OF THINGS
        </span>
        <Link to='/'>HOME</Link>
        <Link to='/dashboard'>DASHBOARD</Link>
    </div>
}