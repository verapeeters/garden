import React, {Component} from 'react';
import {connect} from 'react-redux';

import {PlantName} from '../utils/plantNameButton';


class ContextDialogComponent extends Component {
    render() {
        const {showContextMenuForPlant} = this.props;
        if (!showContextMenuForPlant) return null;

        const {area, x, y} = showContextMenuForPlant;
        const style={top:y, left:x};
        return (
            <div className="ContextDialog" style={style}>
                <PlantName key={area.plant} plantId={area.plant}/>
            </div>
        );
    }
}


// Map Redux state to component props
function mapStateToProps_ContextDialog(state) {
    return {
        showContextMenuForPlant: state.gardenReducer.showContextMenuForPlant,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_ContextDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {}
}

// Connected Component (Redux container)
export const ContextDialog = connect(
    mapStateToProps_ContextDialog,
    mapDispatchToProps_ContextDialog
)(ContextDialogComponent);