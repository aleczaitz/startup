import React, { useEffect } from 'react';
import './drawer.css';
import { NavLink, useLocation } from 'react-router-dom';

export function Drawer({isOpen, setIsOpen, user}) {

    const location = useLocation();

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname])

    function handleSignOut() {
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    return (
        <nav className={`drawer ${isOpen ? 'open' : ''}`}>
            <button className="navButton" onClick={()=> setIsOpen(!isOpen)}>→</button>
                <menu className="drawerMenu">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">Login</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/home">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/friends">Friends</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/about">About</NavLink>
                    </li>
                    <li className="nav-item">
                        <div onClick={handleSignOut}>Sign Out</div>
                    </li>
                </menu> 
        </nav>
    )
}