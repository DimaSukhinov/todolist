import {v1} from 'uuid'
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from 'redux'

type ActionsType =
    ReturnType<typeof deleteTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodosAC>

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET_TODOS': {
            return action.todos.map(tl => {
                return {...tl, filter: 'all'}
            })
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state;
    }
}

export const deleteTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title, todolistId: v1()} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter} as const
}
export const setTodosAC = (todos: TodolistType[]) => {
    return {type: 'SET_TODOS', todos} as const
}

export const fetchTodosTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolists().then((res) => {
        dispatch(setTodosAC(res.data))
    })
}
export const deleteTodoTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTodolist(todolistId).then(() => {
        dispatch(deleteTodolistAC(todolistId))
    })
}
export const addTodoTC = (title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTodolist(title).then((res) => {
        dispatch(addTodolistAC(title))
    })
}
export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title).then(() => {
        dispatch(changeTodolistTitleAC(id, title))
    })
}