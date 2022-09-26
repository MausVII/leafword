type PitchProps = {
    pitch: string[],
    hiragana: string,
}

const PitchCom = ({pitch, hiragana}: PitchProps) => {
    return (<>{ pitch.map( (char, index) => <div key={`pitch_char_${index}`} className={char == 'r' ? 'rising_pitch' : char == 'h' ? 'high_pitch' : char == 'f' ? 'falling_pitch' : 'low_pitch'}>
        {hiragana[index]}
    </div>)}</>)
}

export default PitchCom