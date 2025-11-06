import React, { useState, useEffect } from 'react';
import './friends.css';
import friendData from '../../friends.json'

export function Friends({user, userId}) {

  const [friends, setFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  async function fetchFriends() {
    const response = await fetch(`/api/friendships/${userId}`);
    const data = await response.json();
    setFriends(data);
  }

  async function handleCreateFriendship(recieverId) {
    try {
      const response = await fetch(`/api/friendships/create`, {
        method: 'post',
        body: JSON.stringify({initiatorId: userId, recieverId: recieverId}),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
      });
      const data = await response.json();
      if (response?.status === 200) {
        // Todo
      }
    } catch (err) {
      return;
    }
  }

  async function fetchUserIdByEmail(email) {
    try{
        const response = await fetch(`api/users/${email}`);
      if (response?.status === 200) {
        const data = await response.json();
        return data;
      } else {
        console.log('something went wrong with fetching userId')
      }
    } catch (err) {
      console.log(`Error: ${err.msg}`)
    }
    
  }

  

  return (
        <main>
            <section className="addFriendSection">
                <h2>Friends</h2>
                {!user && <h3>Please log in to view and manage your friends.</h3>}
                <input 
                  type="text" 
                  placeholder="Enter Friend's email" 
                  className="friendInput"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                />
                <button className="accentButton">Add Friend</button>
            </section>

            {user && <section className="listSection">
              <h2>Current Friends</h2>
              <ul>
              </ul>
            </section>}
        </main>
  );
}
// todo: map out friends to friendships and display them here.