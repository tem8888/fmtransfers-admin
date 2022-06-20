import React, {useState, useEffect} from 'react';
import {
  Button,
  Box,
  Typography,
  Stack,
  TextField,
  Modal
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { inputs } from '../assets/data'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalUser = ({buttonText, title, onClickModalClose, onChangeUser, open, user}) => {

  const [inputValues, setInputValues] = useState({})

  useEffect(() => {
    // Если модальное окно открылось для редактирования пользователя, то заполняем дефолтные значения формы
    // и дополнительно добавлем поле пароля, т.к. по умолчанию оно не загружается со списком пользователей
    if (user) {
      setInputValues({...user, password: ''})
    } 
    // Если модальное окно открылось для создания нового пользователя, то предварительно очищаем инпуты, 
    // если там что-то было. Если не было, то все равно будет ререндер, что плохо.
    else {
      setInputValues({})
    }
  }, [user])

  const onChangeInput= (e) => {
    setInputValues({...inputValues, [e.target.id] : e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onChangeUser(inputValues)
  }

  const renderTextField = () => {
    return (
      inputs.map((input) => 
        <TextField 
          key={input.id}
          required={input.required}
          size='small'
          label={input.label}
          id={input.name}
          type={input.type}
          value={inputValues[input.name] || ''}
          onChange={onChangeInput}
        />
      )
    )
  }
  
  return (
    <div>
      <Modal
        open={open}
        onClose={onClickModalClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={{...style, maxWidth: '500px', width: '80%'}} component="form" autoComplete="off" onSubmit={handleSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 3}}>
            {title}
          </Typography>
          <Stack spacing={2}>
            {renderTextField()}
          </Stack>
          <Stack direction="row" spacing={2} sx={{mt: 3, justifyContent:'center'}}>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={onClickModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" endIcon={<SaveIcon />}>
              {buttonText}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalUser