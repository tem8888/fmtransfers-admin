import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material'

export default function AlertResetRounds({user, title, buttonText, open, onClickCloseAlert, onClickSubmit}) {

  const renderDialogContent = () => {
    if (user) {
      return (
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Do you really want to delete this user? <b> {user.username} ({user.club})</b>
            </DialogContentText>
        </DialogContent>
      )
    }
    else {
        return (
          <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Do you want to reset rounds and delete all bids?
              </DialogContentText>
          </DialogContent>
        )
      }
  }

    return (
      <div>
        <Dialog
          open={open}
          onClose={onClickCloseAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {title}
          </DialogTitle>
            {renderDialogContent()}
          <DialogActions>
            <Button onClick={onClickCloseAlert}>
              Cancel
            </Button>
            <Button onClick={() => onClickSubmit(user?.userId)}>
              {buttonText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );                          
}