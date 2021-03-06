import React, {createContext, useContext, useReducer} from "react";
import {
    createAsyncDispatcher,
    createAsyncHandler,
    initialAsyncState
} from "./asyncActionUtils";
import * as api from './api'

// UsersContext에서 사용할 기본 상태
const initialState = {
    users: initialAsyncState,
    user: initialAsyncState
}
const usersHandler = createAsyncHandler('GET_USERS', 'users')
const userHandler = createAsyncHandler('GET_USER', 'user')


// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
function usersReducer(state, action) {
    switch (action.type) {
        case 'GET_USERS':
        case 'GET_USERS_SUCCESS':
        case 'GET_USERS_ERROR':
            return usersHandler(state, action)
        case 'GET_USER':
        case 'GET_USER_SUCCESS':
        case 'GET_USER_ERROR':
            return userHandler(state, action)
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}
export const getUsers = createAsyncDispatcher('GET_USERS', api.getUsers);
export const getUser = createAsyncDispatcher('GET_USER', api.getUser);

const UsersStateContext = createContext(null)
const UsersDispatchContext = createContext(null)

export function UsersProvider({ children }) {
    const [state, dispatch] = useReducer(usersReducer, initialState);
    return (
        <UsersStateContext.Provider value={state}>
            <UsersDispatchContext.Provider value={dispatch}>
                {children}
            </UsersDispatchContext.Provider>
        </UsersStateContext.Provider>
    )
}
// State custom hook
export function useUsersState() {
    const state = useContext(UsersStateContext);
    if(!state) { throw new Error('Cannot find UsersProvider')}
    return state
}
// dispatch custom hook
export function useUsersDispatch() {
    const state = useContext(UsersDispatchContext);
    if(!state) { throw new Error('Cannot find UsersProvider')}
    return state
}
