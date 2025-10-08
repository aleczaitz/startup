import React from 'react';
import { NavLink } from 'react-router-dom';
import './login.css';

export function Login() {
  return (
    <main>
        <section className="loginContainer">
            <img src="JorvoLogo.png" alt="Jorvo Logo" className="loginLogo"/>
              <form className ="loginForm" action="/home">
                  <input type ="text" className="username" name="username" placeholder="Username" required />
                  <input type ="password" className="password" name="password" placeholder="Password" required />
                  <button type="submit" className="loginButton">Login</button>
              </form>
        </section>
    </main>
  );
}