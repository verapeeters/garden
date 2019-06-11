import * as ACTIONCONSTANTS from '../constants/actionConstants';
import * as DIALOGS from '../constants/dialogConstants';
import * as DEFAULTS from '../data/defaults.data.js'
import {
    addWindowInShownWindows,
    getWindowsFor,
    toggleWindowInShownWindows,
    toggleWindowInShownWindowsXXS
} from "../utils/shownWindows";


const INITIALSTATE = {
    shownWindows: getWindowsFor(DEFAULTS.DATA.shownWindows),
};

//Reducer
export function shownWindowsReducer(state = INITIALSTATE, action) {
    switch (action.type) {
        case ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE: {
            const {windowType, windowKey, mediaLargerThenXXS} = action.payload;
            //console.log("shownWindowsReducer DIALOG_WINDOW_TOGGLE " + mediaLargerThenXXS);
            if (mediaLargerThenXXS) {
                const newShownWindows = toggleWindowInShownWindows(state.shownWindows, windowType, windowKey);
                return {...state, shownWindows: newShownWindows};
            } else {
                const newShownWindows = toggleWindowInShownWindowsXXS(state.shownWindows, windowType, windowKey);
                return {...state, shownWindows: newShownWindows};
            }
        }
        case ACTIONCONSTANTS.DIALOG_WINDOW_TO_FRONT: {
            const {windowKey} = action.payload;
            //console.log("shownWindowsReducer DIALOG_WINDOW_TO_FRONT");
            const newShownWindows = state.shownWindows.slice();
            const foundIndex = newShownWindows.findIndex((el) => el.key === windowKey);
            if (foundIndex !== -1) {
                const foundWindow = newShownWindows[foundIndex];
                newShownWindows.splice(foundIndex, 1);
                newShownWindows.push(foundWindow);
            }
            return {...state, shownWindows: newShownWindows};
        }
        case ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT: {
            return {...INITIALSTATE};
        }

        case ACTIONCONSTANTS.AGREE_WITH_COOKIE_LAW: {
            return {...state, shownWindows: toggleWindowInShownWindows(state.shownWindows, DIALOGS.COOKIE_LAW_DIALOG)};
        }
        case ACTIONCONSTANTS.TUTORIAL_RESET: {
            return {...state, shownWindows: addWindowInShownWindows(state.shownWindows, DIALOGS.TUTORIAL_DIALOG)};
        }
        case ACTIONCONSTANTS.IMPORT_GARDEN_AS_JSON_ON_LOAD: {
            return {
                ...state,
                shownWindows: toggleWindowInShownWindows(state.shownWindows, DIALOGS.IMPORT_FILE_SELECTOR_DIALOG)
            };
        }
        case ACTIONCONSTANTS.FETCH_CURRENT_CAMERA_POSITION: {
            return {
                ...state,
                shownWindows: toggleWindowInShownWindows(state.shownWindows, DIALOGS.SAVE_CAMERA_POSITION_DIALOG)
            };
        }
        case ACTIONCONSTANTS.EXPORT_GARDEN_AS_JSON_DONE: {
            return {
                ...state,
                shownWindows: toggleWindowInShownWindows(state.shownWindows, DIALOGS.EXPORT_GARDEN_AS_JSON_DIALOG)
            };
        }
        default:
            return state;
    }
}

