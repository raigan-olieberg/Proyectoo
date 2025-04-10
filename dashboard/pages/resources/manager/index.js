// React / NextJs components
import cn from 'classnames';
import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import AppContext from '../../../helpers/AppContext';
import { 
    FUNC__GetUsers,
    FUNC__CreateResource,
    FUNC__LoadMoreUsers
} from './Controller.js';
import VIEW__SectionOverview__Header from './VIEW__SectionOverview__Header.js';
import VIEW__SectionOverview from './VIEW__SectionOverview.js';
import VIEW__SectionLeaveOfAbsence__Header from './VIEW__SectionLeaveOfAbsence__Header.js';
import PopupComponentConfirm from '../../../components/Global/Sidebar/Popup/Confirm.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


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
    const [overviewDataHasLoaded, setOverviewDataHasLoaded] = useState(false);
    const [currentlyLoadingMoreOverviewData, setCurrentlyLoadingMoreOverviewData] = useState(false);
    const {ref: loadingMoreOverviewData, inView} = useInView();
    const [resourcesObject, setResourcesObject] = useState([]);
    const [overviewLastVisible, setOverviewLastVisible] = useState(null);
    const [overviewKeyFilter, setOverviewKeyFilter] = useState({
        key: 'show_all',
        value: ''
    });
    const [leaveOfAbsenceKeyFilter, setLeaveOfAbsenceKeyFilter] = useState({
        key: 'show_all',
        value: ''
    });
    useEffect(() => {
        let oldLastVisible = overviewLastVisible;
        if(overviewLastVisible != null){
            setOverviewLastVisible(null);
            oldLastVisible = null;
        }
        if(overviewDataHasLoaded){
            setOverviewDataHasLoaded(false);
        }
        FUNC__GetUsers(
            appContext.globalContext.authenticate.user.organization_id,
            setResourcesObject,
            setOverviewDataHasLoaded,
            overviewKeyFilter,
            oldLastVisible,
            setOverviewLastVisible,
            appContext.globalContext.authenticate.user.user_id,
            appContext.globalContext.authenticate.user.role
        );
    },[overviewKeyFilter]);
    useEffect(() => {
        const action = searchParams.get('action');
        switch(action){
            case "create-user":
                FUNC__CreateResource(
                    appContext,
                    resourcesObject,
                    setResourcesObject
                )
                router.replace('', undefined, { shallow: true });
                break;
        }
    },[searchParams]);
    useEffect(() => {
        if (inView) {
            if(overviewDataHasLoaded
                && !currentlyLoadingMoreOverviewData){
                setCurrentlyLoadingMoreOverviewData(true);
                FUNC__LoadMoreUsers(
                    setCurrentlyLoadingMoreOverviewData,
                    appContext.globalContext.authenticate.user.organization_id,
                    resourcesObject,
                    setResourcesObject,
                    overviewKeyFilter,
                    overviewLastVisible,
                    setOverviewLastVisible,
                    appContext.globalContext.authenticate.user.user_id,
                    appContext.globalContext.authenticate.user.role
                );
            }
        }
    }, [inView]);
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
                        <VIEW__SectionOverview__Header 
                            resourcesObject={resourcesObject}
                            setResourcesObject={setResourcesObject}
                            keyFilter={overviewKeyFilter}
                            setKeyFilter={setOverviewKeyFilter}/>
                        <VIEW__SectionOverview 
                            resourcesObject={resourcesObject}
                            setResourcesObject={setResourcesObject}
                            loadingMoreData={loadingMoreOverviewData}
                            dataHasLoaded={overviewDataHasLoaded}
                            keyFilter={overviewKeyFilter}
                            lastVisible={overviewLastVisible}
                            setLastVisible={setOverviewLastVisible}/>
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