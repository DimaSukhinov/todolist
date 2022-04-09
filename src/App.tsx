import React, {useState} from 'react';
import './App.css';
import {taskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {Form} from './common/Form';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';

export type filterType = 'all' | 'active' | 'completed'

type todolistType = {
    id: string
    title: string
    filter: filterType
}

type tasksStateType = {
    [key: string]: taskType[]
}

export const App = () => {

    let todolistID1 = v1()
    let todolistID2 = v1()

    const [todolists, setTodolists] = useState<todolistType[]>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasksObj, setTasksObj] = useState<tasksStateType>({
        [todolistID1]: [
            {id: v1(), isDone: true, title: 'HTML'},
            {id: v1(), isDone: false, title: 'JS'},
            {id: v1(), isDone: true, title: 'React'},
            {id: v1(), isDone: false, title: 'Node JS'},
            {id: v1(), isDone: false, title: 'Angular'},
        ],
        [todolistID2]: [
            {id: v1(), isDone: true, title: 'Book'},
            {id: v1(), isDone: false, title: 'Milk'},
            {id: v1(), isDone: true, title: 'Phone'},
        ],
    })

    const addTask = (title: string, todolistId: string) => {
        let tasks = tasksObj[todolistId]
        tasksObj[todolistId] = [...tasks, {id: v1(), isDone: false, title: title}]
        setTasksObj({...tasksObj})
    }

    const removeTask = (taskId: string, todolistId: string) => {
        let tasks = tasksObj[todolistId]
        tasksObj[todolistId] = tasks.filter(t => t.id !== taskId)
        setTasksObj({...tasksObj})
    }

    const changeFilter = (filter: filterType, todolistId: string) => {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = filter
            setTodolists([...todolists])
        }
    }

    const changeStatus = (taskId: string, isDone: boolean, todolistId: string) => {
        let tasks = tasksObj[todolistId]
        let task = tasks.find(t => t.id === taskId)
        if (task) {
            task.isDone = isDone
            setTasksObj({...tasksObj})
        }
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(t => t.id !== todolistId))
        delete tasksObj[todolistId]
        setTasksObj({...tasksObj})
    }

    const addTodolist = (title: string) => {
        let todolist: todolistType = {
            id: v1(),
            filter: 'all',
            title: title
        }
        setTodolists([todolist, ...todolists])
        setTasksObj({...tasksObj, [todolist.id]: []})
    }

    const changeTaskTitle = (taskId: string, todolistId: string, newTitle: string) => {
        let tasks = tasksObj[todolistId]
        let task = tasks.find(t => t.id === taskId)
        if (task) {
            task.title = newTitle
            setTasksObj({...tasksObj})
        }
    }

    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        let todolist = todolists.find(t => t.id === todolistId)
        if (todolist) {
            todolist.title = newTitle
            setTodolists([...todolists])
        }
    }

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

                            let tasksForTodolist = tasksObj[tl.id]
                            if (tl.filter === 'completed') {
                                tasksForTodolist = tasksForTodolist.filter(t => t.isDone)
                            }
                            if (tl.filter === 'active') {
                                tasksForTodolist = tasksForTodolist.filter(t => !t.isDone)
                            }

                            return (
                                <Grid item>
                                    <Paper style={{padding: '10px'}}>
                                        <Todolist
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={tasksForTodolist}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeTaskStatus={changeStatus}
                                            filter={tl.filter}
                                            removeTodolist={removeTodolist}
                                            changeTaskTitle={changeTaskTitle}
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