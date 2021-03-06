import {addTodolistAC, deleteTodolistAC, setTodosAC} from './todolists-reducer'
import {TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../app/store'
import {setAppStatusAC} from '../app/app-reducer'
import {AxiosError} from 'axios'
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils'

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOS': {
            const stateCopy = {...state}
            action.todos.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId]
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId)
            return stateCopy
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId]
            stateCopy[action.task.todoListId] = [action.task, ...tasks]
            return stateCopy
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId]
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t)
            return ({...state})
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId]
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t)
            return ({...state})
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        }
        default:
            return state
    }
}

// actions
export const deleteTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const
}
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {type: 'SET-TASKS', todolistId, tasks} as const
}

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setAppStatusAC('succeeded'))
            dispatch(setTasksAC(todolistId, res.data.items))
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(deleteTaskAC(taskId, todolistId))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
}
export const addTaskTC = (todoListId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todoListId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(addTaskAC(res.data.data.item))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
}
export const changeTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const tasks = getState().tasks
        const tasksForCurrentTodolist = tasks[todolistId]
        const task = tasksForCurrentTodolist.find(t => t.id === taskId)

        if (task) {
            dispatch(setAppStatusAC('loading'))
            todolistsAPI.updateTask(todolistId, taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: status
            })
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(setAppStatusAC('succeeded'))
                        dispatch(changeTaskStatusAC(taskId, status, todolistId))
                    } else {
                        handleServerAppError(dispatch, res.data)
                    }
                })
                .catch((err: AxiosError) => {
                    handleServerNetworkError(dispatch, err.message)
                })
        }
    }
export const changeTaskTitleTC = (taskId: string, todolistId: string, newTitle: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const tasks = getState().tasks
        const tasksForCurrentTodolist = tasks[todolistId]
        const task = tasksForCurrentTodolist.find(t => t.id === taskId)

        if (task) {
            dispatch(setAppStatusAC('loading'))
            todolistsAPI.updateTask(todolistId, taskId, {
                title: newTitle,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status
            })
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(setAppStatusAC('succeeded'))
                        dispatch(changeTaskTitleAC(taskId, newTitle, todolistId))
                    } else {
                        handleServerAppError(dispatch, res.data)
                    }
                })
                .catch((err: AxiosError) => {
                    handleServerNetworkError(dispatch, err.message)
                })
        }
    }

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

type ActionsType =
    ReturnType<typeof deleteTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof deleteTodolistAC>
    | ReturnType<typeof setTodosAC>
    | ReturnType<typeof setTasksAC>