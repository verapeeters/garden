import React, {Component} from 'react';

import MdClose from 'react-icons/lib/md/close';

import * as SIZES from '../constants/sizes';

export class CloseButton extends Component {
    render() {
        const {closeAction} = this.props;
        return  <div className="closeButton">
            <button onClick={closeAction} title="close">
                <MdClose size={SIZES.ICON_SIZE}/>
            </button>
        </div>


    }
}