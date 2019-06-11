import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GeneralDialog} from '../utils/generalDialog.js'

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import {GeneralDialogTextDivComponent} from "../utils/generalDialog";


class ExportGardenAsJsonDialogComponent extends Component {
    render() {
        const {gardenNameToExport} = this.props;
        const {setNameForExportGarden, exportGardenAsJson} = this.props;

        return (
            <GeneralDialog title="export current garden"
                           dialogName={DIALOGS.EXPORT_GARDEN_AS_JSON_DIALOG}
                           className="ExportGardenAsJsonDialog"
                           {...this.props}>
                <GeneralDialogTextDivComponent>
                    The file will be saved in your Downloads folder and can be imported later.
                </GeneralDialogTextDivComponent>
                <GeneralDialogTextDivComponent>
                    <div className="inputRow">
                        <label>name:</label>
                        <input value={gardenNameToExport}
                               onChange={setNameForExportGarden}/>
                    </div>
                </GeneralDialogTextDivComponent>

                <div className="generalActionButton">
                    <button onClick={exportGardenAsJson}>save</button>
                </div>
            </GeneralDialog>
        );
    }
}


// Map Redux state to component props
function mapStateToProps_ExportGardenAsJsonDialog(state) {
    return {
        gardenNameToExport: state.gardenReducer.gardenNameForNextExport,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_ExportGardenAsJsonDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        setNameForExportGarden: (e) => dispatch(ACTIONS.setNameForExportGardenAction(e.target.value)),
        exportGardenAsJson: () => dispatch(ACTIONS.exportGardenAsJsonAction()),
    }
}

// Connected Component (Redux container)
export const ExportGardenAsJsonDialog = connect(
    mapStateToProps_ExportGardenAsJsonDialog,
    mapDispatchToProps_ExportGardenAsJsonDialog
)(ExportGardenAsJsonDialogComponent);

