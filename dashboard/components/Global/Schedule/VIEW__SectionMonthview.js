// React / NextJs components
import cn from 'classnames';
import { useState, useEffect } from 'react';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:VIEW__SectionMonthview
    WHAT IS IT: 
        The generated view for the section Monthview (NL -> Maand)
*
*
* 
* 
*/
const VIEW__SectionMonthview = (props) => {
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalendarView__{...}
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Fill the calendar days
    *
    *
    * 
    * 
    */
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const FUNC__CalendarView__Navigate = (direction, init) => {
        /* 
            Step 1: 
                If not init -> Navigate to next or previous month
                If init -> Fill calendar based on given date
        */
        if(!init){
            const newDate = calendarDate;
            if(direction == "forward"){
                newDate.setMonth(newDate.getMonth() + 1);
            } else {
                newDate.setMonth(newDate.getMonth() - 1);
            }
            setCalendarDate(new Date(newDate));
        }
        /* 
            Step 2: Fill calendar days
        */
        FUNC__CalendarView__FillCalander();
    };
    const FUNC__CalendarView__FillCalander = () => {
        //const numDaysDate = new Date(calendarDate.getFullYear(), (calendarDate.getMonth() + 1), 0);
        const numDaysFirstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).toLocaleDateString("nl-NL", { weekday: 'long' });
        const numDays = new Date(calendarDate.getFullYear(), (calendarDate.getMonth() + 1), 0).getDate();
        let newDays = [];
        // Set empty days before
        let daysBefore = 0;
        switch(numDaysFirstDay){
            case "maandag":
                daysBefore = 1;
                break;
            case "dinsdag":
                daysBefore = 2;
                break;
            case "woensdag":
                daysBefore = 3;
                break;
            case "donderdag":
                daysBefore = 4;
                break;
            case "vrijdag":
                daysBefore = 5;
                break;
            case "zaterdag":
                daysBefore = 6;
                break;
            case "zondag":
                daysBefore = 7;
                break;
        }
        if(daysBefore > 0){
            for(let i=1;i<daysBefore;i++){
                newDays.push({
                    key: "empty-day-before-"+i,
                    day_number: null,
                    day_name: null,
                    type: "empty",
                    items_total: 0
                });
            }
        }
        // Set filled days
        for(let i=1;i<=numDays;i++){
            let day = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i).toLocaleDateString("nl-NL", { weekday: 'long' });
            newDays.push({
                key: "filled-day-"+i,
                day_number: i,
                day_name: day,
                type: "filled",
                total_items: 3
            });
        }
        // Set empty days after
        let totalAvailableDays = (daysBefore < 7)?35:42;
        let emptyDaysAfter = (totalAvailableDays - newDays.length);
        if(emptyDaysAfter > 0){
            for(let i=1;i<=emptyDaysAfter;i++){
                newDays.push({
                    key: "empty-day-after-"+i,
                    day_number: null,
                    day_name: null,
                    type: "empty",
                    items_total: 0
                });
            }
        }
        setCalendarDays(newDays);
    }
    /*
        Fill calendar on first render
    */
    useEffect(() => {
        FUNC__CalendarView__FillCalander();
        console.log("first render!");
    }, [])

    return (
        <>
            <div className={cn([
                globalStyles['calendar-header'],
                globalStyles['global-grid-7']
            ])}>
                <div>maa</div>
                <div>din</div>
                <div>woe</div>
                <div>don</div>
                <div>vrij</div>
                <div>zat</div>
                <div>zon</div>
            </div>
            <div className={cn([
                globalStyles['calendar-content'],
                globalStyles['global-grid-7']
            ])}>
                
                {calendarDays.map(item => (
                    item.type == "filled"
                    &&
                    <button key={item.key} className={cn([
                        globalStyles['global-cursor-pointer'],
                        globalStyles['global-transition-duration'],
                    ])}>
                        <div className={globalStyles['calendar-date']}>{item.day_number}</div>
                        {
                            item.total_items > 0
                            &&
                            <div className={cn([
                                globalStyles['calender-events'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['calender-events__indicator']}></div>
                                <div>{item.total_items} {item.total_items == 1?"taak":"taken"}</div>
                            </div>
                            ||
                            <div className={globalStyles['calender-events']}></div>
                        }
                    </button>
                    ||
                    <div key={item.key} className={cn([
                        globalStyles['global-backgroundcolor-item'],
                        globalStyles['button-inactive']
                    ])}></div>
                ))}
            </div>
        </>
    );
}
export default VIEW__SectionMonthview;