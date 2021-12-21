import React, { useState } from 'react';
import * as ReactDOM from 'react-dom';
import './App.css'
import Card from './components/card/Card';
import Header from './components/header/Header';
import { LeafMode } from './models/models';

const App = () => {
    const [mode, setmode] = useState<LeafMode>("Card")

    return(
        <div className='app'>
            <Header mode={mode} modeHandler={setmode}/>
            <h1>{mode}</h1>
            <Card />
        </div>
    )
}

export default App
