import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as DIALOGS from './constants/dialogConstants';
import * as ACTIONS from './actions.js';
import * as AREAS from './data/gardens.data.js';
import {ButtonWithMenu} from './utils/menu.js';

import MdMenu from 'react-icons/lib/md/menu';


const MENU_BUTTON_SIZE = 25;

export class GardenButtonWithMenu extends Component {

    render() {
        const {savedCameraPositions} = this.props;
        const {clearGarden, toggleExportGardenAsJsonDialog, toggleImportFileSelectorDialog, resetGardenToDefault} = this.props;
        const {selectPredefinedGarden} = this.props;
        const {viewFromSavedPosition, toggleSaveCurrentCameraPositionDialog} = this.props;
        const {tutorialReset} = this.props;
        //console.log("GardenButtonWithMenu render savedCameraPositions:"+JSON.stringify(savedCameraPositions));
        return (
            <ButtonWithMenu buttonContent={<MdMenu size={MENU_BUTTON_SIZE}/>}>
                <div>load / save</div>
                <div className="dropdown-content">
                    <a onClick={clearGarden}>clear garden</a>
                    <a onClick={toggleExportGardenAsJsonDialog}>export garden</a>
                    <a onClick={toggleImportFileSelectorDialog}>import garden</a>
                    <a onClick={resetGardenToDefault}>reset garden to default</a>
                </div>

                <div>select predefined garden</div>
                <div className="dropdown-content">
                    {Object.keys(AREAS.PREDEFINED_GARDENS).map((areaSet) => (
                        <a key={areaSet} onClick={() => selectPredefinedGarden(areaSet)}>{areaSet}</a>
                    ))}
                </div>
                <div>camera positions</div>
                <div className="dropdown-content">
                    {Object.keys(savedCameraPositions).map((savedPositionName) => (
                        <a key={savedPositionName}
                           onClick={() => viewFromSavedPosition(savedPositionName, savedCameraPositions[savedPositionName])}>view
                            from {savedPositionName}</a>
                    ))}
                    <a onClick={toggleSaveCurrentCameraPositionDialog}>save current camera position...</a>
                </div>
                <div>help</div>
                <div className="dropdown-content">
                    <a className="dropdown-content" onClick={tutorialReset}>tutorial</a>
                </div>
            </ButtonWithMenu>
        );
    }
}


// Map Redux state to component props
function mapStateToProps(state) {
    return {
        areas: state.gardenReducer.areas, /* areas defined for this garden */
        savedCameraPositions: state.gardenThreeWorldReducer.savedCameraPositions,
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        clearGarden: () => dispatch(ACTIONS.clearGardenAction()),
        toggleExportGardenAsJsonDialog: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.EXPORT_GARDEN_AS_JSON_DIALOG)),
        toggleImportFileSelectorDialog: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.IMPORT_FILE_SELECTOR_DIALOG)),
        resetGardenToDefault: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.OK_TO_RESET_DIALOG)),
        selectPredefinedGarden: (areaSet) => dispatch(ACTIONS.selectPredefinedGardenAction(areaSet)),
        viewFromSavedPosition: (newPositionName, newCoordinates) => dispatch(ACTIONS.viewFromSavedPositionAction(newPositionName, newCoordinates)),
        toggleSaveCurrentCameraPositionDialog: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.SAVE_CAMERA_POSITION_DIALOG)),
        tutorialReset: () => dispatch(ACTIONS.tutorialResetAction),
    }
}

export const GardenMenuButtonContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GardenButtonWithMenu);
