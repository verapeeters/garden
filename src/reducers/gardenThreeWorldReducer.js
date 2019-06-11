// noinspection JSFileReferences
// noinspection NpmUsedModulesInstalled

import * as DEFAULTS from '../data/defaults.data.js'
import * as ACTIONCONSTANTS from "../constants/actionConstants";


//=============================== redux store

const INITIALSTATE = {
    activeCameraPositionName: DEFAULTS.DATA.activeCameraPositionName, // to modify orbitControls when a named cameraposition is selected
    lastSelectedCameraPositionName: DEFAULTS.DATA.activeCameraPositionName, //to save in local storage
    cameraPositionNameToSave: DEFAULTS.DATA.activeCameraPositionName+"NEW",
    savingCameraPosition: false, //only defined when we need to fetch cameraPosition in gardenThreeWorld
    savedCameraPositions: DEFAULTS.DATA.savedCameraPositions,
    orbitControlsActive: true,
};

//Reducer
export function gardenThreeWorldReducer(state = INITIALSTATE, action) {
    switch (action.type) {
        case ACTIONCONSTANTS.INITIALIZE_DATA: {
            //console.log("gardenThreeWorldReducer INITIALIZE_DATA savedCameraPositions:"+JSON.stringify(state.savedCameraPositions));
            return {...state, activeCameraPositionName: state.lastSelectedCameraPositionName};
        }
        case ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT: {
            //console.log("ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT ");
            return {...INITIALSTATE, activeCameraPositionName: state.lastSelectedCameraPositionName};
        }
        case ACTIONCONSTANTS.VIEW_FROM_SAVED_POSITION: {
            const {newPositionName} = action.payload;
            //const newCoordinates = state.savedCameraPositions[newPositionName];
            //console.log("gardenThreeWorldReducer VIEW_FROM_SAVED_POSITION " + newPositionName + " " + JSON.stringify(newCoordinates));
            return {...state, activeCameraPositionName: newPositionName, lastSelectedCameraPositionName: newPositionName};
        }
        case ACTIONCONSTANTS.TOGGLE_ORBIT_CONTROLS: {
            return {...state, orbitControlsActive: !state.orbitControlsActive};
        }
        case ACTIONCONSTANTS.MODIFY_VIEW_POINT_DONE: {
            return {...state, activeCameraPositionName: null,};
        }
        case ACTIONCONSTANTS.SET_NAME_FOR_CAMERA_POSITION: {
            const {newPositionName} = action.payload;
            //console.log("SET_NAME_FOR_CAMERA_POSITION "+newPositionName);
            return {...state, cameraPositionNameToSave: newPositionName,};
        }
        case ACTIONCONSTANTS.FETCH_CURRENT_CAMERA_POSITION: {
            //console.log("save current camera position with name REDUCER");
            //modify state so that we end up in the componentWillReceiveProps method where we can find the camera position
            return {...state, savingCameraPosition: true};
        }
        case ACTIONCONSTANTS.SAVE_FETCHED_CAMERA_POSITION_WITH_NAME: {
            const {newPositionName, coordinates} = action.payload;
            //console.log("gardenThreeWorldReducer SAVE_FETCHED_CAMERA_POSITION_WITH_NAME " + newPositionName + " " + JSON.stringify(coordinates));
            const newSavedCameraPositions = {...state.savedCameraPositions};
            newSavedCameraPositions[newPositionName] = {...coordinates};
            return {
                ...state,
                savingCameraPosition: false,
                savedCameraPositions: newSavedCameraPositions,
                activeCameraPositionName: newPositionName,
                lastSelectedCameraPositionName: newPositionName
            };
        }
        default:
            return state;
    }
}

