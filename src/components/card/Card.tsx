import React, { useState } from 'react'
import "./Card.css"
const Card = () => {
    const [flipState, setflipState] = useState<"front" | "back">("front")

    const flip = () => {
        flipState === 'front' ? setflipState("back") : setflipState("front")
    }

    return (
        <div className='card-container'>
            <div className={`card-front ${flipState === "front" ? "active" : ""}`}>
                <h1>Front</h1>
                <button className='type-2-btn' onClick={flip}>Flip</button>
            </div>

            <div className={`card-back ${flipState === "back" ? "active" : ""}`}>
                <h1>Back</h1>
                <button className='type-2-btn' onClick={flip}>Flip</button>
            </div>
        </div>
    )
}

export default Card
