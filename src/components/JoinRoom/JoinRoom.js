import React, { useEffect, useState } from 'react';
import './JoinRoom.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const JoinRoom = ({socket}) => {
    const [error, setError] = useState('');
    const [roomId, setRoomId] = useState('');
    const [joined, setJoined] = useState(false);

    const {user} = useSelector((state) => state.user);
    console.log(user);

    useEffect(() => {
        if(!user) {
            window.location.href = '/';
        }

        socket.on('message', (payload) => {
            console.log(payload);
            if(payload.error) {
                setError(payload.error)
                setTimeout(() => {
                    setError('');
                }, 4000)
            } else {
                setJoined(true);
            }
        })
    }, []);

    const onChangeRoomId = (e) => {
        setRoomId(e.target.value);
    }

    const handleJoinRoom = () => {
        if(roomId.length === 0) {
            setError('Please enter room id')
            setTimeout(() => {
                setError('');
            }, 4000)
            return;
        }

        socket.emit('joinExistingRoom', {userName: user.userName, userId: user.userId, roomId});
    }


  return (
    <div className='join-room'>
        <h2>Join Game</h2>

        <div className='join-room-container'>
            <div className='url-container'>
                {error.length > 0 ? <p className='error'>{error}</p> : null}

                <input value={roomId} onChange={onChangeRoomId} className='name-input' placeholder='Enter RoomCode' type='text' />

                <button disabled={joined} onClick={handleJoinRoom} className='room-btn copy-btn'>{joined ? 'Joined': 'Join'}</button>
                
            </div>
            <div className='go-to-game'>
                {
                    joined ? <Link to={`/game/${roomId}`}>
                        <button className='room-btn'>Play Game</button>
                    </Link> : null
                }
            </div>
        </div>
    </div>
  )
}

export default JoinRoom