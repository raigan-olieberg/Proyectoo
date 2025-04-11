// React / NextJs components
import cn from 'classnames';
import { useContext } from 'react';
// Global / Page / Layout components
import UserComponentInsideList from '../../../components/Global/Resources/User/InsideList';
import { 
    FUNC__TranslateProblemsStatus,
    FUNC__TranslateProblemsPriority,
    FUNC__EditOverviewProblem,
} from './Controller';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
import { GLOBALFUNC__TimeAgo } from '../../../helpers/GlobalFunctions';
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import AppContext from '../../../helpers/AppContext';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const VIEW__SectionOverview = (props) => {
    const appContext = useContext(AppContext);
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
    return(
        <div className={globalStyles['content-body-with-header__body']}>
            {/* Content */}
            {
                props.dataHasLoaded
                && props.problemsObject.length > 0
                &&
                props.problemsObject.map(item => (
                    <button 
                        key={item.problem_id} 
                        className={cn({
                            [globalStyles['global-item']]:true,
                            [globalStyles['global-item__standard-grid']]:true,
                            [globalStyles['global-hover-standard']]:true,
                            [globalStyles['global-margin-bottom-item']]:true,
                            [globalStyles['global-transition-duration']]:true,
                            [globalStyles['global-grid-7']]:true,
                            [globalStyles['global-side-selected-item']]:appContext.globalContext.sidebar.show == 1 && appContext.globalContext.sidebar.selectedItemID == item.problem_id,
                    })} onClick={() => FUNC__EditOverviewProblem(
                            appContext,
                            props.problemsObject,
                            props.setProblemsObject,
                            item
                        )}>  
                        <UserComponentInsideList
                            user={item.resource[0]}/>
                        <div className={cn({
                            [globalStyles['global-status']]:true,
                            [globalStyles['global-backgroundcolor-red']]:item.priority == 'high',
                            [globalStyles['global-backgroundcolor-orange']]:item.priority == 'medium',
                            [globalStyles['global-backgroundcolor-yellow']]:item.priority == 'low'
                        })}>{FUNC__TranslateProblemsPriority(item.priority)}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.short_description}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.project}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>
                            {
                                item.related_component_type == 'project'
                                &&
                                'Project'
                            }
                            {
                                item.related_component_type == 'phase'
                                &&
                                <span>Fase: {item.phase}</span>
                            }
                            {
                                item.related_component_type == 'task'
                                &&
                                /*<div className={globalStyles['global-display-flex']}>
                                    <span>{item.phase}</span>
                                    <i dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", with: "1vw"})}}></i>
                                    <span>{item.task}</span>
                                </div>*/
                                <span>Taak: {item.task}</span>
                            }
                        </div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{GLOBALFUNC__TimeAgo(
                                new Date(item.date_added.seconds * 1000), 
                                true,
                                true
                            )}</div>
                        <div className={cn({
                            [globalStyles['global-status']]:true,
                            [globalStyles['global-backgroundcolor-blue']]:item.status == 'open',
                            [globalStyles['global-backgroundcolor-purple']]:item.status == 'in_progress',
                            [globalStyles['global-backgroundcolor-lightgreen']]:item.status == 'resolved'
                        })}>{FUNC__TranslateProblemsStatus(item.status)}</div>
                    </button>
                ))
            }

            {/* Empty message */}
            {
                props.dataHasLoaded
                && props.problemsObject.length == 0
                &&
                <GlobalComponentDynamicMessage
                    showTitle={true}
                    message={"Er zijn voor de geselecteerde filters geen gewerkte uren gevonden."}/>
            }

            {/* Loader */}
            {
                !props.dataHasLoaded
                &&
                <GlobalComponentLoadingData
                    type={'firstTimeLoading'}/>
            }

            {/* Infinite scroll loader */}
            {
                props.dataHasLoaded
                && props.problemsObject.length > 0
                && props.lastVisible != 'end_has_been_reached'
                &&
                <div ref={props.loadingMoreData} className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }
        </div>
    );
}
export default VIEW__SectionOverview;