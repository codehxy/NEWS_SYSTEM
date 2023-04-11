import { configureStore } from '@reduxjs/toolkit';
import CollapsedReducer from './reducers/CollapsedReducer';
import LoadingReducer from './reducers/LoadingReducer';



const store = configureStore({
    reducer: {
        collapsed: CollapsedReducer,
        loading: LoadingReducer
    },
})


export default store
