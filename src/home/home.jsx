import React from 'react';

export function Home() {
  return (
    <main>
        <section className="matchStartSection">
            <h2>Join or start a match</h2>
            <input type="text" className="matchCodeInput" placeholder="Enter match Code"/>
            <button className="startButton">Join Match</button>
            <button className="newMatchButton">Start a new match</button>
        </section>
        <section>
            <h3>Past Matches</h3>
            <ul>
                <li className="matchItem">match, winner, and speed <button>Rematch</button></li>
                <li className="matchItem">match, winner, and speed <button>Rematch</button></li>
                <li className="matchItem">match, winner, and speed <button>Rematch</button></li>
            </ul>
        </section>
    </main>
  );
}