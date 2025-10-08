import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Home } from './home/home';
import { Friends } from './friends/friends';
import { About } from './about/about';


export default function App() {
  return (
    <BrowserRouter>
        <div>
            <header className="container-fluid">
                <nav className="navbar">
                    <div className="navbar-brand">
                        Jorvo
                    </div>
                    <menu>
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
                    </menu>
                </nav>
            </header>
            <Routes>
                <Route path='/' element={<Login />} exact />
                <Route path='/home' element={<Home />} />
                <Route path='/friends' element={<Friends />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <footer>
  <p>&copy; 2025 Jorvo. All rights reserved. Product of Alec Zaitz</p>
  <a href="https://github.com/aleczaitz/startup" className="githubLink" target="_blank" rel="noopener noreferrer">
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
      alt="GitHub Logo"
      style={{ width: '24px', verticalAlign: 'middle', marginRight: '6px' }}
    />
    Github
  </a>
</footer>
        </div>
    </BrowserRouter>
  )
}

function NotFound() {
    return (
        <main className="container-fluid bg-secondary text-center">
        <div>404 - Not Found</div>
        </main>
    );
}