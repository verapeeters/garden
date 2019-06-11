// noinspection Annotator
import {initialisePlantList, orderPlantListBy} from '../utils/plantListUtils.js';

import * as DEFAULTS from '../data/defaults.data.js'
import * as GARDENS from '../data/gardens.data.js';
import * as ACTIONCONSTANTS from '../constants/actionConstants';

//=============================== redux reducer

//export for test purposes
export function* idMaker(seed) {
    let index = seed || 0;
    while (true)
        yield index++;
}

let areaIdGenerator = idMaker();

//export for test purposes
export function enrichAreasWithKey(predefinedGarden, areaIdGenerator) {
    return predefinedGarden.map((area) =>
        ({...area, key: areaIdGenerator.next().value.toString()}));
}

//export for test purposes
export function gardenWithNewArea(garden, newArea, areaIdGenerator) {
    const enrichedNewArea = {...newArea, key: areaIdGenerator.next().value.toString()};
    const newGarden = garden.slice();
    newGarden.push(enrichedNewArea);
    return (newGarden);
}


const INITIALSTATE = {
    media: {
        largerThenXXS: false,
        width: undefined,
        height: undefined,
        hover: undefined,
    },
    cookieLawOk: false,
    tutorialStep: 0,
    showDebugInfo: DEFAULTS.DATA.showDebugInfo,
    gardenName: DEFAULTS.DATA.gardenName,
    gardenNameForNextExport: DEFAULTS.DATA.gardenName,
    selectedFile: null,
    showAllPlants: true,
    plantlist_order_direction: DEFAULTS.DATA.plantlist_order_direction,
    plantlist_order_field: DEFAULTS.DATA.plantlist_order_field,
    clearGardenOnImport: true,
    showContextMenuForPlant: null,
    areas: null, /*initialized in gardenReducer INITIALIZE_DATA */
    plants: null, /*initialized in gardenReducer INITIALIZE_DATA */
};


//Reducer
export function gardenReducer(state = INITIALSTATE, action) {
    switch (action.type) {
        case ACTIONCONSTANTS.INITIALIZE_DATA: {
            const {largerThenXXS, hover} = action.payload;
            const media = {...state.media, largerThenXXS, hover};
            //console.log("INITIALIZE_DATA media = " + JSON.stringify(media));
            if (!state.areas) {
                //console.log("INITIALIZE_DATA " + JSON.stringify(state));
                const areas = enrichAreasWithKey(GARDENS.PREDEFINED_GARDENS[state.gardenName], areaIdGenerator);
                const plants = initialisePlantList(areas);
                const orderedPlants = orderPlantListBy(plants, state.plantlist_order_direction === "asc", state.plantlist_order_field);

                return {...state, areas: areas, plants: orderedPlants, media};
            } else {
                // else state initialised from localstorage by redux-localstorage
                const newIdSeed = state.areas.reduce((cum, a) => Math.max(a.key, cum), 0) + 1;
                areaIdGenerator = idMaker(newIdSeed);
                return {...state, media};
            }
        }
        case ACTIONCONSTANTS.MODIFY_MEDIA_XXS: {
            const {largerThenXXS} = action.payload;
            const media = {...state.media, largerThenXXS};
            //console.log("MODIFY_MEDIA_XXS media = " + JSON.stringify(media));
            return {...state, media};
        }
        case ACTIONCONSTANTS.MODIFY_MEDIA_HOVER: {
            const {hover} = action.payload;
            const media = {...state.media, hover};
            //console.log("MODIFY_MEDIA_HOVER media = " + JSON.stringify(media));
            return {...state, media};
        }
        case ACTIONCONSTANTS.GARDEN_WINDOW_SIZE_CHANGED: {
            const media = {...state.media, width: window.innerWidth, height: window.innerHeight};
            //console.log("GARDEN_WINDOW_SIZE_CHANGED media = " + JSON.stringify(media));
            return {...state, media};
        }
        case ACTIONCONSTANTS.SELECT_PREDEFINED_GARDEN: {
            const {nameOfPredefinedAreaSet} = action.payload;
            //console.log("gardenReducer SELECT_PREDEFINED_GARDEN " + nameOfPredefinedAreaSet);
            const areas = enrichAreasWithKey(GARDENS.PREDEFINED_GARDENS[nameOfPredefinedAreaSet], areaIdGenerator);
            const plants = initialisePlantList(areas);
            const orderedPlants = orderPlantListBy(plants, state.plantlist_order_direction === "asc", state.plantlist_order_field);
            return {...state, gardenName: nameOfPredefinedAreaSet, areas: areas, plants: orderedPlants};
        }
        case ACTIONCONSTANTS.SHOW_ALL_AREAS: {
            return {
                ...state, areas: state.areas.map((area) => {
                    return {...area, showArea: true}
                })
            };
        }
        case ACTIONCONSTANTS.HIDE_ALL_AREAS: {
            return {
                ...state, areas: state.areas.map((area) => {
                    return {...area, showArea: false}
                })
            };
        }
        case ACTIONCONSTANTS.TOGGLE_SHOW_ALL_PLANTS: {
            return {...state, showAllPlants: !state.showAllPlants};
        }
        case ACTIONCONSTANTS.ORDER_PLANT_LIST_BY: {
            const {plantlist_order_field} = action.payload;
            const order_by_different_fields = state.plantlist_order_field !== plantlist_order_field;
            const ascending = (order_by_different_fields || state.plantlist_order_direction !== "asc");
            const orderedPlants = orderPlantListBy(state.plants, ascending, plantlist_order_field);
            return {
                ...state,
                plants: orderedPlants,
                plantlist_order_direction: ascending ? "asc" : "desc",
                plantlist_order_field: plantlist_order_field
            };
        }
        case ACTIONCONSTANTS.TOGGLE_SHOW_ONE_AREA: {
            const {areaKey} = action.payload;
            const areaToModify = {...state.areas.find((area) => area.key === areaKey)};
            const showArea = areaToModify.showArea || false;
            areaToModify.showArea = !showArea;

            return {
                ...state, areas: state.areas.map((area) => {
                    return (area.key === areaKey) ? areaToModify : area;
                })
            };
        }
        case ACTIONCONSTANTS.TOGGLE_SHOW_AREA_CONTEXT_MENU: {
            const {areaKey, x, y} = action.payload;
            //console.log("TOGGLE_SHOW_AREA_CONTEXT_MENU " + areaKey);

            const selectedArea = {...state.areas.find((area) => area.key === areaKey)};
            if (!selectedArea || state.showContextMenuForPlant) {
                return {...state, showContextMenuForPlant: null};
            } else {
                return {...state, showContextMenuForPlant: {area: selectedArea, x, y}};
            }

        }
        case ACTIONCONSTANTS.TOGGLE_SHOW_AREAS_FOR_PLANT: {
            const {plantId} = action.payload;
            const firstAreaForPlant = state.areas.find((area) => area.plant === plantId);
            if (!firstAreaForPlant) return state;

            const oldShowArea = firstAreaForPlant.showArea || false;

            return {
                ...state, areas: state.areas.map((area) => {
                    return (area.plant === plantId) ? {...area, showArea: !oldShowArea} : area;
                })
            };
        }
        case ACTIONCONSTANTS.CHANGE_FIELD_IN_GIVEN_AREA: {
            const {fieldName, areaKey, newValue} = action.payload;
            //console.log("CHANGE_FIELD_IN_GIVEN_AREA "+fieldName+" for area "+areaKey+" to "+ newValue);
            const areaToModify = {...state.areas.find((area) => area.key === areaKey)};
            areaToModify[fieldName] = Number(newValue);

            return {
                ...state, areas: state.areas.map((area) => {
                    return (area.key === areaKey) ? areaToModify : area;
                })
            };
        }
        case ACTIONCONSTANTS.CHANGE_POSITION_FOR_AREA: {
            const {areaKey, newX, newZ} = action.payload;
            const areaToModify = {...state.areas.find((area) => area.key === areaKey)};
            areaToModify.x = Number(newX);
            areaToModify.z = Number(newZ);

            return {
                ...state, areas: state.areas.map((area) => {
                    return (area.key === areaKey) ? areaToModify : area;
                })
            };
        }
        case ACTIONCONSTANTS.AGREE_WITH_COOKIE_LAW: {
            //console.log("ACTIONCONSTANTS.AGREE_WITH_COOKIE_LAW ");
            return {...state, cookieLawOk: true};
        }
        case ACTIONCONSTANTS.TUTORIAL_NEXT_STEP: {
            return {...state, tutorialStep: state.tutorialStep + 1};
        }
        case ACTIONCONSTANTS.TUTORIAL_PREVIOUS_STEP: {
            return {...state, tutorialStep: Math.max(0, state.tutorialStep - 1)};
        }
        case ACTIONCONSTANTS.TUTORIAL_RESET: {
            return {...state, tutorialStep: 0};
        }
        case ACTIONCONSTANTS.CLEAR_GARDEN: {
            //console.log("ACTIONCONSTANTS.CLEAR_GARDEN ");
            return {...state, areas: [], plants: []};
        }
        case ACTIONCONSTANTS.TOGGLE_CLEAR_GARDEN_ON_IMPORT: {
            return {...state, clearGardenOnImport: !state.clearGardenOnImport};
        }
        case ACTIONCONSTANTS.SET_NAME_FOR_EXPORT_GARDEN: {
            const {newGardenName} = action.payload;
            //console.log("ACTIONCONSTANTS.SET_NAME_FOR_EXPORT_GARDEN " + newGardenName);
            if (newGardenName && newGardenName !== "") {
                return {...state, gardenNameForNextExport: newGardenName};
            }
            return state;
        }
        case ACTIONCONSTANTS.FILE_SELECTED_FOR_IMPORT: {
            const {files} = action.payload;
            //console.log("ACTIONCONSTANTS.FILE_SELECTED "+files);
            if (files.length === 1) {
                return {...state, selectedFile: files[0]};
            }
            return state;
        }
        case ACTIONCONSTANTS.IMPORT_GARDEN_AS_JSON_ON_LOAD: {
            const {e} = action.payload;
            //console.log("IMPORT_GARDEN_AS_JSON_ON_LOAD");
            const fileReaderWithLoadedContent = e.target;
            //console.log("result " + fileReaderWithLoadedContent.result);
            const fileContent = fileReaderWithLoadedContent.result;
            //console.log("fileContent " + fileContent);
            const fileContentAsJson = JSON.parse(fileContent);

            //console.log(JSON.stringify(fileContentAsJson));
            const areasFromFile = enrichAreasWithKey(fileContentAsJson, areaIdGenerator);
            const areas = state.clearGardenOnImport ? areasFromFile : state.areas.concat(areasFromFile);
            const plants = initialisePlantList(areas);
            const orderedPlants = orderPlantListBy(plants, state.plantlist_order_direction === "asc", state.plantlist_order_field);

            return {...state, areas: areas, plants: orderedPlants};
        }
        case ACTIONCONSTANTS.IMPORT_GARDEN_AS_JSON_ON_ERROR: {
            return state;
        }
        case ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT: {
            //console.log("ACTIONCONSTANTS.RESET_GARDEN_TO_DEFAULT ");
            const newState = INITIALSTATE;
            const media = state.media;
            const areas = enrichAreasWithKey(GARDENS.PREDEFINED_GARDENS[newState.gardenName], areaIdGenerator);
            const plants = initialisePlantList(areas);
            const orderedPlants = orderPlantListBy(plants, newState.plantlist_order_direction === "asc", newState.plantlist_order_field);

            return {...newState, areas: areas, plants: orderedPlants, media};
        }

        case ACTIONCONSTANTS.DUPLICATE_AREA: {
            const {areaKey} = action.payload;
            const areaForAreaKey = state.areas.find((area) => area.key === areaKey);
            if (!areaForAreaKey) return state;
            //console.log("ACTIONCONSTANTS.DUPLICATE_AREA " + JSON.stringify(areaForAreaKey));
            const newAreas = gardenWithNewArea(state.areas, areaForAreaKey, areaIdGenerator);
            return {...state, areas: newAreas};
        }
        case ACTIONCONSTANTS.CREATE_NEW_AREA_FOR_PLANT: {
            const {plantId} = action.payload;
            const newAreaKey = state.areas.length.toString();

            const newArea = {key: newAreaKey, "x": 0, "z": 0, "width": 100, "length": 100, "plant": plantId};
            const newAreas = gardenWithNewArea(state.areas, newArea, areaIdGenerator);
            const newPlants = initialisePlantList(newAreas);
            return {...state, areas: newAreas, plants: newPlants};
        }
        case ACTIONCONSTANTS.DELETE_AREA: {
            const {areaKey} = action.payload;
            const newAreas = state.areas.filter((area) => area.key !== areaKey);
            const newPlants = initialisePlantList(newAreas);
            return {...state, areas: newAreas, plants: newPlants};
        }
        default:
            return state;
    }
}
