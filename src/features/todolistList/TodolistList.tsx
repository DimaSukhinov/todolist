import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from '../../app/store'
import {
    addTodoTC, changeTodolistFilterAC, changeTodolistTitleTC,
    deleteTodoTC, fetchTodosTC, FilterValuesType, TodolistDomainType
} from '../todolists-reducer'
import {addTaskTC, changeTaskStatusTC, changeTaskTitleTC, deleteTaskTC, TasksStateType} from '../tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import Grid from '@mui/material/Grid'
import {AddItemForm} from '../../components/AddItemForm'
import Paper from '@mui/material/Paper'
import {Todolist} from './todolist/Todolist'
import {useNavigate} from 'react-router-dom'

export const TodolistsList = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchTodosTC())
        } else {
            navigate('login')
        }
    }, [isLoggedIn])
    
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const removeTask = useCallback((id: string, todolistId: string) => dispatch(deleteTaskTC(todolistId, id)), [dispatch])
    const addTask = useCallback((title: string, todolistId: string) => dispatch(addTaskTC(todolistId, title)), [dispatch])
    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => dispatch(changeTaskStatusTC(id, todolistId, status)), [dispatch])
    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => dispatch(changeTaskTitleTC(id, todolistId, newTitle)), [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => dispatch(changeTodolistFilterAC(todolistId, value)), [dispatch])
    const changeTodolistTitle = useCallback((id: string, title: string) => dispatch(changeTodolistTitleTC(id, title)), [dispatch])
    const removeTodolist = useCallback((id: string) => dispatch(deleteTodoTC(id)), [dispatch])
    const addTodolist = useCallback((title: string) => dispatch(addTodoTC(title)), [dispatch])

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    id={tl.id}
                                    title={tl.title}
                                    filter={tl.filter}
                                    isDisabled={tl.isDisabled}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    )
}