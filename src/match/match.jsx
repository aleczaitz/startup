import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './match.css';

export function Match(props) {
    const { matchId } = useParams();
    const [status, setStatus] = useState('waiting');
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        // const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);
        const ws = new WebSocket('ws://localhost:4000'); // or 'ws://localhost:4000/ws' if you later set path


        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: 'join',
                    matchId,
                    userId: props.userId
                })
            )
        }

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === 'match_start') {
                setStatus('started');
                // store msg.text, msg.startTime, etc.
            }

            if (msg.type === 'opponent_left') {
                setStatus('opponent_left');
            }
        }
        setWebSocket(ws);
        return () => ws.close();
    }, [matchId]);

    return (
        <main>
            {status === 'waiting' && <p>Waiting for the other player to join…</p>}
            {status === 'started' && <p>Race started!</p>}
            {status === 'opponent_left' && <p>Your opponent left the match.</p>}
            {/* here you’ll render the typing UI once started */}
        </main>
    )
}