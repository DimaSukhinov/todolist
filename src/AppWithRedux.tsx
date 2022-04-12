import React from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {Form} from './common/Form';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC
} from './state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';

export type FilterType = 'all' | 'active' | 'completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

export const AppWithRedux = () => {

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, TodolistType[]>(state  => state.todolists)

    const addTodolist = (title: string) => dispatch(addTodolistAC(title))

    const removeTodolist = (todolistId: string) => dispatch(removeTodolistAC(todolistId))

    const changeTodolistTitle = (todolistId: string, newTitle: string) => dispatch(changeTodolistTitleAC(todolistId, newTitle))

    const changeFilter = (filter: FilterType, todolistId: string) => dispatch(changeTodolistFilterAC(filter, todolistId))

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolist
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid style={{padding: '20px'}} container>
                    <Form addItem={addTodolist}/>
                </Grid>
                <Grid spacing={3} container>
                    {
                        todolists.map((tl) => {
                            return (
                                <Grid item>
                                    <Paper style={{padding: '10px'}}>
                                        <Todolist
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            changeFilter={changeFilter}
                                            filter={tl.filter}
                                            removeTodolist={removeTodolist}
                                            changeTodolistTitle={changeTodolistTitle}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}