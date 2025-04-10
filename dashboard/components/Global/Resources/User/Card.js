// React / NextJs components
import cn from 'classnames';
import { useContext } from 'react';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

export function UserComponentMember(props){
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalculatePercentage
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Calculating the percentage of something
    *
    *
    * 
    * 
    */
    const FUNC__CalculatePercentage = (item, total) => {
        return Math.round((item / total) * 100);
    };
    /*
    *
    *
    * 
    * 
        REF:FUNC__Click
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Decide what happens when clicking on a member
    *
    *
    * 
    * 
    */
    const FUNC__OnClick = () => {
        if(props.showMemberTasks != undefined){
            let direction = "";
            let directionLeft = [0,1,4,5,8,9,12,13,16,17,20,21,24,25,28,29,32,33,36,37,40,41,44,45,48,49,52,53,56,57,60,61,64,65,68,69,72,73,76,77,80,81,84,85,88,89,92,93,96,97,100,101];
            let directionRight = [2,3,6,7,10,11,14,15,18,19,22,23,26,27,30,31,34,35,38,39,42,43,46,47,50,51,54,55,58,59,62,63,66,67,70,71,74,75,78,79,82,83,86,87,90,91,94,95,98,99];
            if(directionLeft.includes(props.index)){
                direction = "right";
            } else if(directionRight.includes(props.index)){
                direction = "left";
            } else {
                direction = "right";
            }
            return FUNC__SelectItemForSidebar(props.id, direction, {page: "project/manager", title: "Voortgang medewerker", view: "VIEW__Manager__ProjectMemberTasks", data: null});
        } else {
            return false;
        }
    }
    return (
        <>
            {
                (props.clickable != undefined && props.clickable)
                &&
                <button className={cn({
                    [globalStyles['global-members-row__item']]:true,
                    [globalStyles['global-hover-standard-nocursor']]:true,
                    [globalStyles['global-transition-duration']]:true,
                    [globalStyles['global-border-radius']]:true,
                    //[globalStyles['global-side-selected-item']]:sidebarContext.globalContext.sidebar.show == 1 && sidebarContext.globalContext.sidebar.selectedItemID == props.id
                })} onClick={() => FUNC__OnClick()}>
                    <div className={globalStyles['global-cursor-pointer']}>
                        <img className={cn([
                            globalStyles['global-margin-bottom'],
                            globalStyles['global-center-item'],
                            globalStyles['global-photo-big']
                        ])} src="../img/female1-150.jpg"/>
                        <div className={globalStyles['global-text-align-center']}>
                            <div className={globalStyles['global-margin-subtext']}>{props.attributes.name}</div>
                            <div className={cn([
                                globalStyles['global-margin-subtext'],
                                globalStyles['global-fontsize-subtext']
                            ])}>{props.attributes.role} { props.attributes.label != undefined && props.attributes.label != "" && " ("+props.attributes.label+")"}</div>
                            {/*
                                (props.attributes.admin != undefined && props.attributes.admin == 1)
                                &&
                                <div className={cn([
                                    globalStyles['item-admin'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <i className={globalStyles['item-admin__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['shield'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                    Admin
                                </div>
                                ||
                                <div className={cn([
                                    globalStyles['item-noadmin'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <i className={globalStyles['item-noadmin__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['shield-off'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                    Admin
                                </div>
                            */}
                        </div>
                        {
                            (props.showProgress !== undefined && props.showProgress)
                            &&
                            <>
                                <div className={cn([
                                    globalStyles['global-seperator__horizontal'],
                                    globalStyles['global-margin-top-item']
                                ])}></div>
                                <div className={cn([
                                    globalStyles['global-progress'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <div className={globalStyles['global-progress__title']}>Taken voltooid - {FUNC__CalculatePercentage(props.attributes.tasks.completed, props.attributes.tasks.total)}%</div>
                                    <div className={cn([
                                        globalStyles['global-progress__indicator'],
                                        globalStyles['global-margin-top-item']
                                    ])}>
                                        <div className={globalStyles['indicator-filler']} style={{width: FUNC__CalculatePercentage(props.attributes.tasks.completed, props.attributes.tasks.total)+"%"}}></div>
                                    </div>
                                    <div className={cn([
                                        globalStyles['global-progress__status'],
                                        globalStyles['global-grid-5'],
                                        globalStyles['global-margin-top-item']
                                    ])}>
                                        <div>
                                            <div className={globalStyles['global-fontsize-subtext']}>Open</div>
                                            <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.open}</div>
                                        </div>
                                        <div>
                                            <div className={globalStyles['global-fontsize-subtext']}>Nu bezig</div>
                                            <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.in_progress}</div>
                                        </div>
                                        <div>
                                            <div className={globalStyles['global-fontsize-subtext']}>Te laat</div>
                                            <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.not_on_schedule}</div>
                                        </div>
                                        <div>
                                            <div className={globalStyles['global-fontsize-subtext']}>Vastgelopen</div>
                                            <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.stuck}</div>
                                        </div>
                                        <div>
                                            <div className={globalStyles['global-fontsize-subtext']}>Voltooid</div>
                                            <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.completed}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    {
                        (props.showDeletebutton !== undefined && props.showDeletebutton)
                        &&
                        <button className={cn([
                            globalStyles['global-delete-button'],
                            globalStyles['global-center-item'],
                            globalStyles['global-color-subtext'],
                            globalStyles['global-fontsize-subtext']
                        ])}>Verwijderen</button>
                    }
                </button>
                ||
                <div className={[
                    globalStyles['global-members-row__item'],
                    globalStyles['global-hover-standard-nocursor'],
                    globalStyles['global-transition-duration']
                ]}>
                    <img className={cn([
                        globalStyles['global-margin-bottom'],
                        globalStyles['global-center-item'],
                        globalStyles['global-photo-big']
                    ])} src="../img/female1-150.jpg"/>
                    <div className={globalStyles['global-text-align-center']}>
                        <div className={globalStyles['global-margin-subtext']}>{props.attributes.name}</div>
                        <div className={cn([
                            globalStyles['global-margin-subtext'],
                            globalStyles['global-fontsize-subtext']
                        ])}>{props.attributes.role} { props.attributes.label != undefined && props.attributes.label != "" && " ("+props.attributes.label+")"}</div>
                        {/*
                            (props.attributes.admin != undefined && props.attributes.admin == 1)
                            &&
                            <div className={cn([
                                globalStyles['item-admin'],
                                globalStyles['global-margin-top-item']
                            ])}>
                                <i className={globalStyles['item-admin__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['shield'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                Admin
                            </div>
                            ||
                            <div className={cn([
                                globalStyles['item-noadmin'],
                                globalStyles['global-margin-top-item']
                            ])}>
                                <i className={globalStyles['item-noadmin__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['shield-off'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                Admin
                            </div>
                        */}
                    </div>
                    {
                        (props.showProgress !== undefined && props.showProgress)
                        &&
                        <>
                            <div className={cn([
                                globalStyles['global-seperator__horizontal'],
                                globalStyles['global-margin-top-item']
                            ])}></div>
                            <div className={cn([
                                globalStyles['global-progress'],
                                globalStyles['global-margin-top-item']
                            ])}>
                                <div className={globalStyles['global-progress__title']}>Taken voltooid - {FUNC__CalculatePercentage(props.attributes.tasks.completed, props.attributes.tasks.total)}%</div>
                                <div className={cn([
                                    globalStyles['global-progress__indicator'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <div className={globalStyles['indicator-filler']} style={{width: FUNC__CalculatePercentage(props.attributes.tasks.completed, props.attributes.tasks.total)+"%"}}></div>
                                </div>
                                <div className={cn([
                                    globalStyles['global-progress__status'],
                                    globalStyles['global-grid-5'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <div>
                                        <div className={globalStyles['global-fontsize-subtext']}>Open</div>
                                        <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.open}</div>
                                    </div>
                                    <div>
                                        <div className={globalStyles['global-fontsize-subtext']}>Nu bezig</div>
                                        <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.in_progress}</div>
                                    </div>
                                    <div>
                                        <div className={globalStyles['global-fontsize-subtext']}>Te laat</div>
                                        <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.not_on_schedule}</div>
                                    </div>
                                    <div>
                                        <div className={globalStyles['global-fontsize-subtext']}>Vastgelopen</div>
                                        <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.stuck}</div>
                                    </div>
                                    <div>
                                        <div className={globalStyles['global-fontsize-subtext']}>Voltooid</div>
                                        <div className={globalStyles['global-margin-subtext']}>{props.attributes.tasks.completed}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            }
        </>
    );
}