// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

/**
 * @param {object} props 
 * @param {string} type 
 * @param {boolean} firstItem 
 * @param {string} title 
 * @param {string} subTitle 
 * @param {object} value 
 * @param {object} editField 
 * @param {string} id 
 */

const SidebarComponentFieldsResources = (props) => {
    return(
        <>
            {/* Create */}
            {
                props.type == "create"
                &&
                <div className={cn({
                    [globalStyles['bodysection-field']]:true,
                    [globalStyles['global-margin-top']]:!props.firstItem
                })}></div>
            }

            {/* Edit */}
            {
                props.type == "edit"
                &&
                <div className={cn({
                    [globalStyles['bodysection-field']]:true,
                    [globalStyles['global-margin-top']]:!props.firstItem
                })}></div>
            }

            {/* Readonly */}
            {
                props.type == "readonly"
                &&
                <div className={cn({
                    [globalStyles['bodysection-field']]:true,
                    [globalStyles['global-margin-top']]:!props.firstItem
                })}>
                    <div className={globalStyles['bodysection-field__label']}>{props.title}</div>
                    {
                        props.subTitle != undefined
                        &&
                        <div className={cn([
                            globalStyles['global-margin-subtext'],
                            globalStyles['global-margin-bottom-item']
                        ])}>{props.subTitle}</div>
                    }
                    {
                        props.value.length > 0
                        &&
                        <div className={globalStyles['global-height-250']}>
                            {
                                props.value.map((resource) => 
                                    <div className={cn([
                                        globalStyles['global-member-in-list'],
                                        globalStyles['global-member-in-list__with-delete-button'],
                                        globalStyles['global-text-align-start'],
                                        globalStyles['global-margin-bottom-item'],
                                        globalStyles['global-backgroundcolor-item'],
                                        globalStyles['global-animation-fadein']
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
                                        {
                                            props.type == "edit"
                                            && props.editField.get == props.id
                                            &&
                                            <button className={cn([
                                                globalStyles['bodysection-field__non-input-with-button--button'],
                                                globalStyles['global-transition-duration'],
                                                globalStyles['global-button-cancel-hover-icon-only'],
                                                globalStyles['global-animation-fadein']
                                            ])}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: ".9vw", width: ".9vw"})}}></i></button>
                                        }
                                    </div>
                                )
                            }
                        </div>
                        ||
                        <>
                            {   
                                props.type != "edit"
                                &&
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item'],
                                    globalStyles['global-animation-fadein']
                                ])}>-</div>
                            }
                        </>
                    }
                </div>
            }
        </>
    );
}
export default SidebarComponentFieldsResources;