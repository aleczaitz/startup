import React from 'react';

export function Friends() {
  return (
        <main>
            <section>
                <h2>Friends</h2>
                <input type="text" id="friendNameInput" placeholder="Enter Friend's Name"/>
                <button id="addFriendButton">Add Friend</button>
                <p>A list of added friends will appear hear</p>
            </section>
        </main>
  );
}