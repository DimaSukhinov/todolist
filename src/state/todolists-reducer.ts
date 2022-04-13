import {FilterType, TodolistType} from '../App';
import {v1} from 'uuid';

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string
}

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterType
}

type ActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType

export let todolistID1 = v1()
export let todolistID2 = v1()

const initialState: TodolistType[] = [
    {id: todolistID1, title: 'What to learn', filter: 'all'},
    {id: todolistID2, title: 'What to buy', filter: 'all'},
]

export const todolistsReducer = (state: TodolistType[] = initialState, action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            const stateCopy = [...state]
            return stateCopy.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            const stateCopy = [...state]
            return [{id: action.todolistId, title: action.title, filter: 'all'}, ...stateCopy]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const stateCopy = [...state]
            let todolist = stateCopy.find(tl => tl.id === action.id)
            if (todolist) {
                todolist.title = action.title
            }
            return [...stateCopy]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const stateCopy = [...state]
            let todolist = stateCopy.find(tl => tl.id === action.id)
            if (todolist) {
                todolist.filter = action.filter
            }
            return [...stateCopy]
        }
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}

export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title, todolistId: v1()}
}

export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title}
}

export const changeTodolistFilterAC = (filter: FilterType, id: string): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter}
}