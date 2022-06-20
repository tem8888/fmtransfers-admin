import React from 'react'
import {
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    IconButton
  } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import EditIcon from '@mui/icons-material/Edit'; 

const UsersTable = ({users, onClickModalOpen, onClickOpenAlert}) => {
    
    const renderRow = () => {
        return users.map((row) => (
            <TableRow
                key={row.userId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell align="right">
                <IconButton aria-label="edit" size='small' onClick={() => onClickModalOpen('update', row)}>
                    <EditIcon fontSize="small"/>
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">{row.username}</TableCell>
            <TableCell align="right">{row.club}</TableCell>
            <TableCell align="right">
                <AccessibleForwardIcon fontSize="small" color={row.bidStatus === 'closed' ? 'red' : 'green'} />
            </TableCell>
            <TableCell align="right">{row.money.toFixed(2)}</TableCell>
            <TableCell align="right">{row.coeff.toFixed(2)}</TableCell>
            <TableCell align="right">
                <IconButton aria-label="edit" size='small' onClick={() => onClickOpenAlert('delete', row)}>
                    <DeleteForeverIcon fontSize="small" />
                </IconButton>
            </TableCell>
            </TableRow>
        ))
    }

    return (
        <TableContainer component={Paper} >
            <Table sx={{ minWidth: 450 }} size="small" aria-label="users table">
                <TableHead>
                <TableRow>
                    <TableCell align="right">Edit</TableCell>
                    <TableCell>Nickname</TableCell>
                    <TableCell align="right">Club</TableCell>
                    <TableCell sx={{maxWidth: '20px'}} align="right">Ready</TableCell>
                    <TableCell align="right">Money&nbsp;(€ mln)</TableCell>
                    <TableCell align="right">Coeff</TableCell>
                    <TableCell align="right">Del</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {renderRow()}
                </TableBody>
            </Table>
        </TableContainer> 
    )
}

export default UsersTable