import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setAppStatusAC} from '../app/app-reducer'
import {AxiosError} from 'axios'
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils'

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOS': {
            return action.todos.map(tl => {
                return {...tl, filter: 'all', isDisabled: 'idle'}
            })
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', isDisabled: 'idle'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case 'CHANGE-TODOLIST-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, isDisabled: action.isDisabled} : tl)
        default:
            return state
    }
}

// actions
export const deleteTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter} as const
}
export const setTodosAC = (todos: TodolistType[]) => {
    return {type: 'SET-TODOS', todos} as const
}
export const changeTodolistIsDisabledAC = (id: string, isDisabled: RequestStatusType) => {
    return {type: 'CHANGE-TODOLIST-STATUS', id, isDisabled} as const
}

// thunks
export const fetchTodosTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setAppStatusAC('succeeded'))
            dispatch(setTodosAC(res.data))
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
}
export const deleteTodoTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistIsDisabledAC(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(deleteTodolistAC(todolistId))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
}
export const addTodoTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(addTodolistAC(res.data.data.item))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
}
export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.updateTodolist(id, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeTodolistTitleAC(id, title))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
}

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    isDisabled: RequestStatusType
}

type ActionsType =
    ReturnType<typeof deleteTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodosAC>
    | ReturnType<typeof changeTodolistIsDisabledAC>