import React from 'react'
import linkLogo from '../assets/img/logo.jpg'
import {
    Box,
    Link,
    Tooltip,
} from '@mui/material'

const LogoImg = () => {
    return (
        <Box sx={{display: {xs: 'none', md: 'block'}, mt: 6, textAlign: 'center'}}>
            <Tooltip title="To FM-List App" enterDelay={300} leaveDelay={200}>
                <Link 
                    href={process.env.REACT_APP_FM_TRANSFERS_LINK} 
                    target="_blank" 
                    sx={{'&:hover': {opacity: 0.8}}}
                >
                    <img 
                        src={linkLogo} 
                        alt="FM Transfers logo" 
                        width="120px" 
                        loading="lazy" 
                        style={{
                            borderRadius: '20px', 
                            boxShadow: '0px 4px 2px -2px rgb(0 0 0 / 20%), 0px 3px 3px 0px rgb(0 0 0 / 14%), 0px 2px 6px 0px rgb(0 0 0 / 12%)'
                        }}
                    />
                </Link>
            </Tooltip>
        </Box>
    )
}

export default LogoImg