import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GeneralDialog} from '../utils/generalDialog.js'

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import {GeneralDialogTextDivComponent} from "../utils/generalDialog";


class SaveCameraPositionDialogComponent extends Component {
    render() {
        const {cameraPositionNameToSave} = this.props;
        const {setNameForCameraPosition, saveCurrentCameraPositionWithNameAction} = this.props;

        return (
            <GeneralDialog title="save current camera position"
                           dialogName={DIALOGS.SAVE_CAMERA_POSITION_DIALOG}
                           className="SaveCameraPositionDialog"
                           {...this.props}>
                <GeneralDialogTextDivComponent>
                    <div className="inputRow">
                        <label>name:</label>
                        <input value={cameraPositionNameToSave}
                               onChange={setNameForCameraPosition}/>
                    </div>
                </GeneralDialogTextDivComponent>
                <div className="generalActionButton">
                    <button onClick={() => saveCurrentCameraPositionWithNameAction(cameraPositionNameToSave)}>save
                    </button>
                </div>
            </GeneralDialog>
        );
    }
}


// Map Redux state to component props
function mapStateToProps_SaveCameraPositionDialog(state) {
    return {
        cameraPositionNameToSave: state.gardenThreeWorldReducer.cameraPositionNameToSave,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_SaveCameraPositionDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        setNameForCameraPosition: (e) => dispatch(ACTIONS.setNameForCameraPositionAction(e.target.value)),
        saveCurrentCameraPositionWithNameAction: (newPositionName) => dispatch(ACTIONS.saveCurrentCameraPositionWithNameAction(newPositionName)),
    }
}

// Connected Component (Redux container)
export const SaveCameraPositionDialog = connect(
    mapStateToProps_SaveCameraPositionDialog,
    mapDispatchToProps_SaveCameraPositionDialog
)(SaveCameraPositionDialogComponent);

