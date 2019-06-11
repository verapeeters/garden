
import * as ACTIONCONSTANTS from '../constants/actionConstants';

const INITIALSTATE = {
    sunPosition: {x: -200, y: 700, z: 500},
};

//Reducer
export function sunMeshReducer(state = INITIALSTATE, action) {
    switch (action.type) {
        case ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT: {
            //console.log("ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT ");
            return INITIALSTATE;
        }
        case ACTIONCONSTANTS.CLICK_SUN_POSITION: {
            const {positionName, newValue} = action.payload;
            const newSunPosition = {...state.sunPosition};
            newSunPosition[positionName] += newValue;
            return {...state, sunPosition: newSunPosition, };
        }

        default:
            return state;
    }
}

