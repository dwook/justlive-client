import React from 'react';
import {} from 'react-router-dom';
import Headers from './components/Header/Header';
import Booking from './components/Booking/Booking';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Headers />
      <div className="main">
        <Booking />
      </div>
    </div>
  );
}

export default App;
