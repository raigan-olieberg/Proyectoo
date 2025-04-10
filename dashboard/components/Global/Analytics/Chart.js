// React / NextJs components
import cn from 'classnames';
import { useRouter } from 'next/navigation';
// Global / Page / Layout components
import {
    GLOBALFUNC__CalculatePercentage,
    GLOBALFUNC__SelectItemForSidebar
} from '../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const GlobalComponentChart = (props) => {
    /* ========================================
    ===========================================
    ===========================================
    ===========================================
    ===========================================

        References

    ===========================================
    ===========================================
    ===========================================
    ===========================================
    =========================================== 
    
        PROPS
            -> min:number
            -> total:number
            -> id:string
            -> sidebarDirection:string
            -> sidebarData:any
        VIEWS
            -> REF:VIEW__Vertical
            -> REF:VIEW__Horizontal
            -> REF:generated view
        FUNCTIONS
            -> REF:FUNC__CalculatePercentage
            -> REF:FUNC__CalculateLabelMargin
            -> REF:FUNC__CalculateLabelColor

    */
    const router = useRouter();
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalculateLabelMargin
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Calculating margin of the chart label inside the chart bar
    *
    *
    * 
    * 
    */
    const FUNC__CalculateLabelMargin = (type = null, percentage, length = null) => {
        let value = 0;
        if(type == "projects"){
            if(percentage < 80){
                value = (percentage + 2)+"%";
            } else {
                value = "calc("+percentage+"% - 1.8vw)";
            }
        } else {
            if(percentage < 80){
                value = (percentage + 3)+"%";
            } else if(percentage >= 80) {
                switch(length){
                    case 1:
                        value = "calc("+percentage+"% - 1.5vw)";
                        break;
                    case 2:
                        value = "calc("+percentage+"% - 2vw)";
                        break;
                    case 3:
                        value = "calc("+percentage+"% - 2.5vw)";
                        break;
                    case 4:
                        value = "calc("+percentage+"% - 3vw)";
                        break;
                }
            }
        }
        return value;
    };
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalculateLabelColor
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Calculating the color of the chart label inside the chart bar
    *
    *
    * 
    * 
    */
    const FUNC__CalculateLabelColor = (percentage) => {
        let value = 0;
        if(percentage < 80){
            value = "#272727";
        } else {
            value = "#fff";
        }
        return value;
    }

    const FUNC__OnClick = (
        href
    ) => {
        router.push(href);
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Vertical
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for the vertical chart
    *
    *
    * 
    * 
    */
    function VIEW__Vertical(){
        return (
            <section className={cn({
                [globalStyles['global-chart__vertical']]:true,
                [globalStyles['global-chart__vertical--with-label']]:true,
                //[globalStyles['global-margin-top']]:GLOBALFUNC__CalculatePercentage(props.min, props.total) > 90 && props.sidebar.show == 1 && props.sidebar.selectedItemID == props.id
            })}>
                <div className={globalStyles['global-chart__vertical--chart']}>
                    <div className={globalStyles['incubator']}>
                        <div className={globalStyles['incubator__label']} style={{ bottom: FUNC__CalculateLabelMargin("projects", GLOBALFUNC__CalculatePercentage(props.min, props.total)), color: FUNC__CalculateLabelColor(GLOBALFUNC__CalculatePercentage(props.min, props.total))}}>
                            {props.min}
                        </div>
                        <div className={cn({
                            [globalStyles['incubator__filler']]:true,
                            [globalStyles[props.fill]]:true,
                            [globalStyles['global-hover-makedarker']]:true,
                            [globalStyles['global-transition-duration']]:true,
                            //[globalStyles['global-side-selected-item']]:props.sidebar.show == 1 && props.sidebar.selectedItemID == props.id
                        })} style={{height: GLOBALFUNC__CalculatePercentage(props.min, props.total)+"%"}} onClick={() => FUNC__OnClick(props.FUNC__OnClickHref)}></div>
                    </div>
                </div>
                <div className={globalStyles['global-fontsize-subtext']}>
                    <div>{props.label}</div>
                    <div className={cn([
                        globalStyles['global-fontweight-bold'],
                        globalStyles['global-margin-subtext']
                    ])}>{GLOBALFUNC__CalculatePercentage(props.min, props.total)}%</div>
                </div>
            </section>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Horizontal
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for the horizontal chart
    *
    *
    * 
    * 
    */
    function VIEW__Horizontal(){
        return (
            <section className={globalStyles['global-chart__horizontal']}>
                <div className={cn({
                    [globalStyles['global-chart__horizontal--chart']]:true,
                    //[globalStyles['global-margin-top']]:props.sidebar.show == 1 && props.sidebar.selectedItemID == props.id && props.first != undefined,
                    //[globalStyles['global-margin-right']]:GLOBALFUNC__CalculatePercentage(props.min, props.total) > 90 && props.sidebar.show == 1 && props.sidebar.selectedItemID == props.id
                })}>
                    <div className={globalStyles['incubator']}>
                        <div className={cn({
                            [globalStyles['incubator__filler']]:true,
                            [globalStyles[props.fill]]:true,
                            [globalStyles['global-hover-makedarker']]:true,
                            [globalStyles['global-transition-duration']]:true,
                            //[globalStyles['global-side-selected-item']]:props.sidebar.show == 1 && props.sidebar.selectedItemID == props.id
                        })} onClick={() => GLOBALFUNC__SelectItemForSidebar(props.id, props.sidebarDirection, props.sidebarData)} style={{width: GLOBALFUNC__CalculatePercentage(props.min, props.total)+"%"}}></div>
                        <div className={globalStyles['incubator__label']} style={{ left: FUNC__CalculateLabelMargin("tasks",GLOBALFUNC__CalculatePercentage(props.min, props.total),props.min.toString().length), color: FUNC__CalculateLabelColor(GLOBALFUNC__CalculatePercentage(props.min, props.total))}}>
                            <div>{props.min}</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Fullscreen
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for the fullscreen chart
    *
    *
    * 
    * 
    */
    function VIEW__Fullscreen(props){
        return(
            <div className={globalStyles['global-chart__fullscreen']}>
                <div className={cn([
                    globalStyles['header'],
                    globalStyles['header__two-columns']
                ])}>
                    <div className={globalStyles['header__item']}>
                    <div className={globalStyles['subtitle']}>{props.projectObject.phases.total}</div>
                        <div className={globalStyles['title']}>Fases</div>
                    </div>
                    <div></div>
                    <div className={globalStyles['header__item']}>
                        <div className={globalStyles['subtitle']}>{props.projectObject.tasks.total}</div>
                        <div className={globalStyles['title']}>Taken</div>
                    </div>
                </div>
                <div className={globalStyles['wrapper']}>
                    <div className={globalStyles['wrapper__item']}>
                        <div className={globalStyles['indicator']}>
                            <button className={cn([
                                globalStyles['indicator__filler'],
                                globalStyles['global-backgroundcolor-green'],
                                globalStyles['global-hover-makedarker'],
                                globalStyles['global-transition-duration']
                            ])} style={{height: GLOBALFUNC__CalculatePercentage(props.projectObject.phases.completed, props.projectObject.phases.total)+"%"}}></button>
                        </div>
                        <div className={globalStyles['info']}>
                            <div>Fases voltooid</div>
                            <div className={cn([
                                globalStyles['global-fontweight-bold'],
                                globalStyles['global-margin-subtext']
                            ])}>{props.projectObject.phases.completed} ({GLOBALFUNC__CalculatePercentage(props.projectObject.phases.completed, props.projectObject.phases.total)}%)</div>
                        </div>
                    </div>
                    <div className={globalStyles['wrapper__seperator']}></div>
                    <div className={globalStyles['wrapper__item']}>
                        <div className={globalStyles['indicator']}>
                            <button className={cn([
                                globalStyles['indicator__filler'],
                                globalStyles['global-backgroundcolor-lightslategrey'],
                                globalStyles['global-hover-makedarker'],
                                globalStyles['global-transition-duration']
                            ])} style={{height: GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.unasigned, props.projectObject.tasks.total)+"%"}}></button>
                        </div>
                        <div className={globalStyles['info']}>
                            <div>Niet toegewezen</div>
                            <div className={cn([
                                globalStyles['global-fontweight-bold'],
                                globalStyles['global-margin-subtext']
                            ])}>{props.projectObject.tasks.unasigned} ({GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.unasigned, props.projectObject.tasks.total)}%)</div>
                        </div>
                    </div>
                    <div className={globalStyles['wrapper__item']}>
                        <div className={globalStyles['indicator']}>
                            <button className={cn([
                                globalStyles['indicator__filler'],
                                globalStyles['global-backgroundcolor-blue'],
                                globalStyles['global-hover-makedarker'],
                                globalStyles['global-transition-duration']
                            ])} style={{height: GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.open, props.projectObject.tasks.total)+"%"}}></button>
                        </div>
                        <div className={globalStyles['info']}>
                            <div>Open</div>
                            <div className={cn([
                                globalStyles['global-fontweight-bold'],
                                globalStyles['global-margin-subtext']
                            ])}>{props.projectObject.tasks.unasigned} ({GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.open, props.projectObject.tasks.total)}%)</div>
                        </div>
                    </div>
                    <div className={globalStyles['wrapper__item']}>
                        <div className={globalStyles['indicator']}>
                            <button className={cn([
                                globalStyles['indicator__filler'],
                                globalStyles['global-backgroundcolor-purple'],
                                globalStyles['global-hover-makedarker'],
                                globalStyles['global-transition-duration']
                            ])} style={{height: GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.in_progress, props.projectObject.tasks.total)+"%"}}></button>
                        </div>
                        <div className={globalStyles['info']}>
                            <div>Nu bezig</div>
                            <div className={cn([
                                globalStyles['global-fontweight-bold'],
                                globalStyles['global-margin-subtext']
                            ])}>{props.projectObject.tasks.in_progress} ({GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.in_progress, props.projectObject.tasks.total)}%)</div>
                        </div>
                    </div>
                    <div className={globalStyles['wrapper__item']}>
                        <div className={globalStyles['indicator']}>
                            <button className={cn([
                                globalStyles['indicator__filler'],
                                globalStyles['global-backgroundcolor-orange'],
                                globalStyles['global-hover-makedarker'],
                                globalStyles['global-transition-duration']
                            ])} style={{height: GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.not_on_schedule, props.projectObject.tasks.total)+"%"}}></button>
                        </div>
                        <div className={globalStyles['info']}>
                            <div>Te laat</div>
                            <div className={cn([
                                globalStyles['global-fontweight-bold'],
                                globalStyles['global-margin-subtext']
                            ])}>{props.projectObject.tasks.not_on_schedule} ({GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.not_on_schedule, props.projectObject.tasks.total)}%)</div>
                        </div>
                    </div>
                    <div className={globalStyles['wrapper__item']}>
                        <div className={globalStyles['indicator']}>
                            <button className={cn([
                                globalStyles['indicator__filler'],
                                globalStyles['global-backgroundcolor-red'],
                                globalStyles['global-hover-makedarker'],
                                globalStyles['global-transition-duration']
                            ])} style={{height: GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.stuck, props.projectObject.tasks.total)+"%"}}></button>
                        </div>
                        <div className={globalStyles['info']}>
                            <div>Vastgelopen</div>
                            <div className={cn([
                                globalStyles['global-fontweight-bold'],
                                globalStyles['global-margin-subtext']
                            ])}>{props.projectObject.tasks.stuck} ({GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.stuck, props.projectObject.tasks.total)}%)</div>
                        </div>
                    </div>
                    <div className={globalStyles['wrapper__item']}>
                        <div className={globalStyles['indicator']}>
                            <button className={cn([
                                globalStyles['indicator__filler'],
                                globalStyles['global-backgroundcolor-lightgreen'],
                                globalStyles['global-hover-makedarker'],
                                globalStyles['global-transition-duration']
                            ])} style={{height: GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.completed, props.projectObject.tasks.total)+"%"}}></button>
                        </div>
                        <div className={globalStyles['info']}>
                            <div>Voltooid</div>
                            <div className={cn([
                                globalStyles['global-fontweight-bold'],
                                globalStyles['global-margin-subtext']
                            ])}>{props.projectObject.tasks.stuck} ({GLOBALFUNC__CalculatePercentage(props.projectObject.tasks.completed, props.projectObject.tasks.total)}%)</div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:generated view
        -> WHAT IS IT / WHAT DOES IT DO:  
            --> The generated view for this page
    *
    *
    * 
    * 
    */
    return (
        <>
        {
            props.type == "vertical"
            &&
            <VIEW__Vertical />
        }
        {
            props.type == "horizontal"
            &&
            <VIEW__Horizontal />
        }
        {
            props.type == "fullscreen"
            &&
            <VIEW__Fullscreen />
        }
        </>
    );
}
export default GlobalComponentChart;
