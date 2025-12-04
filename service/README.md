## Server Schema ##

User
```
{
    userId: string
    email: string
    password: string(hash)
    token: string
}
```

Friendship
```
{
    friendshipId: string
    initiatorId: string
    receiverId: string
    createdAt: Date
    status: "pending" : "accepted"
}
```
Match
```
{
    matchId: string
    player1Id: string
    player2Id: string
    quote: string
    status: "pending" : "in progress" : "complete"
}
```

### Websocket message shapes ###
client → server
```
{ "type": "join", "matchId": "abc123", "userId": "u1" }

{ "type": "progress", "matchId": "abc123", "userId": "u1", "progress": 0.45, "wpm": 72 }

{ "type": "finished", "matchId": "abc123", "userId": "u1", "timeMs": 15432 }
```

server → clients in that match
```
{ "type": "opponent_progress", "userId": "u1", "progress": 0.45, "wpm": 72 }

{ "type": "match_start", "startTime": 1733262000000, "text": "The quick brown fox..." }

{ "type": "match_result", "winnerUserId": "u1", "results": [ ... ] }
```

