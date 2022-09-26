import { TextField } from '@mui/material'
import React, { useState } from 'react'

type DefinitionProps = {
    notes: string,
    eng_def: string,
    jap_def: string
}

const DefinitionBox = ({notes, eng_def, jap_def}: DefinitionProps) => {
    const [lang, setLang] = useState<"eng" | "jap">("eng")
    const [showNotes, setShowNotes] = useState<boolean>(false)
    
  return (
    <>
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
                    value={showNotes ? notes : lang == 'eng' ? eng_def : jap_def}/>
                </div>
    </>
  )
}

export default DefinitionBox