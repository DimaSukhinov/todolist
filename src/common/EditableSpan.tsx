import React, {ChangeEvent, useState} from 'react'
import '../App.css';
import {TextField} from '@material-ui/core';

type editableSpanType = {
    title: string
    onChange: (newValue: string) => void
}

export const EditableSpan = (props: editableSpanType) => {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')

    const onChangeInEditMode = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }

    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }

    return editMode
        ? <TextField value={title} onChange={onChangeInEditMode} onBlur={activateViewMode} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
}