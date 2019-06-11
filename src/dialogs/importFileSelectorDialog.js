import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GeneralDialog, GeneralDialogTextDivComponent} from '../utils/generalDialog.js'

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';


class ImportFileSelectorDialogComponent extends Component {
    render() {
        const {clearGardenOnImport} = this.props;
        const {fileSelectedForImport, toggleClearGardenOnImport, importGardenAsJson} = this.props;

        return (
            <GeneralDialog title="select a file that contains a garden"
                           dialogName={DIALOGS.IMPORT_FILE_SELECTOR_DIALOG}
                           className="ImportFileSelectorDialog"
                           {...this.props}>
                <GeneralDialogTextDivComponent>
                    <div className="inputRow">
                        <input name="myFile" type="file" accept=".json"
                               onChange={(e) => fileSelectedForImport(e.target.files)}/>
                    </div>
                </GeneralDialogTextDivComponent>
                <GeneralDialogTextDivComponent>
                    <input type="checkbox" name="clearGarden" checked={clearGardenOnImport}
                           onChange={(e) => toggleClearGardenOnImport(e)}/>
                    <label>clear garden before import</label>
                </GeneralDialogTextDivComponent>
                <div className="generalActionButton">
                    <button onClick={importGardenAsJson}>import</button>
                </div>
            </GeneralDialog>
        );
    }
}


// Map Redux state to component props
function mapStateToProps_ImportFileSelectorDialog(state) {
    return {
        clearGardenOnImport: state.gardenReducer.clearGardenOnImport,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_ImportFileSelectorDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        fileSelectedForImport: (fileName) => dispatch(ACTIONS.fileSelectedForImportAction(fileName)),
        toggleClearGardenOnImport: () => dispatch(ACTIONS.toggleClearGardenOnImportAction()),
        importGardenAsJson: () => dispatch(ACTIONS.importGardenAsJsonAction()),
    }
}

// Connected Component (Redux container)
export const ImportFileSelectorDialog = connect(
    mapStateToProps_ImportFileSelectorDialog,
    mapDispatchToProps_ImportFileSelectorDialog
)(ImportFileSelectorDialogComponent);

