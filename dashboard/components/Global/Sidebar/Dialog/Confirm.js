// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const SidebarComponentDialogConfirm = (props) => {
    /*
        Use example:
            
    */
    return(
        <div className={cn([
            globalStyles['global-margin-top-x2'],
            globalStyles['bodysection-field__confirm-delete'],
            globalStyles['bodysection-buttons'],
            globalStyles['global-animation-fadein']
        ])}>
            <div className={cn([
                globalStyles['global-text-align-center'],
                globalStyles['global-fontweight-bold']
            ])}>{props.confirmDialog.message}</div>
            <div className={cn([
                globalStyles['global-margin-top'],
                globalStyles['global-grid-2'],
                globalStyles['global-grid-gap-column']
            ])}>
                <button className={cn([
                    globalStyles['global-button'],
                    globalStyles['global-button-hover'],
                    globalStyles['global-transition-duration']
                ])} onClick={() => props.FUNC__Confirm(
                    "confirm",
                    null,
                    props.confirmDialog,
                    props.setConfirmDialog,
                    props.setDataIsLoading,
                    props.appContext,
                    props.params
                )}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    Ja, {props.confirmDialog.submitMessage}
                </button>
                <button className={cn([
                    globalStyles['global-button'],
                    globalStyles['global-button-back'],
                    globalStyles['global-transition-duration']
                ])} onClick={() => props.FUNC__Confirm(
                        "hideDialog",
                        null,
                        props.confirmDialog,
                        props.setConfirmDialog
                    )}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    Nee, annuleren
                </button>
            </div>
        </div>
    );
}
export default SidebarComponentDialogConfirm;