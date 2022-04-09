import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import '../App.css';
import {IconButton, TextField} from '@material-ui/core';
import {ControlPoint} from '@material-ui/icons';

type FormType = {
    addItem: (title: string) => void
}

export const Form = (props: FormType) => {

    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    const addTask = () => {
        if (title.trim() !== '') {
            props.addItem(title.trim())
            setTitle('')
        } else {
            setError('Title is required!')
            // props.addItem('New list')
        }
    }

    const onKeyPressAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') {
            addTask()
        }
    }

    return (
        <div>
            <TextField
                variant={'outlined'}
                label={'Type value'}
                value={title}
                onChange={onChangeTitle}
                onKeyPress={onKeyPressAddTask}
                error={!!error}
                helperText={error}
            />
            <IconButton color="primary" onClick={addTask}>
                <ControlPoint />
            </IconButton>
        </div>
    )
}