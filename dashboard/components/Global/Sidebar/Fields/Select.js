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
 * @param {string} subTitle 
 * @param {array} subTitleList 
 * @param {object} error 
 * @param {string} id 
 * @param {boolean} transparent 
 * @param {method} FUNC__CreateObject 
 * @param {string} value 
 * @param {object} itemObject
 * @param {method} setItemObject
 * @param {boolean} upperCase
 * @param {object} editField
 * @param {boolean} hideEditButton
 * @param {string} label
 */

const SidebarComponentFieldsSelect = (props) => {
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
                        props.subTitle != undefined
                        &&
                        <div className={cn([
                            globalStyles['global-margin-subtext'],
                            globalStyles['global-margin-bottom-item']
                        ])}>{props.subTitle}</div>
                    }
                    {
                        props.subTitleList != undefined
                        &&
                        <div className={cn([
                            globalStyles['global-margin-subtext'],
                            globalStyles['global-margin-bottom-item']
                        ])}>
                            {
                                props.subTitleList.map((item, index) => (
                                    item.show
                                    &&
                                    <div key={`item_${index}`} className={globalStyles['global-margin-bottom-item']}>
                                        <div className={globalStyles['global-margin-bottom-item']}>{item.title}</div>
                                        <ul>
                                            {
                                                item.content.map((content, contextIndex) => (
                                                    <li key={`content_${contextIndex}`}>{content}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ))
                            }
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
                        <select className={cn({
                            [globalStyles['global-transition-duration']]:true,
                            [globalStyles['global-backgroundcolor-transparent']]:props.transparent != undefined
                        })} 
                            id={props.id}
                            value={props.value}
                            onChange={e => {props.FUNC__CreateObject(
                                props.itemObject,
                                props.setItemObject, 
                                props.id, 
                                e.target.value, 
                                props.upperCase
                            )}}>
                                {
                                    props.options.map(item => (
                                        <option key={item.key} value={item.value}>{item.key}</option>
                                    ))
                                }
                        </select>
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
                        props.subTitle != undefined
                        && props.editField.get == props.id
                        &&
                        <div className={cn([
                            globalStyles['global-margin-subtext'],
                            globalStyles['global-margin-bottom-item']
                        ])}>{props.subTitle}</div>
                    }
                    {
                        props.subTitleList != undefined
                        && props.editField.get == props.id
                        &&
                        <div className={cn([
                            globalStyles['global-margin-subtext'],
                            globalStyles['global-margin-bottom-item']
                        ])}>
                            {
                                props.subTitleList.map((item, index) => (
                                    item.show
                                    &&
                                    <div key={`item_${index}`} className={globalStyles['global-margin-bottom-item']}>
                                        <div className={globalStyles['global-margin-bottom-item']}>{item.title}</div>
                                        <ul>
                                            {
                                                item.content.map((content, contextIndex) => (
                                                    <li key={`content_${contextIndex}`}>{content}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ))
                            }
                        </div>
                    }
                    {
                        props.editField.get != props.id
                        && props.editField.get != "edit_all_fields"
                        && !props.hideReadOnly
                        &&
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-animation-fadein']
                        ])}>
                            {
                                props.label == undefined
                                &&
                                (props.value != "" ? props.value : "-")
                            }
                            {
                                props.label != undefined
                                &&
                                (props.label != "" ? props.label : "-")
                            }
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
                    {
                        (props.editField.get == props.id
                        || props.editField.get == "edit_all_fields")
                        &&
                        <div className={cn([
                            globalStyles['bodysection-field__input'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-animation-fadein']
                        ])}>
                            <div className={cn([
                                globalStyles['bodysection-field__input'],
                                globalStyles['global-margin-top-item']
                            ])}>
                                <select className={globalStyles['global-transition-duration']} 
                                    id={props.id}
                                    value={props.value}
                                    onChange={e => {props.FUNC__CreateObject(
                                        props.itemObject,
                                        props.setItemObject, 
                                        props.id, 
                                        e.target.value, 
                                        props.upperCase
                                    )}}>
                                        {
                                            props.options.map(item => (
                                                <option key={item.key} value={item.value}>{item.key}</option>
                                            ))
                                        }
                                </select>
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    );
}
export default SidebarComponentFieldsSelect;