// React / NextJs components
import cn from 'classnames';
import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import AppContext from '../../../helpers/AppContext';
import { 
    FUNC__GetResourcesWorkedHoursAnalytics,
    FUNC__GetResourcesWorkedHours
} from './Controller.js';
import VIEW__SectionOverview__Header from './VIEW__SectionOverview__Header.js';
import VIEW__SectionAnalytics__Header from './VIEW__SectionAnalytics__Header.js';
import VIEW__SectionOverview from './VIEW__SectionOverview.js';
import VIEW__SectionAnalytics from './VIEW__SectionAnalytics.js';
import PopupComponentConfirm from '../../../components/Global/Sidebar/Popup/Confirm.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';;


const Index = () => {
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
    
        VIEWS
            -> REF:VIEW__SectionTasks
            -> REF:VIEW__ProjectsAndTasks
            -> REF:VIEW__Problems
            -> REF:VIEW__Activities
            -> REF:generated view
        FUNCTIONS
            -> REF:FUNC__SelectItemForSidebar
            -> REF:FUNC__ActivityType
            -> REF:FUNC__ActivityBody

    */
    const appContext = useContext(AppContext);
    const searchParams = useSearchParams();
    const router = useRouter();
    const sortFilterkey = searchParams.get('filterkey');
    const sortFiltervalue = searchParams.get('filtervalue');
    const [currentView, setCurrentView] = useState('overview');
    const [dataHasLoaded, setDataHasLoaded] = useState(false);
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    const [resourcesWorkedHoursObject, setResourcesWorkedHoursObject] = useState([]);
    const [resourcesWorkedHoursAnalyticsObject, setResourcesWorkedHoursAnalyticsObject] = useState([]);
    const [organizationWorkedHoursAnalyticsObject, setOrganizationWorkedHoursAnalyticsObject] = useState(null);
    const [showAnalyticsGraph, setShowAnalyticsGraph] = useState(true)
    const dateToday = new Date();
    const [lastVisible, setLastVisible] = useState(null);
    const currentYear = dateToday.getFullYear();
    const currentMonth = dateToday.getMonth();
    const [keyFilter, setKeyFilter] = useState({
        key: 'monthsview',
        value: currentMonth
    });
    const [overviewSortFilter, setOverviewSortFilter] = useState({
        key: 'show_all',
        value: ''
    });
    useEffect(() => {
        if(dataHasLoaded){
            setDataHasLoaded(false);
        }
        let oldLastVisible = lastVisible;
        if(lastVisible != null){
            setLastVisible(null);
            oldLastVisible = null;
        }
        if(currentView == 'analytics'){
            FUNC__GetResourcesWorkedHoursAnalytics(
                appContext.globalContext.authenticate.user.organization_id,
                setResourcesWorkedHoursAnalyticsObject,
                setOrganizationWorkedHoursAnalyticsObject,
                setDataHasLoaded,
                currentYear,
                oldLastVisible,
                setLastVisible,
                keyFilter,
                appContext.globalContext.authenticate.user.user_id,
                appContext.globalContext.authenticate.user.role
            );
        } else {
            FUNC__GetResourcesWorkedHours(
                appContext.globalContext.authenticate.user.organization_id,
                setResourcesWorkedHoursObject,
                setDataHasLoaded,
                keyFilter,
                currentYear,
                overviewSortFilter,
                oldLastVisible,
                setLastVisible,
                appContext.globalContext.authenticate.user.user_id,
                appContext.globalContext.authenticate.user.role
            );
        }
    },[currentView, keyFilter, overviewSortFilter]);
    useEffect(() => {
        if(dataHasLoaded){
            setDataHasLoaded(false);
        }
        let oldLastVisible = lastVisible;
        if(lastVisible != null){
            setLastVisible(null);
            oldLastVisible = null;
        }
        if(sortFilterkey != null
            && sortFiltervalue != null){
            setCurrentView('overview');
            setOverviewSortFilter({
                key: sortFilterkey,
                value: sortFiltervalue
            });
            FUNC__GetResourcesWorkedHours(
                appContext.globalContext.authenticate.user.organization_id,
                setResourcesWorkedHoursObject,
                setDataHasLoaded,
                keyFilter,
                currentYear,
                {
                    key: sortFilterkey,
                    value: sortFiltervalue
                },
                oldLastVisible,
                setLastVisible,
                appContext.globalContext.authenticate.user.user_id,
                appContext.globalContext.authenticate.user.role
            );
            router.replace('', undefined, { shallow: true });
        }
    },[searchParams]);
    /*
    *
    *
    * 
    * 
        REF:generated view
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The generated view for this page
    *
    *
    * 
    * 
    */
    return (
        <>
            <section className={globalStyles['global-container']}>
                <div className={globalStyles['global-container__content']}>
                    <div className={cn([
                        globalStyles['global-border-column'],
                        globalStyles['global-border-radius'],
                        globalStyles['content-body-with-header']
                    ])}>
                        {
                            currentView == 'overview'
                            &&
                            <>
                                <VIEW__SectionOverview__Header
                                    currentView={currentView}
                                    setCurrentView={setCurrentView}
                                    appContext={appContext}
                                    keyFilter={keyFilter}
                                    setKeyFilter={setKeyFilter}
                                    overviewSortFilter={overviewSortFilter}
                                    setOverviewSortFilter={setOverviewSortFilter}
                                    dataHasLoaded={dataHasLoaded}/>
                                <VIEW__SectionOverview
                                    currentView={currentView}
                                    setCurrentView={setCurrentView}
                                    resourcesWorkedHoursObject={resourcesWorkedHoursObject}
                                    setResourcesWorkedHoursObject={setResourcesWorkedHoursObject}
                                    appContext={appContext}
                                    keyFilter={keyFilter}
                                    currentYear={currentYear}
                                    overviewSortFilter={overviewSortFilter}
                                    dataHasLoaded={dataHasLoaded}
                                    lastVisible={lastVisible}
                                    setLastVisible={setLastVisible}
                                    loadingMoreData={loadingMoreData}
                                    setLoadingMoreData={setLoadingMoreData}/>
                            </>
                        }
                        {
                            currentView == 'analytics'
                            &&
                            <>
                                <VIEW__SectionAnalytics__Header
                                    currentView={currentView}
                                    setCurrentView={setCurrentView}
                                    appContext={appContext}
                                    keyFilter={keyFilter}
                                    setKeyFilter={setKeyFilter}
                                    dataHasLoaded={dataHasLoaded}
                                    organizationWorkedHoursAnalyticsObject={organizationWorkedHoursAnalyticsObject}
                                    showAnalyticsGraph={showAnalyticsGraph}
                                    setShowAnalyticsGraph={setShowAnalyticsGraph}/>
                                <VIEW__SectionAnalytics
                                    resourcesWorkedHoursAnalyticsObject={resourcesWorkedHoursAnalyticsObject}
                                    setResourcesWorkedHoursAnalyticsObject={setResourcesWorkedHoursAnalyticsObject}
                                    currentYear={currentYear}
                                    appContext={appContext}
                                    keyFilter={keyFilter}
                                    dataHasLoaded={dataHasLoaded}
                                    lastVisible={lastVisible}
                                    setLastVisible={setLastVisible}
                                    setLoadingMoreData={setLoadingMoreData}/>
                            </>
                        }
                    </div>
                </div>
            </section> 
            {
                appContext.globalContext.popup.show
                &&
                <PopupComponentConfirm 
                    appContext={appContext}/> 
            }
        </>
    );
};
Index.getLayout = (page) => {
    return (
        <LayoutComponentLoggedinPage>{page}</LayoutComponentLoggedinPage>
    );
};

export default Index;