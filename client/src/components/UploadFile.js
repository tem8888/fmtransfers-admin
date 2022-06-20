import React, {useState, useRef} from 'react'
import axios from 'axios'
import { UploadButton } from '../theme'
import {
    Button,
    Box,
    Typography,
    Stack,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import csvToUsersArray from '../helpers/csvToUsersArray'
import rtfToSquadArray from '../helpers/rtfToSquadArray'
import rtfToTransfersArray from '../helpers/rtfToTransfersArray'
import SnackbarAlert from './SnackbarAlert'

const UploadUsers = ({type, label, mt, setUsers}) => {
    const [filename, setFilename] = useState(null)
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, severity: 'success', message: ''});
    const refData = useRef()
    var fileReader = new FileReader();

    const handleFileRead = () => {
        refData.current = fileReader.result;
    };

    const handleFileChoose = (e) => {
        const file = e.target.files[0]
        if (!file) {
            return;
        }
        if (file.type !== 'text/csv' && type === 'users') {
            setSnackbar({...snackbar, open: true, severity: 'error', message: 'You need .csv file!'})
            return;
        }
        if (file.type !== 'text/rtf' && type !== 'users') {
            setSnackbar({...snackbar, open: true, severity: 'error', message: 'You need .rtf file!'})
            return;
        }
        setFilename(file.name);

        fileReader.onloadend = handleFileRead
        fileReader.readAsText(file);
    }

    const handleFileUpload = async (e) => {
        e.preventDefault()
        if (!refData.current) {
            setSnackbar({...snackbar, open: true, severity: 'warning', message: 'You should choose the file'})
            return
        }

        const data = 
            type === 'users' ? csvToUsersArray(refData.current) :
            type === 'squads' ? rtfToSquadArray(refData.current) : 
            type === 'transfers' ? rtfToTransfersArray(refData.current) : null
        setLoading(true)
        
        if (!data || data.length === 0) {
            setSnackbar({...snackbar, open: true, severity: 'error', message: 'Something went wrong'})
            return
        }

        try {   
            const response = await axios.post(`api/upload${type}`, data)
            if (type === 'users'){
                setUsers(response.data)
            }
            setLoading(false)
            setSnackbar({...snackbar, open: true, severity: 'success', message: 'Data has been uploaded!'})
            setFilename(null)
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleSnackbarClose = () => {
        setSnackbar({...snackbar, open: false})
    }

    return (
        <Stack direction="column" spacing={1} sx={{mt: {xs: 0, md: mt}, justifyContent:'center'}}>
            <Box component="div" sx={{ p: 1, mt: 2, border: '1px dashed grey', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>   
                <Button component="label" variant="text" color="lightblue">
                    Choose File
                    <input accept={type === 'users' ? '.csv' : '.rtf'} hidden id="file-upload" type="file" onChange={handleFileChoose} />
                </Button>
                <Typography component="span" sx={{fontSize: '0.8rem', ml: 1}}>
                    {filename ? filename : 'No file choosen'}
                </Typography>
                <SnackbarAlert snackbar={snackbar} handleSnackbarClose={handleSnackbarClose} />
            </Box>
            <UploadButton 
                loading={loading}
                variant="outlined"
                align="center" 
                sx={{mt:1}}
                startIcon={<UploadFileIcon/>}
                onClick={(e) => handleFileUpload(e)}
            >
                Upload {label}
            </UploadButton>
        </Stack>
    )
}

export default UploadUsers