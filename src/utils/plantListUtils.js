import * as PLANTS from '../data/plants.data.js';



export function initialisePlantList(areas) {
    const setOfPlantNamesWithAreas = new Set(areas.map((area) => area.plant));
    const arayOfPlantNamesWithAreas = [...setOfPlantNamesWithAreas];
    const arrayOfExistingPlantNamesWithAreas =
        arayOfPlantNamesWithAreas.filter((plantId) => (PLANTS.getPlantProps(plantId)));
    return arrayOfExistingPlantNamesWithAreas.map((plantId) => ({plantId}));
}

//plantlist_order_field can be "name" or "timeLine.flowerStart" or ..
function getFieldFromPlantCatalog(plantId, plantlist_order_field) {
    const plantFromCatalog = PLANTS.getPlantProps(plantId);
    const fields = plantlist_order_field.split(".");
    return fields.reduce((acc, field) => acc[field], plantFromCatalog);
}

export function orderPlantListBy(plantList, ascending, plantlist_order_field) {
    const leftIsSmaller = ascending ? -1 : 1;
    const leftIsLarger = ascending ? 1 : -1;
    return plantList.slice().sort(
        (l, r) => {
            const leftValue = getFieldFromPlantCatalog(l.plantId, plantlist_order_field);
            const rightValue = getFieldFromPlantCatalog(r.plantId, plantlist_order_field);
            return (leftValue < rightValue) ? leftIsSmaller : leftIsLarger;
        });
}


export function plantsNotUsed(plantsUsed, plantsCatalog) {
    const plantIdsFromCatalog = Object.keys(plantsCatalog);
    const plantIdsWithoutAreas = plantIdsFromCatalog.filter((plantId) => !plantsUsed.find((plant) => plant.plantId === plantId));
    return plantIdsWithoutAreas.map((plantId) => ({plantId}));
}