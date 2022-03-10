import { applyMiddleware, createStore } from "redux"
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension';

const middleware = [
    thunk
]

const state = {}

const store = createStore(rootReducer, state, composeWithDevTools(applyMiddleware(...middleware)))

export default store