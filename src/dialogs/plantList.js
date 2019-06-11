import React, {Component} from 'react';
import {connect} from 'react-redux';

import {CloseButton} from '../utils/closeButton';
import {PlantTimeLine} from '../utils/plantTimeLine';
import {PlantName} from '../utils/plantNameButton';

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import * as PLANTS from '../data/plants.data.js';
import * as SIZES from '../constants/sizes';
import FaEye from 'react-icons/lib/fa/eye';




//================================================
class PlantPropertiesComponent extends Component {
    render() {
        const {plantProps, areas} = this.props;
        const {toggleShowAreasForPlant} = this.props;
        const plantPropsFromCatalog = PLANTS.getPlantProps(plantProps.plantId);
        const allAreasForThisPlant = areas.filter((area) => (area.plant === plantProps.plantId));
        const areAllAreasForThisPlantShown = allAreasForThisPlant.reduce((accum, area) => accum && area.showArea, true);
        const titleForShowAreasButton = (areAllAreasForThisPlantShown ? "hide" : "show") + " all areas for " + plantPropsFromCatalog.name;

        return <div className="PlantRow">
            <div className="colButton">
                <button onClick={() => toggleShowAreasForPlant(plantProps.plantId)}
                        title={titleForShowAreasButton}
                        className={areAllAreasForThisPlantShown ? "buttonActive" : "buttonNotActiveButVisible"}>
                    <FaEye size={SIZES.ICON_SIZE}/>
                </button>
            </div>
            <PlantName key={plantProps.plantId} plantId={plantProps.plantId}/>
            <div className="colPlantTimeline"><PlantTimeLine plantProps={plantPropsFromCatalog}/></div>
        </div>
    }
}

// Map Redux state to component props
function mapStateToProps_PlantProperties(state) {
    return {
        plants: state.gardenReducer.plants, /* plants used in this garden */
        areas: state.gardenReducer.areas, /* areas defined for this garden */
    }
}

// Map Redux actions to component props
function mapDispatchToProps_PlantProperties(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        toggleShowAreasForPlant: (plantId) => dispatch(ACTIONS.toggleShowAreasForPlantAction(plantId)),
    }
}

// Connected Component (Redux container)
export const PlantProperties = connect(
    mapStateToProps_PlantProperties,
    mapDispatchToProps_PlantProperties
)(PlantPropertiesComponent);


//================================================
export class PlantListComponent extends Component {

    render() {
        const {plants} = this.props;
        const {toggleShowPlantList} = this.props;
        return (
            <div className="PlantListContainer">
                <div className="PlantList">
                    {plants &&
                    plants.map((plantProps) => <PlantProperties key={plantProps.plantId}
                                                                   plantProps={plantProps}/>)}
                </div>
                <CloseButton closeAction={() => toggleShowPlantList()}/>
            </div>
        );
    }
}

// Map Redux state to component props
function mapStateToProps_PlantList(state) {
    return {
        plants: state.gardenReducer.plants, /* plants used in this garden */
    }
}

// Map Redux actions to component props
// noinspection JSUnusedLocalSymbols
function mapDispatchToProps_PlantList(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        toggleShowPlantList: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.PLANT_LIST_DIALOG)),
    }
}

// Connected Component (Redux container)
export const PlantList = connect(
    mapStateToProps_PlantList,
    mapDispatchToProps_PlantList
)(PlantListComponent);
