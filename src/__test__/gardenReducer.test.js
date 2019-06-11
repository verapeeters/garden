import {
    idMaker,
    enrichAreasWithKey,
    gardenWithNewArea,
    gardenReducer
} from '../reducers/gardenReducer.js';

import * as ACTIONCONSTANTS from '../constants/actionConstants';

describe('test if test works', () => {
    test('first test', () => {
        expect(1).toEqual(1);
    });
});


describe('idMaker', () => {
    test('several calls', () => {
        const gen = idMaker();

        expect(gen.next().value).toEqual(0);
        expect(gen.next().value).toEqual(1);
        expect(gen.next().value).toEqual(2);
    });
    test('seeded idMaker', () => {
        const gen = idMaker(65);

        expect(gen.next().value).toEqual(65);
        expect(gen.next().value).toEqual(66);
    });
});

describe('enrichAreasWithKey', () => {
    test('empty garden', () => {
        const idGenerator = idMaker();
        expect(enrichAreasWithKey([], idGenerator)).toEqual([]);
    });
    test('one area', () => {
        const idGenerator = idMaker();
        const area = {plant: "anthericum_liliago"};
        const expectedArea = {key: "0", plant: "anthericum_liliago"};
        expect(enrichAreasWithKey([area], idGenerator)).toEqual([expectedArea]);
    });
    test('more areas', () => {
        const idGenerator = idMaker();
        const areas = [{plant: "anthericum_liliago"}, {plant: "crocus"}, {plant: "stipa"}];
        const expectedAreas = [{key: "0", plant: "anthericum_liliago"}, {key: "1", plant: "crocus"}, {
            key: "2",
            plant: "stipa"
        }];
        expect(enrichAreasWithKey(areas, idGenerator)).toEqual(expectedAreas);
    });
});

describe('gardenWithNewArea', () => {
    const newArea1 = {plant: "anthericum_liliago"};
    const newArea2 = {plant: "crocus"};
    test('empty garden', () => {
        const idGenerator = idMaker();
        const expectedGarden = [{key: "0", plant: "anthericum_liliago"}];
        expect(gardenWithNewArea([], newArea1, idGenerator)).toEqual(expectedGarden);
    });
    test('garden that contains an area', () => {
        const idGenerator = idMaker();
        const gardenWithOneArea = gardenWithNewArea([], newArea1, idGenerator);
        const expectedGarden = [{key: "0", plant: "anthericum_liliago"}, {key: "1", plant: "crocus"}];
        expect(gardenWithNewArea(gardenWithOneArea, newArea2, idGenerator)).toEqual(expectedGarden);
    });
});


describe('ACTIONCONSTANTS.ORDER_PLANT_LIST_BY', () => {
    test('virgin state - order by name', () => {
        const originalState = {
            plants: [
                {plantId: "crocus"},
                {plantId: "anthericum_liliago"},]
        };
        const expectedState = {
            "plantlist_order_direction": "asc", plantlist_order_field: "name",
            plants: [
                {plantId: "anthericum_liliago"},
                {plantId: "crocus"},]
        };
        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.ORDER_PLANT_LIST_BY, payload: {plantlist_order_field: "name"}
        })).toEqual(expectedState);
    });
    test('virgin state - order by flowerstart', () => {
        const originalState = {
            plants: [
                {plantId: "alium_sphaerocephalon"}, /* 29 */
                {plantId: "anthericum_liliago"}, /* 19 */]
        };
        const expectedState = {
            "plantlist_order_direction": "asc", plantlist_order_field: "timeLine.flowerStart",
            plants: [
                {plantId: "anthericum_liliago"}, /* 19 */
                {plantId: "alium_sphaerocephalon"}, /* 29 */]
        };
        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.ORDER_PLANT_LIST_BY, payload: {plantlist_order_field: "timeLine.flowerStart"}
        })).toEqual(expectedState);
    });
    test('list already ordered asc- result: toggle so it will be desc', () => {
        const originalState = {
            "plantlist_order_direction": "asc", plantlist_order_field: "timeLine.flowerStart",
            plants: [
                {plantId: "anthericum_liliago"}, /* 19 */
                {plantId: "alium_sphaerocephalon"}, /* 29 */]
        };
        const expectedState = {
            "plantlist_order_direction": "desc", plantlist_order_field: "timeLine.flowerStart",
            plants: [
                {plantId: "alium_sphaerocephalon"}, /* 29 */
                {plantId: "anthericum_liliago"}, /* 19 */]
        };
        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.ORDER_PLANT_LIST_BY,
            payload: {plantlist_order_field: "timeLine.flowerStart"}
        })).toEqual(expectedState);
    });
    test('list already ordered by name asc- result: order by flowerstart asc ', () => {
        const originalState = {
            "plantlist_order_direction": "asc", plantlist_order_field: "name",
            plants: [
                {plantId: "anthericum_liliago"} /* 19 */,
                {plantId: "crocus"}, /* 3 */]
        };
        const expectedState = {
            "plantlist_order_direction": "asc", plantlist_order_field: "timeLine.flowerStart",
            plants: [
                {plantId: "crocus"} /* 3 */,
                {plantId: "anthericum_liliago"}, /* 19 */]
        };
        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.ORDER_PLANT_LIST_BY,
            payload: {plantlist_order_field: "timeLine.flowerStart"}
        })).toEqual(expectedState);
    });

});

describe('ACTIONCONSTANTS.TOGGLE_SHOW_ONE_AREA', () => {
    test('virgin area: result is true', () => {
        const originalState = {areas: [{key: "0", plant: "anthericum_liliago"}]};
        const expectedState = {areas: [{key: "0", plant: "anthericum_liliago", showArea: true}]};
        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.TOGGLE_SHOW_ONE_AREA,
            payload: {areaKey: "0"}
        })).toEqual(expectedState);
    });
    test('area that is true', () => {
        const originalArea = {key: "0", plant: "anthericum_liliago", showArea: true};
        const expectedArea = {key: "0", plant: "anthericum_liliago", showArea: false};

        expect(gardenReducer({areas: [originalArea]}, {
            type: ACTIONCONSTANTS.TOGGLE_SHOW_ONE_AREA,
            payload: {areaKey: "0"}
        })).toEqual({areas: [expectedArea]});
    });
    test('area that is false', () => {
        const originalArea = {key: "0", plant: "anthericum_liliago", showArea: false};
        const expectedArea = {key: "0", plant: "anthericum_liliago", showArea: true};

        expect(gardenReducer({areas: [originalArea]}, {
            type: ACTIONCONSTANTS.TOGGLE_SHOW_ONE_AREA,
            payload: {areaKey: "0"}
        })).toEqual({areas: [expectedArea]});
    });
});

describe('ACTIONCONSTANTS.TOGGLE_SHOW_AREAS_FOR_PLANT', () => {
    test('plant does not have an area', () => {
        const originalState = {areas: []};
        const expectedState = {areas: []};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.TOGGLE_SHOW_AREAS_FOR_PLANT,
            payload: {plantId: "anthericum_liliago"}
        })).toEqual(expectedState);
    });
    test('one virgin area: result is true', () => {
        const originalState = {areas: [{key: "0", plant: "anthericum_liliago"}]};
        const expectedState = {areas: [{key: "0", plant: "anthericum_liliago", showArea: true}]};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.TOGGLE_SHOW_AREAS_FOR_PLANT,
            payload: {plantId: "anthericum_liliago"}
        })).toEqual(expectedState);
    });
    test('2 virgin areas: result is true', () => {
        const originalState = {
            areas: [
                {key: "0", plant: "anthericum_liliago"},
                {key: "1", plant: "anthericum_liliago"}]
        };
        const expectedState = {
            areas: [
                {key: "0", plant: "anthericum_liliago", showArea: true},
                {key: "1", plant: "anthericum_liliago", showArea: true}]
        };

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.TOGGLE_SHOW_AREAS_FOR_PLANT,
            payload: {plantId: "anthericum_liliago"}
        })).toEqual(expectedState);
    });
    test('2 areas with different value: result is toggled value of first area', () => {
        const originalState = {
            areas: [
                {key: "0", plant: "anthericum_liliago", showArea: false},
                {key: "1", plant: "anthericum_liliago", showArea: true}]
        };
        const expectedState = {
            areas: [
                {key: "0", plant: "anthericum_liliago", showArea: true},
                {key: "1", plant: "anthericum_liliago", showArea: true}]
        };

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.TOGGLE_SHOW_AREAS_FOR_PLANT,
            payload: {plantId: "anthericum_liliago"}
        })).toEqual(expectedState);
    });
});



describe('ACTIONCONSTANTS.CHANGE_FIELD_IN_GIVEN_AREA', () => {
    test('modify existing field for existing area', () => {
        const originalState = {areas: [{key: "0", x: 33}]};
        const expectedState = {areas: [{key: "0", x: 77}]};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.CHANGE_FIELD_IN_GIVEN_AREA,
            payload: {fieldName: "x", areaKey: "0", newValue: "77"}
        })).toEqual(expectedState);
    });
    test('modify unexisting field for existing area: field is added', () => {
        const originalState = {areas: [{key: "0", x: 33}]};
        const expectedState = {areas: [{key: "0", x: 33, xxx: 77}]};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.CHANGE_FIELD_IN_GIVEN_AREA,
            payload: {fieldName: "xxx", areaKey: "0", newValue: "77"}
        })).toEqual(expectedState);
    });
    test('modify field for unexisting area: no effect', () => {
        const originalState = {areas: [{key: "0", x: 33}]};
        const expectedState = {areas: [{key: "0", x: 33}]};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.CHANGE_FIELD_IN_GIVEN_AREA,
            payload: {fieldName: "x", areaKey: "999", newValue: "77"}
        })).toEqual(expectedState);
    });
    test('modify field with wrong value - not a number-string: no effect', () => {
        const originalState = {areas: [{key: "0", x: 33}]};
        const expectedState = {areas: [{key: "0", x: 33}]};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.CHANGE_FIELD_IN_GIVEN_AREA,
            payload: {fieldName: "x", areaKey: "999", newValue: "aaa"}
        })).toEqual(expectedState);
    });
    test('modify field with wrong value - not a string - that simply works', () => {
        const originalState = {areas: [{key: "0", x: 33}]};
        const expectedState = {areas: [{key: "0", x: 77}]};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.CHANGE_FIELD_IN_GIVEN_AREA,
            payload: {fieldName: "x", areaKey: "0", newValue: 77}
        })).toEqual(expectedState);
    });
});

function countAreasForPlant(areas, plant) {
    return areas.reduce((acc, current) => (acc + ((current.plant === plant) ? 1 : 0)), 0);
}


describe('ACTIONCONSTANTS.DUPLICATE_AREA', () => {
    test('one area', () => {
        const originalState = {areas: [{key: "0", plant: "anthericum_liliago"}]};
        const newState = gardenReducer(originalState, {
            type: ACTIONCONSTANTS.DUPLICATE_AREA,
            payload: {areaKey: "0"}
        });
        expect(newState.areas.length).toEqual(2);
        expect(countAreasForPlant(newState.areas, "anthericum_liliago")).toEqual(2);
        //no tests on keys - can't inject areaIdGenerator

    });
    test('two areas', () => {
        const originalState = {
            areas: [
                {key: "0", plant: "anthericum_liliago"},
                {key: "1", plant: "crocus"}]
        };
        const newState = gardenReducer(originalState, {
            type: ACTIONCONSTANTS.DUPLICATE_AREA,
            payload: {areaKey: "0"}
        });
        expect(newState.areas.length).toEqual(3);
        expect(countAreasForPlant(newState.areas, "anthericum_liliago")).toEqual(2);
        expect(countAreasForPlant(newState.areas, "crocus")).toEqual(1);
        //no tests on keys - can't inject areaIdGenerator

    });
    test('unexisting area', () => {
        const originalArea = {key: "0", plant: "anthericum_liliago"};
        const originalState = {areas: [originalArea]};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.DUPLICATE_AREA,
            payload: {areaKey: "99"}
        })).toEqual(originalState);
    });
});

describe('ACTIONCONSTANTS.CREATE_NEW_AREA_FOR_PLANT', () => {
    test('new area for plant not yet used', () => {
        const originalState = {areas: [], plants: []};
        const newState = gardenReducer(originalState, {
            type: ACTIONCONSTANTS.CREATE_NEW_AREA_FOR_PLANT,
            payload: {plantId: "anthericum_liliago"}
        });
        //expect(newArea).toEqual(expectedState);
        expect(newState.areas.length).toEqual(1);
        expect(countAreasForPlant(newState.areas, "anthericum_liliago")).toEqual(1);
        expect(newState.plants.length).toEqual(1);
        expect(newState.plants[0].plantId).toEqual("anthericum_liliago");


    });
    test('new area for plant already used', () => {
        const originalState = {
            areas: [{key: "0", plant: "anthericum_liliago"}],
            plants: [{plantId: "anthericum_liliago"}]
        };
        const newState = gardenReducer(originalState, {
            type: ACTIONCONSTANTS.CREATE_NEW_AREA_FOR_PLANT,
            payload: {plantId: "anthericum_liliago"}
        });
        expect(newState.areas.length).toEqual(2);
        expect(countAreasForPlant(newState.areas, "anthericum_liliago")).toEqual(2);
        expect(newState.plants.length).toEqual(1);
        expect(newState.plants[0].plantId).toEqual("anthericum_liliago");
    });
});

describe('ACTIONCONSTANTS.DELETE_AREA', () => {
    test('delete existing area', () => {
        const originalState = {
            areas: [
                {key: "0", plant: "anthericum_liliago"},
                {key: "1", plant: "anthericum_liliago"}],
            plants: [{plantId: "anthericum_liliago"}]
        };
        const expectedState = {
            areas: [
                {key: "1", plant: "anthericum_liliago"}],
            plants: [{plantId: "anthericum_liliago"}]
        };

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.DELETE_AREA,
            payload: {areaKey: "0"}
        })).toEqual(expectedState);

    });
    test('delete existing area - last area for this plant', () => {
        const originalState = {
            areas: [{key: "0", plant: "anthericum_liliago"}],
            plants: [{plantId: "anthericum_liliago"}]
        };
        const expectedState = {areas: [], plants: []};

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.DELETE_AREA,
            payload: {areaKey: "0"}
        })).toEqual(expectedState);

    });
    test('delete unexisting area', () => {
        const originalState = {
            areas: [{key: "0", plant: "anthericum_liliago"}],
            plants: [{plantId: "anthericum_liliago"}]
        };

        expect(gardenReducer(originalState, {
            type: ACTIONCONSTANTS.DELETE_AREA,
            payload: {areaKey: "999"}
        })).toEqual(originalState);

    });
});

