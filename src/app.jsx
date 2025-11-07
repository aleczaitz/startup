import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Home } from './home/home';
import { Friends } from './friends/friends';
import { About } from './about/about';
import { Drawer } from './components/drawer/drawer';



export default function App() {

    const [user, setUser] = useState(localStorage.getItem('user') || null);
    const [userId, setUserId] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedUserId = localStorage.getItem('userId');
        if (storedUser && storedUserId) {
            setUser(storedUser);
            setUserId(storedUserId);
        }
    }, []);


    return (
        <BrowserRouter>
            <div>
                <header className="container-fluid">
                    <nav className="navbar">
                        <div className="navbar-brand">
                            Jorvo
                        </div>
                        <div className='corner-container'>
                            {user && <span>{user}</span>}
                            <button className="navButton" onClick={()=> setIsOpen(!isOpen)}>☰</button>
                        </div>
                        <Drawer 
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            user={user}
                        />
                    </nav>
                </header>
                <Routes>
                    <Route path='/' element={<Login setUser={setUser} user={user} setUserId={setUserId} userId={setUserId}/>} exact />
                    <Route path='/home' element={<Home user={user} userId={userId}/>}/>
                    <Route path='/friends' element={<Friends user={user} userId={userId} />} />
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