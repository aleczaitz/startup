import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { ErrorMessage } from '../components/ErrorMessage';

export function Login({setUser}) {
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);



  async function handleLogin() {
    if (!username || !password) {
      setErrorMsg('Enter username and password');
      return;
    } else {
      setIsAuthenticating(true);
      await authenticate();
      setUser(username);
      localStorage.setItem('user', username);
      setErrorMsg('');
      setIsAuthenticating(false);
      navigate("/home")

    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function authenticate() {
    console.log('authenticating...')
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('authentication complete');
  }

  
  return (
    <main>
        <section className="loginContainer">
            <img src="JorvoLogo.png" alt="Jorvo Logo" className="loginLogo"/>
              <div className ="loginForm">
                  <input type ="text" className="username" placeholder="Username" onChange={handleUsernameChange} required />
                  <input type ="password" className="password" placeholder="Password" onChange={handlePasswordChange} required />
                  <button type="submit" className="loginButton" onClick={handleLogin} disabled={isAuthenticating}>{
                    isAuthenticating ? (
                      <div className="spinner-container">
                        Authenticating
                         <span className="spinner"></span>
                      </div>
                    ) : (
                      <div>Login</div>
                    )
                  }</button>
              </div>
              {errorMsg && <ErrorMessage message={errorMsg} />}
        </section>
    </main>
  );
}