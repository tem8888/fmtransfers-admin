import React, {useState} from 'react'
import axios from 'axios'
import { ThemeProvider } from '@mui/material/styles';
import { darkModeTheme, MainButton } from './theme'
import AddIcon from '@mui/icons-material/Add';
import {
  Container,
  Grid,
  LinearProgress,
  Box,
} from '@mui/material'
import ModalUser from './components/ModalUser' 
import ModalAlert from './components/ModalAlert'
import UploadFile from './components/UploadFile'
import UsersTable from './components/UsersTable';
import RoundManagement from './components/RoundManagement';
import SnackbarAlert from './components/SnackbarAlert'
import LogoImg from './components/LogoImg';
import { useFetch } from './hooks/useFetch'

import openSocket from 'socket.io-client';
const socket = openSocket();

function App() {
  const [round, setRound, usersData, setUsersData, isLoading] = useFetch('/api/loadusers', '/api/loadsettings')
  const [user, setUser] = useState(null) 
  const [openModal, setOpenModal] = useState({open: false, role: ''})
  const [openAlert, setOpenAlert] = useState({open: false, role: ''})
  const [snackbar, setSnackbar] = useState({open: false, severity: 'success', message: ''})

  // Как только Дискорд-бот получает соответствующую команду от пользователя в дискорд-чате,
  // то меняет статус в базе и делает запрос на сервер этого приложения для обновления информации на клиенте
  socket.on('discord', (id) => {
    const newState = usersData.map(user => {
      if (user.userId === id) {
        user.bidStatus = 'open'
      }
      return user
    })
    setUsersData(newState)
  })

  // Обработчики открытия модальных окон
  const onClickOpenAlert = (role, user) => { 
    setOpenAlert({open: true, role: role})
    if (user) {
      setUser(user)
    }
   };
  const onClickModalOpen = (role, user) => { 
    setOpenModal({role: role, open: true})
    if (user) {
      setUser(user) 
    }
  }

  // Обработчик удаления пользователя
  const onClickDeleteUser = (userId) => {
    axios.post('/api/deleteuser', {userId: userId})
    .then((res) => {
      setUsersData(usersData.filter(state => state.userId !== res.data.userId))
      setOpenAlert({...openAlert, open: false})
    })
    .catch((err) => console.log(err))
  }
  
  //Обработчик редактирования пользователя
  const onClickUpdateUser = (user) => {
    axios.post('/api/updateuser', user, {params: {_id: user._id}})
    .then((res) => {
      const updatedUser = res.data
      const newState = usersData.map(user => {
        if (user.userId === updatedUser.userId)
          return updatedUser
        return user
      })
      
      setUsersData(newState)
      setOpenModal({...openModal, open: false})
    })
    .catch((err) => console.log(err))
  }

  //Обработчик добавления нового пользователя
  const onClickCreateUser = (user) => {
    axios.post('/api/createuser', user)
    .then((res) => {
      setOpenModal({...openModal, open: false})
      setUsersData([...usersData, res.data])
    })
    .catch((err) => console.log(err))
  }

  // Обработчик обновления раундов
  const handleRoundUpdate = (status, roundNumber) => {
    setRound({...round, number: roundNumber, status: status})
    setUsersData([...usersData.map(user => {
      user.bidStatus = status
      return user
    })])
  }

  // Обработчик сброса раундов
  const onClickResetRounds = () => {
    axios.post('/api/reset')
    .then( _ => {
      setRound({...round, number: 1, status: 'closed'})
      setUsersData([...usersData.map(user => {
        user.bidStatus = 'closed'
        return user
      })])
      setOpenAlert({...openAlert, open: false})
      setSnackbar({...snackbar, open: true, severity: 'success', message: 'Settings has been reseted succesfully!'})
    })
    .catch(err => { console.log(err) })
  }

  // Рендерим модальное окно для изменения или создания пользователя
  const renderModal = () => {
    if (!openModal.open) {
      return null
    }
    if (openModal.role === 'update') {
      return (
        <ModalUser 
          buttonText='Update'
          title='Update user'
          user={user}
          open={openModal.open} 
          onClickModalClose={() => setOpenModal({...openModal, open: false})} 
          onChangeUser={onClickUpdateUser}
        /> 
      )
    }
    if (openModal.role === 'create') {
      return (
        <ModalUser
          buttonText='Create'
          title='Create user'
          open={openModal.open} 
          onClickModalClose={() => setOpenModal({...openModal, open: false})} 
          onChangeUser={onClickCreateUser}
        /> 
      )
    }
  }

  // Рендерим диалоговое окно для подтверждения удаления пользователя или сброса настроек
  const renderAlert = () => {
    if (!openAlert.open) {
      return null
    }
    if (openAlert.role === 'delete') {
      return (
        <ModalAlert 
          user={user} 
          title='Deleting a User'
          buttonText='Delete'
          open={openAlert.open} 
          onClickCloseAlert={() => setOpenAlert({...openAlert, open: false})}
          onClickSubmit={onClickDeleteUser}
        />
      )
    }
    if (openAlert.role === 'reset') {
      return (
        <ModalAlert
          title='Resetting round settings'
          buttonText='Reset'
          open={openAlert.open} 
          onClickCloseAlert={() => setOpenAlert({...openAlert, open: false})}
          onClickSubmit={onClickResetRounds}
        />
      )
    }
  }

  // Рендерим таблицу пользователей
  const renderUsersTable = () => {
    if (isLoading) {
      return <Box sx={{ width: '100%'}}><LinearProgress color="blue"/></Box>
    }
    if (!usersData.length) {
      return <div>Users not found in DB. </div>
    }
    return <UsersTable 
      users={usersData}
      setUsers={setUsersData}
      onClickModalOpen={onClickModalOpen}
      onClickOpenAlert={onClickOpenAlert}
    />
  }

  /* RETURN JSX */
  return (
     <ThemeProvider theme={darkModeTheme}>
      <Container size="lg" sx={{pt: 2}}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            {renderUsersTable()}
            <Grid container
              direction="row"
              justifyContent="space-between"
              sx={{p: 1}}
            >
              <Grid item md={6}> 
                <MainButton 
                  variant="contained" 
                  onClick={() => onClickModalOpen('create')}
                  endIcon={<AddIcon />}
                >
                  Add new user
                </MainButton>
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={4} xl={4}> 
                <RoundManagement 
                  round={round}
                  onClickOpenAlert={onClickOpenAlert}
                  handleRoundUpdate={handleRoundUpdate}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} sx={{display: {xs: 'flex', md: 'block'}, justifyContent: "space-around", flexGrow: 1, flexWrap: 'wrap'}}>
            <UploadFile type='users' label='Users List' setUsers={setUsersData} />
            <UploadFile type='squads' label='Squads List' mt={4} />
            <UploadFile type='transfers' label='Transfers List' mt={4} />
            <LogoImg />
          </Grid>
        </Grid>
        {renderModal()}
        {renderAlert()}
        <SnackbarAlert snackbar={snackbar} handleSnackbarClose={() => setSnackbar({...snackbar, open: false})} />
      </Container>   
    </ThemeProvider>
  );
}

export default App;
