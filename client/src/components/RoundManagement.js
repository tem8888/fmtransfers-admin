import React from 'react'
import { MainButton } from '../theme'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
    Button,
    Stack,
    Typography,
    Box,
  } from '@mui/material'
import roundUpdate from '../helpers/roundUpdate'

const RoundManagement = ({round, onClickOpenAlert, handleRoundUpdate}) => {
    return (
        <Stack spacing={1} sx={{marginTop: {xs: '20px', sm: 0}}}>
            <Typography sx={{display: 'flex', alignItems: 'center', marginInline: 'auto'}}>
                Round
                <Box component="span" sx={{ p: '4px', ml: 1, mr: 2, borderBottom: '1px dashed grey' }}>
                    {round.number}
                </Box>
                Status
                <Box component="span" sx={{ p: '4px', ml: 1, borderBottom: '1px dashed grey', display: 'flex', alignItems: 'center'}}>
                {round.status === 'closed' ? 
                    <LockIcon fontSize='small' color='red'/> : 
                    <LockOpenIcon fontSize='small' color='green'/>
                }  
                {round.status}
                </Box>
            </Typography>
            <MainButton 
                variant="contained"  
                onClick={() => roundUpdate('start', round.number, handleRoundUpdate)} 
                disabled={round.status === 'open' ? true : false}
            >
                Start
            </MainButton>
            <MainButton 
                variant="contained" 
                sx={{lineHeight: '1.25'}} 
                onClick={() => roundUpdate('finish', round.number, handleRoundUpdate)} 
                disabled={round.status === 'closed' ? true : false}
            >
                Finish
            </MainButton>
            <Button variant="outlined" color="red" sx={{lineHeight: '1.4'}} onClick={() => onClickOpenAlert('reset')}>
                Reset
            </Button>
        </Stack>
    )
}

export default RoundManagement