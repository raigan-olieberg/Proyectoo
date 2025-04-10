// React / NextJs components
import { useEffect } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { GLOBALFUNC__ShowOrHidePopup } from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const PopupComponentConfirm = (props) => {
    useEffect(() => {
        setTimeout(() => {
            GLOBALFUNC__ShowOrHidePopup(
                props.appContext,
                false
            );
        }, 5000);
    });

    return(
        <div className={cn([
           globalStyles['global-popup']
        ])}>
            {props.appContext.globalContext.popup.message}
        </div>
    );
}
export default PopupComponentConfirm;