import React, {ChangeEvent, useCallback, useState, KeyboardEvent} from 'react'
import TextField from '@mui/material/TextField'

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {

    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(props.value)

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.value)
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }
    const onEnterPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            activateViewMode()
        }
    }, [activateViewMode])
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    return editMode
        ? <TextField value={title} onChange={changeTitle} onBlur={activateViewMode} onKeyPress={onEnterPress}
                     autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.value}</span>
})