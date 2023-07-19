import React, { useEffect, useState } from 'react'
import './Room.css'
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const roomId = nanoid(7)

const Room = ({ socket }) => {
  const [copyBtnValue, setCopyBtnValue] = useState('Copy')
  const [copied, setCopied] = useState(false)

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [])

  useEffect(() => {
    console.log(user);
    socket.emit('joinRoom', { userName: user.userName, userId: user.userId, roomId });
  }, [socket])

  useEffect(() => {
    socket.on('message', (payload) => {
      console.log(payload)
    })

    socket.on('message', (message) => {
      console.log(message);
    });
  }, [])

  function copyText() {
    navigator.clipboard.writeText(roomId);

    setCopyBtnValue('Copied');
    setCopied(true);

    setInterval(() => {
      setCopyBtnValue('Copy');
      setCopied(false);
    }, 3000)
  }

  return (
    <div className='create-room'>
      <h2>Invite A Friend</h2>

      <div className="text">
        <span>You can invite a friend by sharing this code.</span>
      </div>

      <div className="create-room-container">
        <div className="url-container">

          <input value={roomId} className='name-input url-input' type="text" disabled={true} />
          <button className={copied ? `room-btn copy-btn copied` : `room-btn copy-btn`} onClick={copyText} >{copyBtnValue}</button>
        </div>
        <div className="go-to-game">
          <Link to={`/game/${roomId}`}> <button className='room-btn' >Play Game</button> </Link>
        </div>
      </div>
    </div>
  )
}

export default Room;