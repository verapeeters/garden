import {toHexStringOnly2LastDigits, hexColorToCssColor, highlightColor} from '../utils/colorUtils';
import {initialisePlantList, orderPlantListBy, plantsNotUsed} from '../utils/plantListUtils.js';


describe('toHexStringOnly2LastDigits', () => {
    test('simple test', () => {
        expect(toHexStringOnly2LastDigits(0x000000)).toEqual("00");
        expect(toHexStringOnly2LastDigits(0x0000ff)).toEqual("ff");
        expect(toHexStringOnly2LastDigits(0x00ff00)).toEqual("00");
        expect(toHexStringOnly2LastDigits(0xff0000)).toEqual("00");
        expect(toHexStringOnly2LastDigits(0xffffff)).toEqual("ff");
    });
});

describe('hexColorToCssColor', () => {
    test('simple test', () => {
        expect(hexColorToCssColor(0x000000)).toEqual("#000000");
        expect(hexColorToCssColor(0xFFFFFF)).toEqual("#ffffff");
        expect(hexColorToCssColor(0xffffff)).toEqual("#ffffff");
        expect(hexColorToCssColor(0xaa0000)).toEqual("#aa0000");
        expect(hexColorToCssColor(0xa1b2c3)).toEqual("#a1b2c3");
        expect(hexColorToCssColor(0)).toEqual("#000000");
    });
});

describe('highlightColor', () => {
    test('simple test', () => {
        expect(highlightColor(0x000000)).toEqual(0x202020);
        expect(highlightColor(0xa0b0c0)).toEqual(0xc0d0e0);
        expect(highlightColor(0xa1b2c3)).toEqual(0xc1d2e3);
    });
    test('b larger than 0xf0', () => {
        expect(highlightColor(0x0000f1)).toEqual(0x2020d1);
    });
    test('highlight white', () => {
        expect(highlightColor(0xffffff)).toEqual(0xdfdfdf);
    });
});


describe('initialisePlantList', () => {
    test('empty areas', () => {
        expect(initialisePlantList([])).toEqual([]);
    });
    test('one area', () => {
        const areas = [{key: "0", plant: "anthericum_liliago"}];
        const expectedPlantList = [{plantId: "anthericum_liliago"},];

        expect(initialisePlantList(areas)).toEqual(expectedPlantList);
    });
    test('2 areas for same plant', () => {
        const areas = [
            {key: "0", plant: "anthericum_liliago"},
            {key: "1", plant: "anthericum_liliago"}];
        const expectedPlantList = [{plantId: "anthericum_liliago"},];

        expect(initialisePlantList(areas)).toEqual(expectedPlantList);
    });
    test('2 areas for different plant', () => {
        const areas = [
            {key: "0", plant: "anthericum_liliago"},
            {key: "1", plant: "alium_gladiator"}];
        const expectedPlantList = [
            {plantId: "anthericum_liliago"},
            {plantId: "alium_gladiator"}];

        expect(initialisePlantList(areas)).toEqual(expectedPlantList);
    });
    test('unexisting plant', () => {
        const areas = [{key: "0", plant: "unexisting plant"}];
        const expectedPlantList = [];

        expect(initialisePlantList(areas)).toEqual(expectedPlantList);
    })
});


describe('orderPlantListBy', () => {
    test('empty plantlist', () => {
        const originalList = [];
        const expectedList = [];
        expect(orderPlantListBy(originalList, true, "name")).toEqual(expectedList);
    });
    test('simple plantlist by name', () => {
        const originalList = [
            {plantId: "crocus"},
            {plantId: "anthericum_liliago"},
            {plantId: "aster"},];
        const expectedList = [
            {plantId: "anthericum_liliago"},
            {plantId: "aster"},
            {plantId: "crocus"},];
        expect(orderPlantListBy(originalList, true, "name")).toEqual(expectedList);
    });
    test('simple plantlist by flowerStart', () => {
        const originalList = [
            {plantId: "crocus"}, //3
            {plantId: "anthericum_liliago"}, //19
            {plantId: "aster"},]; //35
        const expectedList = [
            {plantId: "crocus"}, //3
            {plantId: "anthericum_liliago"},//19
            {plantId: "aster"},]; //35
        expect(orderPlantListBy(originalList, true, "timeLine.flowerStart")).toEqual(expectedList);
    });
    test('simple plantlist by flowerStart desc', () => {
        const originalList = [
            {plantId: "crocus"}, //3
            {plantId: "anthericum_liliago"}, //19
            {plantId: "aster"},]; //35
        const expectedList = [
            {plantId: "aster"}, //35
            {plantId: "anthericum_liliago"},//19
            {plantId: "crocus"},];//3
        expect(orderPlantListBy(originalList, false, "timeLine.flowerStart")).toEqual(expectedList);
    });
    test('simple plantlist by flowercolor', () => {
        const originalList = [
            {plantId: "crocus"}, //0xa000a0 PURPLE
            {plantId: "anthericum_liliago"}, //0xeeeeee WHITE
            {plantId: "aster"},]; //0xc09dee VIOLET
        const expectedList = [
            {plantId: "crocus"},  //0xa000a0 PURPLE
            {plantId: "aster"}, //0xc09dee VIOLET
            {plantId: "anthericum_liliago"},];//0xeeeeee WHITE
        expect(orderPlantListBy(originalList, true, "flowerColor")).toEqual(expectedList);
    });
});

describe('plantsNotUsed', () => {
    test('everything empty plantlist', () => {
        const plantsUsed = [];
        const plantsCatalog = {};
        const expectedPlantsNotUsedList = [];
        expect(plantsNotUsed(plantsUsed, plantsCatalog)).toEqual(expectedPlantsNotUsedList);
    });
    test('empty plantlist', () => {
        const plantsUsed = [];
        const plantsCatalog = {plant1: {name: "name plant 1"}, plant2: {name: "name plant 2"}, plant3: {name: "name plant 3"}, };
        const expectedPlantsNotUsedList = [{plantId: "plant1"}, {plantId: "plant2"}, {plantId: "plant3"}];
        expect(plantsNotUsed(plantsUsed, plantsCatalog)).toEqual(expectedPlantsNotUsedList);
    });
    test('plantlist contains 1 el', () => {
        const plantsUsed = [{plantId: "plant1"}];
        const plantsCatalog = {plant1: {name: "name plant 1"}, plant2: {name: "name plant 2"}, plant3: {name: "name plant 3"}, };
        const expectedPlantsNotUsedList = [{plantId: "plant2"}, {plantId: "plant3"}];
        expect(plantsNotUsed(plantsUsed, plantsCatalog)).toEqual(expectedPlantsNotUsedList);
    });
});
