import './App.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home/Home';

import io from 'socket.io-client';
import CreateRoom from './components/Room/Room';
import JoinRoom from './components/JoinRoom/JoinRoom';
import Game from './components/Game/Game';
import Footer from './components/Footer/Footer';

const socket = io.connect("https://server-tictactoe-multiplayer.onrender.com/");

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} ></Route>
          <Route path='/create-room' element={<CreateRoom socket={socket}/>}></Route>
          <Route path='/join-room' element={<JoinRoom socket={socket}/>}></Route>
          <Route path='/game/:roomId' element={<Game socket={socket} />}></Route>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
