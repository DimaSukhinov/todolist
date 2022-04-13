import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import '../App.css';
import {IconButton, TextField} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';

type FormType = {
    addItem: (title: string) => void
}

export const AddItemForm = React.memo((props: FormType) => {

    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const addTask = useCallback(() => {
        if (title.trim() !== '') {
            props.addItem(title.trim())
            setTitle('')
        } else {
            setError('Title is required!')
        }
    }, [props, title])

    const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value), [setTitle])

    const onKeyPressAddTask = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.key === 'Enter') {
            addTask()
        }
    }, [addTask, error])

    return (
        <div>
            <TextField
                variant={'outlined'}
                label={'Title'}
                value={title}
                onChange={onChangeTitle}
                onKeyPress={onKeyPressAddTask}
                error={!!error}
                helperText={error}
            />
            <IconButton color="primary" onClick={addTask}>
                <AddBoxIcon/>
            </IconButton>
        </div>
    )
})