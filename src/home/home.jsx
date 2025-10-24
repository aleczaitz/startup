import React from 'react';
import './home.css';

export function Home({user}) {
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
        <section className="listSection">
            <h2>Past Matches</h2>
            <ul>
                <li className="listItem">match, winner, and speed <button className="primaryButton">Rematch</button></li>
                <li className="listItem">match, winner, and speed <button className="primaryButton">Rematch</button></li>
                <li className="listItem">match, winner, and speed <button className="primaryButton">Rematch</button></li>
            </ul>
        </section>
    </main>
  );
}