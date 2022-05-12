import {useDispatch} from 'react-redux';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer';
import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from '@material-ui/core';
import {EditableSpan} from './common/EditableSpan';
import {Delete} from '@material-ui/icons';
import {TaskType} from './Todolist';

type TaskPropsType = {
    todolistId: string
    task: TaskType
}

export const Task = React.memo((props: TaskPropsType) => {

    const dispatch = useDispatch()

    const removeTask = useCallback(() => dispatch(removeTaskAC(props.task.id, props.todolistId)), [dispatch, props])
    const onChangeTitle = useCallback((title: string) => dispatch(changeTaskTitleAC(props.task.id, title, props.todolistId)), [dispatch, props])
    const onChangeStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(props.task.id, e.currentTarget.checked, props.todolistId)), [dispatch, props])

    return (
        <ListItem key={props.task.id} disableGutters divider button={false}
                  style={{display: 'flex', justifyContent: 'space-between'}}>
            <div key={props.task.id} className={props.task.isDone ? 'is-done' : ''}>
                <Checkbox checked={props.task.isDone} onChange={onChangeStatus} color={'primary'}/>
                <EditableSpan title={props.task.title} onChange={onChangeTitle}/>
            </div>
            <IconButton onClick={removeTask}>
                <Delete/>
            </IconButton>
        </ListItem>
    )
})