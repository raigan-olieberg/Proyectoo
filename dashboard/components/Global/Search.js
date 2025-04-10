// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useContext } from 'react';
// Global / Page / Layout components
import AppContext from '../../helpers/AppContext';
import { 
    GLOBALFUNC__UserInitials
} from '../../helpers/GlobalFunctions';
import GlobalComponentDynamicMessage from './Alerts/DynamicMessage';
// Page styles
import globalStyles from '../../styles/global.module.scss';

const GlobalComponentSearch = (props) => {
    const appContext = useContext(AppContext);

    const FUNC__DeactivateSearchFilter = () => {
        props.setSearchFilterActive('');
        props.setSearchInputValue('');
    }
   
    return (
        <div className={cn({
            [globalStyles['global-search']]:true,
            [globalStyles['global-search__with-border']]:props.showSearchIcon,
            [globalStyles['global-display-flex']]:props.showSearchIcon,
            [globalStyles['global-padding-left-item']]:props.showSearchIcon
        })}>
            {props.showSearchIcon && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['search'].toSvg({height: "1vw", with: "1vw"})}}></i>}
            <input 
                className={globalStyles['global-search__input']}
                type="text" 
                placeholder={props.searchPlaceholder}
                value={props.searchInputValue}
                disabled={props.searchFilterActive != ''}
                onChange={e => {
                    props.FUNC__Search(
                        e.target.value,
                        props.setSearchInputValue,
                        props.setShowAlgoliaSearchResults,
                        props.setAlgoliaSearchObject,
                        appContext.globalContext.authenticate.user.organization_id,
                        appContext.globalContext.authenticate.user.role,
                        appContext.globalContext.authenticate.user.user_id,
                        props.searchingFor ? props.searchingFor : null
                    )
                }}/>
                {
                    props.showAlgoliaSearchResults
                    &&
                    <div className={cn([
                        globalStyles['global-search__results'],
                        globalStyles['global-box-shadow']
                    ])}>
                        {
                            props.algoliaSearchObject.length > 0
                            &&
                            props.algoliaSearchObject.map(item => (
                                <button key={item.objectID} className={cn([
                                    globalStyles['results-item'],
                                    globalStyles['results-item__resources'],
                                    globalStyles['global-hover-standard'],
                                    globalStyles['global-transition-duration']
                                ])} onClick={() => props.FUNC__SelectSearchedItem(
                                    item.document_id,
                                    appContext,
                                    props.itemObject,
                                    props.setItemObject,
                                    props.setShowAlgoliaSearchResults,
                                    props.setSearchInputValue,
                                    props.searchingFor,
                                    props.setSearchFilterActive,
                                    item.name,
                                    item.description,
                                )}>
                                    {
                                        props.searchingFor == 'resources'
                                        &&
                                        <div className={globalStyles['global-photo-thumbnail-wrapper__single']}>
                                            {GLOBALFUNC__UserInitials(
                                                item.name,
                                                '',
                                                true
                                            )}
                                        </div>
                                    }
                                    <div>
                                        <div className={globalStyles['global-display-flex']}>
                                            {item.name}
                                        </div>
                                        <div className={cn([
                                            globalStyles['global-fontsize-subtext'],
                                            globalStyles['global-margin-subtext']
                                        ])}><span dangerouslySetInnerHTML={{__html:item.description}}></span></div>
                                    </div>
                                </button>
                            ))
                        }
                        {
                            props.algoliaSearchObject.length == 0
                            &&
                            <GlobalComponentDynamicMessage
                                showTitle={false}
                                message={"Er zijn geen " + props.emptyMessage + " gevonden."}/>
                        }
                    </div>
                }
                {
                    props.searchFilterActive != ''
                    &&
                    <button className={cn([
                        globalStyles['global-search__activeButton'],
                        globalStyles['global-display-flex'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration']
                    ])} onClick={() => FUNC__DeactivateSearchFilter()}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", with: "1vw"})}}></i> 
                        Sluiten
                    </button>
                }
        </div>
    );
}
export default GlobalComponentSearch;