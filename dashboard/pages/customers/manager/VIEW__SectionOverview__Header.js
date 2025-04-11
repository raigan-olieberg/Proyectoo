// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { 
    FUNC__CreateCustomer
} from './Controller.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const VIEW__SectionOverview__Header = (props) => {
    return(
        <div className={globalStyles['content-body-with-header__header']}>
            {/* 
                TODO -> Replace 'global-search' with GlobalComponentSearch -> Copy from tasks/manager/VIEW__SectionOverview__Header.js
            */}
            <div className={cn([
                globalStyles['header-top-with-viewfilter-and-inputfilter-and-searchfilter'],
                globalStyles['global-margin-top']
            ])}>
                <input 
                    className={globalStyles['global-search']}
                    type="text" 
                    placeholder="Zoek klant..."
                    value={props.filterValue}
                    disabled={props.filterActive ? true : false}
                    onKeyDown={
                        (e) => {
                            FUNC__OnKeyDown(e);
                        }
                    }
                    onChange={e => {FUNC__ChangeFilterValue(e.target.value, "text")}}/>
                <div className={globalStyles['global-display-flex-end']}>
                    <button href="projects/add" className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-hover'],
                        globalStyles['global-transition-duration'],
                    ])} onClick={() => FUNC__CreateCustomer(
                        props.appContext,
                        props.customersObject,
                        props.setCustomersObject
                    )}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: '1vw', width: '1vw'})}}></i>
                        Klant aanmaken
                    </button>
                </div>
            </div>

            {/* Column header */}
            <div className={globalStyles['header-bottom']}>
                <div className={cn([
                    globalStyles['global-column-header'],
                    globalStyles['global-column-header__standard-grid'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-5']
                ])}>
                    <div>Naam</div>
                    <div>Contactpersoon</div>
                    <div>E-mail</div>
                    <div>Telefoonnummer</div>
                    <div>Gekoppelde projecten</div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionOverview__Header;