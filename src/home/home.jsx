import React, { useState } from 'react';
import './home.css';
import matchesData from '../../matches.json';

export function Home({user}) {

  const [ErrorMessage, setErrorMessage] = useState('');

  async function handleCreateMatch() {
    createMatch(`/api/match/create`)
  }

  async function createMatch(endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({
          inviterId: '',
          inviteeId: ''
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
      })
    } catch (err) {
      setErrorMessage(`Error: ${err}`);
    }
  }

  return (
    <main>
        <section className="matchStartSection">
            {user ? <h3>Welcome back, {user}!</h3> : <h3>Log in to join matches!</h3>}
            <h2>Join or start a match</h2>
            <div className="matchCodeInput">
              <input type="text" placeholder="Enter match Code"/>
              <button className="primaryButton">Join Match</button>
            </div>
            <button className="accentButton">Start a new match</button>
        </section>
        {user && <section className="listSection">
            <h2>Past Matches</h2>
            <ul>
              {matchesData.map((match) => (
                <li className="listItem" key={match.id}>
                  {user} vs {match.player2}  -  Winner: {user}  -  Duration: {match.duration}
                  <button className="primaryButton">Rematch</button>
                </li>
              ))}
            </ul>
        </section>}
    </main>
  );
}