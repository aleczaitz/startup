import React from 'react';
import './friends.css';

export function Friends() {
  return (
        <main>
            <h2>Friends</h2>
            <section className="addFriendSection">
                <input type="text" placeholder="Enter Friend's Name" className="friendInput"/>
                <button className="accentButton">Add Friend</button>
            </section>
            <section className="friendListSection">
              <h2>Current Friends</h2>
              <ul>
                  <li className="friendItem">Friend Name <button className="primaryButton">Start Match</button></li>
                  <li className="friendItem">Friend Name <button className="primaryButton">Start Match</button></li>
                  <li className="friendItem">Friend Name <button className="primaryButton">Start Match</button></li>
              </ul>
            </section>
        </main>
  );
}