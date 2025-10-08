import React from 'react';
import './home.css';

export function Home() {
  return (
    <main>
        <section className="matchStartSection">
            <h2>Join or start a match</h2>
            <div className="matchCodeInput">
              <input type="text" placeholder="Enter match Code"/>
              <button className="startButton">Join Match</button>
            </div>
            <button className="newMatchButton">Start a new match</button>
        </section>
        <section className="pastMatchesSection">
            <h2>Past Matches</h2>
            <ul>
                <li className="matchItem">match, winner, and speed <button>Rematch</button></li>
                <li className="matchItem">match, winner, and speed <button>Rematch</button></li>
                <li className="matchItem">match, winner, and speed <button>Rematch</button></li>
            </ul>
        </section>
    </main>
  );
}