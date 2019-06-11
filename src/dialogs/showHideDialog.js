import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GeneralTextButton} from '../utils/generalTextButton';
import {GeneralDialog} from '../utils/generalDialog.js'

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';

class ShowHideDialogComponent extends Component {
    render() {
        const {showAllPlants} = this.props;
        const {showAllAreas, hideAllAreas, toggleShowAllPlants} = this.props;
        const showAllPlantsText = (showAllPlants ? "hide" : "show") + " all plants";
        return (
            <GeneralDialog title="show / hide"
                           dialogName={DIALOGS.SHOW_HIDE_DIALOG}
                           className="ShowHideDialog"
                           {...this.props}>
                <GeneralTextButton buttonText="show all areas" buttonAction={showAllAreas}/>
                <GeneralTextButton buttonText="hide all areas" buttonAction={hideAllAreas}/>
                <GeneralTextButton buttonText={showAllPlantsText} buttonAction={toggleShowAllPlants}/>
            </GeneralDialog>
        );
    }
}


// Map Redux state to component props
function mapStateToProps_ShowHideDialog(state) {
    return {
        showAllPlants: state.gardenReducer.showAllPlants,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_ShowHideDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        showAllAreas: () => dispatch(ACTIONS.showAllAreasAction),
        hideAllAreas: () => dispatch(ACTIONS.hideAllAreasAction),
        toggleShowAllPlants: () => dispatch(ACTIONS.toggleShowAllPlantsAction),
    }
}

// Connected Component (Redux container)
export const
    ShowHideDialog = connect(
        mapStateToProps_ShowHideDialog,
        mapDispatchToProps_ShowHideDialog
    )(ShowHideDialogComponent);

