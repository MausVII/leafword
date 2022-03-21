import React, { useState } from 'react'
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
    const [CardData, setCardData] = useState<CardData>({
        kanji: '一ノ瀬',
        variants: [],
        components: [],
        tags: ['名詞', '名前'],
        pitch: ['r', 'h', 'f', 'l'],
        priority: 3,
        hiragana: 'いちのせ',
        eng_def: "Ichinose",
        jap_def: "いちのせ",
        notes: 'Amazing girl'
    })
    const [flipState, setflipState] = useState<"front" | "back">("back")
    const [lang, setLang] = useState<"eng" | "jap">("eng")
    const [showNotes, setShowNotes] = useState<boolean>(false)

    const flip = () => {
        flipState === 'front' ? setflipState("back") : setflipState("front")
    }

    const PitchCom = ({pitch, hiragana}: PitchProps) => {
        return (<>{ pitch.map( (char, index) => <div key={`pitch_char_${index}`} className={char == 'r' ? 'rising_pitch' : char == 'h' ? 'high_pitch' : char == 'f' ? 'falling_pitch' : 'low_pitch'}>
            {hiragana[index]}
        </div>)}</>)
    }

    const formatTags = (tags: string[]) => tags.reduce( (acc, curr) => acc + ` [${curr}]`, '')

    const CardBack = () => {
        return (
            <>
            <form id='word-info' onSubmit={(event) => event.preventDefault()}>
                <div className='kanji-variants'>
                    <TextField id='kanji-variants' variant='standard' fullWidth
                    value={CardData.kanji}
                    inputProps={{style: { textAlign: 'center' }}}
                    InputProps={{
                        startAdornment: ( <InputAdornment position='start'><SvgIcon component={ArrowBackIcon} /></InputAdornment>),
                        endAdornment: ( <InputAdornment position='end'><SvgIcon component={ArrowForwardIcon} /></InputAdornment>),
                        readOnly: true,
                        style: { fontSize: '1.5rem'}
                    }}/>
                </div>

                <div className="tags">
                    <TextField id='tags_input' placeholder='Tags' variant='standard' fullWidth
                    inputProps={{style: { textAlign: 'end' }}}
                    InputProps={{
                        readOnly: true,
                        style: { fontSize: '1.3rem'}
                    }}
                    value={formatTags(CardData.tags)}/>
                </div>

                <div className="pitch">
                    <PitchCom pitch={CardData.pitch} hiragana={CardData.hiragana} />
                </div>
                <div className="notes_lang">
                    <div className="notes">
                        <button className={`card-btns ${showNotes === true ? "active" : ""}`}
                        onClick={(event) => setShowNotes(!showNotes)}>Notes</button>
                    </div>

                    <div className="lang-switch">
                        <button className={`card-btns ${lang === 'eng' ? 'active' : ''}`}
                        onClick={(event) => setLang('eng')}>ENG</button>
                        <button className={`card-btns ${lang === 'jap' ? 'active' : ''}`}
                        onClick={(event) => setLang('jap')}>JAP</button>
                    </div>
                </div>

                <div className="definition">
                    <TextField id='definition' variant='outlined' multiline minRows={5} fullWidth
                    InputProps={{ readOnly: true }}
                    value={showNotes && CardData.notes !== '' ? CardData.notes : lang == 'eng' ? CardData.eng_def : CardData.jap_def}/>
                </div>

                <div className="priority">
                    <StyledRating name='priority' value={CardData.priority} precision={1} size='large' color='primary' IconContainerComponent={PriorityIconContainer}/>
                </div>

            </form>
            </>
        )
    }

    return (
        <div className='card-container'>
            <div className={`card-front ${flipState === "front" ? "active" : ""}`}>
                <h1>{CardData.kanji}</h1>
                <button className='type-2-btn' onClick={flip}>Flip</button>
            </div>

            <div className={`card-back ${flipState === "back" ? "active" : ""}`}>
                <CardBack />
            </div>
        </div>
    )
}

export default Card
