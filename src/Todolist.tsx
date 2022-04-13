import React, {useCallback} from 'react';
import './App.css';
import {FilterType} from './App';
import {AddItemForm} from './common/AddItemForm';
import {EditableSpan} from './common/EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {addTaskAC} from './state/tasks-reducer';
import {Task} from './Task';

type TodolistType = {
    id: string
    title: string
    filter: FilterType
    changeFilter: (filter: FilterType, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
}

export type TaskType = {
    id: string
    isDone: boolean
    title: string
}

export const Todolist = React.memo((props: TodolistType) => {

    const dispatch = useDispatch()
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id])

    const addTask = useCallback((title: string) => dispatch(addTaskAC(title, props.id)), [dispatch, props])
    const removeTodolist = useCallback(() => props.removeTodolist(props.id), [props])
    const changeTodolistTitle = useCallback((title: string) => props.changeTodolistTitle(props.id, title), [props])

    const setAll = useCallback(() => props.changeFilter('all', props.id), [props])
    const setActive = useCallback(() => props.changeFilter('active', props.id), [props])
    const setCompleted = useCallback(() => props.changeFilter('completed', props.id), [props])

    let tasksForTodolist = tasks
    if (props.filter === 'active') {
        tasksForTodolist = tasksForTodolist.filter(t => !t.isDone)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist}>
                    <Delete/>
                </IconButton>
            </h3>
            <div>
                <AddItemForm addItem={addTask}/>
            </div>
            <div>
                {
                    tasksForTodolist.map(t => <Task key={t.id} todolistId={props.id} task={t}/>)
                }
            </div>
            <div style={{paddingTop: '5px'}}>
                <Button onClick={setAll}
                        variant={props.filter === 'all' ? 'contained' : 'text'}>All</Button>
                <Button color="primary" onClick={setActive}
                        variant={props.filter === 'active' ? 'contained' : 'text'}>Active</Button>
                <Button color="secondary" onClick={setCompleted}
                        variant={props.filter === 'completed' ? 'contained' : 'text'}>Completed</Button>
            </div>
        </div>
    )
})