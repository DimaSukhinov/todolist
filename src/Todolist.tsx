import React, {ChangeEvent} from 'react';
import './App.css';
import {FilterType} from './AppWithRedux';
import {Form} from './common/Form';
import {EditableSpan} from './common/EditableSpan';
import {Button, Checkbox, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer';

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

export const Todolist = (props: TodolistType) => {

    const dispatch = useDispatch()
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id])

    const removeTodolist = () => props.removeTodolist(props.id)
    const changeTodolistTitle = (newTitle: string) => props.changeTodolistTitle(props.id, newTitle)

    const setAll = () => props.changeFilter('all', props.id)
    const setActive = () => props.changeFilter('active', props.id)
    const setCompleted = () => props.changeFilter('completed', props.id)

    let tasksForTodolist = tasks
    if (props.filter === 'completed') {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone)
    }
    if (props.filter === 'active') {
        tasksForTodolist = tasksForTodolist.filter(t => !t.isDone)
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
                <Form addItem={(title) => dispatch(addTaskAC(title, props.id))}/>
            </div>
            <div>
                {
                    tasksForTodolist.map(t => {

                            const removeTask = () => dispatch(removeTaskAC(t.id, props.id))
                            const onChangeTitle = (title: string) => dispatch(changeTaskTitleAC(t.id, props.id, title))
                            const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(t.id, e.currentTarget.checked, props.id))

                            return (
                                <div key={t.id} className={t.isDone ? 'is-done' : ''}>
                                    <Checkbox checked={t.isDone} onChange={onChangeStatus}/>
                                    <EditableSpan title={t.title} onChange={onChangeTitle}/>
                                    <IconButton onClick={removeTask}>
                                        <Delete/>
                                    </IconButton>
                                </div>
                            )
                        }
                    )
                }
            </div>
            <div>
                <Button onClick={setAll}
                        variant={props.filter === 'all' ? 'contained' : 'text'}>All</Button>
                <Button color="primary" onClick={setActive}
                        variant={props.filter === 'active' ? 'contained' : 'text'}>Active</Button>
                <Button color="secondary" onClick={setCompleted}
                        variant={props.filter === 'completed' ? 'contained' : 'text'}>Completed</Button>
            </div>
        </div>
    )
}