// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useState } from 'react';
// Global / Page / Layout components
import SidebarComponentFieldsInputText from './InputText';
import SidebarComponentFieldsInputNumber from './InputNumber';
import SidebarComponentFieldsSelect from './Select';
import SidebarComponentFieldsInputDate from './InputDate';
import SidebarComponentFieldsInputTime from './InputTime';
import SidebarComponentFieldsSelectDays from './SelectDays';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const SidebarComponentFieldsInputWithIcon = (props) => {
    const [editField, setEditField] = useState({
        set: null,
        get: ""
    });
    const FUNC__EditStatus = (action) => {
        let value = "";
        if(action == "edit"){
            props.editField.set(props.id);
            value = "edit_all_fields";
        } else {
            value = "";
            props.editField.set("")
        }
        setEditField({
            ...editField,
            get: value
        });
    }
    return(
        <div className={cn({
            [globalStyles['bodysection-field']]:true,
            [globalStyles['global-margin-top']]:!props.firstItem
        })}>
            {
                props.type != "edit"
                &&
                <>
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
                </>
            }
            {
                props.type == "edit"
                &&
                <div className={globalStyles['bodysection-field__label-with-button']}>
                    <div>{props.title} {!props.required ? "(optioneel)" : ""}</div>
                    {
                        (props.currentUser.name == props.createdBy.name 
                            || props.currentUser.role == "Manager")  
                            && props.editField.get != props.id
                        &&
                        <button className={cn([
                            globalStyles['bodysection-field__non-input-with-button--button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-animation-fadein']
                        ])} onClick={() => FUNC__EditStatus("edit")}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['edit'].toSvg({height: ".9vw", width: ".9vw"})}}></i>Aanpassen</button>
                    }
                    {
                        (props.currentUser.name == props.createdBy.name 
                            || props.currentUser.role == "Manager") 
                            && props.editField.get == props.id
                        &&
                        <button className={cn([
                            globalStyles['bodysection-field__non-input-with-button--button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-animation-fadein']
                        ])} onClick={() => FUNC__EditStatus("")}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: ".9vw", width: ".9vw"})}}></i>Sluiten</button>
                    }
                </div>
            }
            <div className={globalStyles['bodysection-field__location']}>
                <i dangerouslySetInnerHTML={{__html: featherIcon.icons[props.icon].toSvg({height: "1vw", widfth: "1vw"})}}></i>
                <div>
                    {
                        props.fields.map((item, index) => (
                            <div key={index} className={cn({
                                [globalStyles['bodysection-field__input']]:true,
                                [globalStyles['global-margin-top']]:!item.firstItem,
                                [globalStyles['global-grid-'+item.grid]]:item.grid > 0,
                                [globalStyles['global-grid-gap-column-small']]:item.grid > 0
                            })}>
                                {
                                    item.inputs.map(input => (
                                        <>
                                            {
                                                input.type == "text"
                                                && input.action == "create"
                                                &&
                                                <SidebarComponentFieldsInputText
                                                    firstItem={input.firstItem} 
                                                    title={input.title} 
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    upperCase={true}
                                                    error={input.error}
                                                    required={input.required}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}/>
                                            }
                                            {
                                                input.type == "text"
                                                && input.action == "edit"
                                                &&
                                                <SidebarComponentFieldsInputText
                                                    firstItem={input.firstItem} 
                                                    title={input.title} 
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    upperCase={true}
                                                    error={input.error}
                                                    required={input.required}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}
                                                    currentUser={props.currentUser}
                                                    createdBy={props.createdBy}
                                                    showIndicator={input.showIndicator}
                                                    editField={props.editField.get == props.id ? editField : {set: null, get: ""}}
                                                    hideEditButton={true}/>
                                            }
                                            {
                                                input.type == "text"
                                                && input.action == "readonly"
                                                &&
                                                <SidebarComponentFieldsInputText
                                                    firstItem={input.firstItem} 
                                                    title={input.title} 
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}/>
                                            }
                                            {
                                                input.type == "number"
                                                && input.action == "create"
                                                &&
                                                <SidebarComponentFieldsInputNumber
                                                    firstItem={input.firstItem} 
                                                    title={input.title}
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    error={input.error}
                                                    required={input.required}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}/>
                                            }
                                            {
                                                input.type == "number"
                                                && input.action == "edit"
                                                &&
                                                <SidebarComponentFieldsInputNumber
                                                    firstItem={input.firstItem} 
                                                    title={input.title}
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    error={input.error}
                                                    required={input.required}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}
                                                    currentUser={props.currentUser}
                                                    createdBy={props.createdBy}
                                                    editField={props.editField.get == props.id ? editField : {set: null, get: ""}}
                                                    hideEditButton={true}/>
                                            }
                                            {
                                                input.type == "date"
                                                && input.action == "create"
                                                &&
                                                <SidebarComponentFieldsInputDate
                                                    firstItem={input.firstItem} 
                                                    title={input.title} 
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    error={input.error}
                                                    required={input.required}
                                                    limits={input.limits}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}/>
                                            }
                                            {
                                                input.type == "date"
                                                && input.action == "edit"
                                                &&
                                                <SidebarComponentFieldsInputDate
                                                    firstItem={input.firstItem} 
                                                    title={input.title} 
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    error={input.error}
                                                    required={input.required}
                                                    limits={input.limits}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}
                                                    currentUser={props.currentUser}
                                                    createdBy={props.createdBy}
                                                    editField={props.editField.get == props.id ? editField : {set: null, get: ""}}
                                                    hideEditButton={true}/>
                                            }
                                             {
                                                input.type == "date"
                                                && input.action == "readonly"
                                                &&
                                                <SidebarComponentFieldsInputDate
                                                    firstItem={input.firstItem} 
                                                    title={input.title} 
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}/>
                                            }
                                            {
                                                input.type == "time"
                                                && input.action == "create"
                                                &&
                                                <SidebarComponentFieldsInputTime
                                                    firstItem={input.firstItem} 
                                                    title={input.title} 
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    error={input.error}
                                                    required={input.required}
                                                    limits={input.limits}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}/>
                                            }
                                            {
                                                input.type == "time"
                                                && input.action == "edit"
                                                &&
                                                <SidebarComponentFieldsInputTime
                                                    firstItem={input.firstItem} 
                                                    title={input.title} 
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    error={input.error}
                                                    required={input.required}
                                                    limits={input.limits}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}
                                                    currentUser={props.currentUser}
                                                    createdBy={props.createdBy}
                                                    editField={props.editField.get == props.id ? editField : {set: null, get: ""}}
                                                    hideEditButton={true}/>
                                            }
                                            {
                                                input.type == "select"
                                                && input.action == "create"
                                                &&
                                                <SidebarComponentFieldsSelect 
                                                    firstItem={input.firstItem} 
                                                    title={input.title}
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    error={input.error}
                                                    options={input.options}
                                                    required={input.required}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}/>
                                            }
                                            {
                                                input.type == "select"
                                                && input.action == "edit"
                                                &&
                                                <SidebarComponentFieldsSelect 
                                                    firstItem={input.hideReadOnly && editField.get == "" ? true : false} 
                                                    title={input.title}
                                                    id={input.id} 
                                                    value={input.value}
                                                    type={input.action}
                                                    error={input.error}
                                                    options={input.options}
                                                    required={input.required}
                                                    FUNC__CreateObject={input.FUNC__CreateObject}
                                                    currentUser={props.currentUser}
                                                    createdBy={props.createdBy}
                                                    editField={props.editField.get == props.id ? editField : {set: null, get: ""}}
                                                    hideEditButton={true}
                                                    hideReadOnly={input.hideReadOnly}/>
                                            }
                                            {
                                                input.type == "select-days"
                                                &&
                                                <SidebarComponentFieldsSelectDays
                                                    title={input.title}
                                                    buttonText={input.buttonText}
                                                    id={input.id}
                                                    value={input.value}
                                                    error={input.error}
                                                    required={input.required}
                                                    limits={input.limits}
                                                    dataIsLoading={input.dataIsLoading}
                                                    appContext={input.appContext}/>
                                            }
                                        </>
                                    ))
                                } 
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
export default SidebarComponentFieldsInputWithIcon;