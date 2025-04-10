// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useState, useContext } from 'react';
// Global / Page / Layout components
import SidebarComponentMemberAndTeams from './Resources';
import AppContext from '../../../helpers/AppContext';
import { 
    GLOBALFUNC__CloseSidebar,
    GLOBALFUNC__CloseExpandedSidebar
} from '../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const GlobalComponentSidebarExpanded = (props) => {
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
            -> direction
            -> headerType
            -> payload
        VIEWS
            -> REF:VIEW__Vertical
            -> REF:VIEW__Horizontal
            -> REF:generated view
        FUNCTIONS
            -> REF:FUNC__CalculatePercentage
            -> REF:FUNC_CloseSidebar

    */
    const appContext = useContext(AppContext);
    const [currentView, setCurrentView] = useState("members");
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
        <section className={globalStyles['global-sidebar']}>
            <div className={cn({
                [globalStyles['global-sidebar__content-expanded']]:true,
                [globalStyles['global-sidebar__content-left-boxshadow']]:props.direction == "left",
                [globalStyles['global-sidebar__content-right-boxshadow']]:props.direction == "right",
                [globalStyles['global-sidebar__expanded-left']]:props.direction == "left",
                [globalStyles['global-sidebar__expanded-right']]:props.direction == "right"
            })}>
                {
                    props.headerType == null
                    &&
                    <div className={globalStyles['content-header__standard']}>
                        <div className={globalStyles['title']}>
                            {props.payload.title}
                        </div>
                        <div className={globalStyles['button']}>
                            <button className={cn([
                                globalStyles['global-hover-standard'],
                                globalStyles['global-transition-duration']
                            ])} onClick={() => GLOBALFUNC__CloseExpandedSidebar(appContext)}>
                                <i dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", widfth: "1vw"})}}></i>
                            </button>
                        </div>
                    </div>
                }
                {
                    props.headerType == "with-subheader"
                    && props.headerAction == "select-resource"
                    &&
                    <div className={globalStyles['content-header__with-subheader']}>
                        <div className={globalStyles['top']}>
                            <div className={globalStyles['top__title']}>
                                {props.payload.title}
                            </div>
                            <button className={cn([
                                    globalStyles['global-button'],
                                    globalStyles['global-button-hover'],
                                    globalStyles['global-transition-duration']
                                ])} onClick={() => GLOBALFUNC__CloseExpandedSidebar(appContext)}><i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                    Voltooid
                            </button>
                        </div>
                        <div className={cn([
                            globalStyles['bottom'],
                            globalStyles['global-margin-top']
                        ])}>
                            <div className={cn([
                                globalStyles['global-search'],
                                globalStyles['global-margin-top-item']
                            ])}>
                                <div>
                                    <input type="text" placeholder="Type een naam..."></input>
                                </div>
                            </div>
                            <div className={cn([
                                globalStyles['bottom__add'],
                                globalStyles['global-margin-top']
                            ])}>
                                <div>
                                    {currentView == "members"?"Beschikbare medewerkers":"Beschikbare teams"}
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext']
                                    ])}>Selecteer 1 of meerdere</div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className={cn({
                    [globalStyles['content-inner']]:true,
                    [globalStyles['content-inner__standard']]:props.headerType == null,
                    [globalStyles['content-inner__with-subheader']]:props.headerType == "with-subheader" && props.headerAction == "select-resource",
                    [globalStyles['content-inner__with-subheader-select-task']]:props.headerType == "with-subheader" && props.headerAction == "select-task"
                })}>
                    {
                        props.payload.page == "resource-planning/manager/select-resource"
                        &&
                        <SidebarComponentMemberAndTeams view={props.payload.view} subview={currentView} data={props.payload.data} fetchFromServer={props.payload.fetchFromServer} />
                    }
                </div>
            </div>
        </section>
    );
}
export default GlobalComponentSidebarExpanded;
