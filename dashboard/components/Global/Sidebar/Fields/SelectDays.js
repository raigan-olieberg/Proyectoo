// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useState, useEffect } from 'react';
// Global / Page / Layout components
import SidebarComponentFieldsInputDate from './InputDate';
import SidebarComponentFieldsInputTime from './InputTime';
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__CompareDates,
    GLOBALFUNC__MultipleDateRangeOverlaps,
    GLOBALFUNC__CalculateHoursBudgeted
} from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

/**
 * @param {object} props 
 * @param {object} appContext
 * @param {string} title
 * @param {string} subTitle
 * @param {array} value
 * @param {boolean} dataIsLoading
 * @param {string} buttonText
 * @param {boolean} required
 * @param {object} limits
 */

const SidebarComponentFieldsSelectDays = (props) => {
    const [showFields, setShowFields] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [itemObject, setItemObject] = useState({
        key: new Date(),
        date: "",
        starttime: "",
        endtime: ""
    });
    const FUNC__CreateObject = (key, value) => {
        setItemObject({
            ...itemObject,
            [key]: value
        });
    }
    const FUNC__AddDate = () => {
        const dateTodayObj = new Date();
        const dateTodayStr = `${dateTodayObj.getFullYear()}-${dateTodayObj.getMonth() + 1}-${dateTodayObj.getDate()}`;
        const date1 = `${itemObject.date}T${itemObject.starttime}:00`;
        const date2 = `${itemObject.date}T${itemObject.endtime}:00`;
        if(GLOBALFUNC__CompareDates(itemObject.date, dateTodayStr, "before")){
            setErrorMessage("Oeps, de datum komt eerder dan vandaag.");
            setShowErrorMessage(true);
            return;
        } else {
            setErrorMessage("");
            setShowErrorMessage(false);
        }
        if(GLOBALFUNC__CompareDates(date2, date1, "before")){
            setErrorMessage("Oeps, de eindtijd komt eerder dan de starttijd.");
            setShowErrorMessage(true);
            return;
        } else {
            setErrorMessage("");
            setShowErrorMessage(false);
        }
        let newSidebarContext = props.appContext.globalContext.sidebar;
        if(newSidebarContext.payload.data.selectedDays != undefined
        && newSidebarContext.payload.data.selectedDays.length > 0){
            let dates = [];
            for(let i=0;i<newSidebarContext.payload.data.selectedDays.length;i++){
                dates.push({
                    from: new Date(`${newSidebarContext.payload.data.selectedDays[i].date}T${newSidebarContext.payload.data.selectedDays[i].starttime}:00`),
                    to: new Date(`${newSidebarContext.payload.data.selectedDays[i].date}T${newSidebarContext.payload.data.selectedDays[i].endtime}:00`)
                });
            }
            dates.push({
                from: new Date(`${itemObject.date}T${itemObject.starttime}:00`),
                to: new Date(`${itemObject.date}T${itemObject.endtime}:00`)
            });
            if(GLOBALFUNC__MultipleDateRangeOverlaps(dates)){
                setErrorMessage("Oeps, deze dag en tijd overlapt met al eerder ingeplande dagen en tijden.");
                setShowErrorMessage(true);
                return;
            } else {
                setErrorMessage("");
                setShowErrorMessage(false);
            }
        }
        if(newSidebarContext.payload.data == undefined){
            newSidebarContext.payload["data"] = {};
        }
        if(newSidebarContext.payload.data.selectedDays == undefined){
            newSidebarContext.payload.data["selectedDays"] = [];
        }
        if(newSidebarContext.payload.data.hours_budgeted == undefined){
            newSidebarContext.payload.data["hours_budgeted"] = 0;
        }
        newSidebarContext.payload.data.hours_budgeted += parseFloat(GLOBALFUNC__CalculateHoursBudgeted(itemObject.date, itemObject.starttime, itemObject.endtime));
        newSidebarContext.payload.data.selectedDays.unshift(itemObject);
        props.appContext.setGlobalContext({
            ...props.appContext.globalContext,
            sidebar: newSidebarContext,
        });
        setItemObject({
            key: new Date(),
            date: "",
            starttime: "",
            endtime: ""
        });
    }
    const FUNC__DeleteDate = (item, index) => {
        let newSidebarContext = props.appContext.globalContext.sidebar;
        newSidebarContext.payload.data.hours_budgeted -= parseFloat(GLOBALFUNC__CalculateHoursBudgeted(item.date, item.starttime, item.endtime));
        newSidebarContext.payload.data.selectedDays.splice(index, 1);
        props.appContext.setGlobalContext({
            ...props.appContext.globalContext,
            sidebar: newSidebarContext,
        });
    }
    const FUNC__Cancel = () => {
        setShowFields(false);
        setItemObject({
            key: new Date(),
            date: "",
            starttime: "",
            endtime: ""
        });
    }
    useEffect(() => {
        let value = false;
        if(!GLOBALFUNC__isWhitespaceString(itemObject.date)
            && !GLOBALFUNC__isWhitespaceString(itemObject.starttime)
            && !GLOBALFUNC__isWhitespaceString(itemObject.endtime)){
            value = true;
        } else {
            value = false;
        }
        setShowSubmitButton(value);     
    }, [itemObject]);
    
    return(
        <>
            <div className={cn([
                globalStyles['bodysection-field'],
                globalStyles['global-margin-top']
            ])}>
                <div className={cn([
                    globalStyles['bodysection-field__label'],
                    globalStyles['global-padding-bottom-item']
                ])}>{props.title}</div>
                {
                    props.subTitle != undefined
                    &&
                    <div className={cn([
                        globalStyles['global-margin-subtext'],
                        globalStyles['global-margin-bottom-item']
                    ])}>{props.subTitle}</div>
                }
                {
                    showErrorMessage
                    &&
                    <div className={cn([
                        globalStyles['bodysection-field__error'],
                        globalStyles['global-display-flex'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-margin-bottom']
                    ])}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        {errorMessage}
                    </div>
                }
                <div className={globalStyles['global-height-250']}>
                    {
                        props.value != undefined 
                        && props.value != null 
                        && props.value.length > 0
                        &&
                        props.value.map((item, index) =>
                            <div key={item.key} className={cn([
                                globalStyles['bodysection-field__non-input-with-button'],
                                globalStyles['global-margin-bottom-item'],
                                //globalStyles['global-animation-fadein']
                            ])}>
                                <div className={cn([
                                    globalStyles['global-display-flex']
                                ])}>
                                    <div>{item.date}</div>
                                    <div className={cn([
                                        globalStyles['global-seperator__vertical'],
                                        globalStyles['global-margin-right-item'],
                                        globalStyles['global-margin-left-item']
                                    ])}></div>
                                    <div className={cn([
                                        globalStyles['global-display-flex'],
                                        globalStyles['global-grid-gap-column-small']
                                    ])}>
                                        {item.starttime}
                                        <i className={globalStyles['global-display-flex']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: ".9vw", width: ".9vw"})}}></i>
                                        {item.endtime}
                                    </div>
                                </div>             
                                <button className={cn([
                                    globalStyles['bodysection-field__non-input-with-button--button'],
                                    globalStyles['global-transition-duration'],
                                    globalStyles['global-button-cancel-hover-icon-only']
                                ])} onClick={() => FUNC__DeleteDate(item, index)}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: ".9vw", width: ".9vw"})}}></i></button>          
                            </div>
                        )
                    }
                </div>
            </div>
            {
                !props.dataIsLoading
                && !showFields
                &&
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
                    ])} onClick={() => setShowFields(true)}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        {props.buttonText}
                    </button>
                </div>
            }
            {
                showFields
                &&
                <>
                    <div className={cn([
                        globalStyles['global-seperator__horizontal'],
                        globalStyles['global-margin-top'],
                        globalStyles['global-margin-bottom']
                    ])}></div>
                    <div>
                        <SidebarComponentFieldsInputDate
                            firstItem={true} 
                            title={"Datum"} 
                            id={"date"} 
                            value={itemObject.date}
                            type={"create"}
                            error={{
                                show: false
                            }}
                            required={props.required}
                            limits={props.limits}
                            FUNC__CreateObject={FUNC__CreateObject}/>
                        <div className={cn([
                            globalStyles['global-grid-2'],
                            globalStyles['global-grid-gap-column'],
                        ])}>
                            <SidebarComponentFieldsInputTime
                                firstItem={false}
                                title={"Starttijd"}
                                id={"starttime"}
                                value={itemObject.starttime}
                                type={"create"}
                                error={{
                                    show: false
                                }}
                                required={true}
                                FUNC__CreateObject={FUNC__CreateObject}/>
                            <SidebarComponentFieldsInputTime
                                firstItem={false}
                                title={"Eindtijd"}
                                id={"endtime"}
                                value={itemObject.endtime}
                                type={"create"}
                                error={{
                                    show: false
                                }}
                                required={true}
                                FUNC__CreateObject={FUNC__CreateObject}/>
                        </div>
                    </div>
                    <div className={cn([
                        globalStyles['global-grid-2'],
                        globalStyles['global-margin-top'],
                        globalStyles['global-grid-gap-column']
                    ])}>
                        {
                            showSubmitButton
                            &&
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-display-flex-center']
                            ])} onClick={() => FUNC__AddDate()}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Toevoegen
                            </button>
                            ||
                            <div className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button__inactive'],
                                globalStyles['global-display-flex-center'],
                                globalStyles['global-text-align-center'],
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Toevoegen
                            </div>
                        }
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-back'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex-center']
                        ])} onClick={() => FUNC__Cancel()}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Sluiten
                        </button>
                    </div>
                </>
            }
        </>
    );
}
export default SidebarComponentFieldsSelectDays;