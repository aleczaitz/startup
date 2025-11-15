import React, { useState, useEffect } from 'react';
import './friends.css';
import friendData from '../../friends.json'

export function Friends({user, userId}) {

  const [friends, setFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user && userId) {
      fetchFriends();
    }
    fetchUsers();
  }, [user, userId]);

  // fills in the friends array with user objects that user has a friendship with
  async function fetchFriends() {
    const response = await fetch(`/api/friendships/${userId}`);
    if (response.status === 404) {
      return;
    }
    const friendships = await response.json();

    const friendfetches = friendships.map(async (f) => {
      const otherId = userId === f.initiatorId ? f.receiverId : f.initiatorId;
      const response = await fetch(`/api/users/id/${otherId}`);
      return response.json();
    })

    const friendObjects = await Promise.all(friendfetches);
    setFriends(friendObjects);
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
      console.log(data);

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
        const response = await fetch(`/api/users/email/${email}`);
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

  async function fetchUsers() {
    try {
      const response = await fetch('/api/users');

      if (!response.ok) {
        if (response.status === 404) {
          // depending on how you design the API, but if we fix backend, this won't happen
          setErrorMessage('Looks like there are no users yet');
          setUsers([]); // keep users as an array
          return;
        }

        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []); // defensive
    } catch (err) {
      console.error(err);
      setErrorMessage(`Error: ${err.message ?? err}`);
    }
  }

  return (
        <main>
            <section className="inputButtonSection">
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
                {friends.length > 0 && friends.map((u) => (
                  <li key={u.userId} className="listItem"> {u.email}
                  <button className="primaryButton">Start Match</button>
                  </li>
                ))}
              </ul>
            </section>}
            <section className="listSection">
              <h2>Other Users</h2>
              <ul>
              {users.length > 1 ? users.filter((u) => u.userId !== userId && !friends.some((f) => f.user.userId === u.userId) ).map((u) => (
                <li key={u.userId} className="listItem">
                  {u.email}
                  <button className="primaryButton" onClick={() => handleCreateFriendship(u.email)}>Add Friend</button>
                </li>
              )) : <h3>No other users yet... </h3>}
              </ul>
            </section>
        </main>
  );
}
