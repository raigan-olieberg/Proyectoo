// React / NextJs components
import cn from 'classnames';
import { useState } from 'react';
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
import VIEW__SectionDayview from './VIEW__SectionDayview';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const VIEW__SectionWeekview = (props) => {
    const [moreDataIsLoading, setMoreDataIsLoading] = useState(false);
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
                props.weekviewDataHasLoaded
                && props.weekviewObject.length > 0
                &&
                <>
                    <div className={globalStyles['global-schedule__hours-header']}>
                        <div></div>
                        <div></div>
                        <div className={cn([
                            globalStyles['global-grid-24'],
                            globalStyles['global-padding-bottom'],
                            globalStyles['global-backgroundcolor-white']
                        ])}>
                            <div className={globalStyles['hours-header-item']}>00:00</div>
                            <div className={globalStyles['hours-header-item']}>01:00</div>
                            <div className={globalStyles['hours-header-item']}>02:00</div>
                            <div className={globalStyles['hours-header-item']}>03:00</div>
                            <div className={globalStyles['hours-header-item']}>04:00</div>
                            <div className={globalStyles['hours-header-item']}>05:00</div>
                            <div className={globalStyles['hours-header-item']}>06:00</div>
                            <div className={globalStyles['hours-header-item']}>07:00</div>
                            <div className={globalStyles['hours-header-item']}>08:00</div>
                            <div className={globalStyles['hours-header-item']}>09:00</div>
                            <div className={globalStyles['hours-header-item']}>10:00</div>
                            <div className={globalStyles['hours-header-item']}>11:00</div>
                            <div className={globalStyles['hours-header-item']}>12:00</div>
                            <div className={globalStyles['hours-header-item']}>13:00</div>
                            <div className={globalStyles['hours-header-item']}>14:00</div>
                            <div className={globalStyles['hours-header-item']}>15:00</div>
                            <div className={globalStyles['hours-header-item']}>16:00</div>
                            <div className={globalStyles['hours-header-item']}>17:00</div>
                            <div className={globalStyles['hours-header-item']}>18:00</div>
                            <div className={globalStyles['hours-header-item']}>19:00</div>
                            <div className={globalStyles['hours-header-item']}>20:00</div>
                            <div className={globalStyles['hours-header-item']}>21:00</div>
                            <div className={globalStyles['hours-header-item']}>22:00</div>
                            <div className={globalStyles['hours-header-item']}>23:00</div>
                        </div>
                    </div>
                    {
                        Object.keys(props.weekviewObject[0]).map((day, index) => (
                            <>
                                <div className={globalStyles['weekview-item']} key={index}>
                                    <div className={globalStyles['weekview-item-day-container']}>
                                        <div className={cn([
                                            globalStyles['weekview-item__day'],
                                            globalStyles['global-margin-bottom-item']
                                        ])}>
                                            <div className={globalStyles['day-title']}>{
                                                props.FUNC__ReturnDay(
                                                    'title',
                                                    props.weekviewDate,
                                                    day
                                            )}</div>
                                            <div className={globalStyles['global-margin-top-item']}>{
                                                props.FUNC__ReturnDay(
                                                    'subtitle',
                                                    props.weekviewDate,
                                                    day
                                            )}</div>
                                        </div>
                                    </div>
                                    <div className={globalStyles['global-seperator__vertical']}></div>
                                    <div className={globalStyles['global-margin-top']}>
                                        {
                                        <VIEW__SectionDayview 
                                            appContext={props.appContext}
                                            dayviewObject={props.weekviewObject[0][day]}
                                            setDayviewObject={props.setWeekviewObject}
                                            dayViewDataHasLoaded={true}/>
                                        }
                                    </div>
                                </div>
                                {
                                    index != (Object.keys(props.weekviewObject[0]).length - 1)
                                    &&
                                    <div className={cn([
                                        globalStyles['global-seperator__horizontal'],
                                        globalStyles['global-margin-top'],
                                        globalStyles['global-margin-bottom']
                                    ])}></div>
                                }
                            </>
                        ))        
                    }
                    {/*<div className={globalStyles['global-schedule__hours-indicator']}>
                        <div></div>
                        <div></div>
                        <div className={globalStyles['hours-indicator-wrapper']}>
                            <props.VIEW__DayviewIndicator/>
                        </div>
                    </div>*/}
                </>
            }
            {
                !props.weekviewDataHasLoaded
                &&
                <GlobalComponentLoadingData
                    type={'firstTimeLoading'}/>
            }
            {
                props.weekviewDataHasLoaded
                && props.weekviewObject.length == 0
                &&
                <GlobalComponentDynamicMessage
                    showTitle={true}
                    message={"Er is voor de geselecteerde week geen planning gevonden."}/>
            }
            {
                props.weekviewDataHasLoaded
                && props.weekviewObject.length > 0
                && props.weekviewLastVisible != 'end_has_been_reached'
                &&
                <div ref={props.loadingMoreWeekviewData} className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }
        </>
    );
}
export default VIEW__SectionWeekview;