// React / NextJs components
import cn from 'classnames';
import { useState, useRef, createRef } from 'react';
import { motion } from "framer-motion";
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import GlobalComponentEmptyMessage from '../../../components/Global/Alerts/EmptyMessage';
import { AsignedResourcesComponentInsideList } from '../../../components/Global/Resources/AsignedResources';
import {
    GLOBALFUNC__SelectItemForSidebar,
    GLOBALFUNC__TranslateTasksStatus
} from '../../../helpers/GlobalFunctions';
import { 
    FUNC__EditPlanning,
    FUNC__FormattedItem
} from './Controller';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const VIEW__SectionDayview = (props) => {
    const [moreDataIsLoading, setMoreDataIsLoading] = useState(false);
    const elementsRef = useRef(props.dayviewObject.map(() => createRef()));
    /*
    *
    *
    * 
    * 
        REF:FUNC__SetSidebarDirection
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> De direction of the sidebar when clicking on item
    *
    *
    * 
    * 
    */
    const FUNC__SetSidebarDirection = (time) => {
        return (time.split(":")[0] > 16)?"left":"right";
    }
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalculateWidth
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Calculating the width of a planning item
    *
    *
    * 
    * 
    */
    const FUNC__CalculateWidth = (starttime, endtime) => {
        let dateNow = new Date();
        let date1 = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), starttime.split(":")[0], starttime.split(":")[1]);
        let date2 = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), endtime.split(":")[0], endtime.split(":")[1]);
        let hoursDiffNum = Math.abs(date1 - date2) / 36e5;

        function convertNumToTime(number){
            var sign = (number >= 0) ? 1 : -1;
            number = number * sign;
            var hour = Math.floor(number);
            var decpart = number - hour;
            var min = 1 / 60;
            decpart = min * Math.round(decpart / min);
            var minute = Math.floor(decpart * 60) + '';
            if (minute.length < 2) {
                minute = '0' + minute; 
            }
            sign = sign == 1 ? '' : '-';
            var time = sign + hour + ':' + minute;
            return time;
        }
        return (convertNumToTime(hoursDiffNum).split(":")[0] * 3600 + convertNumToTime(hoursDiffNum).split(":")[1] * 60 + 0) / 864; 
    };
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalculateItemMargin
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Calculating where a planning item should start
    *
    *
    * 
    * 
    */
    const FUNC__CalculateItemMargin = (time) => {
        let starttimeNum = time.split(':')[0] * 3600 + time.split(':')[1] * 60 + 0;
        let endtimeNum = 24 * 3600 + 0 * 60 + 0;
        return `${(100 * starttimeNum / endtimeNum).toFixed(2)}%`;
    };
    /*
    *
    *
    * 
    * 
        TODO -> Drag & expand planning item
    *
    *
    * 
    * 
    */
    const FUNC__HandleDrag = (
        event, info
    ) => {
        //console.log(elementsRef.current[0]);
        //console.log(event.srcElement.offsetX);
        //console.log(elementsRef.current[0].current.offsetWidth);
        //console.log(event);
        //console.log(event.pageX - event.offsetX);
        //console.log(event.srcElement);
        //console.log(info);
    }
    const FUNC__HandleDragEnd = (
        event, info
    ) => {
        /*console.log(elementsRef.current[0].current.offsetWidth);
        console.log(event);
        console.log(event.srcElement.offsetParent.classList[0]);
        console.log(event.pageX);
        console.log(event.offsetX);
        const querySelector = document.querySelector("."+event.srcElement.offsetParent.classList[0]+"."+event.srcElement.offsetParent.classList[0]);
        console.log(querySelector);*/
        //const time = querySelector?.getAttribute("data-time");
    }
    /*
    *
    *
    * 
    * 
        Content
    *
    *
    * 
    * 
    */
    return (
        <>
            {
                props.dayViewDataHasLoaded
                && props.dayviewObject.length > 0
                &&
                props.dayviewObject.map((item, index) => (
                    /* Normal item */
                    FUNC__CalculateWidth(item.starttime, item.endtime) > 14
                    &&
                    <div ref={elementsRef.current[index]} key={item.planning_id} className={cn([
                        globalStyles['day-item'],
                        globalStyles['global-margin-bottom'],
                        globalStyles['global-animation-fadein']
                    ])}>
                        <motion.div
                            drag="x"
                            onDrag={FUNC__HandleDrag}
                            onDragEnd={FUNC__HandleDragEnd}
                            dragElastic={0}
                            dragMomentum={false}
                            dragConstraints={elementsRef.current[index]} className={cn({
                            [globalStyles['day-item__wrapper']]:true,
                            [globalStyles['global-box-shadow']]:true,
                            [globalStyles['global-side-selected-item']]:props.appContext.globalContext.sidebar.show == 1 && props.appContext.globalContext.sidebar.selectedItemID == item.planning_id
                        })} style={{width: FUNC__CalculateWidth(item.starttime, item.endtime)+"%", marginLeft: FUNC__CalculateItemMargin(item.starttime)}}
                        onClick={() => FUNC__EditPlanning(
                            props.appContext,
                            props.dayviewObject,
                            props.setDayviewObjectObject,
                            FUNC__FormattedItem(
                                item
                            )
                        )}>
                            <div className={cn([
                                globalStyles['wrapper-header'],
                                globalStyles['global-transition-duration']
                            ])}>
                                <div className={globalStyles['wrapper-header__start']}>{item.starttime}</div>
                                <div className={globalStyles['wrapper-header__end']}>{item.endtime}</div>
                            </div>
                            <div className={globalStyles['wrapper-body']}>
                                <div className={globalStyles['wrapper-body__info-flex']}>
                                    <span className={globalStyles['global-fontweight-bold']}>Project:</span> {item.project}
                                </div>
                                <div className={cn([
                                    globalStyles['wrapper-body__info-flex'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <span className={globalStyles['global-fontweight-bold']}>Fase:</span> {item.phase}
                                </div>
                                <div className={cn([
                                    globalStyles['wrapper-body__info-flex'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <span className={globalStyles['global-fontweight-bold']}>Taak:</span> {item.task.name}
                                </div>
                                <div className={cn([
                                    globalStyles['wrapper-body__info-flex'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <span className={globalStyles['global-fontweight-bold']}>Status:</span>
                                    <span className={cn({
                                        [globalStyles['global-fontweight-bold']]:true,
                                        [globalStyles['global-color-blue']]:item.task.status == "open",
                                        [globalStyles['global-color-purple']]:item.task.status == "in_progress",
                                        [globalStyles['global-color-red']]:item.task.status == "stuck",
                                        [globalStyles['global-color-orange']]:item.task.status == "overdue",
                                        [globalStyles['global-color-lightgreen']]:item.task.status == "completed"
                                    })}>{GLOBALFUNC__TranslateTasksStatus(item.task.status)}</span>
                                </div>
                                <AsignedResourcesComponentInsideList 
                                    assigned_to={item.assigned_to}
                                    addMarginTop={true}/>
                            </div>
                        </motion.div>
                    </div>
                    ||

                    /* Items that are too small, are shown as dots*/
                    <div key={item.planning_id} className={cn([
                        globalStyles['day-item'],
                        globalStyles['global-margin-top']
                    ])}>
                        <button className={cn([
                            globalStyles['day-item__wrapper'],
                            globalStyles['day-item__matteo']
                        ])} style={{marginLeft: FUNC__CalculateItemMargin(item.starttime)}}
                        onClick={() => GLOBALFUNC__SelectItemForSidebar(props.appContext, item.key, FUNC__SetSidebarDirection(item.endtime), {page: "project/manager", title: "Taak inzien", view: "VIEW__Manager__ProjectPhaseTask__SubtaskDetails", data: item})}>
                            <div className={cn({
                                [globalStyles['wrapper-preview']]:true,
                                [globalStyles['global-transition-duration']]:true,
                                [globalStyles['global-backgroundcolor-green']]:props.appContext.globalContext.sidebar.show == 1 && props.appContext.globalContext.sidebar.selectedItemID == item.key
                            })}></div>
                            <div className={cn([
                                globalStyles['day-item__wrapper'],
                                globalStyles['global-box-shadow'],
                                globalStyles['wrapper-preview-item']
                            ])}>
                                <div className={cn([
                                    globalStyles['wrapper-header'],
                                    globalStyles['global-transition-duration']
                                ])}>
                                    <div className={globalStyles['wrapper-header__start']}>{item.starttime}</div>
                                    <div className={globalStyles['wrapper-header__end']}>{item.endtime}</div>
                                </div>
                                <div className={globalStyles['wrapper-body']}>
                                    <div className={globalStyles['wrapper-body__info-flex']}>
                                        <span className={globalStyles['global-fontweight-bold']}>Project:</span> {item.project}
                                    </div>
                                    <div className={cn([
                                        globalStyles['wrapper-body__info-flex'],
                                        globalStyles['global-margin-top-item']
                                    ])}>
                                        <span className={globalStyles['global-fontweight-bold']}>Fase:</span> {item.phase}
                                    </div>
                                    <div className={cn([
                                        globalStyles['wrapper-body__info-flex'],
                                        globalStyles['global-margin-top-item']
                                    ])}>
                                        <span className={globalStyles['global-fontweight-bold']}>Taak:</span> {item.task.name}
                                    </div>
                                    <div className={cn([
                                        globalStyles['wrapper-body__info-flex'],
                                        globalStyles['global-margin-top-item']
                                    ])}>
                                        <span className={globalStyles['global-fontweight-bold']}>Status:</span>
                                        <span className={cn({
                                            [globalStyles['global-fontweight-bold']]:true,
                                            [globalStyles['global-color-blue']]:item.task.status == "open",
                                            [globalStyles['global-color-purple']]:item.task.status == "in_progress",
                                            [globalStyles['global-color-red']]:item.task.status == "stuck",
                                            [globalStyles['global-color-orange']]:item.task.status == "overdue",
                                            [globalStyles['global-color-lightgreen']]:item.task.status == "completed"
                                        })}>{GLOBALFUNC__TranslateTasksStatus(item.task.status)}</span>
                                    </div>
                                    <AsignedResourcesComponentInsideList 
                                        assigned_to={item.assigned_to}
                                        addMarginTop={true}/>
                                </div>
                            </div>      
                        </button>
                    </div>
                ))
            }
            {/*<VIEW__DayviewIndicator />*/}
            {/*
                props.dayViewDataHasLoaded
                && props.dayviewObject.length > 0
                && !moreDataIsLoading
                &&
                <div className={globalStyles['global-margin-top-x2']}>
                    <GlobalComponentLoadMoreButton />
                </div>
            */}

            {/* Loaders */}
            {
                !props.dayViewDataHasLoaded
                &&
                <GlobalComponentLoadingData type={"firstTimeLoading"} />
            }
            {
                moreDataIsLoading
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }

            {/* Empty message */}
            {
                props.dayviewObject.items_total == 0
                &&
                <GlobalComponentEmptyMessage
                    buttonTitle={"Planning aanmaken"}
                    FUNC__OnclickAction={props.FUNC__AddPlanning}/>
            }
        </>
    );
}
export default VIEW__SectionDayview;