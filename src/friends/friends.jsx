import React from 'react';
import './friends.css';

export function Friends() {
  return (
        <main>
            <section className="addFriendSection">
                {}
                <h2>Friends</h2>
                <input type="text" placeholder="Enter Friend's Name" className="friendInput"/>
                <button className="accentButton">Add Friend</button>
            </section>
            <section className="listSection">
              <h2>Current Friends</h2>
              <ul>
                  <li className="listItem">Friend Name <button className="primaryButton">Start Match</button></li>
                  <li className="listItem">Friend Name <button className="primaryButton">Start Match</button></li>
                  <li className="listItem">Friend Name <button className="primaryButton">Start Match</button></li>
              </ul>
            </section>
        </main>
  );
}