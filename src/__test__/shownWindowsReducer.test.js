import {
    shownWindowsReducer
} from '../reducers/shownWindowsReducer';

import * as ACTIONCONSTANTS from '../constants/actionConstants';

function windowForPlantFiche(plantId) {
    return {windowType: "plantFicheDialog", key: plantId};
}

function windowForType(windowType) {
    return {windowType: windowType, key: windowType};
}


describe('ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE', () => {

    test('empty list add PlantFiche', () => {
        const originalState = {shownWindows: []};
        const expectedState = {shownWindows: [windowForPlantFiche("anthericum_liliago")]};

        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE,
            payload: {windowType: "plantFicheDialog", windowKey: "anthericum_liliago", mediaLargerThenXXS: true},
        })).toEqual(expectedState);
    });
    test('empty list add different windowType', () => {
        const originalState = {shownWindows: []};
        const expectedState = {shownWindows: [windowForType("otherType")]};

        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE,
            payload: {windowType: "otherType", mediaLargerThenXXS: true}
        })).toEqual(expectedState);
    });

    test('non-empty list containing different windowType', () => {
        const originalState = {shownWindows: [windowForType("otherType")]};
        const expectedState = {shownWindows: [windowForType("otherType"), windowForPlantFiche("anthericum_liliago")]};

        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE,
            payload: {windowType: "plantFicheDialog", windowKey: "anthericum_liliago", mediaLargerThenXXS: true}
        })).toEqual(expectedState);
    });
    test('non-empty list add different windowType', () => {
        const originalState = {shownWindows: [windowForPlantFiche("anthericum_liliago")]};
        const expectedState = {shownWindows: [windowForPlantFiche("anthericum_liliago"), windowForType("otherType")]};

        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE,
            payload: {windowType: "otherType", mediaLargerThenXXS: true}
        })).toEqual(expectedState);
    });
    test('non-empty list containing plantFiche', () => {
        const originalState = {shownWindows: [windowForPlantFiche("anthericum_liliago")]};
        const expectedState = {shownWindows: [windowForPlantFiche("anthericum_liliago"), windowForPlantFiche("narcis")]};

        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE,
            payload: {windowType: "plantFicheDialog", windowKey: "narcis", mediaLargerThenXXS: true}
        })).toEqual(expectedState);
    });
    test('plant exists in list: result: plant is removed', () => {
        const originalState = {shownWindows: [windowForPlantFiche("anthericum_liliago"), windowForPlantFiche("narcis")]};
        const expectedState = {shownWindows: [windowForPlantFiche("anthericum_liliago")]};
        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE,
            payload: {windowType: "plantFicheDialog", windowKey: "narcis", mediaLargerThenXXS: true}
        })).toEqual(expectedState);
    });
    test('other windowType exists in list: result: it is removed', () => {
        const originalState = {shownWindows: [windowForPlantFiche("anthericum_liliago"), windowForType("otherType")]};
        const expectedState = {shownWindows: [windowForPlantFiche("anthericum_liliago")]};
        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TOGGLE,
            payload: {windowType: "otherType", mediaLargerThenXXS: true}
        })).toEqual(expectedState);
    });
});

describe('ACTIONCONSTANTS.DIALOG_WINDOW_TO_FRONT', () => {

    test('empty list: no effect', () => {
        const originalState = {shownWindows: []};
        const expectedState = {shownWindows: []};

        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TO_FRONT,
            payload: {windowKey: "anthericum_liliago"}
        })).toEqual(expectedState);
    });
    test('non-empty list: to front means to end of array', () => {
        const originalState = {shownWindows: [windowForPlantFiche("anthericum_liliago"), windowForPlantFiche("narcis")]};
        const expectedState = {shownWindows: [windowForPlantFiche("narcis"), windowForPlantFiche("anthericum_liliago")]};

        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TO_FRONT,
            payload: {windowKey: "anthericum_liliago"}
        })).toEqual(expectedState);
    });
    test('plant that is not in list: result: no effect', () => {
        const originalState = {shownWindows: [windowForPlantFiche("anthericum_liliago"), windowForPlantFiche("narcis")]};
        const expectedState = {shownWindows: [windowForPlantFiche("anthericum_liliago"), windowForPlantFiche("narcis")]};

        expect(shownWindowsReducer(originalState, {
            type: ACTIONCONSTANTS.DIALOG_WINDOW_TO_FRONT,
            payload: {windowKey: "non existing"}
        })).toEqual(expectedState);
    })
});
