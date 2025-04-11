// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import GlobalComponentChart from '../../../components/Global/Analytics/Chart';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const VIEW__SectionProblems = (props) => {
    return (
        <div className={cn([
            globalStyles['manager-left__bottom'],
            globalStyles['dashboardview-content']
        ])}>
            {/* Header */}
            <div className={globalStyles['dashboardview-content__header']}>
                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-triangle'].toSvg({height: '1vw', width: '1vw'})}}></i>
                Problemen
            </div>

            {/* Content */}
            <div className={globalStyles['dashboardview-content__content']}>
                <div className={cn([
                    globalStyles['content-wrapper'],
                    globalStyles['content-wrapper__problems']
                ])}>
                    {/* Left container */}
                    <div className={globalStyles['problems-left']}>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            id={"dashboardpage-tasks-open"} 
                            sidebarDirection={"right"} 
                            sidebarData={{
                                page: "dashboard/manager", 
                                title: "Met hoge prioriteit", 
                                view: "VIEW__Manager__Dashboard__Projects", 
                                fetchFromServer: true
                            }} 
                            first={true} 
                            fill={"global-backgroundcolor-red"} 
                            label={"Hoge prioriteit"} 
                            min={props.problemsObject.priority_high} 
                            total={props.problemsObject.total} 
                            sidebar={props.sidebar}/>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            id={"dashboardpage-tasks-on_schedule"} 
                            sidebarDirection={"right"} 
                            sidebarData={{
                                page: "dashboard/manager", 
                                title: "Met medium prioriteit", 
                                view: "VIEW__Manager__Dashboard__Projects", 
                                fetchFromServer: true
                            }}
                            fill={"global-backgroundcolor-orange"}
                            label={"Medium prioriteit"} 
                            min={props.problemsObject.priority_medium} 
                            total={props.problemsObject.total} 
                            sidebar={props.sidebar}/>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            id={"dashboardpage-tasks-at_risk"} 
                            sidebarDirection={"right"} 
                            sidebarData={{
                                page: "dashboard/manager", 
                                title: "Met lage prioriteit", 
                                view: "VIEW__Manager__Dashboard__Projects", 
                                fetchFromServer: true
                            }} 
                            fill={"global-backgroundcolor-yellow"} 
                            label={"Lage prioriteit"} 
                            min={props.problemsObject.priority_low} 
                            total={props.problemsObject.total} sidebar={props.sidebar}/>
                    </div>

                    {/* Seperator */}
                    <div className={globalStyles['global-seperator__vertical']}></div>

                    {/* Right container */}
                    <div className={globalStyles['problems-right']}>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            id={"dashboardpage-tasks-open"} 
                            sidebarDirection={"right"} 
                            sidebarData={{
                                page: "dashboard/manager", 
                                title: "Met de status 'Open'", 
                                view: "VIEW__Manager__Dashboard__Projects", 
                                fetchFromServer: true
                            }} 
                            first={true} 
                            fill={"global-backgroundcolor-blue"} 
                            label={"Open"}
                            min={props.problemsObject.status_open} 
                            total={props.problemsObject.total} 
                            sidebar={props.sidebar}/>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            id={"dashboardpage-tasks-on_schedule"} 
                            sidebarDirection={"right"} 
                            sidebarData={{
                                page: "dashboard/manager", 
                                title: "Met de status 'In behandeling'", 
                                view: "VIEW__Manager__Dashboard__Projects", 
                                fetchFromServer: true
                            }} 
                            fill={"global-backgroundcolor-purple"} 
                            label={"In behandeling"} 
                            min={props.problemsObject.status_in_progress} 
                            total={props.problemsObject.total} 
                            sidebar={props.sidebar}/>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            id={"dashboardpage-tasks-at_risk"} 
                            sidebarDirection={"right"} 
                            sidebarData={{
                                page: "dashboard/manager", 
                                title: "Met de status 'Opgelost'", 
                                view: "VIEW__Manager__Dashboard__Projects", 
                                fetchFromServer: true
                            }} 
                            fill={"global-backgroundcolor-lightgreen"} 
                            label={"Opgelost"} 
                            min={props.problemsObject.status_open} 
                            total={props.problemsObject.total} 
                            sidebar={props.sidebar}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
VIEW__SectionProblems.getLayout = (page) => {
    return (
        <LayoutComponentLoggedinPage>{page}</LayoutComponentLoggedinPage>
    );
};

export default VIEW__SectionProblems;