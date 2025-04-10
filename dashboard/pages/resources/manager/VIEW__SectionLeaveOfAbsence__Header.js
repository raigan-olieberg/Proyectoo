// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { 
    FUNC__CreateResource,
    FUNC__ChangeKeyFilter,
    FUNC__SearchUsers,
    FUNC__SelectSearchedUser
} from './Controller.js';
import GlobalComponentSearch from '../../../components/Global/Search.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
import { useState } from 'react';
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
const VIEW__SectionLeaveOfAbsence__Header = (props) => {
    const [showAlgoliaSearchResults, setShowAlgoliaSearchResults] = useState(false);
    const [algoliaSearchObject, setAlgoliaSearchObject] = useState([]);
    const [searchInputValue, setSearchInputValue] = useState('');

    return(
        <div className={globalStyles['content-body-with-header__header']}>
            <div className={cn([
                globalStyles['header-top-resources'],
                globalStyles['global-margin-top']
            ])}>
                <div className={cn([
                    globalStyles['global-display-flex'],
                    globalStyles['global-grid-gap-column']
                ])}>
                    <div className={cn([
                        globalStyles['global-select__with-icon'],
                        globalStyles['global-select__with-border']
                    ])}>
                        {props.currentView == "overview" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['list'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        {props.currentView == "occupation" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['command'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        {props.currentView == "leave_of_absence" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['user-minus'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])}
                            value={props.currentView}
                            onChange={e => {props.setCurrentView(e.target.value)}}>
                            <option value="overview">Overzicht</option>
                            <option value="occupation">Bezetting</option>
                            <option value="leave_of_absence">Verlof</option>
                        </select>
                    </div>
                </div>
                <GlobalComponentSearch
                    searchInputValue={searchInputValue}
                    setSearchInputValue={setSearchInputValue}
                    showAlgoliaSearchResults={showAlgoliaSearchResults}
                    setShowAlgoliaSearchResults={setShowAlgoliaSearchResults}
                    algoliaSearchObject={algoliaSearchObject}
                    setAlgoliaSearchObject={setAlgoliaSearchObject}
                    FUNC__Search={FUNC__SearchUsers}
                    FUNC__SelectSearchedItem={FUNC__SelectSearchedUser}
                    setItemObject={props.setResourcesObject}
                    itemObject={props.resourcesObject}
                    searchingFor={'resources'}/>
                <div className={cn([
                    globalStyles['global-select-with-sort-and-button'],
                    globalStyles['global-grid-gap-column']
                ])}>
                    <div></div>
                    <div></div>
                    <div className={globalStyles['global-select-with-sort-and-button__left']}>
                        <div>
                            <label className={globalStyles['global-margin-right-item']} htmlFor="sortby">Filteren op:</label>
                            <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])} 
                            value={props.keyFilter.key}
                            onChange={e => {FUNC__ChangeKeyFilter(
                                'key', 
                                e.target.value,
                                props.keyFilter,
                                props.setKeyFilter
                            )}}>
                                <option value="show_all">Toon alles</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        {
                            props.keyFilter.key != 'show_all'
                            &&
                            <div className={globalStyles['global-select__with-icon']}>
                                <select className={cn([
                                    globalStyles['global-select__standard'],
                                    globalStyles['global-transition-duration']
                                ])}
                                value={props.keyFilter.value}
                                onChange={e => {FUNC__ChangeKeyFilter(
                                    'value', 
                                    e.target.value,
                                    props.keyFilter,
                                    props.setKeyFilter
                                )}}>
                                    {
                                        props.keyFilter.key == 'status'
                                        &&
                                        <>
                                            <option value="open">Nog niet beoordeeld</option>
                                            <option value="approved">Goedgekeurd</option>
                                            <option value="rejected">Afgekeurd</option>
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
                    globalStyles['global-grid-6']
                ])}>
                    <div className={globalStyles['global-text-align-start']}>Resource</div>
                    <div>Omschrijving</div>
                    <div>Vanaf</div>
                    <div>Tot</div>
                    <div>Aangevraagd op</div>
                    <div>Status</div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionLeaveOfAbsence__Header;