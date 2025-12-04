import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './match.css';

export function Match(props) {
    const navigate = useNavigate();
    const { matchId } = useParams();
    const [status, setStatus] = useState('waiting'); // 'waiting' | 'started' | 'finished' | 'opponent_left'
    const [webSocket, setWebSocket] = useState(null);

    const [quote, setQuote] = useState('');
    const [startTime, setStartTime] = useState(null);

    const [input, setInput] = useState('');
    const [myCorrectCount, setMyCorrectCount] = useState(0);
    const [opponentProgress, setOpponentProgress] = useState(0); // 0..1
    const [winnerId, setWinnerId] = useState(null);

    useEffect(() => {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);
        // const ws = new WebSocket('ws://localhost:4000');


        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: 'join',
                    matchId,
                    userId: props.userId,
                }),
            );
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === 'match_start') {
                setStatus('started');
                setQuote(msg.text || '');
                setStartTime(msg.startTime || Date.now());
                setInput('');
                setMyCorrectCount(0);
                setOpponentProgress(0);
                setWinnerId(null);
            }

            if (msg.type === 'opponent_left') {
                setStatus('opponent_left');
            }

            if (msg.type === 'opponent_progress') {
                if (msg.userId !== props.userId) {
                    // server sends progress as 0..1
                    setOpponentProgress(msg.progress ?? 0);
                }
            }

            if (msg.type === 'match_result') {
                setWinnerId(msg.winnerUserId);
                setStatus('finished');
            }

            if (msg.type === 'error') {
                console.error('WS error:', msg.message);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
        };

        setWebSocket(ws);
        return () => ws.close();

    }, [matchId, props.userId]);

    function countCorrectPrefix(typed, target) {
        let i = 0;
        while (i < typed.length && i < target.length && typed[i] === target[i]) {
        i++;
        }
        return i;
    }

    function handleChange(e) {
        const value = e.target.value;
        setInput(value);

        if (!quote || !startTime || !webSocket) return;

        const correctCount = countCorrectPrefix(value, quote);
        setMyCorrectCount(correctCount);

        const progress = Math.min(correctCount / quote.length, 1);

        const now = Date.now();
        const elapsedMinutes = Math.max((now - startTime) / 60000, 0.001);
        const wordsTyped = correctCount / 5; // only count correct chars
        const wpm = Math.round(wordsTyped / elapsedMinutes);

        webSocket.send(
        JSON.stringify({
            type: 'progress',
            matchId,
            userId: props.userId,
            progress,
            wpm,
        }),
        );

        // Must type the *exact* quote to finish
        if (value === quote) {
            const timeMs = now - startTime;
            webSocket.send(
                JSON.stringify({
                type: 'finished',
                matchId,
                userId: props.userId,
                timeMs,
                }),
            );
            finishMatch(matchId);
            // Server will broadcast match_result
        }
    }
    async function finishMatch(matchId) {
        try {
            const response = await fetch(`/api/matches/complete`, {
            method: 'put',
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({ matchId: matchId, userId: props.userId })
            })
            const data = await response.json();

            if (response.ok) {

            } else {
            console.log(data.msg)
            }

        } catch (err) {
            return;
        }
    }

    const opponentCharsFilled = Math.floor(opponentProgress * quote.length);
    const iAmWinner = winnerId && winnerId === props.userId;
    const iAmLoser = winnerId && winnerId !== props.userId;


  return (
    <main className="match-page">
      {status === 'waiting' && <p>Waiting for the other player to join…</p>}

      {status === 'started' && (
        <div className="race-container">
          {/* YOU */}
          <section className="player-section">
            <h3>You</h3>
            <div className="quote-line">
              <span className="correct">
                {quote.slice(0, myCorrectCount)}
              </span>
              <span className="incorrect">
                {quote.slice(myCorrectCount, input.length)}
              </span>
              <span className="remaining">
                {quote.slice(input.length)}
              </span>
            </div>

            <input
              className="typing-input"
              type="text"
              value={input}
              onChange={handleChange}
              autoFocus
              disabled={status !== 'started'}
              placeholder="Type the quote here…"
            />
          </section>

          {/* OPPONENT */}
          <section className="player-section opponent">
            <h3>Opponent</h3>
            <div className="quote-line">
              <span className="opponent-correct">
                {quote.slice(0, opponentCharsFilled)}
              </span>
              <span className="remaining">
                {quote.slice(opponentCharsFilled)}
              </span>
            </div>
          </section>
        </div>
      )}

      {status === 'finished' && (
        <div className="result-section">
          <p>Race finished!</p>
          {iAmWinner && <p>You won!</p>}
          {iAmLoser && <p>You lost — rematch?</p>}
          <button className='accentButton' onClick={() => navigate('/home')}>Go Home</button>
        </div>
      )}

      {status === 'opponent_left' && <p>Your opponent left the match.</p>}
    </main>
  );
}