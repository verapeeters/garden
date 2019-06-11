import React, {Component} from 'react';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';

import {CloseButton} from './closeButton';

import * as ACTIONS from "../actions";


export class GeneralDialogTextDivComponent extends Component {
    render() {
        return <div className="textdiv">{this.props.children}</div>;
    }
}

class GeneralDialogComponent extends Component {
    componentWillMount() {
        const {index, calcPositionFromIndex} = this.props;

        if (calcPositionFromIndex) {
            const bottomFromIndex = (100 + (index * 20)).toString() + "px";
            const rightFromIndex = (70 + (index * 20)).toString() + "px";
            this.style = {bottom: bottomFromIndex, right: rightFromIndex};
        }
    }

    render() {
        const {title, className, dialogName, fixed} = this.props;
        const windowType = this.props.windowType || dialogName;
        const {toggleDialogWindow, windowToFront} = this.props;
        const extendedClassName = "GeneralDialog " + className;

        if (fixed)
            return (
                <div className={className}>
                    <div className="title">{title}</div>
                    {this.props.children}
                    <CloseButton closeAction={() => toggleDialogWindow(windowType, dialogName)}/>
                </div>
            );
        else
            return (
                <Draggable onStart={() => windowToFront(dialogName)} cancel="input,button">
                    <div className={extendedClassName} style={this.style}>
                        <div className="title">{title}</div>
                        {this.props.children}
                        <CloseButton closeAction={() => toggleDialogWindow(windowType, dialogName)}/>
                    </div>

                </Draggable>
            );
    }
}


// Map Redux state to component props
function mapStateToProps_GeneralDialog(state) {
    return {}
}

// Map Redux actions to component props
function mapDispatchToProps_GeneralDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        windowToFront: (dialogName) => dispatch(ACTIONS.dialogWindowToFrontAction(dialogName)),
        toggleDialogWindow: (windowType, windowKey) => dispatch(ACTIONS.dialogWindowToggleAction(windowType, windowKey)),
    }
}

// Connected Component (Redux container)
export const GeneralDialog = connect(
    mapStateToProps_GeneralDialog,
    mapDispatchToProps_GeneralDialog
)(GeneralDialogComponent);