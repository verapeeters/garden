import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GeneralTextButton} from "./generalTextButton.js";

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import * as PLANTS from '../data/plants.data.js';


class PlantNameComponent extends Component {
    render() {
        const {plantId} = this.props;
        const {toggleShowPlantFiche} = this.props;
        const plantPropsFromCatalog = PLANTS.getPlantProps(plantId);

        return (
            <GeneralTextButton buttonKey={plantId}
                               buttonText={plantPropsFromCatalog.name}
                               buttonTitle="open fiche"
                               buttonAction={() => toggleShowPlantFiche(plantId)}/>
        );
    }
}

// Map Redux state to component props
function mapStateToProps_PlantName(state) {
    return {}
}

// Map Redux actions to component props
function mapDispatchToProps_PlantName(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        toggleShowPlantFiche: (plantId) => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.PLANT_FICHE_DIALOG, plantId)),
    }
}

// Connected Component (Redux container)
export const PlantName = connect(
    mapStateToProps_PlantName,
    mapDispatchToProps_PlantName
)(PlantNameComponent);

