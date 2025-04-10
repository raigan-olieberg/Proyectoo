// React / NextJs components
import cn from 'classnames';
import { 
    GLOBALFUNC__UserInitials
} from '../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:GlobalComponentAsignedResources
    WHAT IS IT: 
        The generated view for the load more button
*
*
* 
* 
*/
export function AsignedResourcesComponentInsideList(props){
    return(
        props.assigned_to != undefined
        && props.assigned_to.length > 0
        &&
        <div className={cn({
            [globalStyles['global-photo-thumbnail-wrapper']]:true,
            [globalStyles['global-display-flex-start']]:true,
            [globalStyles['global-margin-top-item']]:props.addMarginTop
        })}>
            {
                props.assigned_to != undefined
                &&
                props.assigned_to.slice(0, 6).map(resource => (
                    <div key={resource.user_id} className={globalStyles['global-photo-thumbnail-wrapper__multiple']}>
                        {GLOBALFUNC__UserInitials(
                            resource.firstname,
                            resource.lastname
                        )}
                    </div>
                ))
            }
            {
                (props.assigned_to != undefined && props.assigned_to.length > 6)
                &&
                <div className={globalStyles['global-photo-thumbnail-wrapper__multiple--last']}>+{(props.assigned_to.length - 6)}</div>
            }
        </div>
        ||
        <div className={globalStyles['global-text-align-start']}>-</div>
    );
}