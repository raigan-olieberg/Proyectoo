// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import GlobalComponentChart from '../../../components/Global/Analytics/Chart';
import { GLOBALFUNC__CalculatePercentage } from '../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const VIEW__SectionProjectsAndTasks = (props) => {
    return (
        <div className={cn([
            globalStyles['top-right'],
            globalStyles['dashboardview-content']
        ])}>
            {/* Header */}
            <div className={globalStyles['dashboardview-content__header-grid']}>
                <div>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['folder'].toSvg({height: '1vw', width: '1vw'})}}></i>
                    Projecten ({props.projectsObject.total})
                </div>
                <div></div>
                <div>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['clipboard'].toSvg({height: '1vw', width: '1vw'})}}></i>
                    Taken ({props.tasksObject.total})
                </div>
            </div>

            {/* Content */}
            <div className={globalStyles['dashboardview-content__content']}>
                <div className={cn([
                    globalStyles['content-wrapper'],
                    globalStyles['content-wrapper__projects']
                ])}>
                    {/* Projects */}
                    <div className={globalStyles['projects-left']}>
                        <div className={globalStyles['projects-left__content']}>
                            <GlobalComponentChart 
                                type={"vertical"} 
                                id={"dashboardpage-tasks-open"} 
                                sidebarDirection={"right"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Projecten met de status 'Open'", 
                                    view: "VIEW__Manager__Dashboard__Projects", 
                                    fetchFromServer: true
                                }} 
                                first={true} 
                                fill={"global-backgroundcolor-blue"} 
                                label={"Open"} 
                                min={props.projectsObject.open} 
                                total={props.projectsObject.total} 
                                sidebar={props.sidebar}/>
                            <GlobalComponentChart 
                                type={"vertical"} 
                                id={"dashboardpage-tasks-on_schedule"} 
                                sidebarDirection={"right"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Projecten met de status 'Op schema'", 
                                    view: "VIEW__Manager__Dashboard__Projects", 
                                    fetchFromServer: true
                                }} 
                                fill={"global-backgroundcolor-purple"} 
                                label={"Op schema"} 
                                min={props.projectsObject.on_schedule} 
                                total={props.projectsObject.total} 
                                sidebar={props.sidebar}/>
                            <GlobalComponentChart 
                                type={"vertical"} 
                                id={"dashboardpage-tasks-at_risk"} 
                                sidebarDirection={"right"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Projecten met de status 'Loopt risico'", 
                                    view: "VIEW__Manager__Dashboard__Projects", 
                                    fetchFromServer: true
                                }} 
                                fill={"global-backgroundcolor-orange"} 
                                label={"Loopt risico"} 
                                min={props.projectsObject.at_risk} 
                                total={props.projectsObject.total} 
                                sidebar={props.sidebar}/>
                            <GlobalComponentChart 
                                type={"vertical"} 
                                id={"dashboardpage-tasks-completed"} 
                                sidebarDirection={"right"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Projecten met de status 'Voltooid'", 
                                    view: "VIEW__Manager__Dashboard__Projects", 
                                    fetchFromServer: true
                                }} 
                                fill={"global-backgroundcolor-lightgreen"} 
                                label={"Voltooid"} 
                                min={props.projectsObject.completed} 
                                total={props.projectsObject.total} 
                                sidebar={props.sidebar}/>
                        </div>
                    </div>

                    {/* Seperator */}
                    <div className={globalStyles['global-seperator__vertical']}></div>

                    {/* Tasks */}
                    <div className={globalStyles['projects-right']}>
                        <div className={cn([
                            globalStyles['projects-right__info'],
                            globalStyles['global-fontsize-subtext']
                        ])}>
                            <div className={globalStyles['info-item']}>
                                <div className={globalStyles['info-item__label']}>
                                    Niet toegewezen
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-fontweight-bold'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{GLOBALFUNC__CalculatePercentage(props.tasksObject.unasigned, props.tasksObject.total)}%</div>
                                </div>
                            </div>
                            <div className={globalStyles['info-item']}>
                                <div className={globalStyles['info-item__label']}>
                                    Open
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-fontweight-bold'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{GLOBALFUNC__CalculatePercentage(props.tasksObject.open, props.tasksObject.total)}%</div>
                                </div>
                            </div>
                            <div className={globalStyles['info-item']}>
                                <div className={globalStyles['info-item__label']}>
                                    In behandeling
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-fontweight-bold'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{GLOBALFUNC__CalculatePercentage(props.tasksObject.in_progress, props.tasksObject.total)}%</div>
                                </div>
                            </div>
                            <div className={globalStyles['info-item']}>
                                <div className={globalStyles['info-item__label']}>
                                    Te laat
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-fontweight-bold'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{GLOBALFUNC__CalculatePercentage(props.tasksObject.overdue, props.tasksObject.total)}%</div>
                                </div>
                            </div>
                            <div className={globalStyles['info-item']}>
                                <div className={globalStyles['info-item__label']}>
                                    Vastgelopen
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-fontweight-bold'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{GLOBALFUNC__CalculatePercentage(props.tasksObject.stuck, props.tasksObject.total)}%</div>
                                </div>
                            </div>
                            <div className={globalStyles['info-item']}>
                                <div className={globalStyles['info-item__label']}>
                                    Voltood
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-fontweight-bold'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{GLOBALFUNC__CalculatePercentage(props.tasksObject.completed, props.tasksObject.total)}%</div>
                                </div>
                            </div>
                        </div>
                        <div className={globalStyles['projects-right__content']}>
                            <GlobalComponentChart 
                                type={"horizontal"} 
                                id={"dashboardpage-projects-unasigned"} 
                                sidebarDirection={"left"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Taken met de status 'Niet toegewezen'", 
                                    view: "VIEW__Manager__Dashboard__Tasks", 
                                    fetchFromServer: true
                                }} 
                                first={true} 
                                fill={"global-backgroundcolor-lightslategrey"} 
                                min={props.tasksObject.unasigned} 
                                total={props.tasksObject.total} 
                                sidebar={props.sidebar}/>
                            <GlobalComponentChart 
                                type={"horizontal"} 
                                id={"dashboardpage-projects-open"} 
                                sidebarDirection={"left"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Taken met de status 'Open'", 
                                    view: "VIEW__Manager__Dashboard__Tasks", 
                                    fetchFromServer: true
                                }} 
                                fill={"global-backgroundcolor-blue"} 
                                min={props.tasksObject.open} 
                                total={props.tasksObject.total} 
                                sidebar={props.sidebar}/>
                            <GlobalComponentChart 
                                type={"horizontal"} 
                                id={"dashboardpage-projects-in_progress"} 
                                sidebarDirection={"left"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Taken met de status 'Nu bezig'", 
                                    view: "VIEW__Manager__Dashboard__Tasks", 
                                    fetchFromServer: true
                                }} 
                                fill={"global-backgroundcolor-purple"} 
                                min={props.tasksObject.in_progress} 
                                total={props.tasksObject.total} 
                                sidebar={props.sidebar}/>
                            <GlobalComponentChart 
                                type={"horizontal"} 
                                id={"dashboardpage-projects-overdue"} 
                                sidebarDirection={"left"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Taken met de status 'Te laat'", 
                                    view: "VIEW__Manager__Dashboard__Tasks", 
                                    fetchFromServer: true
                                }} 
                                fill={"global-backgroundcolor-orange"} 
                                min={props.tasksObject.overdue} 
                                total={props.tasksObject.total} 
                                sidebar={props.sidebar}/>
                            <GlobalComponentChart 
                                type={"horizontal"} 
                                id={"dashboardpage-projects-stuck"} 
                                sidebarDirection={"left"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Taken met de status 'Vastgelopen'", 
                                    view: "VIEW__Manager__Dashboard__Tasks", 
                                    fetchFromServer: true
                                }} 
                                fill={"global-backgroundcolor-red"} 
                                min={props.tasksObject.stuck} 
                                total={props.tasksObject.total} 
                                sidebar={props.sidebar}/>
                            <GlobalComponentChart 
                                type={"horizontal"} 
                                id={"dashboardpage-projects-completed"} 
                                sidebarDirection={"left"} 
                                sidebarData={{
                                    page: "dashboard/manager", 
                                    title: "Taken met de status 'Voltooid'", 
                                    view: "VIEW__Manager__Dashboard__Tasks", 
                                    fetchFromServer: true
                                }} 
                                fill={"global-backgroundcolor-lightgreen"} 
                                min={props.tasksObject.completed} 
                                total={props.tasksObject.total} 
                                sidebar={props.sidebar}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
VIEW__SectionProjectsAndTasks.getLayout = (page) => {
    return (
        <LayoutComponentLoggedinPage>{page}</LayoutComponentLoggedinPage>
    );
};

export default VIEW__SectionProjectsAndTasks;