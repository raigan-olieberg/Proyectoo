// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import Link from 'next/link';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const SidebarComponentDashboardPage = (props) => {
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
            view:string
            data:any
            fetchFromServer:boolean
        VIEWS
            -> REF:VIEW__Manager__Dashboard__Task
            -> REF:VIEW__Manager__Dashboard__Projects
            -> REF:VIEW__Manager__Dashboard__Tasks
            -> REF:VIEW__Manager__Dashboard__Problems
            -> REF:VIEW__Manager__Dashboard__Activity__Budget
            -> REF:VIEW__Manager__Dashboard__Activity__CreatedATask
            -> REF:VIEW__Manager__Dashboard__Activity__DeletedATask
            -> REF:VIEW__Manager__Dashboard__Activity__FinishedATask
            -> REF:VIEW__Manager__Dashboard__Activity__ChangedTaskStatus
            -> REF:VIEW__Manager__Dashboard__Activity__TaskOverdue
            -> REF:VIEW__Manager__Dashboard__Activity__StuckWithTask
            -> REF:VIEW__Manager__Dashboard__Activity__ReportedAProblem
            -> REF:VIEW__Manager__Dashboard__Activity__ChangedProblemStatus
            -> REF:VIEW__Manager__Dashboard__Activity__DeletedAProblem
            -> REF:VIEW__Manager__Dashboard__Activity__CreatedAPhase
            -> REF:VIEW__Manager__Dashboard__Activity__DeletedAPhase
            -> REF:VIEW__Manager__Dashboard__Activity__FinishedAPhase
            -> REF:VIEW__Manager__Dashboard__Activity__Document
            -> REF:VIEW__Manager__Dashboard__Activity__Team
            -> REF:VIEW__Manager__Dashboard__Activity__TeamMember
            -> REF:VIEW__blueprint_with_inputs
            -> REF:generated view
        FUNCTIONS
            -> REF:FUNC__CalculatePercentage
            -> REF:FUNC__CalculateTimeExceeded
    
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
        REF:FUNC__CalculateTimeExceeded
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Calculating the hours or days that a member is working longer than planned on a task
    *
    *
    * 
    * 
    */
    const FUNC__CalculateTimeExceeded = (endate, endtime) => {
        const oneDay = 24 * 60 * 60 * 1000;
        const d1 = new Date();
        const d2 = new Date(endate.substring(6,10), (endate.substring(3,5) - 1), endate.substring(0,2), endtime.substring(0,2), endtime.substring(3,5));
        
        // get total seconds between the times
        let delta = Math.abs(d2 - d1) / 1000;

        // calculate (and subtract) whole days
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;
        let daysString = (days == 1)?"dag":"dagen";

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        let hoursString = (hours == 1)?"uur":"uren";

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        let minutesString = (minutes == 1)?"minuut":"minuten";

        return days+" "+daysString+", "+hours+" "+hoursString+" en "+minutes+" "+minutesString;
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Task
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->tasks scheduled for today
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Task(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Fase</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.phase}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Taak</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.description}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Taakomschrijving</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.long_description}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Toegewezen medewerker(s)</div>
                    {
                        props.data.asigned_to.length > 0
                        &&
                        props.data.asigned_to.map((member) => 
                            <div className={cn([
                                globalStyles['global-member-in-list'],
                                globalStyles['global-member-in-list__standard'],
                                globalStyles['global-text-align-start'],
                                globalStyles['global-margin-top-item'],
                                globalStyles['global-backgroundcolor-item']
                            ])}>
                                <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                <div>
                                    <div>{member.name}</div>
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                    {
                                        member.team != undefined
                                        &&
                                        <div className={cn([
                                            globalStyles['global-fontsize-subtext'],
                                            globalStyles['global-margin-subtext'],
                                            globalStyles['global-display-flex']
                                        ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                    }
                                </div>
                            </div>
                        )
                        ||
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item']
                        ])}>-</div>
                    }
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Locatie</div>
                    <div className={cn([
                        globalStyles['bodysection-field__location'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['map-pin'].toSvg({height: "1vw", widfth: "1vw"})}}></i>
                       <div>
                            <div className={globalStyles['bodysection-field__non-input']}>{props.data.location.street_and_number}</div>
                            <div className={cn([
                                globalStyles['global-margin-top-item'],
                                globalStyles['bodysection-field__non-input']
                            ])}>{props.data.location.zipcode_and_city}</div>
                        </div> 
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Startdatum</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.startdate != ""?props.data.startdate:"-"}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Einddatum</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.enddate != ""?props.data.enddate:"-"}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Starttijd</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.starttime != ""?props.data.starttime:"-"}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Eindtijd</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.endtime != ""?props.data.endtime:"-"}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Status</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.status}</div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    <div></div>
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar Taken
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Projects
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->projects
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Projects(){
        return (
            props.fetchFromServer != undefined
            &&
            <>
                <div className={globalStyles['global-infinite-scroll-loader']}>
                    <div className={globalStyles['global-infinite-scroll-loader__center']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </>
            ||
            <>
                <Link href="info/budget" className={cn([
                    globalStyles['row-item'],
                    globalStyles['global-hover-standard'],
                    globalStyles['global-margin-bottom-item'],
                    globalStyles['global-transition-duration']
                ])}>Project 1</Link>
                <Link href="info/budget" className={cn([
                    globalStyles['row-item'],
                    globalStyles['global-hover-standard'],
                    globalStyles['global-margin-bottom-item'],
                    globalStyles['global-transition-duration']
                ])}>Project 2</Link>
                <Link href="info/budget" className={cn([
                    globalStyles['row-item'],
                    globalStyles['global-hover-standard'],
                    globalStyles['global-margin-bottom-item'],
                    globalStyles['global-transition-duration']
                ])}>Project 3</Link>
                <Link href="info/budget" className={cn([
                    globalStyles['row-item'],
                    globalStyles['global-hover-standard'],
                    globalStyles['global-margin-bottom-item'],
                    globalStyles['global-transition-duration']
                ])}>Project 4</Link>
                <Link href="info/budget" className={cn([
                    globalStyles['row-item'],
                    globalStyles['global-hover-standard'],
                    globalStyles['global-margin-bottom-item'],
                    globalStyles['global-transition-duration']
                ])}>Project 5</Link>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    <div></div>
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar Projecten
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Tasks
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->tasks
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Tasks(){
        return (
            props.fetchFromServer != undefined
            &&
            <>
                <div className={globalStyles['global-infinite-scroll-loader']}>
                    <div className={globalStyles['global-infinite-scroll-loader__center']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </>
            ||
            <>
                <div className={cn([
                    globalStyles['global-margin-bottom'],
                    globalStyles['row-item-multilevel']
                ])}>
                    <div className={cn([
                        globalStyles['row-item-multilevel__parent'],
                        globalStyles['global-margin-bottom-item']
                    ])}>Project 1</div>
                    <div className={cn([
                        globalStyles['row-item-multilevel__children'],
                        globalStyles['global-indent']
                    ])}>
                        <Link href="info/budget" className={cn([
                            globalStyles['row-item'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration']
                        ])}>
                            <div>Taak 1</div>
                            <div className={cn([
                                globalStyles['global-photo-thumbnail-wrapper'],
                                globalStyles['global-margin-top-item']
                            ])}>
                                <img className={globalStyles['global-photo-thumbnail-wrapper__multiple']} src="../../../img/female3-80.jpg"/>
                                <img className={globalStyles['global-photo-thumbnail-wrapper__multiple']} src="../../../img/female3-80.jpg"/>
                                <img className={globalStyles['global-photo-thumbnail-wrapper__multiple']} src="../../../img/female3-80.jpg"/>
                            </div>
                        </Link>
                        <Link href="info/budget" className={cn([
                            globalStyles['row-item'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration']
                        ])}>
                            <div>Taak 2</div>
                            <div className={cn([
                                globalStyles['global-photo-thumbnail-wrapper'],
                                globalStyles['global-margin-top-item']
                            ])}>
                               <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                            </div>
                        </Link>
                        <Link href="info/budget" className={cn([
                            globalStyles['row-item'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration']
                        ])}>Taak 3</Link>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-margin-bottom'],
                    globalStyles['row-item-multilevel']
                ])}>
                    <div className={cn([
                        globalStyles['row-item-multilevel__parent'],
                        globalStyles['global-margin-bottom-item']
                    ])}>Project 2</div>
                    <div className={cn([
                        globalStyles['row-item-multilevel__children'],
                        globalStyles['global-indent']
                    ])}>
                        <Link href="info/budget" className={cn([
                            globalStyles['row-item'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration']
                        ])}>Taak 1</Link>
                        <Link href="info/budget" className={cn([
                            globalStyles['row-item'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration']
                        ])}>Taak 2</Link>
                        <Link href="info/budget" className={cn([
                            globalStyles['row-item'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration']
                        ])}>Taak 3</Link>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    <div></div>
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar Projecten
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Problems
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->problems
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Problems(){
        return (
            <>
                {
                    props.data.task_description != undefined
                    &&
                    <div className={globalStyles['bodysection-field']}>
                        <div className={globalStyles['bodysection-field__label']}>Taak</div>
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item']
                        ])}>{props.data.task_description}</div>
                    </div>
                }
                <div className={cn({
                    [globalStyles['bodysection-field']]:true,
                    [globalStyles['global-margin-top']]:props.data.task_description != undefined,
                })}>
                    <div className={globalStyles['bodysection-field__label']}>Prioriteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.priority}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Korte omschrijving</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.description}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Lange omschrijving</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.long_description}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Aangemeld door</div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Status</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.status}</div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    <div></div>
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar Probleem
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__Budget
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__Budget(){
        return (
            <>
                {
                    props.data.project != undefined
                    &&
                    <div className={globalStyles['bodysection-field']}>
                        <div className={globalStyles['bodysection-field__label']}>Project</div>
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item']
                        ])}>{props.data.project}</div>
                    </div>
                }
                {
                    (props.data.type != "budget_added" && props.data.type != "budget_deleted")
                    &&
                    <div className={cn({
                        [globalStyles['bodysection-field']]:true,
                        [globalStyles['global-margin-top']]:props.data.project != undefined
                    })}>
                        <div className={globalStyles['bodysection-field__label']}>Naam</div>
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item']
                        ])}>{props.data.budget_description}</div>
                    </div>
                }
                {
                    (props.data.type != "budget_added" && props.data.type != "budget_deleted" && props.data.team != undefined)
                    &&
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>Toegewezen team</div>
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item']
                        ])}>{props.data.team}</div>
                    </div>
                }
                {
                    (props.data.type == "budget_added" || props.data.type == "budget_deleted")
                    &&
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>
                            {
                                props.data.type == "budget_added"
                                &&
                                "Aangemaakt door"
                                ||
                                "Verwijderd door"
                            }
                        </div>
                        <div className={cn([
                            globalStyles['global-member-in-list'],
                            globalStyles['global-member-in-list__standard'],
                            globalStyles['global-text-align-start'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-backgroundcolor-item']
                        ])}>
                            <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                            <div>
                                <div>{props.data.member.name}</div>
                                <div className={cn(
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext']
                                )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                                {
                                    props.data.member.team != undefined
                                    &&
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext'],
                                        globalStyles['global-display-flex']
                                    ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                }
                            </div>
                        </div>
                    </div>
                }
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            {
                                props.data.type == "budget_almost_exhausted"
                                &&
                                <div>Het budget voor dit item is bijna op. Er nog maar <strong>{(100 - FUNC__CalculatePercentage(props.data.budget.used, props.data.budget.total))}% (€{props.data.budget.total - props.data.budget.used})</strong> van het toegewezen budget over.</div>
                            }
                            {
                                props.data.type == "budget_exceeded"
                                &&
                                <div>Het budget voor dit item is overschreden. Er is <strong>€{(props.data.budget.used - props.data.budget.total)}</strong> boven het toegewezen budget verbruikt.</div>
                            }
                            {
                                props.data.type == "budget_exhausted"
                                &&
                                <div>Het budget voor dit item is op.</div>
                            }
                            {
                                props.data.type == "budget_added"
                                &&
                                <div>Heeft een nieuw budget item aangemaakt.</div>
                            }
                            {
                                props.data.type == "budget_deleted"
                                &&
                                <div>Heeft dit budget item verwijderd.</div>
                            }
                            {
                                (props.data.type == "budget_added" || props.data.type == "budget_deleted")
                                &&
                                <div className={cn([
                                    globalStyles['global-indent'],
                                    globalStyles['global-margin-top']
                                ])}>
                                    <div className={globalStyles['global-fontweight-bold']}>Naam</div>
                                    <div className={cn([
                                        globalStyles['bodysection-field__non-input'],
                                        globalStyles['global-margin-top-item']
                                    ])}>{props.data.budget_description}</div>
                                </div>
                            }
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Toegewezen bedrag</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>€{props.data.budget.total}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Verbruikt</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>€{props.data.budget.used}</div>
                            </div>
                            {
                                ((props.data.type == "budget_added" || props.data.type == "budget_deleted") && props.data.team != undefined)
                                &&
                                <div className={cn([
                                    globalStyles['global-indent'],
                                    globalStyles['global-margin-top']
                                ])}>
                                    <div className={globalStyles['global-fontweight-bold']}>Toegewezen team</div>
                                    <div className={cn([
                                        globalStyles['bodysection-field__non-input'],
                                        globalStyles['global-margin-top-item']
                                    ])}>{props.data.team}</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {
                    props.data.type != "budget_deleted"
                    &&
                    <div className={cn([
                        globalStyles['global-grid-2'],
                        globalStyles['global-margin-top-x2'],
                        globalStyles['global-grid-gap-column'],
                        globalStyles['bodysection-buttons']
                    ])}>
                        {
                            props.data.showdeletebutton != undefined
                            &&
                            <Link href="info/budget" className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-button-back']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Melding verwijderen
                            </Link>
                            ||
                            <div></div>
                        }
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover'],
                            globalStyles['global-transition-duration']
                        ])}>
                            Ga naar item
                            <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        </Link>
                    </div>
                }
            </>
        )
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__FinishedATask
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__FinishedATask(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Fase</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.phase}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Taak</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.task_description}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Toegewezen medewerker(s)</div>
                    {props.data.members.map((member) => 
                        <div className={cn([
                            globalStyles['global-member-in-list'],
                            globalStyles['global-member-in-list__standard'],
                            globalStyles['global-text-align-start'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-backgroundcolor-item']
                        ])}>
                            <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                            <div>
                                <div>{member.name}</div>
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext']
                                ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                {
                                    member.team != undefined
                                    &&
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext'],
                                        globalStyles['global-display-flex']
                                    ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                }
                            </div>
                        </div>
                    )}
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        {
                            props.data.members.length == 1
                            &&
                            "Heeft deze taak voltooid."
                            ||
                            "Hebben deze taak voltooid."
                        }
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar taak
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__ReportedAProblem
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__ReportedAProblem(){
        return (
            <>
               <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                {
                    props.data.problem.asigned_to == "task"
                    &&
                    <>
                        <div className={cn([
                            globalStyles['bodysection-field'],
                            globalStyles['global-margin-top']
                        ])}>
                            <div className={globalStyles['bodysection-field__label']}>Fase</div>
                            <div className={cn([
                                globalStyles['bodysection-field__non-input'],
                                globalStyles['global-margin-top-item']
                            ])}>{props.data.phase}</div>
                        </div>
                        <div className={cn([
                            globalStyles['bodysection-field'],
                            globalStyles['global-margin-top']
                        ])}>
                            <div className={globalStyles['bodysection-field__label']}>Taak</div>
                            <div className={cn([
                                globalStyles['bodysection-field__non-input'],
                                globalStyles['global-margin-top-item']
                            ])}>{props.data.task_description}</div>
                        </div>
                    </>
                }
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Aangemeld door</div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>
                                {
                                    props.data.problem.asigned_to == "task"
                                    &&
                                    "Heeft voor deze taak een probleem aangemeld."
                                    ||
                                    "Heeft een probleem aangemeld."
                                }
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Prio</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.priority}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Korte omschrijving</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.description}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Lange omschrijving</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.long_description}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar probleem
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__ChangedProblemStatus
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__ChangedProblemStatus(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                {
                    props.data.problem.asigned_to == "task"
                    &&
                    <>
                        <div className={cn([
                            globalStyles['bodysection-field'],
                            globalStyles['global-margin-top']
                        ])}>
                            <div className={globalStyles['bodysection-field__label']}>Fase</div>
                            <div className={cn([
                                globalStyles['bodysection-field__non-input'],
                                globalStyles['global-margin-top-item']
                            ])}>{props.data.phase}</div>
                        </div>
                        <div className={cn([
                            globalStyles['bodysection-field'],
                            globalStyles['global-margin-top']
                        ])}>
                            <div className={globalStyles['bodysection-field__label']}>Taak</div>
                            <div className={cn([
                                globalStyles['bodysection-field__non-input'],
                                globalStyles['global-margin-top-item']
                            ])}>{props.data.task_description}</div>
                        </div>
                    </>
                }
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Veranderd door</div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>Heeft de status van dit probleem veranderd naar <strong>{props.data.problem.status}</strong>.</div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Prio</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.priority}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Korte omschrijving</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.description}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Lange omschrijving</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.long_description}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar probleem
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__DeletedAProblem
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__DeletedAProblem(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                {
                    props.data.problem.asigned_to == "task"
                    &&
                    <>
                        <div className={cn([
                            globalStyles['bodysection-field'],
                            globalStyles['global-margin-top']
                        ])}>
                            <div className={globalStyles['bodysection-field__label']}>Fase</div>
                            <div className={cn([
                                globalStyles['bodysection-field__non-input'],
                                globalStyles['global-margin-top-item']
                            ])}>{props.data.phase}</div>
                        </div>
                        <div className={cn([
                            globalStyles['bodysection-field'],
                            globalStyles['global-margin-top']
                        ])}>
                            <div className={globalStyles['bodysection-field__label']}>Taak</div>
                            <div className={cn([
                                globalStyles['bodysection-field__non-input'],
                                globalStyles['global-margin-top-item']
                            ])}>{props.data.task_description}</div>
                        </div>
                    </>
                }
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Verwijderd door</div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>
                                {
                                    props.data.problem.asigned_to == "task"
                                    &&
                                    "Heeft voor deze taak dit probleem verwijderd."
                                    ||
                                    "Heeft dit probleem verwijderd."
                                }
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Prio</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.priority}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Korte omschrijving</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.description}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Lange omschrijving</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.problem.long_description}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__CreatedAPhase
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__CreatedAPhase(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Aangemaakt door</div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>Heeft een nieuwe fase aangemaakt.</div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Naam</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.phase}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Startdatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.startdate}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Einddatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.enddate}</div>
                            </div>
                            {
                                props.data.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-indent'],
                                    globalStyles['global-margin-top']
                                ])}>
                                    <div className={globalStyles['global-fontweight-bold']}>Toegewezen team</div>
                                    <div className={cn([
                                        globalStyles['bodysection-field__non-input'],
                                        globalStyles['global-margin-top-item']
                                    ])}>{props.data.team}</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar fase
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__DeletedAPhase
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__DeletedAPhase(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Verwijderd door</div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>Heeft deze fase verwijderd.</div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Naam</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.phase}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Startdatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.startdate}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Einddatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.enddate}</div>
                            </div>
                            {
                                props.data.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-indent'],
                                    globalStyles['global-margin-top']
                                ])}>
                                    <div className={globalStyles['global-fontweight-bold']}>Toegewezen team</div>
                                    <div className={cn([
                                        globalStyles['bodysection-field__non-input'],
                                        globalStyles['global-margin-top-item']
                                    ])}>{props.data.team}</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__FinishedAPhase
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__FinishedAPhase(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Fase</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.phase}</div>
                </div>
                {
                    props.data.team != undefined
                    &&
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>Toegewezen team</div>
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item']
                        ])}>{props.data.team}</div>
                    </div>
                }
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>Deze fase is voltooid.</div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar fase
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__CreatedATask
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__CreatedATask(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Fase</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.phase}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Aangemaakt door</div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>Heeft een nieuwe taak aangemaakt.</div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Naam</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.task_description}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Startdatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.startdate}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Einddatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.enddate}</div>
                            </div>
                            {
                                props.data.asigned_to.length != 0
                                &&
                                <div className={cn([
                                    globalStyles['global-indent'],
                                    globalStyles['global-margin-top']
                                ])}>
                                    <div className={globalStyles['global-fontweight-bold']}>Toegewezen medewerker(s)</div>
                                    {props.data.asigned_to.map((member) => 
                                        <div className={cn([
                                            globalStyles['global-member-in-list'],
                                            globalStyles['global-member-in-list__standard'],
                                            globalStyles['global-text-align-start'],
                                            globalStyles['global-margin-top-item'],
                                            globalStyles['global-backgroundcolor-item']
                                        ])}>
                                            <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                            <div>
                                                <div>{member.name}</div>
                                                <div className={cn([
                                                    globalStyles['global-fontsize-subtext'],
                                                    globalStyles['global-margin-subtext']
                                                ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                                {
                                                    member.team != undefined
                                                    &&
                                                    <div className={cn([
                                                        globalStyles['global-fontsize-subtext'],
                                                        globalStyles['global-margin-subtext'],
                                                        globalStyles['global-display-flex']
                                                    ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar taak
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__DeletedATask
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__DeletedATask(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Fase</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.phase}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Verwijderd door</div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>Heeft deze taak verwijderd.</div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Naam</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.task_description}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Startdatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.startdate}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Einddatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.enddate}</div>
                            </div>
                            {
                                props.data.asigned_to.length != 0
                                &&
                                <div className={cn([
                                    globalStyles['global-indent'],
                                    globalStyles['global-margin-top']
                                ])}>
                                    <div className={globalStyles['global-fontweight-bold']}>Toegewezen medewerker(s)</div>
                                    {props.data.asigned_to.map((member) => 
                                        <div className={cn([
                                            globalStyles['global-member-in-list'],
                                            globalStyles['global-member-in-list__standard'],
                                            globalStyles['global-text-align-start'],
                                            globalStyles['global-margin-top-item'],
                                            globalStyles['global-backgroundcolor-item']
                                        ])}>
                                            <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                            <div>
                                                <div>{member.name}</div>
                                                <div className={cn([
                                                    globalStyles['global-fontsize-subtext'],
                                                    globalStyles['global-margin-subtext']
                                                ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                                {
                                                    member.team != undefined
                                                    &&
                                                    <div className={cn([
                                                        globalStyles['global-fontsize-subtext'],
                                                        globalStyles['global-margin-subtext'],
                                                        globalStyles['global-display-flex']
                                                    ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar taak
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__ChangedTaskStatus
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__ChangedTaskStatus(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Fase</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.phase}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Taak</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.task_description}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Toegewezen medewerker(s)</div>
                    {props.data.members.map((member) => 
                        <div className={cn([
                            globalStyles['global-member-in-list'],
                            globalStyles['global-member-in-list__standard'],
                            globalStyles['global-text-align-start'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-backgroundcolor-item']
                        ])}>
                            <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                            <div>
                                <div>{member.name}</div>
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext']
                                ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                {
                                    member.team != undefined
                                    &&
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext'],
                                        globalStyles['global-display-flex']
                                    ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                }
                            </div>
                        </div>
                    )}
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        {
                            props.data.members.length == 1
                            &&
                            <span>Heeft de status van deze taak veranderd naar <strong>{props.data.status}</strong>.</span>
                            ||
                            <span>Hebben de status van deze taak veranderd naar <strong>{props.data.status}</strong>.</span>
                        }
                    </div>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__Document
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__Document(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                {
                    props.data.phase != undefined
                    &&
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>Fase</div>
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item']
                        ])}>{props.data.phase}</div>
                    </div>
                }
                {
                    props.data.task_description != undefined
                    &&
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>Taak</div>
                        <div className={cn([
                            globalStyles['bodysection-field__non-input'],
                            globalStyles['global-margin-top-item']
                        ])}>{props.data.task_description}</div>
                    </div>
                }
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>
                        {
                            props.data.type == "document_added"
                            &&
                            "Toegevoegd door"
                            ||
                            "Verwijderd door"
                        }
                    </div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={globalStyles['global-margin-top-item']}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>
                                {
                                    (props.data.phase == undefined && props.data.task_description == undefined && props.data.type == "document_added")
                                    &&
                                    "Heeft een document toegevoegd."
                                }
                                {
                                    (props.data.phase == undefined && props.data.task_description == undefined && props.data.type == "document_deleted")
                                    &&
                                    "Heeft dit document verwijderd."
                                }
                                {
                                    (props.data.phase != undefined && props.data.task_description == undefined && props.data.type == "document_added")
                                    &&
                                    "Heeft voor deze fase een document toegevoegd."
                                }
                                {
                                    (props.data.phase != undefined && props.data.task_description == undefined && props.data.type == "document_deleted")
                                    &&
                                    "Heeft voor deze fase een document verwijderd."
                                }
                                {
                                    (props.data.phase != undefined && props.data.task_description != undefined && props.data.type == "document_added")
                                    &&
                                    "Heeft voor deze taak een document toegevoegd."
                                }
                                {
                                    (props.data.phase != undefined && props.data.task_description != undefined && props.data.type == "document_deleted")
                                    &&
                                    "Heeft voor deze taak een document verwijderd."
                                }
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Naam</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.document.name}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Omschrijving</div>
                                 <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.document.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    props.data.type == "document_added"
                    &&
                    <div className={cn([
                        globalStyles['global-grid-2'],
                        globalStyles['global-margin-top-x2'],
                        globalStyles['global-grid-gap-column'],
                        globalStyles['bodysection-buttons']
                    ])}>
                        {
                            props.data.showdeletebutton != undefined
                            &&
                            <Link href="info/budget" className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-button-back']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Melding verwijderen
                            </Link>
                            ||
                            <div></div>
                        }
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover'],
                            globalStyles['global-transition-duration']
                        ])}>
                            Ga naar document
                            <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        </Link>
                    </div>
                }
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__TaskOverdue
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__TaskOverdue(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Fase</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.phase}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Taak</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.task_description}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Toegewezen medewerker(s)</div>
                    {props.data.members.map((member) => 
                        <div className={cn([
                            globalStyles['global-member-in-list'],
                            globalStyles['global-member-in-list__standard'],
                            globalStyles['global-text-align-start'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-backgroundcolor-item']
                        ])}>
                            <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                            <div>
                                <div>{member.name}</div>
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext']
                                ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                {
                                    member.team != undefined
                                    &&
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext'],
                                        globalStyles['global-display-flex']
                                    ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                }
                            </div>
                        </div>
                    )}
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={globalStyles['global-margin-top-item']}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>
                                {
                                    props.data.members.length == 1
                                    &&
                                    "Is langer dan gepland bezig met deze taak."
                                    ||
                                    "Zijn langer dan gepland bezig met deze taak."
                                }
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Geplande einddatum</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.enddate}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Geplande eindtijd</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.endtime}</div>
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Dagen, uren en minuten overtijd</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{FUNC__CalculateTimeExceeded(props.data.enddate, props.data.endtime)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar taak
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__StuckWithTask
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__StuckWithTask(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.project}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Fase</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.phase}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Taak</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.task_description}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Toegewezen medewerker(s)</div>
                    {props.data.members.map((member) => 
                        <div className={cn([
                            globalStyles['global-member-in-list'],
                            globalStyles['global-member-in-list__standard'],
                            globalStyles['global-text-align-start'],
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-backgroundcolor-item']
                        ])}>
                            <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                            <div>
                                <div>{member.name}</div>
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext']
                                ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                {
                                    member.team != undefined
                                    &&
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext'],
                                        globalStyles['global-display-flex']
                                    ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                }
                            </div>
                        </div>
                    )}
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={globalStyles['global-margin-top-item']}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>
                                {
                                    props.data.members.length == 1
                                    &&
                                    "Is bij deze taak vastgelopen."
                                    ||
                                    "Zijn bij deze taak vastgelopen."
                                }
                            </div>
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>Opgegeven reden</div>
                                <div className={cn([
                                    globalStyles['bodysection-field__non-input'],
                                    globalStyles['global-margin-top-item']
                                ])}>{props.data.reason}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar taak
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__Team
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__Team(){
        return (
            <>
            {
                props.data.type == "team_deleted"
                &&
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Team</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.team}</div>
                </div>
            }
                <div className={cn({
                    [globalStyles['bodysection-field']]:true,
                    [globalStyles['global-margin-top']]:props.data.type == "team_deleted"
                })}>
                    <div className={globalStyles['bodysection-field__label']}>
                        {
                            props.data.type == "team_added"
                            &&
                            "Aangemaakt door"
                            ||
                            "Verwijderd door"
                        }
                    </div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            <div>
                                {
                                    props.data.type == "team_added"
                                    &&
                                    "Heeft een nieuw team aangemaakt."
                                    ||
                                    "Heeft dit team verwijderd."
                                }

                            </div>
                            {
                                props.data.type == "team_added"
                                &&
                                <>
                                    <div className={cn([
                                        globalStyles['global-indent'],
                                        globalStyles['global-margin-top']
                                    ])}>
                                        <div className={globalStyles['global-fontweight-bold']}>Naam</div>
                                        <div className={cn([
                                            globalStyles['bodysection-field__non-input'],
                                            globalStyles['global-margin-top-item']
                                        ])}>{props.data.team}</div>
                                    </div>
                                    <div className={cn([
                                        globalStyles['global-indent'],
                                        globalStyles['global-margin-top']
                                    ])}>
                                        <div className={globalStyles['global-fontweight-bold']}>Toegevoegde teamleden</div>
                                        {props.data.added_members.map((member) => 
                                            <div className={cn([
                                                globalStyles['global-member-in-list'],
                                                globalStyles['global-member-in-list__standard'],
                                                globalStyles['global-text-align-start'],
                                                globalStyles['global-margin-top-item'],
                                                globalStyles['global-backgroundcolor-item']
                                            ])}>
                                                <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                                <div>
                                                    <div>{member.name}</div>
                                                    <div className={cn([
                                                        globalStyles['global-fontsize-subtext'],
                                                        globalStyles['global-margin-subtext']
                                                    ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                                    {
                                                        member.team != undefined
                                                        &&
                                                        <div className={cn([
                                                            globalStyles['global-fontsize-subtext'],
                                                            globalStyles['global-margin-subtext'],
                                                            globalStyles['global-display-flex']
                                                        ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
                {
                    props.data.type == "team_added"
                    &&
                    <div className={cn([
                        globalStyles['global-grid-2'],
                        globalStyles['global-margin-top-x2'],
                        globalStyles['global-grid-gap-column'],
                        globalStyles['bodysection-buttons']
                    ])}>
                        {
                            props.data.showdeletebutton != undefined
                            &&
                            <Link href="info/budget" className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-button-back']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Melding verwijderen
                            </Link>
                            ||
                            <div></div>
                        }
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover'],
                            globalStyles['global-transition-duration']
                        ])}>
                            Ga naar team
                            <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        </Link>
                    </div>
                }
            </>
        )
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Dashboard__Activity__TeamMember
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->activities
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Dashboard__Activity__TeamMember(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Team</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.team}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>
                        {
                            props.data.type == "member_added_to_team"
                            &&
                            "Toegevoegd door"
                            ||
                            "Verwijderd door"
                        }
                    </div>
                    <div className={cn([
                        globalStyles['global-member-in-list'],
                        globalStyles['global-member-in-list__standard'],
                        globalStyles['global-text-align-start'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-backgroundcolor-item']
                    ])}>
                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                        <div>
                            <div>{props.data.member.name}</div>
                            <div className={cn(
                                globalStyles['global-fontsize-subtext'],
                                globalStyles['global-margin-subtext']
                            )}>{props.data.member.role} { props.data.member.label != undefined && props.data.member.label != "" && " ("+props.data.member.label+")"}</div>
                            {
                                props.data.member.team != undefined
                                &&
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext'],
                                    globalStyles['global-display-flex']
                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Wanneer</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item']
                    ])}>{props.data.date}</div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Activiteit</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <div className={globalStyles['input-wrapper']}>
                            {
                                props.data.type == "member_added_to_team"
                                &&
                                <div>Heeft {props.data.added_members.length} {(props.data.added_members.length == 1)?"teamlid":"teamleden"} toegevoegd aan dit team.</div>
                                ||
                                <div>Heeft {props.data.deleted_members.length} {(props.data.deleted_members.length == 1)?"teamlid":"teamleden"} verwijderd uit dit team.</div>
                            }
                            <div className={cn([
                                globalStyles['global-indent'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div className={globalStyles['global-fontweight-bold']}>
                                    {
                                        props.data.type == "member_added_to_team"
                                        &&
                                        "Toegevoegde teamleden"
                                        ||
                                        "Verwijderde teamleden"
                                    }
                                </div>
                                {props.data[(props.data.type == "member_added_to_team")?'added_members':'deleted_members'].map((member) => 
                                    <div className={cn([
                                        globalStyles['global-member-in-list'],
                                        globalStyles['global-member-in-list__standard'],
                                        globalStyles['global-text-align-start'],
                                        globalStyles['global-margin-top-item'],
                                        globalStyles['global-backgroundcolor-item']
                                    ])}>
                                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                        <div>
                                            <div>{member.name}</div>
                                            <div className={cn([
                                                globalStyles['global-fontsize-subtext'],
                                                globalStyles['global-margin-subtext']
                                            ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                            {
                                                member.team != undefined
                                                &&
                                                <div className={cn([
                                                    globalStyles['global-fontsize-subtext'],
                                                    globalStyles['global-margin-subtext'],
                                                    globalStyles['global-display-flex']
                                                ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    {
                        props.data.showdeletebutton != undefined
                        &&
                        <Link href="info/budget" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-button-back']
                        ])}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Melding verwijderen
                        </Link>
                        ||
                        <div></div>
                    }
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar team
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
        )
    }
    /*
    *
    *
    * 
    * 
        REF:VIEW__blueprint_with_inputs
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
    *
    *
    * 
    * 
    */
    function VIEW__blueprint_with_inputs(){
        return (
            <>
                <div className={globalStyles['bodysection-field']}>
                    <div className={globalStyles['bodysection-field__label']}>Project</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <input className={globalStyles['global-transition-duration']} type="text" defaultValue={props.data.project} />
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Taaknaam</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <input className={globalStyles['global-transition-duration']} type="text" defaultValue={props.data.description} />
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Taakomschrijving</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <textarea className={globalStyles['global-transition-duration']} defaultValue={props.data.long_description}></textarea>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Toegewezen aan</div>
                    {props.data.members.map((member) => 
                        <div className={cn([
                            globalStyles['bodysection-field__list-item-grid'],
                            globalStyles['global-margin-top-item']
                        ])}>
                            <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                            <div>
                                <div>{member.name}</div>
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['global-margin-subtext']
                                ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                {
                                    member.team != undefined
                                    &&
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext'],
                                        globalStyles['global-display-flex']
                                    ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                }
                            </div>
                            <div className={cn([
                                globalStyles['list-item-grid-delete'],
                                globalStyles['global-transition-duration']
                            ])}>
                                <i className={globalStyles['list-item-grid-delete__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: "1vw", widfth: "1vw"})}}></i>
                            </div>
                        </div>
                    )}
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Locatie</div>
                    <div className={cn([
                        globalStyles['bodysection-field__location'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <i className={globalStyles['list-item-grid-delete__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['map-pin'].toSvg({height: "1vw", widfth: "1vw"})}}></i>
                        <div>
                            <div>
                                <input className={globalStyles['global-transition-duration']} type="text" defaultValue={props.data.location.street_and_number} />
                            </div>
                            <div className={globalStyles['global-margin-top-item']}>
                                <input className={globalStyles['global-transition-duration']} type="text" defaultValue={props.data.location.zipcode_and_city} />
                            </div>
                        </div> 
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Starttijd</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <input className={globalStyles['global-transition-duration']} type="time" defaultValue={props.data.starttime} />
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Eindtijd</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <input className={globalStyles['global-transition-duration']} type="time" defaultValue={props.data.endtime} />
                    </div>
                </div>
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Status</div>
                    <div className={cn([
                        globalStyles['bodysection-field__input'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <select className={globalStyles['global-transition-duration']} type="text" defaultValue={props.data.status}>
                            <option value="value">Open</option>
                            <option value="value">Nu bezig</option>
                            <option value="value">Te laat</option>
                            <option value="value">Vastgelopen</option>
                            <option value="value">Voltooid</option>
                        </select>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-gap-column'],
                    globalStyles['bodysection-buttons']
                ])}>
                    <button className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        Opslaan
                    </button>
                    <Link href="info/budget" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])}>
                        Ga naar Planning
                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    </Link>
                </div>
            </>
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
        <div className={globalStyles['content-inner__bodysection']}>
            {
                props.view == "VIEW__Manager__Dashboard__Task"
                &&
                <VIEW__Manager__Dashboard__Task />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Projects"
                &&
                <VIEW__Manager__Dashboard__Projects />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Tasks"
                &&
                <VIEW__Manager__Dashboard__Tasks />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Problems"
                &&
                <VIEW__Manager__Dashboard__Problems />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__Budget"
                &&
                <VIEW__Manager__Dashboard__Activity__Budget />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__FinishedATask"
                &&
                <VIEW__Manager__Dashboard__Activity__FinishedATask />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__ReportedAProblem"
                &&
                <VIEW__Manager__Dashboard__Activity__ReportedAProblem />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__ChangedProblemStatus"
                &&
                <VIEW__Manager__Dashboard__Activity__ChangedProblemStatus />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__DeletedAProblem"
                &&
                <VIEW__Manager__Dashboard__Activity__DeletedAProblem />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__CreatedAPhase"
                &&
                <VIEW__Manager__Dashboard__Activity__CreatedAPhase />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__DeletedAPhase"
                &&
                <VIEW__Manager__Dashboard__Activity__DeletedAPhase />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__FinishedAPhase"
                &&
                <VIEW__Manager__Dashboard__Activity__FinishedAPhase />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__CreatedATask"
                &&
                <VIEW__Manager__Dashboard__Activity__CreatedATask />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__DeletedATask"
                &&
                <VIEW__Manager__Dashboard__Activity__DeletedATask />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__ChangedTaskStatus"
                &&
                <VIEW__Manager__Dashboard__Activity__ChangedTaskStatus />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__Document"
                &&
                <VIEW__Manager__Dashboard__Activity__Document />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__TaskOverdue"
                &&
                <VIEW__Manager__Dashboard__Activity__TaskOverdue />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__StuckWithTask"
                &&
                <VIEW__Manager__Dashboard__Activity__StuckWithTask />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__Team"
                &&
                <VIEW__Manager__Dashboard__Activity__Team />
            }
            {
                props.view == "VIEW__Manager__Dashboard__Activity__TeamMember"
                &&
                <VIEW__Manager__Dashboard__Activity__TeamMember />
            }
        </div>
    );
}
export default SidebarComponentDashboardPage;