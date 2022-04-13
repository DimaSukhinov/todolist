import React, {useCallback} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {AddItemForm} from './common/AddItemForm';
import {
    AppBar,
    Button,
    Container,
    Grid,
    IconButton,
    Paper,
    Toolbar,
    Typography
} from '@material-ui/core';
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

export const App = () => {

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)

    const addTodolist = useCallback((title: string) => dispatch(addTodolistAC(title)), [dispatch])

    const removeTodolist = useCallback((todolistId: string) => dispatch(removeTodolistAC(todolistId)), [dispatch])

    const changeTodolistTitle = useCallback((todolistId: string, newTitle: string) => dispatch(changeTodolistTitleAC(todolistId, newTitle)), [dispatch])

    const changeFilter = useCallback((filter: FilterType, todolistId: string) => dispatch(changeTodolistFilterAC(filter, todolistId)), [dispatch])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: 'space-between'}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolist
                    </Typography>
                    <Button color="inherit" variant={'outlined'}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid style={{padding: '20px'}} container>
                    <AddItemForm addItem={addTodolist}/>
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