import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {App} from './app/App'
import reportWebVitals from './reportWebVitals'
import {Provider} from 'react-redux'
import {store} from './app/store'
import {HashRouter} from 'react-router-dom'

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
)

reportWebVitals()