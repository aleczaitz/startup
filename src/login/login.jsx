import React from 'react';
import { NavLink } from 'react-router-dom';
import './login.css';

export function Login() {
  return (
    <main>
        <section className="jorvoHeader">
            <img src="JorvoLogo.png" alt="Jorvo Logo"/>
            <section className="loginSection">
                <h2>Login</h2>
                <form className ="loginForm" action="/home">
                    <input type ="text" className="username" name="username" placeholder="Username" required />
                    <input type ="password" className="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
            </section>
        </section>
    </main>
  );
}