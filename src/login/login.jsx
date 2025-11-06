import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { ErrorMessage } from '../components/errorMessage/errorMessage';

export function Login({user, setUser, userId, setUserId}) {
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleCreateUser() {
    loginOrCreateUser(`/api/auth/create`);
  }

  async function handleLoginUser() {
    loginOrCreateUser(`/api/auth/login`)
  }

  async function loginOrCreateUser(endpoint) {
    if (!username || !password) {
      setErrorMsg('UserName and Password Required');
    } else {
      setIsAuthenticating(true)
      try {
        const response = await fetch(endpoint, {
          method: 'post',
          body: JSON.stringify({ email: username, password: password }),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
        });  
        const data = await response.json();
        console.log(data); // Remove?
        if (response?.status === 200) {
          setUser(username);
          localStorage.setItem('user', username);
          setUserId(data.userId);
          localStorage.setItem('userId', data.userId);
          setErrorMsg('');
        } else {
          setErrorMsg(`Error: ${data.msg}`);
        }
      } catch (err) {
        setErrorMsg(`Error: ${err}`);
      } finally {
        setIsAuthenticating(false);
      }
    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }
  
  return (
    <main>
        <section className="loginContainer">
            <img src="JorvoLogo.png" alt="Jorvo Logo" className="loginLogo"/>
            {!user ? 
              <div className ="loginForm">
                  <input type ="text" className="username" placeholder="Username" onChange={handleUsernameChange} required />
                  <input type ="password" className="password" placeholder="Password" onChange={handlePasswordChange} required />
                  <button type="submit" className="loginButton" onClick={handleLoginUser} disabled={isAuthenticating}>{
                    isAuthenticating ? (
                      <div className="spinner-container">
                        Authenticating
                         <span className="spinner"></span>
                      </div>
                    ) : (
                      <div>Login</div>
                    )
                  }</button>
                  <button type="submit" className="primaryButton" onClick={handleCreateUser} disabled={isAuthenticating}>{
                    isAuthenticating ? (
                      <div className="spinner-container">
                        Authenticating
                         <span className="spinner"></span>
                      </div>
                    ) : (
                      <div>Create Account</div>
                    )
                  }</button>
              </div>
              :
              <h2>You're logged in as {user}</h2>}
              {errorMsg && <ErrorMessage message={errorMsg} />}
        </section>
    </main>
  );
}