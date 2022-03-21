import { styled } from '@mui/material/styles'
import { highlight } from './colors'
import Rating from '@mui/material/Rating'
import { LooksOne, LooksTwo, Looks3, Looks4, Looks5 } from '@mui/icons-material'
import { ToggleButton } from '@mui/material'

export const StyledRating = styled(Rating) ({
    '& .MuiRating-iconFilled': {
        color: highlight,
    },
    '& .MuiRating-iconHover': {
        color: highlight,
    }
})

export const StyledToggleButton = styled(ToggleButton)({
    '& .MuiToggleButton-standard': {
        color: highlight,
        backgroundColor: highlight,
    }
})

export const priorityIcons: { [index: string]: {icon: React.ReactElement}} = {
    1: {
        icon: <LooksOne fontSize='large'/>
    },
    2: {
        icon: <LooksTwo fontSize='large'/>
    },
    3: {
        icon: <Looks3 fontSize='large'/>
    },
    4: {
        icon: <Looks4 fontSize='large'/>
    },
    5: {
        icon: <Looks5 fontSize='large'/>
    },
}