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
 * @param {boolean} required 
 * @param {object} limits 
 * @param {object} error 
 * @param {string} id 
 * @param {string} value 
 * @param {method} FUNC__CreateObject 
 * @param {object} editField 
 * @param {boolean} hideEditButton 
 */

const SidebarComponentFieldsInputTime = (props) => {
    return(
        <>
            {/* Create */}
            {
                props.type == "create"
                &&
                <div className={cn({
                    [globalStyles['bodysection-field']]:true,
                    [globalStyles['global-margin-top']]:!props.firstItem
                })}>
                    <div className={globalStyles['bodysection-field__label']}>
                        {props.title} {!props.required ? "(optioneel)" : ""}
                    </div>
                    {
                        props.limits != undefined
                        &&
                        <div className={cn([
                            globalStyles['global-fontsize-subtext'],
                            globalStyles['global-margin-subtext']
                        ])}>
                            {props.limits.message}
                        </div>
                    }
                    {
                        props.error.show
                        && props.error.id == props.id
                        &&
                        <div className={cn([
                            globalStyles['bodysection-field__error'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-margin-bottom']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            {props.error.message}
                        </div>
                    }
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        {
                            props.limits == undefined
                            &&
                            <input
                                className={globalStyles['global-transition-duration']} 
                                type={"time"}
                                value={props.value}
                                onChange={e => {props.FUNC__CreateObject(
                                    props.id, 
                                    e.target.value, 
                                    false
                                );}}
                                id={props.id}/>
                        }
                        {
                            props.limits != undefined
                            && props.limits.min != undefined
                            && props.limits.max == undefined
                            &&
                            <input
                                className={globalStyles['global-transition-duration']} 
                                type={"time"}
                                value={props.value}
                                onChange={e => {props.FUNC__CreateObject(
                                    props.id, 
                                    e.target.value, 
                                    false
                                );}}
                                id={props.id}
                                min={props.limits.min}/>
                        }
                        {
                            props.limits != undefined
                            && props.limits.min == undefined
                            && props.limits.max != undefined
                            &&
                            <input
                                className={globalStyles['global-transition-duration']} 
                                type={"time"}
                                value={props.value}
                                onChange={e => {props.FUNC__CreateObject(
                                    props.id, 
                                    e.target.value, 
                                    false
                                );}}
                                id={props.id}
                                max={props.limits.max}/>
                        }
                        {
                            props.limits != undefined
                            && props.limits.min != undefined
                            && props.limits.max != undefined
                            &&
                            <input
                                className={globalStyles['global-transition-duration']} 
                                type={"time"}
                                value={props.value}
                                onChange={e => {props.FUNC__CreateObject(
                                    props.id, 
                                    e.target.value, 
                                    false
                                );}}
                                id={props.id}
                                min={props.limits.min}
                                max={props.limits.max}/>
                        }
                    </div>
                </div>
            }

            {/* Edit */}
            {
                props.type == "edit"
                &&
                <div className={cn({
                    [globalStyles['bodysection-field']]:true,
                    [globalStyles['global-margin-top']]:!props.firstItem
                })}>
                    <div className={globalStyles['bodysection-field__label-with-button']}>
                        <div>{props.title} {!props.required ? "(optioneel)" : ""}</div>
                        {
                            props.editField.get != props.id
                            && props.hideEditButton == undefined
                            &&
                            <button className={cn([
                                globalStyles['bodysection-field__non-input-with-button--button'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-animation-fadein']
                            ])} onClick={() => props.editField.set(props.id)}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['edit'].toSvg({height: ".9vw", width: ".9vw"})}}></i>Aanpassen</button>
                        }
                        {
                            props.editField.get == props.id
                            &&
                            <button className={cn([
                                globalStyles['bodysection-field__non-input-with-button--button'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-animation-fadein']
                            ])} onClick={() => props.editField.set("")}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: ".9vw", width: ".9vw"})}}></i>Sluiten</button>
                        }
                    </div>
                    {
                        props.limits != undefined
                        && (props.editField.get == props.id
                            || props.editField.get == "edit_all_fields")
                        &&
                        <div className={cn([
                            globalStyles['global-fontsize-subtext'],
                            globalStyles['global-margin-subtext']
                        ])}>
                            {props.limits.message}
                        </div>
                    }
                    {
                        props.editField.get != props.id
                        && props.editField.get != "edit_all_fields"
                        &&
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-animation-fadein']
                        ])}>{props.value != "" ? props.value : "-"}</div>     
                    } 
                    {
                        props.error.show
                        && props.error.id == props.id
                        &&
                        <div className={cn([
                            globalStyles['bodysection-field__error'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-margin-bottom']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            {props.error.message}
                        </div>
                    }
                    {
                        (props.editField.get == props.id
                        || props.editField.get == "edit_all_fields")
                        &&
                        <div className={cn([
                            globalStyles['bodysection-field__input'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-animation-fadein']
                        ])}>
                            {
                                props.limits == undefined
                                &&
                                <input
                                    className={globalStyles['global-transition-duration']} 
                                    type={"time"}
                                    value={props.value}
                                    onChange={e => {props.FUNC__CreateObject(
                                        props.id, 
                                        e.target.value, 
                                        false
                                    );}}
                                    id={props.id}/>
                            }
                            {
                                props.limits != undefined
                                && props.limits.min != undefined
                                && props.limits.max == undefined
                                &&
                                <input
                                    className={globalStyles['global-transition-duration']} 
                                    type={"time"}
                                    value={props.value}
                                    onChange={e => {props.FUNC__CreateObject(
                                        props.id, 
                                        e.target.value, 
                                        false);}}
                                    id={props.id}
                                    min={props.limits.min}/>
                            }
                            {
                                props.limits != undefined
                                && props.limits.min == undefined
                                && props.limits.max != undefined
                                &&
                                <input
                                    className={globalStyles['global-transition-duration']} 
                                    type={"time"}
                                    value={props.value}
                                    onChange={e => {props.FUNC__CreateObject(
                                        props.id, 
                                        e.target.value, 
                                        false);}}
                                    id={props.id}
                                    max={props.limits.max}/>
                            }
                            {
                                props.limits != undefined
                                && props.limits.min != undefined
                                && props.limits.max != undefined
                                &&
                                <input
                                    className={globalStyles['global-transition-duration']} 
                                    type={"time"}
                                    value={props.value}
                                    onChange={e => {props.FUNC__CreateObject(
                                        props.id, 
                                        e.target.value, 
                                        false);}}
                                    id={props.id}
                                    min={props.limits.min}
                                    max={props.limits.max}/>
                            }
                        </div>
                    }
                </div>
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
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.value}</div>
                </div>
            }
        </>
    );
}
export default SidebarComponentFieldsInputTime;