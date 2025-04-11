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
    FUNC__GetTasks,
    FUNC__LoadMoreTasksData
} from './Controller.js';
import VIEW__SectionOverview__Header from './VIEW__SectionOverview__Header.js';
import VIEW__SectionOverview from './VIEW__SectionOverview.js';
import PopupComponentConfirm from '../../../components/Global/Sidebar/Popup/Confirm.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';;


const Index = () => {
    const appContext = useContext(AppContext);
    const searchParams = useSearchParams();
    const sortFilterkey = searchParams.get('filterkey');
    const sortFiltervalue = searchParams.get('filtervalue');
    const router = useRouter();
    const dateToday = new Date();
    const [overviewDataHasLoaded, setOverviewDataHasLoaded] = useState(false);
    const [currentlyLoadingMoreOverviewData, setCurrentlyLoadingMoreOverviewData] = useState(false);
    const {ref: loadingMoreOverviewData, inView} = useInView();
    const [tasksObject, setTasksObject] = useState([]);
    const [overviewLastVisible, setOverviewLastVisible] = useState(null);
    const [searchFilterActive, setSearchFilterActive] = useState('');
    const [searchingFor, setSearchingFor] = useState('tasks');
    let initialOverviewSortFilter = '';
    switch(appContext.globalContext.authenticate.user.role){
        case 'Admin':
            initialOverviewSortFilter = 'show_all';
            break;
        case 'Projectleader':
            initialOverviewSortFilter = 'show_all_from_project';
            break;
        case 'Manager':
            initialOverviewSortFilter = 'show_all_from_me';
            break;
    }
    const [overviewSortFilter, setOverviewSortFilter] = useState({
        key: initialOverviewSortFilter,
        value: ''
    });
    useEffect(() => {
        if(overviewDataHasLoaded){
            setOverviewDataHasLoaded(false);
        }
        let oldLastVisible = overviewLastVisible;
        if(overviewLastVisible != null){
            setOverviewLastVisible(null);
            oldLastVisible = null;
        }
        FUNC__GetTasks(
            appContext.globalContext.authenticate.user.organization_id,
            setTasksObject,
            setOverviewDataHasLoaded,
            overviewSortFilter,
            oldLastVisible,
            setOverviewLastVisible,
            appContext.globalContext.authenticate.user.user_id,
            appContext.globalContext.authenticate.user.role,
            dateToday,
            searchFilterActive,
            searchingFor
        );
    },[overviewSortFilter, searchFilterActive]);
    useEffect(() => {
        if (inView) {
            if(overviewDataHasLoaded
                && !currentlyLoadingMoreOverviewData){
                setCurrentlyLoadingMoreOverviewData(true);
                console.log('visible');
                FUNC__LoadMoreTasksData(
                    setCurrentlyLoadingMoreOverviewData,
                    appContext.globalContext.authenticate.user.organization_id,
                    tasksObject,
                    setTasksObject,
                    overviewSortFilter,
                    overviewLastVisible,
                    setOverviewLastVisible,
                    appContext.globalContext.authenticate.user.user_id,
                    appContext.globalContext.authenticate.user.role,
                    dateToday,
                    searchFilterActive,
                    searchingFor
                )
            }
        }
    },[inView]);
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
            <section className={globalStyles['global-container']}>
                <div className={globalStyles['global-container__content']}>
                    <div className={cn([
                        globalStyles['global-border-column'],
                        globalStyles['global-border-radius'],
                        globalStyles['content-body-with-header']
                    ])}>
                        {/* Header */}
                        <VIEW__SectionOverview__Header
                            appContext={appContext}
                            overviewSortFilter={overviewSortFilter}
                            setOverviewSortFilter={setOverviewSortFilter}
                            dataHasLoaded={overviewDataHasLoaded}
                            tasksObject={tasksObject}
                            setTasksObject={setTasksObject}
                            searchFilterActive={searchFilterActive}
                            setSearchFilterActive={setSearchFilterActive}
                            searchingFor={searchingFor}
                            setSearchingFor={setSearchingFor}/>

                        {/* Content */}
                        <VIEW__SectionOverview
                            tasksObject={tasksObject}
                            setTasksObject={setTasksObject}
                            appContext={appContext}
                            dataHasLoaded={overviewDataHasLoaded}
                            lastVisible={overviewLastVisible}
                            setLastVisible={setOverviewLastVisible}
                            loadingMoreData={loadingMoreOverviewData}
                            overviewSortFilter={overviewSortFilter}
                            dateToday={dateToday}/>
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