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
    freindshipId: string
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
    player1: string
    player2: string
    quote: string
    status: "pending" : "in progress" : "complete"
}
```