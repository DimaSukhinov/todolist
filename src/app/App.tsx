import React, {useCallback, useEffect} from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {Menu} from '@mui/icons-material'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import {TodolistsList} from '../features/todolistList/TodolistList'
import {useAppSelector} from './store'
import {initializeAppTC, RequestStatusType} from './app-reducer'
import {ErrorSnackbar} from '../components/ErrorSnackbar'
import {Login} from '../features/login/Login'
import {Routes, Route, Navigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import {logoutTC} from '../features/todolistList/auth-reducer';

export const App = () => {

    const dispatch = useDispatch()
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logout = useCallback(() => dispatch(logoutTC()), [dispatch])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: isLoggedIn ? 'space-between' : ''}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolist
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logout}>Logout</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color={'secondary'}/>}
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='404' element={<h1>404: OOPS! PAGE NOT FOUND</h1>}/>
                    <Route path='*' element={<Navigate to='404'/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    )
}