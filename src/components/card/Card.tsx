import React, { useState, useEffect, SyntheticEvent } from 'react'
import TextField from '@mui/material/TextField'
import SvgIcon from '@mui/material/SvgIcon'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import "./Card.css"
import { CardData } from '../../models/models'
import { Button, ButtonGroup, IconContainerProps, InputAdornment, Rating, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { priorityIcons, StyledRating } from '../../models/mui_styles'

type PitchProps = {
    pitch: string[],
    hiragana: string,
}


const PriorityIconContainer = (props: IconContainerProps) => {
    const {value, ...other} = props;
    return <span {...other}>{priorityIcons[value].icon}</span>
}

const Card = () => {
    const [cards, setCards] = useState<CardData[]>([{
        _id: '',
        kanji: '',
        variants: [],
        components: [],
        tags: [''],
        pitch: [],
        priority: 0,
        hiragana: '',
        eng_def: "",
        jap_def: "",
        notes: ''
    }])
    const [currCardIndex, setCurrCardIndex] = useState<number>(0)

    const [flipState, setflipState] = useState<"front" | "back">("back")
    const [lang, setLang] = useState<"eng" | "jap">("eng")
    const [showNotes, setShowNotes] = useState<boolean>(false)

    useEffect(() => {
        window.api.getCards()
        .then((results: CardData[] | []) => setCards(results))
    }, [])

    const flip = () => {
        flipState === 'front' ? setflipState("back") : setflipState("front")
    }

    const PitchCom = ({pitch, hiragana}: PitchProps) => {
        return (<>{ pitch.map( (char, index) => <div key={`pitch_char_${index}`} className={char == 'r' ? 'rising_pitch' : char == 'h' ? 'high_pitch' : char == 'f' ? 'falling_pitch' : 'low_pitch'}>
            {hiragana[index]}
        </div>)}</>)
    }

    const formatTags = (tags: string[]) => tags.reduce( (acc, curr) => acc + ` [${curr}]`, '')

    const updatePriority = (e: any) => {
        let newPrio = parseInt(e.target.value)
        window.api.updatePriority(cards[currCardIndex]._id, newPrio)

        window.api.getCards()
        .then((results: CardData[] | []) => setCards(results))
    }
    
    const handleNext = (e: any) => {
        e.preventDefault()
        window.api.updateLastSeen(cards[currCardIndex]._id, new Date())
        if(currCardIndex == cards.length - 1) {
            window.api.getCards()
            .then((results: CardData[] | []) => {
                setCards(results)
                setCurrCardIndex(0)
            })
        } else {
            setCurrCardIndex(currCardIndex + 1);
        }
    }

    const CardBack = () => {
        return (
            <>
            <form id='word-info' onSubmit={(e => e.preventDefault())}>
                <div className='kanji-variants'>
                    <TextField id='kanji-variants' variant='standard' fullWidth
                    value={cards[currCardIndex].kanji}
                    inputProps={{style: { textAlign: 'center' }}}
                    InputProps={cards[currCardIndex].variants.length > 0 ? {
                        startAdornment: ( <InputAdornment position='start'><SvgIcon component={ArrowBackIcon} /></InputAdornment>),
                        endAdornment: ( <InputAdornment position='end'><SvgIcon component={ArrowForwardIcon} /></InputAdornment>),
                        readOnly: true,
                        style: { fontSize: '1.5rem'}
                    } : {}}/>
                </div>

                <div className="tags">
                    <TextField id='tags_input' placeholder='Tags' variant='standard' fullWidth
                    inputProps={{style: { textAlign: 'end' }}}
                    InputProps={{
                        readOnly: true,
                        style: { fontSize: '1.3rem'}
                    }}
                    value={formatTags(cards[currCardIndex].tags)}/>
                </div>

                <div className="pitch">
                    <PitchCom pitch={cards[currCardIndex].pitch} hiragana={cards[currCardIndex].hiragana} />
                </div>
                <div className="notes_lang">
                    <div className="notes">
                        <button className={`card-btns ${showNotes === true ? "active" : ""}`}
                        onClick={(event) => setShowNotes(!showNotes)}>Notes</button>
                    </div>

                    <div className="lang-switch">
                        <button className={`card-btns ${(!showNotes && lang === 'eng') ? 'active' : ''}`} type='button'
                        onClick={(event) => { setShowNotes(false); setLang('eng') }}>ENG</button>
                        <button className={`card-btns ${(!showNotes && lang === 'jap') ? 'active' : ''}`} type='button'
                        onClick={(event) => { setShowNotes(false); setLang('jap') }}>JAP</button>
                    </div>
                </div>

                <div className="definition">
                    <TextField id='definition' variant='outlined' multiline minRows={5} fullWidth
                    InputProps={{ readOnly: true }}
                    value={showNotes ? cards[currCardIndex].notes : lang == 'eng' ? cards[currCardIndex].eng_def : cards[currCardIndex].jap_def}/>
                </div>

                <div className="priority">
                    <StyledRating name='priority' value={cards[currCardIndex].priority} precision={1} size='large' color='primary' IconContainerComponent={PriorityIconContainer}
                    onChange={updatePriority}/>

                    <button className='card-btns big-btn' onClick={flip}>Flip</button>
                    <button className='card-btns big-btn' onClick={handleNext}>Next</button>
                </div>

            </form>
            </>
        )
    }

    return (
        <div className='card-container'>
            <div className={`card-front ${flipState === "front" ? "active" : ""}`}>
                <h1>{cards[currCardIndex].kanji}</h1>
                <button className='type-2-btn' onClick={flip}>Flip</button>
            </div>

            <div className={`card-back ${flipState === "back" ? "active" : ""}`}>
                <CardBack />
            </div>
        </div>
    )
}

export default Card
