import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from '../app/store'
import {
    addTodoTC,
    changeTodolistFilterAC, changeTodolistTitleTC,
    deleteTodoTC,
    fetchTodosTC,
    FilterValuesType,
    TodolistDomainType
} from './todolists-reducer'
import {addTaskTC, changeTaskStatusTC, changeTaskTitleTC, deleteTaskTC, TasksStateType} from './tasks-reducer'
import {TaskStatuses} from '../api/todolists-api'
import Grid from '@mui/material/Grid'
import {AddItemForm} from '../components/AddItemForm'
import Paper from '@mui/material/Paper'
import {Todolist} from './todolist/Todolist'

export const TodolistsList: React.FC = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodosTC())
    }, [])

    const removeTask = useCallback((id: string, todolistId: string) => dispatch(deleteTaskTC(todolistId, id)), [])
    const addTask = useCallback((title: string, todolistId: string) => dispatch(addTaskTC(todolistId, title)), [])
    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => dispatch(changeTaskStatusTC(id, todolistId, status)), [])
    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => dispatch(changeTaskTitleTC(id, todolistId, newTitle)), [])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => dispatch(changeTodolistFilterAC(todolistId, value)), [])
    const removeTodolist = useCallback((id: string) => dispatch(deleteTodoTC(id)), [])
    const changeTodolistTitle = useCallback((id: string, title: string) => dispatch(changeTodolistTitleTC(id, title)), [])
    const addTodolist = useCallback((title: string) => dispatch(addTodoTC(title)), [])

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
                                    tasks={allTodolistTasks}
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
                    })
                }
            </Grid>
        </>
    )
}