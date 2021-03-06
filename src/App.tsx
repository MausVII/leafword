import React, { useState } from 'react';
import { createTheme } from '@mui/material';
import './App.css'
import Card from './components/card/Card';
import Header from './components/header/Header';
import { LeafMode } from './models/models';
import { ThemeProvider } from '@emotion/react';
import InputCard from './components/input_card/InputCard';

const theme = createTheme({
    palette: {
        primary: {
            main: '#d49c6b',
        },
        secondary: {
            main: '#f6fafb'
        }
    },
    typography: {
        fontFamily: [
            'Kosugi', 'sans-serif',
        ].join(',')
    }
})

const App = () => {
    const [mode, setmode] = useState<LeafMode>("Add")

    return(
        <ThemeProvider theme={theme}>
        <div className='app'>
            <Header mode={mode} modeHandler={setmode}/>
            {mode == 'Card' ? <Card /> :
             mode == 'Add' ? <InputCard /> : 
             ''}
            
        </div>
        </ThemeProvider>
    )
}

export default App
