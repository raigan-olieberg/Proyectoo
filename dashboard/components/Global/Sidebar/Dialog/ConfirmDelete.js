// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const SidebarComponentDialogConfirmDelete = (props) => {
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
            ])}>Weet je zeker dat je {props.message} wilt verwijderen?</div>
            <div className={cn([
                globalStyles['global-margin-top'],
                globalStyles['global-grid-2'],
                globalStyles['global-grid-gap-column']
            ])}>
                <button className={cn([
                    globalStyles['global-button'],
                    globalStyles['global-button-cancel-hover'],
                    globalStyles['global-transition-duration']
                ])} onClick={() => props.FUNC__DeleteObject(
                    "confirm",
                    props.deleteDialog,
                    props.setDeleteDialog,
                    props.setDataIsLoading,
                    props.appContext,
                    props.params
                )}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    Ja, verwijderen
                </button>
                <button className={cn([
                    globalStyles['global-button'],
                    globalStyles['global-button-back'],
                    globalStyles['global-transition-duration']
                ])} onClick={() => props.FUNC__DeleteObject(
                        "hideDialog",
                        props.deleteDialog,
                        props.setDeleteDialog
                    )}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    Nee, annuleren
                </button>
            </div>
        </div>
    );
}
export default SidebarComponentDialogConfirmDelete;