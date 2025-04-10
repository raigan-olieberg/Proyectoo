// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useState } from 'react';
import GlobalComponentSearch from '../../../components/Global/Search.js';
// Global / Page / Layout components
import { 
    FUNC__ChangeOverviewSortFilter,
    FUNC__SearchProblems,
    FUNC__SelectSearchedProblems,
    FUNC__SetSearchEmptyMessage,
    FUNC__SetSearchPlaceholder
} from './Controller.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const VIEW__SectionOverview__Header = (props) => {
    const [showAlgoliaSearchResults, setShowAlgoliaSearchResults] = useState(false);
    const [algoliaSearchObject, setAlgoliaSearchObject] = useState([]);
    const [searchInputValue, setSearchInputValue] = useState('');

    return(
        <div className={globalStyles['content-body-with-header__header']}>
            <div className={cn([
                globalStyles['header-top-problems-overview'],
                globalStyles['global-margin-top']
            ])}>
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
                            <option value="problems">Zoeken naar probleem</option>
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
                        FUNC__Search={FUNC__SearchProblems}
                        FUNC__SelectSearchedItem={FUNC__SelectSearchedProblems}
                        setItemObject={props.setProblemsObject}
                        itemObject={props.problemsObject}
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
                                <option value="show_all">Toon alles</option>
                                <option value="priority">Prioriteit</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        {
                            props.overviewSortFilter.key != 'show_all'
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
                                        props.overviewSortFilter.key == 'priority'
                                        &&
                                        <>
                                            <option value="high">Hoog</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Laag</option>
                                        </>
                                    }
                                    {
                                        props.overviewSortFilter.key == 'status'
                                        &&
                                        <>
                                            <option value="open">Open</option>
                                            <option value="in_progress">In behandeling</option>
                                            <option value="resolved">Opgelost</option>
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
                    globalStyles['global-grid-7']
                ])}>
                    <div className={globalStyles['global-text-align-start']}>Aangemeld door</div>
                    <div>Prio</div>
                    <div>Korte omschrijving</div>
                    <div>Project</div>
                    <div>Aangemeld voor</div>
                    <div>Wanneer</div>
                    <div>Status</div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionOverview__Header;