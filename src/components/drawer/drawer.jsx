import React from 'react';
import './drawer.css';

export function Drawer({isOpen, setIsOpen, user}) {
    return (
        <div className='corner-container'>
            {user && <span>{user}</span>}
            <button className="navButton" onClick={()=> setIsOpen(!isOpen)}>☰</button>
        </div>
    )
}