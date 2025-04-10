// React / NextJs components
import { useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { GLOBALFUNC__SelectItemForSidebarExpanded } from '../../../../helpers/GlobalFunctions';
import UserComponentInsideList from '../../Resources/User/InsideList';
import AppContext from '../../../../helpers/AppContext';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

/**
 * @param {object} props
 * @param {object} planningItemObject
 * @param {method} planningSetItemObject
 * @param {object} appContext
 * @param {string} title
 * @param {string} subTitle
 * @param {array} value
 */

const SidebarComponentFieldsSelectResource = (props) => {
    const appContext = useContext(AppContext);
    const FUNC__ShowResources = () => {
        GLOBALFUNC__SelectItemForSidebarExpanded(
            appContext, 
            "with-subheader",
            "select-resource", 
            null, 
            "right", 
            {
                page: "resource-planning/manager/select-resource", 
                title: "Resource toevoegen", 
                view: "VIEW__Manager__Resources", 
                data: {
                    planningItemObject: props.planningItemObject,
                    planningSetItemObject: props.planningSetItemObject
                }
            }
        );
    }
    const FUNC__DeleteResource = (index) => {
        let newSidebarContext = props.appContext.globalContext.sidebar;
        newSidebarContext.payload.data.selectedResources.splice(index, 1);
        props.appContext.setGlobalContext({
            ...props.appContext.globalContext,
            sidebar: newSidebarContext,
        });
    }

    return(
        <div className={cn([
            globalStyles['bodysection-field'],
            globalStyles['global-margin-top']
        ])}>
            <div className={globalStyles['bodysection-field__label']}>{props.title}</div>
            {
                props.subTitle != undefined
                &&
                <div className={cn([
                    globalStyles['global-margin-subtext'],
                    globalStyles['global-margin-bottom-item']
                ])}>{props.subTitle}</div>
            }
            <div className={globalStyles['global-height-250']}> 
                {
                    props.value != undefined 
                    && props.value != null 
                    && props.value.length > 0
                    &&
                    props.value.map((resource, index) => 
                        <div className={cn([
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-member-in-list__with-delete-button']
                        ])}>
                            <UserComponentInsideList
                                user={resource}/>
                            <button className={cn([
                            globalStyles['bodysection-field__non-input-with-button--button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-cancel-hover-icon-only']
                        ])} onClick={() => {FUNC__DeleteResource(index)}}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: ".9vw", width: ".9vw"})}}></i></button>
                        {/*<div className={cn([
                            globalStyles['global-member-in-list'],
                            globalStyles['global-member-in-list__with-delete-button'],
                            globalStyles['global-text-align-start'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-backgroundcolor-item'],
                            //globalStyles['global-animation-fadein']
                        ])}>
                            {
                                resource.type == "member"
                                &&
                                <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                ||
                                <i className={globalStyles['global-display-flex']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: "1.6vw", width: "1.6vw"})}}></i>
                            }
                            <div>
                                <div>{resource.type == "member" ? resource.name : resource.description}</div>
                                {
                                    resource.type == "member"
                                    &&
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{resource.role} { resource.label != undefined && resource.label != "" && " ("+resource.label+")"}</div>
                                }
                            </div>
                            <button className={cn([
                                globalStyles['bodysection-field__non-input-with-button--button'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-button-cancel-hover-icon-only']
                            ])} onClick={() => {FUNC__DeleteResource(index)}}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: ".9vw", width: ".9vw"})}}></i></button>
                        </div>*/}
                        </div>
                    )
                }
            </div>
            <div className={cn([
                globalStyles['bodysection-field__input'],
                globalStyles['global-margin-top-item'],
                //globalStyles['global-animation-fadein']
            ])}>
                <button className={cn([
                    globalStyles['global-button'],
                    globalStyles['global-button__full-width'],
                    globalStyles['global-button-hover'],
                    globalStyles['global-transition-duration']
                ])} onClick={() => FUNC__ShowResources()}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    Resource toevoegen
                </button>
            </div>
        </div>
    );
}
export default SidebarComponentFieldsSelectResource;