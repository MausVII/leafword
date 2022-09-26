import React from 'react'
import { CardData } from '../../models/models'
import DefinitionBox from '../utilities/DefinitionBox'
import PitchCom from '../utilities/PitchCom'

type Props = {
    cards: CardData[]
}

const DisplayResults = ({cards}: Props ) => {
  return (
    <div className='flex-container w-full white-container'>
        {cards.map( card => 
            <details key={card._id}>
                <summary>{card.kanji} {card.tags.reduce((acc, curr) => acc + `[${curr}] `, '').trim()}</summary>
                <div>
                    <div className='pitch'>
                        <PitchCom pitch={card.pitch} hiragana={card.hiragana}></PitchCom>
                    </div>
                </div>
                <DefinitionBox notes={card.notes} eng_def={card.eng_def} jap_def={card.jap_def}/>
            </details>
        )}
    </div>
  )
}

export default DisplayResults