
import * as ACTIONCONSTANTS from '../constants/actionConstants';
import * as DEFAULTS from "../data/defaults.data";

const INITIALSTATE = {
    weekNumber: DEFAULTS.DATA.weekNumber,
};

//Reducer
export function weekNumberReducer(state = INITIALSTATE, action) {
    switch (action.type) {
        case ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT: {
            return {...INITIALSTATE};
        }
        case ACTIONCONSTANTS.WEEK_NUMBER_CHANGE: {
            return {...state, weekNumber: Number(action.payload.newValue)};
        }
        case ACTIONCONSTANTS.WEEK_NUMBER_INCREMENT: {
            const newWeekNumber = state.weekNumber < 52 ? state.weekNumber + 1 : 1;
            return {...state, weekNumber: newWeekNumber};
        }

        default:
            return state;
    }
}

