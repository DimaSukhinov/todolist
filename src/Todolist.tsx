import React, {ChangeEvent} from 'react';
import './App.css';
import {filterType} from './App';
import {Form} from './common/Form';
import {EditableSpan} from './common/EditableSpan';
import {Button, Checkbox, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';

type todolistType = {
    id: string
    title: string
    tasks: taskType[]
    filter: filterType
    addTask: (title: string, todolistId: string) => void
    removeTask: (id: string, todolistId: string) => void
    changeFilter: (filter: filterType, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (taskId: string, todolistId: string, newTitle: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
}

export type taskType = {
    id: string
    isDone: boolean
    title: string
}

export const Todolist = (props: todolistType) => {

    const removeTodolist = () => props.removeTodolist(props.id)
    const addTask = (title: string) => props.addTask(title, props.id)
    const changeTodolistTitle = (newTitle: string) => props.changeTodolistTitle(props.id, newTitle)

    const setAll = () => props.changeFilter('all', props.id)
    const setActive = () => props.changeFilter('active', props.id)
    const setCompleted = () => props.changeFilter('completed', props.id)

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist}>
                    <Delete/>
                </IconButton>
            </h3>
            <div>
                <Form addItem={addTask}/>
            </div>
            <div>
                {
                    props.tasks.map(t => {

                            const removeTask = () => props.removeTask(t.id, props.id)
                            const onChangeTitle = (newTitle: string) => props.changeTaskTitle(t.id, props.id, newTitle)
                            const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)

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