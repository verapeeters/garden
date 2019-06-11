import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as SIZES from "../constants/sizes";

import MdMoreVert from 'react-icons/lib/md/more-vert';


class ButtonBarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allButtonsVisible: this.props.media.hover,
        };
        this.activateButtons = this.activateButtons.bind(this);
        this.deactivateButtons = this.deactivateButtons.bind(this);
    }

    showAllButtons() {
        return this.props.media.hover || this.state.allButtonsVisible;
    }

    targetIsChildOfButtonBarRef(target) {
        if (!target) return false;

        if (target === this.buttonBarRef) {
            return true;
        } else {
            return this.targetIsChildOfButtonBarRef(target.parentElement);
        }
    }

    getActivatingButton() {
        if (!Array.isArray(this.props.children)) return this.props.children;

        return <button onClick={() => this.activateButtons()}><MdMoreVert size={SIZES.ICON_SIZE}/></button>;
    }

    activateButtons() {
        this.setState({allButtonsVisible: true});
        document.addEventListener("click", this.deactivateButtons);
        document.addEventListener("touchstart", this.deactivateButtons);
    }

    deactivateButtons(e) {
        if (!e || !this.targetIsChildOfButtonBarRef(e.target)) {
            document.removeEventListener("click", this.deactivateButtons);
            document.removeEventListener("touchstart", this.deactivateButtons);
            this.setState({allButtonsVisible: false});
        }
    }


    render() {
        const {className} = this.props;
        const children = this.showAllButtons() ?
            this.props.children :
            this.getActivatingButton();
        return (
            <div className={className + " buttonBar "} ref={(el) => this.buttonBarRef = el }>
                {children}
            </div>
        );
    }
}


// Map Redux state to component props
function mapStateToProps(state) {
    return {
        media: state.gardenReducer.media,
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {}
}

// Connected Component
export const ButtonBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonBarComponent);
