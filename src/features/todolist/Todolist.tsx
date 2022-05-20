import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../components/AddItemForm'
import {EditableSpan} from '../../components/EditableSpan'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import {Delete} from '@mui/icons-material'
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from '../../api/todolists-api'
import {FilterValuesType} from '../todolists-reducer'
import {fetchTasksTC} from '../tasks-reducer'
import {useDispatch} from 'react-redux'
import {RequestStatusType} from '../../app/app-reducer'

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    isDisabled: RequestStatusType
}

export const Todolist = React.memo( (props: PropsType) => {

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [])

    const addTask = useCallback((title: string) => props.addTask(title, props.id), [props])

    const removeTodolist = useCallback(() => props.removeTodolist(props.id), [props])
    const changeTodolistTitle = useCallback((title: string) => props.changeTodolistTitle(props.id, title), [props])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props])


    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={props.isDisabled === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} isDisabled={props.isDisabled}/>
            <div>
                {
                    tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.id}
                                                    removeTask={props.removeTask}
                                                    changeTaskTitle={props.changeTaskTitle}
                                                    changeTaskStatus={props.changeTaskStatus}
                    />)
                }
            </div>
            <div style={{paddingTop: '10px'}}>
                <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                        onClick={onAllClickHandler}
                        color={'inherit'}
                >All
                </Button>
                <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                        onClick={onActiveClickHandler}
                        color={'primary'}>Active
                </Button>
                <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                        onClick={onCompletedClickHandler}
                        color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    )
})