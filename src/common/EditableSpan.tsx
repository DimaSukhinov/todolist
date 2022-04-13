import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react'
import '../App.css';
import {TextField} from '@material-ui/core';

type editableSpanType = {
    title: string
    onChange: (newValue: string) => void
}

export const EditableSpan = React.memo((props: editableSpanType) => {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')

    const onChangeInEditMode = useCallback((e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value), [])

    const activateEditMode = useCallback(() => {
        setEditMode(true)
        setTitle(props.title)
    }, [props])

    const activateViewMode = useCallback(() => {
        setEditMode(false)
        props.onChange(title)
    }, [props, title])

    const onEnterPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            activateViewMode()
        }
    }, [activateViewMode])

    return editMode
        ? <TextField value={title} onChange={onChangeInEditMode} onBlur={activateViewMode} onKeyPress={onEnterPress}
                     autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
})