import { tasksReducer } from '../features/tasks-reducer'
import { todolistsReducer } from '../features/todolists-reducer'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import {appReducer} from './app-reducer'
import thunk from 'redux-thunk'
import {TypedUseSelectorHook, useSelector} from 'react-redux'

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store