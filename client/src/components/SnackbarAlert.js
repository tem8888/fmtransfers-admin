import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const SnackbarAlert = ({snackbar, handleSnackbarClose}) => {
  return (
    <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
    >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
        </Alert>
    </Snackbar>
  )
}

export default SnackbarAlert