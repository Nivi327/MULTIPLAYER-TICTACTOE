import React, { useState } from 'react';
import './Home.css';
import {nanoid} from 'nanoid';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { addUser } from '../../Redux/dispatchActions';

const Home = () => {
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [joined, setJoined] = useState(false);

    const id = nanoid(6);
    const dispatch = useDispatch();

    const onNameChange = (e) => {
        setName(e.target.value);
    }

    const handleOnClick = () => {
        if(name === '') {
            setError('Name is Required.')
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        dispatch(addUser(name, id));

        setJoined(true);
    }

    return (
        <div className="home">
            <h2>TIC<span>TAC</span>TOE</h2>

            {!joined && <div className='text'>
                <span>Welcome to TICTACTOE multiplayer</span> <br />
                <span>You can enter your name and can play with your friends.</span>
            </div>}

            {
                joined && <div className="text">
                    <span>You can Invite your friend or you can join your friends room.</span>
                </div>
            }

            {error.length > 0 ? <p className='error'>{error}</p> : ''}

            {
                !joined ? <>
                    <input value={name} onChange={onNameChange} className='input-name' type='text' placeholder='Enter your name'></input>
                    <button className="btn-join" onClick={handleOnClick}>Find Opponent</button>
                </> : ''
            }
            {
                joined && <div className="show">
                    <div className="room-btns">
                        <Link to='/create-room'>
                            <button className='room-btn'>Invite a Friend</button>
                        </Link>
                        <Link to='/join-room'>
                            <button className='room-btn'>Join Room</button>
                        </Link>
                    </div>
                </div>
            }
        </div>
    )
}

export default Home