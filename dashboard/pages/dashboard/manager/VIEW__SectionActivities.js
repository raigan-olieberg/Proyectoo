// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import { 
    GLOBALFUNC__TimeAgo,
    GLOBALFUNC__ActivityBody,
    GLOBALFUNC__ActivityType
 } from '../../../helpers/GlobalFunctions';
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const VIEW__Activities = (props) => {
    return (
        <div className={cn([
            globalStyles['dashboardview__right'],
            globalStyles['dashboardview-content-with-subheader']
        ])}>
            {/* Header */}
            <div className={globalStyles['dashboardview-content__header']}>
                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['bell'].toSvg({height: '1vw', width: '1vw'})}}></i>
                Activiteiten van vandaag
            </div>

            {/* Subheader */}
            {
                props.activitiesObjectHasLoaded
                && props.activitiesObject != null
                &&
                <div className={cn([
                    globalStyles['dashboardview-content__subheader'],
                    globalStyles['global-grid-4']
                ])}>
                    <div className={globalStyles['subheader-item']}>
                    <div className={cn([
                            globalStyles['subheader-item__indicator'],
                            globalStyles['global-backgroundcolor-yellow']
                        ])}></div>
                        <div className={globalStyles['global-fontsize-subtext']}>Opgelet</div>
                    </div>
                    <div className={globalStyles['subheader-item']}>
                    <div className={cn([
                            globalStyles['subheader-item__indicator'],
                            globalStyles['global-backgroundcolor-orange']
                        ])}></div>
                        <div className={globalStyles['global-fontsize-subtext']}>Risico</div>
                    </div>
                    <div className={globalStyles['subheader-item']}>
                    <div className={cn([
                            globalStyles['subheader-item__indicator'],
                            globalStyles['global-backgroundcolor-red']
                        ])}></div>
                        <div className={globalStyles['global-fontsize-subtext']}>Kritiek</div>
                    </div>
                    <div className={globalStyles['subheader-item']}>
                        <div className={cn([
                            globalStyles['subheader-item__indicator'],
                            globalStyles['global-backgroundcolor-lightgreen']
                        ])}></div>
                        <div className={globalStyles['global-fontsize-subtext']}>Voltooid</div>
                    </div>
                </div>
            }

            {/* Content */}
            <div className={globalStyles['dashboardview-content__content']}>
                {
                    props.activitiesObjectHasLoaded
                    && props.activitiesObject != null
                    &&
                    <div className={cn([
                        globalStyles['content-wrapper'],
                        globalStyles['content-wrapper__activities']
                    ])}>
                        {props.activitiesObject.map((activity, index) => (
                            <button key={activity.activity_id} className={cn({
                                [globalStyles['global-item']]:true,
                                [globalStyles['global-hover-standard']]:true,
                                [globalStyles['global-margin-bottom-item']]:true,
                                [globalStyles['global-transition-duration']]:true,
                                [globalStyles['activities-alert-orange']]:activity.activity == "task_overdue" || activity.activity == "budget_almost_exhausted",
                                [globalStyles['activities-alert-red']]:activity.activity == "task_stuck" || activity.activity == "budget_exceeded" || activity.activity == "budget_exhausted",
                                [globalStyles['activities-alert-yellow']]:activity.activity == "problem_added",
                                [globalStyles['activities-alert-green']]:activity.activity == "task_completed" || activity.activity == "phase_completed",
                                [globalStyles['global-side-selected-item']]:props.sidebar.show == 1 && props.sidebar.selectedItemID == activity.key,
                                [globalStyles['global-margin-top']]:props.sidebar.show == 1 && props.sidebar.selectedItemID == activity.key && index == 0
                            })} onClick={() => FUNC__SelectItemForSidebar(activity.key, "left", {page: "dashboard/manager", title: "Activiteit inzien", view: GLOBALFUNC__ActivityType(activity.activity), data: activity})}>
                                <div className={cn([
                                    globalStyles['global-fontsize-subtext'],
                                    globalStyles['activities-time'],
                                    globalStyles['global-text-align-end']
                                ])}>{GLOBALFUNC__TimeAgo(new Date(activity.date_created.seconds * 1000))}</div>
                                <div className={cn([
                                    globalStyles['activities-body'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    {
                                        activity.member != undefined
                                        &&
                                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                    }
                                    {
                                        (activity.users != undefined && activity.users.length == 1)
                                        &&
                                        <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                    }
                                    {
                                        (activity.users != undefined && activity.users.length > 1)
                                        &&
                                        <i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '1.6vw', width: '1.6vw'})}}></i>
                                    }
                                    {
                                        (activity.member == undefined && activity.users == undefined && activity.activity == "phase_completed")
                                        &&
                                        <i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['clipboard'].toSvg({height: '1.6vw', width: '1.6vw'})}}></i>
                                    }
                                    <div>
                                        <div dangerouslySetInnerHTML={{__html: GLOBALFUNC__ActivityBody(activity)}}></div>
                                        {    
                                            activity.project != undefined
                                            &&    
                                            <div className={cn([
                                                globalStyles['global-margin-top-item'],
                                                globalStyles['global-display-flex'],
                                            ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['folder'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{activity.project}</div>
                                        }
                                    </div>       
                                </div>   
                            </button>
                        ))}
                    </div>    
                }

                {/* Empty message */}
                {
                    props.activitiesObjectHasLoaded
                    && props.activitiesObject == null
                    &&
                    <GlobalComponentDynamicMessage
                        showTitle={true}
                        message={"Hier komen realtime updates van activiteiten en acties binnen jouw workspace."}/>
                }
            </div>

            {/* Loader */}
            {
                !props.activitiesObjectHasLoaded
                &&
                <GlobalComponentLoadingData
                    type={'firstTimeLoading'}/>
            }
        </div>
    );
};
VIEW__Activities.getLayout = (page) => {
    return (
        <LayoutComponentLoggedinPage>{page}</LayoutComponentLoggedinPage>
    );
};

export default VIEW__Activities;