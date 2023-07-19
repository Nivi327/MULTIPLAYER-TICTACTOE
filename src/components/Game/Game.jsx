import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import './Game.css';

const moves = [{ move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }, { move: -1, myMove: false, curUserId: '' }];

const Game = ({ socket }) => {
  const [roomId, setRoomId] = useState('');
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingValue, setLoadingValue] = useState('Waiting for another player...');

  const [userTurn, setUserTurn] = useState(false);
  const [userJoined, setUserJoined] = useState(false);

  const [winner, setWinner] = useState('');
  const [winnerId, setWinnerId] = useState('');

  const [users, setUsers] = useState({});

  const [gameEnd, setGameEnd] = useState(false);
  const [leaveRoom, setLeaveRoom] = useState(false);

  const [winPattern, setWinPattern] = useState([]);
  const [move, setMove] = useState();
  const [allMoves, setAllMoves] = useState([]);

  const { user } = useSelector(state => state.user)

  const params = useParams();

  useEffect(() => {
    window.onbeforeunload = function (event) {
      event.preventDefault();
      window.setTimeout(function () {
        window.location = '/';
        try {
          if (roomId !== undefined && roomId !== '') {
            socket.emit('removeRoom', { roomId });
          }
          else if (roomId !== undefined && roomId.length !== 0) {
            socket.emit('removeRoom', { roomId });
          }
        } catch (err) {
          console.log(err);
        }
      }, 0);
    }

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (e) {
      window.history.pushState(null, this.document.title, window.location.href);
    })
  })

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
    console.log('userEntered')
    socket.emit('userEntered', { roomId: params?.roomId, userId: user?.userId })
    socket.on('userEntered', (data) => {
      setUsers(data);
      console.log(data.user1?.userId === user?.userId);
      if (data.user1?.userId === user?.userId) {
        setOpponentName(data.user2.userName);
      } else {
        setOpponentName(data.user1.userName);
      }

      setLoading(false);
    })

  }, [socket, user, params?.roomId])

  useEffect(() => {
    setRoomId(params?.roomId);
  }, [params?.roomId]);

  useEffect(() => {
    socket.on('move', (payload) => {
      console.log(payload, user);
      setMove({ move: payload.move, myMove: payload?.userId === user?.userId });

      setAllMoves([...allMoves, move]);

      moves[payload.move].move = 1;
      moves[payload.move].curUserId = user?.userId;
      moves[payload.move].myMove = payload?.userId === user?.userId;
      console.log(moves);

      if (payload?.userId !== user?.userId) {
        setUserTurn(false);
      }
    })

    socket.on('win', (payload) => {
      setWinPattern(payload.pattern);
      setGameEnd(true);
      if (payload?.userId === user?.userId) {
        setWinner('You won!');
        setMyScore(myScore + 1);
      } else {
        setWinner(`You Lost, ${payload.userName} won!`);
        setOpponentScore(opponentScore + 1);
      }

      setWinnerId(payload?.userId);
      setUserTurn(false);
    })

    socket.on('draw', (payload) => {
      setWinner('Draw !');
      setGameEnd(true);
      setUserTurn(true);
      setLoadingValue('');
    })
  })

  useEffect(() => {
    socket.on('reMatch', ({ curGameDetail }) => {
      moves.forEach((m) => {
        m.move = -1;
        m.myMove = false;
      })
      setWinner('');
      setUserTurn(user?.userId !== winnerId);
      setGameEnd(false);
    })

    socket.on('removeRoom', (payload) => {
      setUserJoined(false);
      setLeaveRoom(true);
    })
  })

  useEffect(() => {
    socket.on('userLeave', (payload) => {
      setLoadingValue(`${opponentName} left the game`);
      setLoading(true);
      setUserJoined(false);
    })
  })

  const handleOnClickMove = (m) => {
    if (loading && !userJoined) {
      return;
    }

    socket.emit('move', { move: m, roomId, userId: user?.userId });

    moves[m].move = 1
    moves[m].myMove = true;

    setUserTurn(true);
  }

  const handlePlayAgian = () => {
    socket.emit('reMatch', { roomId });
  }

  const handleClose = () => {
    socket.emit('removeRoom', { roomId });
    return true;
  }

  return (
    <div className="game">
      <h2>Tic Tac Toe</h2>
      <p><span className='room-id'>Room Id </span> : {roomId}</p>
      <div className='score'>
        <p><span className='room-you'>You </span>: {myScore}</p>
        <p><span className="room-opp">{opponentName}</span> : {opponentScore}</p>
      </div>
      {winner && winner !== 'Draw !' && winner.length > 0 ? <div className="winner">
        <h3>{winner}</h3>
        <div className={`line p${winPattern}`}></div>
      </div> : null}

      <div className="grid-container">
        <div onClick={moves[1].move === -1 && !winner ? () => handleOnClickMove(1) : null} className={moves[1].move === -1 ? `grid-item-hover grid-item bottom right` : `grid-item bottom right`}>{moves[1].move !== -1 ? (moves[1].myMove ? 'O' : 'X') : null}</div>
        <div onClick={moves[2].move === -1 && !winner ? () => handleOnClickMove(2) : null} className={moves[2].move === -1 ? `grid-item-hover grid-item bottom right` : `grid-item bottom right`}>{moves[2].move !== -1 ? (moves[2].myMove ? 'O' : 'X') : null}</div>
        <div onClick={moves[3].move === -1 && !winner ? () => handleOnClickMove(3) : null} className={moves[3].move === -1 ? `grid-item-hover grid-item bottom` : `grid-item bottom`}>{moves[3].move !== -1 ? (moves[3].myMove ? 'O' : 'X') : null}</div>
        <div onClick={moves[4].move === -1 && !winner ? () => handleOnClickMove(4) : null} className={moves[4].move === -1 ? `grid-item-hover grid-item bottom right` : `grid-item bottom right`}>{moves[4].move !== -1 ? (moves[4].myMove ? 'O' : 'X') : null}</div>
        <div onClick={moves[5].move === -1 && !winner ? () => handleOnClickMove(5) : null} className={moves[5].move === -1 ? `grid-item-hover grid-item bottom right` : `grid-item bottom right`}>{moves[5].move !== -1 ? (moves[5].myMove ? 'O' : 'X') : null}</div>
        <div onClick={moves[6].move === -1 && !winner ? () => handleOnClickMove(6) : null} className={moves[6].move === -1 ? `grid-item-hover grid-item bottom` : `grid-item bottom`}>{moves[6].move !== -1 ? (moves[6].myMove ? 'O' : 'X') : null}</div>
        <div onClick={moves[7].move === -1 && !winner ? () => handleOnClickMove(7) : null} className={moves[7].move === -1 ? `grid-item-hover grid-item right` : `grid-item right`}>{moves[7].move !== -1 ? (moves[7].myMove ? 'O' : 'X') : null}</div>
        <div onClick={moves[8].move === -1 && !winner ? () => handleOnClickMove(8) : null} className={moves[8].move === -1 ? `grid-item-hover grid-item right` : `grid-item right`}>{moves[8].move !== -1 ? (moves[8].myMove ? 'O' : 'X') : null}</div>
        <div onClick={moves[9].move === -1 && !winner ? () => handleOnClickMove(9) : null} className={moves[9].move === -1 ? `grid-item-hover grid-item` : `grid-item`}>{moves[9].move !== -1 ? (moves[9].myMove ? 'O' : 'X') : null}</div>
      </div>

      {loading ? <div className="loading">{loadingValue}</div> : userTurn ? <div className="loading">{`Waiting for ${opponentName}'s response`}</div> : null}

      {
        gameEnd ? <div className="game-end">
          {!leaveRoom ? <button onClick={handlePlayAgian} className='room-btn'>Play Again</button> : null}

          <form action="/" onSubmit={handleClose}>
            <button className="room-btn">Close</button>
          </form>
        </div> : null
      }
    </div>
  )
}

export default Game