import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { ErrorMessage } from '../components/errorMessage/errorMessage';

export function Login({setUser, user}) {
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
      try {
        const msg = await authenticate();
        console.log(msg);
        navigate("/home");
        setUser(username);
        localStorage.setItem('user', username);
        setErrorMsg('');
      } catch (err) {
        console.log(err);
        setErrorMsg(err);
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

  async function authenticate() {
    console.log('authenticating...')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve('authentication successful');
        } else {
          reject('something went wrong, try again (this is a demo error)');
        }
      }, 2000);
    })
  }
  
  return (
    <main>
        <section className="loginContainer">
            <img src="JorvoLogo.png" alt="Jorvo Logo" className="loginLogo"/>
            {!user ? 
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
              :
              <h2>You're logged in as {user}</h2>}
              {errorMsg && <ErrorMessage message={errorMsg} />}
        </section>
    </main>
  );
}