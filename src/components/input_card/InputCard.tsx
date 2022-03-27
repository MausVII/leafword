import React, { SyntheticEvent, useState } from 'react'
import { CardData } from '../../models/models'
import InputAdornment from '@mui/material/InputAdornment'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { priorityIcons, StyledRating, StyledToggleButton } from '../../models/mui_styles'
import { Pitch } from '../../models/models'
import './InputCard.css'
import { Button, ButtonGroup, IconContainerProps, Rating, ToggleButton, ToggleButtonGroup } from '@mui/material'

type PitchProp = {
    hiragana: string,
}

const PriorityIconContainer = (props: IconContainerProps) => {
    const {value, ...other} = props;
    return <span {...other}>{priorityIcons[value].icon}</span>
}

const InputCard = () => {
    const [CardData, setCardData] = useState<CardData>({
        kanji: '収益',
        variants: [],
        components: ['収', '益'],
        tags: ['名'],
        pitch: ['l', 'r', 'h', 'h', 'h'],
        priority: 3,
        hiragana: 'しゅうえき',
        eng_def: "Earning, revenue",
        jap_def: "事業などによって利益を得ること。また、その利益。",
        notes: '',
    })
    const [lang, setLang] = useState<'eng' | 'jap'>('eng')
    const [showNotes, setShowNotes] = useState<boolean>(false)

    const PitchInput = ({hiragana}: PitchProp) => {
        return (
            <>{hiragana.split('').map( (char: Pitch, index) => <button key={`pitch_char_${char}_${index}`}
            id={`${index}_pitch_char`}
            className={`pitch-btns ${CardData.pitch[index] == 'r' ? 'rising_pitch' : CardData.pitch[index] == 'h' ? 'high_pitch' : CardData.pitch[index] == 'f' ? 'falling_pitch' : 'low_pitch'}`}
            onClick={(event) => {
                let target = event.target as HTMLElement
                let idx = parseInt(target.id.split('')[0])
                console.log(target.id.split('')[0])
                setCardData({...CardData, pitch: CardData.pitch.map( (char, index) => index == idx ? 
                    ( CardData.pitch[index] == 'l' ? 'r' :
                    CardData.pitch[index] == 'r' ? 'h' :
                    CardData.pitch[index] == 'h' ? 'f' : 'l' )
                    : CardData.pitch[index]
                    ) })
            }}
            >{char}</button>)}</>
        )
    }

    const handleTag = (event: any) => {
        event.preventDefault()
        if (CardData.tags.includes(event.target.value)) {
            setCardData({...CardData, tags: CardData.tags.filter((tag) => tag != event.target.value)})
        } else {
            setCardData({...CardData, tags: [...CardData.tags, event.target.value]})
        }
    }

    const getNextVariant = () => {
        let tempKanji = CardData.kanji
        setCardData({...CardData,
            kanji: CardData.variants.shift(),
            variants: tempKanji == '' ? [...CardData.variants] : [...CardData.variants, tempKanji],
        })
    }

    const addVariant = () => {
        if (CardData.kanji !== '') {
            setCardData({...CardData,
                    variants: [...CardData.variants, CardData.kanji],
                    kanji: '',
                })
        }
    }

    const sendCard = async (data: CardData) => {
        window.api.sendCard('add-card', data)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        sendCard(CardData)
    }
    
    return (
        <div className='card-container'> 
            <form id='word-info' onSubmit={handleSubmit}>
                <div className='kanji-variants'>
                    <TextField id='kanji-variants' variant='standard' placeholder='Kanji' fullWidth
                    value={CardData.kanji} onChange={(event) => setCardData({...CardData, kanji: event.target.value})}
                    inputProps={{style: { textAlign: 'center' }}}
                    InputProps={{
                        startAdornment: ( <InputAdornment position='start'>
                            <button className='card-btns' onClick={(event: any) => addVariant()} type='button'>
                                <SvgIcon component={AddIcon} />
                            </button></InputAdornment>),
                        endAdornment: ( <InputAdornment position='end'>
                            <button className='card-btns' onClick={(event:any) => getNextVariant()} type='button'>
                                <SvgIcon component={ArrowForwardIcon} />
                            </button></InputAdornment>),
                        style: { fontSize: '1.5rem'}
                    }}/>
                </div>

                <div className="tags">
                    <button className={`card-btns ${CardData.tags.includes('名詞') ? 'active' : ''}`}
                        onClick={handleTag} value='名詞'>名詞</button>
                    <button className={`card-btns ${CardData.tags.includes('動詞') ? 'active' : ''}`}
                        onClick={handleTag} value='動詞'>動詞</button>
                    <button className={`card-btns ${CardData.tags.includes('形容詞') ? 'active' : ''}`}
                        onClick={handleTag} value='形容詞'>形容詞</button>
                    <button className={`card-btns ${CardData.tags.includes('副詞') ? 'active' : ''}`}
                        onClick={handleTag} value='副詞'>副詞</button>
                </div>

                <div className="hiragana">
                    <TextField name='hiragana' id = 'hiragana_input' placeholder='Hiragana' variant='standard' fullWidth
                    // If the pitch already had a value use that, avoids restarting the pitch each time the user modifies the hiragana
                    value={CardData.hiragana} onChange={(event) => setCardData({...CardData, pitch: event.target.value.split('').map(
                        (_, index) => CardData.pitch[index] !== 'l' && CardData.pitch[index] ? CardData.pitch[index] : 'l'), hiragana: event.target.value})}
                    inputProps={{style: { textAlign: 'center' }}}
                    InputProps={{
                        style: { fontSize: '1.3rem'}
                    }} />
                </div>

                <div className="pitch">
                    <PitchInput hiragana={CardData.hiragana}/>
                </div>
                <div className="notes_lang">
                    <div className="notes">
                        <button className={`card-btns ${showNotes === true ? "active" : ""}`} type='button'
                        onClick={(event) => setShowNotes(!showNotes)}>Notes</button>
                    </div>

                    <div className="lang-switch">
                        <button className={`card-btns ${lang === 'eng' ? 'active' : ''}`} type='button'
                        onClick={(event) => setLang('eng')}>ENG</button>
                        <button className={`card-btns ${lang === 'jap' ? 'active' : ''}`} type='button'
                        onClick={(event) => setLang('jap')}>JAP</button>
                    </div>
                </div>

                <div className="definition">
                    <TextField id='definition' variant='outlined' placeholder={`${showNotes ? 'Notes' : lang === 'eng' ? 'English Definition' : 'Japanese Definition'}`} 
                    multiline minRows={5} fullWidth
                    onChange={(event) => {
                        showNotes ? setCardData({...CardData, notes: event.target.value}) :
                        lang == 'eng' ? setCardData({...CardData, eng_def: event.target.value}) :
                            setCardData({...CardData, jap_def: event.target.value})
                    }}
                    value={showNotes ? CardData.notes : lang == 'eng' ? CardData.eng_def : CardData.jap_def}/>
                </div>

                <pre>
                    {JSON.stringify(CardData, null, 2)}
                </pre>

                <div className="priority">
                    <StyledRating name='priority' value={CardData.priority} 
                    onChange={(event) => {
                        let target = event.target as any
                        setCardData({...CardData, priority: parseInt(target.value)})
                    }}
                    precision={1} size='large' color='primary' IconContainerComponent={PriorityIconContainer}/>
                    <button className='card-btns big-btn' type='submit'>Create</button>
                </div>
            </form>
        </div>
    )
}

export default InputCard