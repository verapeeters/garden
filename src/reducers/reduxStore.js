// noinspection Annotator
import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage'


import {gardenReducer} from './gardenReducer.js';
import {gardenThreeWorldReducer} from './gardenThreeWorldReducer.js';
import {shownWindowsReducer} from "./shownWindowsReducer";
import {sunMeshReducer} from './sunReducer';
import {weekNumberReducer} from "./weekNumberReducer";


//=============================== redux store
const combinedReducers = combineReducers({
    gardenReducer,
    gardenThreeWorldReducer,
    shownWindowsReducer,
    sunMeshReducer,
    weekNumberReducer,
});

function storeOnlyWhenAgreedWithCookieLaw (paths) {
    return (state) => {
        return state.gardenReducer.cookieLawOk
            ? {...state, gardenReducer: {...state.gardenReducer, media: undefined}}
            : {};
    }
}

// noinspection Annotator
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// noinspection JSUnusedGlobalSymbols
export const store = createStore(combinedReducers,
    composeEnhancers(applyMiddleware(thunk)),
    persistState(undefined, {key: "Garden", slicer: storeOnlyWhenAgreedWithCookieLaw}));
