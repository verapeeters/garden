import ReactGA from 'react-ga';
import *  as ACTIONCONSTANTS from "./constants/actionConstants";


//Actions


//================================================================================
//========== init
export const initializeDataAction = (largerThenXXS, hover) => ({
    type: ACTIONCONSTANTS.INITIALIZE_DATA,
    payload: {largerThenXXS, hover}
});

//================================================================================
//========== simple
export const clickSunPositionAction = (positionName, newValue) => ({
    type: ACTIONCONSTANTS.CLICK_SUN_POSITION,
    payload: {positionName, newValue}
});

export const modifyMediaXssAction = (largerThenXXS) => ({
    type: ACTIONCONSTANTS.MODIFY_MEDIA_XXS,
    payload: {largerThenXXS}
});
export const modifyMediaHoverAction = (hover) => ({type: ACTIONCONSTANTS.MODIFY_MEDIA_HOVER, payload: {hover}});
export const windowSizeChangedAction = () => ({type: ACTIONCONSTANTS.GARDEN_WINDOW_SIZE_CHANGED, payload: {}});

export const weekNumberChangeAction = (newValue) => ({type: ACTIONCONSTANTS.WEEK_NUMBER_CHANGE, payload: {newValue}});
export const weekNumberIncrementAction = {type: ACTIONCONSTANTS.WEEK_NUMBER_INCREMENT};

export const agreeWithCookieLawAction = {type: ACTIONCONSTANTS.AGREE_WITH_COOKIE_LAW};
export const tutorialResetAction = {type: ACTIONCONSTANTS.TUTORIAL_RESET};
export const tutorialNextStepAction = {type: ACTIONCONSTANTS.TUTORIAL_NEXT_STEP};
export const tutorialPreviousStepAction = {type: ACTIONCONSTANTS.TUTORIAL_PREVIOUS_STEP};

//================================================================================
//========== show / hide
export const showAllAreasAction = {type: ACTIONCONSTANTS.SHOW_ALL_AREAS};
export const hideAllAreasAction = {type: ACTIONCONSTANTS.HIDE_ALL_AREAS};
export const toggleShowAllPlantsAction = {type: ACTIONCONSTANTS.TOGGLE_SHOW_ALL_PLANTS};
export const toggleShowOneAreaAction = (areaKey) => ({type: ACTIONCONSTANTS.TOGGLE_SHOW_ONE_AREA, payload: {areaKey}});
export const toggleShowAreaContextMenuAction = (areaKey, x, y) => ({
    type: ACTIONCONSTANTS.TOGGLE_SHOW_AREA_CONTEXT_MENU,
    payload: {areaKey, x, y}
});
export const toggleShowAreasForPlantAction = (plantId) => ({
    type: ACTIONCONSTANTS.TOGGLE_SHOW_AREAS_FOR_PLANT,
    payload: {plantId}
});
export const toggleOrbitControlsAction = {type: ACTIONCONSTANTS.TOGGLE_ORBIT_CONTROLS};

//================================================================================
//========== order
export const orderPlantListByAction = (plantlist_order_field) => ({
    type: ACTIONCONSTANTS.ORDER_PLANT_LIST_BY,
    payload: {plantlist_order_field}
});


//================================================================================
//========== camera positions
export const viewFromSavedPositionAction = (newPositionName, newCoordinates) => ({
    type: ACTIONCONSTANTS.VIEW_FROM_SAVED_POSITION,
    payload: {newPositionName, newCoordinates}
});

export const saveCurrentCameraPositionWithNameAction = (newPositionName) => ({
    type: ACTIONCONSTANTS.FETCH_CURRENT_CAMERA_POSITION,
    payload: {newPositionName}
});
export const setNameForCameraPositionAction = (newPositionName) => ({
    type: ACTIONCONSTANTS.SET_NAME_FOR_CAMERA_POSITION,
    payload: {newPositionName}
});
export const saveFetchedCameraPositionWithNameAction = (newPositionName, coordinates) => ({
    type: ACTIONCONSTANTS.SAVE_FETCHED_CAMERA_POSITION_WITH_NAME,
    payload: {newPositionName, coordinates}
});

export const modifyViewPointDoneAction = {type: ACTIONCONSTANTS.MODIFY_VIEW_POINT_DONE};

//================================================================================
//========== dialog window
export const dialogWindowToggleAction = (windowType, windowKey) => (
    async function (dispatch, getState) {
        //console.log("dialogWindowToggleAction thunk");
        const state = getState();
        dispatch(dialogWindowToggleWithMediaTypeAction(windowType, windowKey, state.gardenReducer.media.largerThenXXS));
    });
export const dialogWindowToggleWithMediaTypeAction = (windowType, windowKey, mediaLargerThenXXS) => ({
    type: ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE,
    payload: {windowType, windowKey, mediaLargerThenXXS}
});
export const dialogWindowToFrontAction = (windowKey) => ({
    type: ACTIONCONSTANTS.DIALOG_WINDOW_TO_FRONT,
    payload: {windowKey}
});


//================================================================================
//========== import / export
export const setNameForExportGardenAction = (newGardenName) => ({
    type: ACTIONCONSTANTS.SET_NAME_FOR_EXPORT_GARDEN,
    payload: {newGardenName}
});
export const exportGardenAsJsonAction = () => (
    async function (dispatch, getState) {
        //console.log("exportGardenAsJsonAction thunk");
        const state = getState();
        const gardenNameForNextExport = state.gardenReducer.gardenNameForNextExport;
        if (gardenNameForNextExport && gardenNameForNextExport !== "") {
            saveGardenAsFile(gardenNameForNextExport, state.gardenReducer.areas);
            ReactGA.event({category: "export", action: "export garden as json file"});
            dispatch(exportGardenAsJsonDoneAction());
        }

    }
);
export const exportGardenAsJsonDoneAction = () => ({type: ACTIONCONSTANTS.EXPORT_GARDEN_AS_JSON_DONE});

function saveGardenAsFile(newFileName, areas) {
    const propsToStringify = ["x", "z", "width", "length", "plant"];
    const areasAsJSON = areas.reduce((accumulator, a) => (accumulator + (accumulator === "" ? "" : ", \n") + JSON.stringify(a, propsToStringify)), "");
    const filename = newFileName + ".json";
    const blob = new Blob(["[" + areasAsJSON + "]"], {type: 'application/json'});
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
}

export const fileSelectedForImportAction = (files) => ({
    type: ACTIONCONSTANTS.FILE_SELECTED_FOR_IMPORT,
    payload: {files}
});
export const toggleClearGardenOnImportAction = () => ({type: ACTIONCONSTANTS.TOGGLE_CLEAR_GARDEN_ON_IMPORT});
export const importGardenAsJsonAction = () => (
    function (dispatch, getState) {
        //console.log("importGardenAsJsonAction thunk");
        const state = getState();
        if (state.gardenReducer.selectedFile && state.gardenReducer.selectedFile.size > 0) {
            //console.log("importGardenAsJsonAction thunk selectedFile found");
            ReactGA.event({category: "import", action: "import garden from json file"});
            let reader = new FileReader();
            reader.onloadend = (e) => dispatch(importGardenAsJsonOnLoadAction(e));
            reader.onerror = (e) => dispatch(importGardenAsJsonOnErrorAction(e));
            reader.readAsText(state.gardenReducer.selectedFile);
        }
    }
);
export const importGardenAsJsonOnLoadAction = (e) => ({
    type: ACTIONCONSTANTS.IMPORT_GARDEN_AS_JSON_ON_LOAD,
    payload: {e}
});
export const importGardenAsJsonOnErrorAction = (e) => ({
    type: ACTIONCONSTANTS.IMPORT_GARDEN_AS_JSON_ON_ERROR,
    payload: {e}
});
export const resetGardenToDefaultAction = (e) => ({type: ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT});


//================================================================================
//========== Predefined Gardens
export const selectPredefinedGardenAction = (nameOfPredefinedAreaSet) => ({
    type: ACTIONCONSTANTS.SELECT_PREDEFINED_GARDEN,
    payload: {nameOfPredefinedAreaSet}
});

//================================================================================
//========== area actions
export const duplicateAreaAction = (areaKey) => ({type: ACTIONCONSTANTS.DUPLICATE_AREA, payload: {areaKey}});
export const createNewAreaForPlantAction = (plantId) => ({
    type: ACTIONCONSTANTS.CREATE_NEW_AREA_FOR_PLANT,
    payload: {plantId}
});
export const deleteAreaAction = (areaKey) => ({type: ACTIONCONSTANTS.DELETE_AREA, payload: {areaKey}});
export const changeFieldInGivenAreaAction = (fieldName, areaKey, newValue) => ({
    type: ACTIONCONSTANTS.CHANGE_FIELD_IN_GIVEN_AREA,
    payload: {fieldName, areaKey, newValue}
});
export const changePositionForAreaAction = (areaKey, newX, newZ) => ({
    type: ACTIONCONSTANTS.CHANGE_POSITION_FOR_AREA,
    payload: {areaKey, newX, newZ}
});
export const clearGardenAction = () => ({type: ACTIONCONSTANTS.CLEAR_GARDEN});


