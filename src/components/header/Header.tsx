import React from 'react'
import { LeafMode } from '../../models/models'
import './Header.css'

type HeaderProps = {
    modeHandler: (newMode: LeafMode) => void,
    mode: LeafMode
}

const Header: React.FC<HeaderProps> = ({ mode, modeHandler }) => {
    return (
        <div className='header'>
            <h1 className='app-title'>LeafWord</h1>

            <div className='nav-bar'>
                <button className={`nav-btns ${mode === 'Card' ? "active" : ""}`}
                    onClick={() => modeHandler("Card")}>Cards</button>
                <button className={`nav-btns ${mode === 'Browse' ? "active" : ""}`}
                    onClick={() => modeHandler("Browse")}>Browse</button>
                <button className={`nav-btns ${mode === 'Add' ? "active" : ""}`}
                    onClick={() => modeHandler("Add")}>Add</button>
                <button className={`nav-btns ${mode === 'Filters' ? "active" : ""}`}
                    onClick={() => modeHandler("Filters")}>Filters</button>
                <div className='optional-nav'>
                    <button className={`nav-btns ${mode === 'Settings' ? "active" : ""}`}
                        onClick={() => modeHandler("Settings")}>Settings</button>
                    <button className={`nav-btns ${mode === 'Help' ? "active" : ""}`}
                        onClick={() => modeHandler("Help")}>Help</button>
                </div>
            </div>
            
        </div>
    )
}

export default Header
