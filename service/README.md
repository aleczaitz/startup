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