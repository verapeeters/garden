import React, {Component} from 'react';



export class GeneralTextButton extends Component {
    render() {
        const {buttonText, buttonTitle, buttonAction} = this.props;
        // noinspection JSUnresolvedVariable
        const buttonKey = this.props.buttonKey || buttonText;

        return (
            <div key={buttonKey} className="colGeneralTextButton">
                <button onClick={buttonAction}
                        title={buttonTitle}>{buttonText}
                </button>
            </div>
        );
    }
}

