import React from 'react';
import './friends.css';
import friendData from '../../friends.json'

export function Friends({user}) {
  return (
        <main>
            <section className="addFriendSection">
                <h2>Friends</h2>
                {!user && <h3>Please log in to view and manage your friends.</h3>}
                <input type="text" placeholder="Enter Friend's Name" className="friendInput"/>
                <button className="accentButton">Add Friend</button>
            </section>
            {user && <section className="listSection">
              <h2>Current Friends</h2>
              <ul>
                  {user && friendData.map((friend) => (
                      <li key={friend.friend_id} className="listItem">
                        {friend.friend_name} - since {friend.date_added}
                        <button className="primaryButton">Start match</button>
                      </li>
                  ))}
              </ul>
            </section>}
        </main>
  );
}