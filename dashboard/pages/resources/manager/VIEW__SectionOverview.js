// React / NextJs component
import cn from 'classnames';
import { useContext } from 'react';
// Global / Page / Layout components
import UserComponentInsideList from '../../../components/Global/Resources/User/InsideList';
import {
    GLOBALFUNC__TranslateUserStatus,
    GLOBALFUNC__TranslateUserRole
} from '../../../helpers/GlobalFunctions';
import { 
    FUNC__EditResource
} from './Controller';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
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
                && props.resourcesObject.length > 0
                &&
                props.resourcesObject.map((item, index) => (
                    <button 
                        key={item.user_id} 
                        className={cn({
                            [globalStyles['global-item']]:true,
                            [globalStyles['global-item__standard-grid']]:true,
                            [globalStyles['global-hover-standard']]:true,
                            [globalStyles['global-margin-bottom-item']]:true,
                            [globalStyles['global-transition-duration']]:true,
                            [globalStyles['global-side-selected-item']]:appContext.globalContext.sidebar.show == 1 && appContext.globalContext.sidebar.selectedItemID == item.user_id,
                            [globalStyles['global-grid-7']]:appContext.globalContext.authenticate.user.role == 'Admin',
                            [globalStyles['global-grid-5']]:appContext.globalContext.authenticate.user.role != 'Admin'
                    })} onClick={() => FUNC__EditResource(
                            appContext,
                            props.resourcesObject,
                            props.setResourcesObject,
                            item
                        )}>  
                        <UserComponentInsideList
                            user={item}/>
                        {
                            appContext.globalContext.authenticate.user.role == 'Admin'
                            &&
                            <>
                                {
                                    item.manager != null
                                    &&
                                    <UserComponentInsideList
                                        user={item.manager[0]}/>
                                    ||
                                    <div className={globalStyles['global-text-align-start']}>n.v.t.</div>
                                }
                                {
                                    item.role == 'Admin'
                                    &&
                                    <div className={cn([
                                        globalStyles['item'],
                                        globalStyles['global-display-flex-center'],
                                        globalStyles['global-text-align-center']
                                    ])}>{item.resources_under_management}</div>
                                    ||
                                    <div className={cn([
                                        globalStyles['item'],
                                        globalStyles['global-display-flex-center'],
                                        globalStyles['global-text-align-center']
                                    ])}>n.v.t.</div>
                                }
                            </>
                        }
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.email}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.phonenumber != '' ? item.phonenumber : '-'}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{GLOBALFUNC__TranslateUserRole(item.role)}</div>
                        <div className={cn({
                            [globalStyles['global-status']]:true,
                            [globalStyles['global-backgroundcolor-lightslategrey']]:item.status == 'Leave_of_absence',
                            [globalStyles['global-backgroundcolor-red']]:item.status  == 'Inactive',
                            [globalStyles['global-backgroundcolor-orange']]:item.status == 'Sick',
                            [globalStyles['global-backgroundcolor-lightgreen']]:item.status == 'Active'
                        })}>{GLOBALFUNC__TranslateUserStatus(item.status)}</div>
                    </button>
                ))
            }

            {/* Empty message */}
            {
                props.dataHasLoaded
                && props.resourcesObject.length == 0
                &&
                <GlobalComponentDynamicMessage
                    showTitle={true}
                    message={"Er zijn voor de geselecteerde filters geen gebruikers gevonden."}/>
            }

            {/* Loaders */}
            {
                !props.dataHasLoaded
                &&
                <GlobalComponentLoadingData
                    type={'firstTimeLoading'}/>
            }
            {/*
                props.dataHasLoaded
                && !props.loadingMoreData
                && props.lastVisible != null
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadMoreButton 
                        value={'resources'}
                        FUNC__LoadMoreData={FUNC__LoadMoreUsers}
                        params={[
                            props.setLoadingMoreData,
                            appContext.globalContext.authenticate.user.organization_id,
                            props.resourcesObject,
                            props.setResourcesObject,
                            props.keyFilter,
                            props.lastVisible,
                            props.setLastVisible,
                            appContext.globalContext.authenticate.user.user_id,
                            appContext.globalContext.authenticate.user.role
                        ]}/>
                </div>
            */}
            {/*
                props.loadingMoreData
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            */}
            {
                props.dataHasLoaded
                && props.resourcesObject.length > 0
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