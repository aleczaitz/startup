import React from 'react';

export function Friends() {
  return (
        <main>
            <section>
                <h2>Friends</h2>
                <input type="text" className="friendNameInput" placeholder="Enter Friend's Name"/>
                <button className="addFriendButton">Add Friend</button>
                <p>A list of added friends will appear hear</p>
            </section>
        </main>
  );
}