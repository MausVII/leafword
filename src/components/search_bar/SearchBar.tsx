import React from 'react'
import { useState } from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import { priorityIcons, StyledRating, StyledToggleButton } from '../../models/mui_styles'
import { Button, ButtonGroup, IconContainerProps, Rating, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { CardData } from '../../models/models'
import "./Search.css"
import DisplayResults from './DisplayResults'

const PriorityIconContainer = (props: IconContainerProps) => {
  const {value, ...other} = props;
  return <span {...other}>{priorityIcons[value].icon}</span>
}

const SearchBar = () => {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('None')
  const [priority, setPriority] = useState<number>(0)

  const [cards, setCards] = useState<CardData[]>([])

  const searchCards = (e: any) => {
    console.log("Searching")
    e.preventDefault()
    window.api.searchCards(keyword, category, priority)
    .then((cards: CardData[]) => {
      setCards(cards)
    })
  }

  return (
    <>
    <form className='flex-container w-full white-container' onSubmit={(e) => searchCards(e)}>
      <div>
        <TextField id='search-bar' variant='standard' placeholder='Search Text' fullWidth
        onChange={(e) => setKeyword(e.target.value)}
        className=''/>
      </div>

      <div className='container-row'>
        <div>
          <InputLabel id='category-label'>Category</InputLabel>
          <Select labelId='category-label' id='category-select' label={"Category"}
          value={category} onChange={(event: SelectChangeEvent) => setCategory(event.target.value)}>
            <MenuItem value={'None'}>None</MenuItem>
            <MenuItem value={'動詞'}>動詞</MenuItem>
            <MenuItem value={'名詞'}>名詞</MenuItem>
            <MenuItem value={'形容詞'}>形容詞</MenuItem>
            <MenuItem value={'副詞'}>副詞</MenuItem>
          </Select>
        </div>

        <div className="priority">
                    <StyledRating name='priority' value={priority} 
                    onChange={(event) => {
                        let target = event.target as any
                        setPriority(parseInt(target.value))
                    }}
                    precision={1} size='large' color='primary' IconContainerComponent={PriorityIconContainer}/>
                    <button className='card-btns big-btn' type='submit'>Search</button>
        </div>
      </div>
    </form>

    <DisplayResults cards={cards}/>
  </>
  )
}

export default SearchBar