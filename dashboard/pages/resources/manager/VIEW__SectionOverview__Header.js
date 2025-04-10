// React / NextJs components
import cn from 'classnames';
import { useState, useContext } from 'react';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { 
    FUNC__CreateResource,
    FUNC__ChangeOverviewKeyFilter,
    FUNC__SearchUsers,
    FUNC__SelectSearchedUser
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
                globalStyles['header-top-resources'],
                globalStyles['global-margin-top']
            ])}>
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
                    searchingFor={'resources'}
                    showSearchIcon={true}
                    emptyMessage={'gebruikers'}
                    searchPlaceholder={'Zoek resource...'}
                    searchFilterActive={''}/>
                <div className={cn([
                    globalStyles['global-select-with-sort-and-button'],
                    globalStyles['global-grid-gap-column']
                ])}>
                    {
                        appContext.globalContext.authenticate.user.role == 'Manager'
                        &&
                        <>
                            <div></div>
                            <div></div>
                        </>
                    }
                    <div className={globalStyles['global-select-with-sort-and-button__left']}>
                        <div>
                            <label className={globalStyles['global-margin-right-item']} htmlFor="sortby">Filteren op:</label>
                            <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])} 
                            value={props.keyFilter.key}
                            onChange={e => {FUNC__ChangeOverviewKeyFilter(
                                'key', 
                                e.target.value,
                                props.keyFilter,
                                props.setKeyFilter
                            )}}>
                                <option value="show_all">Toon alles</option>
                                <option value="role">Rol</option>
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
                                onChange={e => {FUNC__ChangeOverviewKeyFilter(
                                    'value', 
                                    e.target.value,
                                    props.keyFilter,
                                    props.setKeyFilter
                                )}}>
                                    {
                                        props.keyFilter.key == 'role'
                                        &&
                                        <>
                                            <option value="Admin">Beheerder</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Member">Medewerker</option>
                                        </>
                                    }
                                    {
                                        props.keyFilter.key == 'status'
                                        &&
                                        <>
                                            <option value="Active">Beschikbaar</option>
                                            <option value="Sick">Ziek</option>
                                            <option value="Leave_of_absence">Verlof</option>
                                            <option value="Inactive">Inactief</option>
                                        </>
                                    }
                                </select>
                            </div>
                            ||
                            <div></div>
                    }
                    </div>
                    {
                        appContext.globalContext.authenticate.user.role == 'Admin'
                        &&
                        <>
                            <div className={globalStyles['global-seperator__vertical']}></div>
                            <div>
                                <button href="projects/add" className={cn([
                                    globalStyles['global-button'],
                                    globalStyles['global-button-hover'],
                                    globalStyles['global-transition-duration'],
                                ])} onClick={() => FUNC__CreateResource(
                                    appContext,
                                    props.resourcesObject,
                                    props.setResourcesObject
                                )}>
                                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                    Gebruiker aanmaken
                                </button>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className={globalStyles['header-bottom']}>
                <div className={cn({
                    [globalStyles['global-column-header']]:true,
                    [globalStyles['global-column-header__standard-grid']]:true,
                    [globalStyles['global-margin-top-x2']]:true,
                    [globalStyles['global-grid-7']]:appContext.globalContext.authenticate.user.role == 'Admin',
                    [globalStyles['global-grid-5']]:appContext.globalContext.authenticate.user.role != 'Admin'
                })}>
                    <div className={globalStyles['global-text-align-start']}>Resource</div>
                    {
                        appContext.globalContext.authenticate.user.role == 'Admin'
                        &&
                        <>
                            <div className={globalStyles['global-text-align-start']}>Manager</div>
                            <div>Resources onder leiding</div>
                        </>
                    }
                    <div>E-mail</div>
                    <div>Telefoonnummer</div>
                    <div>Rol</div>
                    <div>Status</div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionOverview__Header;