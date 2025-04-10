// React / NextJs components
import cn from 'classnames';
import { useState, useContext } from 'react';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { 
    FUNC__ChangeOverviewSortFilter,
    FUNC__SearchTasks,
    FUNC__SelectSearchedTasks,
    FUNC__SetSearchEmptyMessage,
    FUNC__SetSearchPlaceholder
} from './Controller.js';
import GlobalComponentSearch from '../../../components/Global/Search.js';
import AppContext from '../../../helpers/AppContext';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:VIEW__SectionHeader
    WHAT IS IT: 
        The generated view for the header section
*
*
* 
* 
*/
const VIEW__SectionOverview__Header = (props) => {
    const appContext = useContext(AppContext);
    const [showAlgoliaSearchResults, setShowAlgoliaSearchResults] = useState(false);
    const [algoliaSearchObject, setAlgoliaSearchObject] = useState([]);
    const [searchInputValue, setSearchInputValue] = useState('');

    return(
        <div className={globalStyles['content-body-with-header__header']}>
            <div className={cn([
                globalStyles['header-top-tasks-overview'],
                globalStyles['global-margin-top']
            ])}>
                {/*<div className={cn([
                    globalStyles['global-display-flex'],
                    globalStyles['global-grid-gap-column']
                ])}>
                    <div className={cn([
                        globalStyles['global-select__with-icon'],
                        globalStyles['global-select__with-border']
                    ])}>
                        {props.currentView == "overview" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['list'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        {props.currentView == "analytics" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['pie-chart'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])}
                            value={props.currentView}
                            onChange={e => {FUNC__ChangeCurrentView(
                                props.currentView,
                                props.setCurrentView
                            )}}>
                            <option value="overview">Taken</option>
                            <option value="phases">Fases</option>
                            <option value="analytics">Statistieken</option>
                        </select>
                    </div>
                </div>*/}
                <div className={globalStyles['header-top-with-selectfilter-and-searchfilter']}>
                    <div className={globalStyles['global-select__with-icon']}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['search'].toSvg({height: "1vw", with: "1vw"})}}></i>
                        <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])}
                            value={props.searchingFor}
                            disabled={props.searchFilterActive != ''}
                            onChange={e => {props.setSearchingFor(e.target.value)}}>
                            <option value="tasks">Zoeken naar taak</option>
                            <option value="phases">Zoeken naar fase</option>
                            <option value="projects">Zoeken naar project</option>
                        </select>
                    </div>
                    <div className={cn([
                        globalStyles['global-seperator__vertical']
                    ])}></div>
                    <GlobalComponentSearch
                        searchInputValue={searchInputValue}
                        setSearchInputValue={setSearchInputValue}
                        showAlgoliaSearchResults={showAlgoliaSearchResults}
                        setShowAlgoliaSearchResults={setShowAlgoliaSearchResults}
                        algoliaSearchObject={algoliaSearchObject}
                        setAlgoliaSearchObject={setAlgoliaSearchObject}
                        FUNC__Search={FUNC__SearchTasks}
                        FUNC__SelectSearchedItem={FUNC__SelectSearchedTasks}
                        setItemObject={props.setTasksObject}
                        itemObject={props.tasksObject}
                        searchingFor={props.searchingFor}
                        emptyMessage={FUNC__SetSearchEmptyMessage(props.searchingFor)}
                        searchPlaceholder={FUNC__SetSearchPlaceholder(props.searchingFor)}
                        searchFilterActive={props.searchFilterActive}
                        setSearchFilterActive={props.setSearchFilterActive}/>
                </div>
                <div className={ globalStyles['global-display-flex-end']}>
                    <div className={globalStyles['global-select-with-sort-and-button__left']}>
                        <div>
                            <label className={globalStyles['global-margin-right-item']} htmlFor="sortby">Filteren op:</label>
                            <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])} 
                            value={props.overviewSortFilter.key}
                            onChange={e => {FUNC__ChangeOverviewSortFilter(
                                'key', 
                                e.target.value,
                                props.overviewSortFilter,
                                props.setOverviewSortFilter
                            )}}>
                                {
                                    appContext.globalContext.authenticate.user.role == 'Admin'
                                    &&
                                    <>
                                        <option value="show_all">Toon alles</option>
                                    </>
                                }
                                {
                                    appContext.globalContext.authenticate.user.role == 'Projectleader'
                                    && props.searchFilterActive == ''
                                    &&
                                    <>
                                        <option value="show_all_from_project">Toon alles van mijn projecten</option>
                                    </>
                                }
                                <option value="show_all_from_me">Toon alles wat ik heb aangemaakt</option>
                                <option value="show_all_assigned_to_me">Toon alles wat aan mij is toegewezen</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        {
                            props.overviewSortFilter.key == 'status'
                            &&
                            <div className={globalStyles['global-select__with-icon']}>
                                <select className={cn([
                                    globalStyles['global-select__standard'],
                                    globalStyles['global-transition-duration']
                                ])}
                                value={props.overviewSortFilter.value}
                                onChange={e => {FUNC__ChangeOverviewSortFilter(
                                    'value', 
                                    e.target.value,
                                    props.overviewSortFilter,
                                    props.setOverviewSortFilter
                                )}}>
                                    {
                                        props.overviewSortFilter.key == 'status'
                                        &&
                                        <>
                                            <option value="unasigned">Nog niet toegewezen</option>
                                            <option value="open">Open</option>
                                            <option value="in_progress">In behandeling</option>
                                            <option value="overdue">Te laat</option>
                                            <option value="stuck">Vastgelopen</option>
                                            <option value="completed">Voltooid</option>
                                        </>
                                    }
                                </select>
                            </div>
                            ||
                            <div></div>
                        }
                    </div>
                </div>
            </div>
            <div className={globalStyles['header-bottom']}>
                <div className={cn([
                    globalStyles['global-column-header'],
                    globalStyles['global-column-header__standard-grid'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-8']
                ])}>
                    <div className={globalStyles['global-text-align-start']}>Toegewezen aan</div>
                    <div>Naam</div>
                    <div>Project</div>
                    <div>Fase</div>
                    <div>Deadline</div>
                    <div>Uren begroot</div>
                    <div>Werkelijke uren</div>
                    <div>Status</div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionOverview__Header;