import React, { useState, useEffect } from 'react';
import './friends.css';
import friendData from '../../friends.json'

export function Friends({user, userId}) {

  const [friends, setFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user && userId) {
      console.log('fetching friends')
      fetchFriends();
    }
  }, [user, userId]);

  // fills in the friends array with user objects that user has a friendship with
  async function fetchFriends() {
    const response = await fetch(`/api/friendships/${userId}`);
    const friendships = await response.json();

    if (!Array.isArray(friendships)) {
      console.error('Expected array, got:', friendships);
      return;
    }

    const friendfetches = friendships.map(async (f) => {
      const otherId = userId === f.initiatorId ? f.receiverId : f.initiatorId;
      const response = await fetch(`/api/users/id/${otherId}`);
      return response.json();
    })

    const friendObjects = await Promise.all(friendfetches);
    setFriends(friendObjects);
    console.log(friendObjects);
  }



  async function handleCreateFriendship(recieverEmail) {
    try {
      const receiverUserObject = await fetchUserIdByEmail(recieverEmail);
      const receiverId = receiverUserObject.userId;
      if (!receiverUserObject) {
        setErrorMessage("User not found.");
        return;
      }
      const response = await fetch(`/api/friendships/create`, {
        method: 'post',
        body: JSON.stringify({ initiatorId: userId, receiverId: receiverId}),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
      });
      const data = await response.json();
      if (response?.status === 200) {
        fetchFriends();
      }
    } catch (err) {
      console.log(`Error: ${err.msg}`)
      return;
    }
  }

  // function to fetch the user's id by email, returns a user object
  async function fetchUserIdByEmail(email) {
    try{
        console.log(email);
        const response = await fetch(`/api/users/email/${email}`);
        console.log(response);
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
                <button className="accentButton" onClick={() => handleCreateFriendship(friendEmail)}>Add Friend</button>
                {errorMessage && <p className="errorText">{errorMessage}</p>}
            </section>

            {user && <section className="listSection">
              <h2>Current Friends</h2>
              {friends.length < 1 && <h3>Get some friends bro...</h3>}
              <ul>
                {friends.length > 0 && friends.map((f) => (
                  <li key={f.user.userId} className="listItem"> {f.user.email}
                  <button className="primaryButton">Start Match</button>
                  </li>
                ))}
              </ul>
            </section>}
        </main>
  );
}
