import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import './login.css';
import { ErrorMessage } from '../components/ErrorMessage';

export function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  function handleLogin() {
    if (!username || !password) {
      setErrorMsg('Enter username and password');
    } else {
      setErrorMsg('');
      console.log("Login button clicked");
      localStorage.setItem('user', username);
    }
  }

  function handleUserNameTextChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordTextChange(e) {
    setPassword(e.target.value);
  }
  
  return (
    <main>
        <section className="loginContainer">
            <img src="JorvoLogo.png" alt="Jorvo Logo" className="loginLogo"/>
              <form className ="loginForm" action="/home">
                  <input type ="text" className="username" name="username" placeholder="Username" onChange={handleUserNameTextChange} required />
                  <input type ="password" className="password" name="password" placeholder="Password" onChange={handlePasswordTextChange} required />
                  <button type="submit" className="loginButton" onClick={handleLogin}>Login</button>
              </form>
              {errorMsg && <ErrorMessage message={errorMsg} />}
        </section>
    </main>
  );
}