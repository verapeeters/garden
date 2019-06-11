import React, {Component} from 'react';
import {CloseButton} from '../utils/closeButton';

class DropDownMenu extends Component {
    render() {
        const {visible} = this.props;
        const classNameShow = visible ? "showMenu " : "hideMenu ";
        const className = classNameShow + "dropdown-content-outer ";
        //console.log("DropDownMenu render className=" + className);
        return (
            <div id="myDropdown" ref="dropDown" className={className}>
                {this.props.children}
            </div>
        );
    }
}

export class ButtonWithMenu extends Component {
    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {};

    constructor(props) {
        super(props);
        //console.log("buttonWithMenu constructor " + this.props.buttonContent);
        this.state = {
            dropDownIsVisible: false,
        };
        this.hideMenu = this.hideMenu.bind(this);

    }

    showMenu() {
        //console.log("buttonWithMenu showMenu " + this.props.buttonContent + " child:"+(this.props.childIsActivated?"yes":"no"));
        this.setState({dropDownIsVisible: true,});
        document.addEventListener("click", this.hideMenu);
        document.addEventListener("touchstart", this.hideMenu);
    }

    targetIsChildOf(target, windowId) {
        if (!target) return false;

        if (target.id === windowId) {
            return true;
        } else {
            return this.targetIsChildOf(target.parentElement, windowId);
        }

    }

    hideMenu(e) {
        //console.log("buttonWithMenu hideMenu " + this.props.buttonContent);
        if (!e || !this.targetIsChildOf(e.target, "myDropdown")) {
            //console.log("outside");
            document.removeEventListener("click", this.hideMenu);
            document.removeEventListener("touchstart", this.hideMenu);
            this.setState({dropDownIsVisible: false});
        }
        else {
            //console.log("inside ");
        }
    }


    render() {
        const {buttonContent, title} = this.props;
        //console.log("buttonWithMenu render " + buttonContent + " dropDownIsVisible:" + this.state.dropDownIsVisible + " hasActiveChild:"+this.state.hasActiveChild);
        const buttonClass = "outerMenuButton";

        return (
            <div>
                <a className={buttonClass} title={title} onClick={() => this.showMenu()}>{buttonContent}</a>
                <DropDownMenu visible={this.state.dropDownIsVisible}>
                    <CloseButton closeAction={() => this.hideMenu()}/>
                    {this.props.children}
                </DropDownMenu>
            </div>
        );
    }
}
