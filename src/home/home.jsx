import React, { useState, useEffect } from 'react';
import './home.css';


export  function Home({user, userId}) {
  
  const [errorMessage, setErrorMessage] = useState('');
  const [matches, setMatches] = useState([]);
  const [matchEmail, setMatchEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user && userId) {
      fetchMatches(userId);
    }
  }, [user, userId])
  
  async function createMatch(inviteeEmail) {
    try {
      const response = await fetch(`/api/matches/create`, {
        method: 'post',
        body: JSON.stringify({
          inviterId: userId,
          inviteeEmail: inviteeEmail
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      })
  
      const data = await response.json();
  
      if (response.ok) fetchMatches();
  
    } catch (err) {
      setErrorMessage(`Error: ${err}`);
    }
  }

  async function fetchMatches() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/matches/userId/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.msg);
        setIsLoading(false);
        return;
      }

      setMatches(data);
      setIsLoading(false);

    } catch (err) {
      setErrorMessage(`Error: ${err.message}`)
      setIsLoading(false);
      return;
    }
  }


  async function acceptMatch(matchId) {
    try {
      const response = await fetch(`/api/matches/accept`, {
        method: 'put',
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({ matchId: matchId, accepterId: userId })
      })

      const data = await response.json();

      if (response.ok) {
        await fetchMatches();
        
      } else {
        setErrorMessage(`Error: ${data.msg}`)
      }

    } catch (err) {
      setErrorMessage(`Error: ${err.message}`)
    }
  } 

  async function finishMatch(matchId) {
    try {
      const response = await fetch(`/api/matches/complete`, {
        method: 'put',
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({ matchId: matchId, userId: userId })
      })
      const data = await response.json();

      if (response.ok) {
        fetchMatches();
      } else {
        console.log(data.msg)
      }

    } catch (err) {
      setErrorMessage(`Error: ${err.message}`)
    }
  }

   
  return (
    <main>
        <section className="inputButtonSection">
            <h3>{errorMessage}</h3>
            <h2>Start a match</h2>
            {user ? <h3>Welcome back, {user}!</h3> : <h3>Log in to join matches!</h3>}
            <input
              type ='text'
              placeholder="Enter a user's email"
              value={matchEmail}
              onChange={(e) => setMatchEmail(e.target.value)}
            />
            <button className="primaryButton" onClick={() => createMatch(matchEmail)}>Start a new match</button>
        </section>
        {!isLoading ? <section className="listSection">
            <h2>Matches</h2>
            <ul>
              {matches.map((m) => {
                const opponentId = (userId === m.player1Id ? m.player2Id : m.player1Id);
                const opponentEmail = (m.player1Id === opponentId ? m.player1Email : m.player2Email);

                return (
                  <li key={m.matchId} className='matchListItem'>
                    <div className='leftHalfContainer'>
                      <h3>{opponentEmail}<span className='dateLabel'>{new Date(m.createdAt).toLocaleString()}</span></h3>
                      {m.quote && (<span>{m.quote}</span>)}
                    </div>
                    <div className='rightHalfContainer'>
                      <div className="statusTag">status: {m.status}</div>
                      {m.status === 'pending' && m.player1Id !== userId && (
                        <button className='accentButton' onClick={() => acceptMatch(m.matchId)}>accept invite</button>
                      )}
                      {m.status === 'in progress' && (
                        <button className='accentButton' onClick={() => finishMatch(m.matchId)}>Finish match</button>
                      )}
                      {m.status === 'complete' && (
                        <button className='primaryButton' onClick={() => createMatch(opponentEmail)}>Rematch</button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
        </section> :
        <h1>Loading...</h1>
        }
    </main>
  );
}