import { tasksReducer } from './tasks-reducer'
import { todolistsReducer } from './todolists-reducer'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store