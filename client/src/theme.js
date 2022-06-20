import { createTheme, styled } from '@mui/material/styles';
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
export const darkModeTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#36393f',
            paper: '#36393f',
            light: 'rgba(114, 137, 217, 0.08)'
        },
        white: { main: '#f9f6f9' },
        blue: { main: '#5865f2', hover: '#7983f5', light: '#7289d9' },
        red: { main: '#f04747' },
        green: { main: '#43b581' },
        lightblue: {main: '#7289d9'}
    }
});

export const MainButton = styled(Button)(({ theme }) => ({
    color: theme.palette.white.main,
    background: theme.palette.blue.main,
    lineHeight: '1.4',
    '&:hover': {
        backgroundColor: theme.palette.blue.hover,
    },
}))

export const UploadButton = styled(LoadingButton)(({ theme }) => ({
    color: theme.palette.blue.light,
    border: `1px solid ${theme.palette.blue.light}`,
    '&:hover': {
        backgroundColor: theme.palette.background.light,
        border: `1px solid ${theme.palette.blue.main}`,
    },
}))
