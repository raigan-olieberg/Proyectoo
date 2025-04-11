// React / NextJs components
import { useState, useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import SidebarComponentFieldsInputText from '../../../../components/Global/Sidebar/Fields/InputText';
import SidebarComponentFieldsInputTime from '../../../../components/Global/Sidebar/Fields/InputTime';
import SidebarComponentFieldsSelectResource from '../../../../components/Global/Sidebar/Fields/SelectResource';
import AppContext from '../../../../helpers/AppContext';
import { 
    GLOBALFUNC__TranslateSecondsToDate,
} from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const ResourcePlanningManagerSidebar__VIEW__SectionPlanningInfo = (props) => {
    const appContext = useContext(AppContext);
    const [itemObject, setItemObject] = useState(props.data.planning);
    const [oldItemObject, setOldItemObject] = useState({...props.data.planning});
    const [editField, setEditField] = useState('');
    const [error, setError] = useState({
        show: false,
        message: '',
        id: ''
    });
    /*
    *
    *
    * 
    * 
        Content
    *
    *
    * 
    * 
    */
    return (
        <div className={globalStyles['content-inner__bodysection']}>
            {/*<SidebarComponentFieldsSelectResource
                firstItem={false} 
                title={"Toegewezen resource(s)"}
                subTitle={"Wordt automatisch ingevuld op basis van de planning."} 
                id={"asigned_to"} 
                value={appContext.globalContext.sidebar.payload.data.selectedResources}
                type={"readonly"}
                appContext={appContext}/>*/}
            <SidebarComponentFieldsInputText
                title={"Project"} 
                id={"project"} 
                value={itemObject.project}
                type={"readonly"}
                firstItem={true}/> 
            <SidebarComponentFieldsInputText
                title={"Fase"} 
                id={"phase"} 
                value={itemObject.phase}
                type={"readonly"}/> 
            <SidebarComponentFieldsInputText
                title={"Taak"} 
                id={"task"} 
                value={itemObject.task.name}
                type={"readonly"}/> 
            <div className={cn([
                globalStyles['bodysection-field'],
                globalStyles['global-margin-top']
            ])}>
            <div className={globalStyles['bodysection-field__label']}>Planning</div>
                <div className={globalStyles['bodysection-field__inputs-with-icon']}>
                    <i dangerouslySetInnerHTML={{__html: featherIcon.icons['clock'].toSvg({height: "1vw", widfth: "1vw"})}}></i>
                    <div>
                        <SidebarComponentFieldsInputText
                            title={"Datum"} 
                            id={"formatted_date"} 
                            value={GLOBALFUNC__TranslateSecondsToDate(
                                new Date(itemObject.formatted_date)
                            )}
                            type={"readonly"}/>
                        <div className={cn([
                            globalStyles['global-margin-top-item'],
                            globalStyles['global-grid-2'],
                            globalStyles['global-grid-gap']
                        ])}>
                            <SidebarComponentFieldsInputTime
                                type={"edit"}
                                required={true}
                                title={"Startijd"}
                                id={"startime"}
                                value={itemObject.starttime}
                                error={error}
                                editField={{
                                    get: editField,
                                    set: setEditField
                                }}/>
                            <SidebarComponentFieldsInputTime
                                type={"edit"}
                                required={true}
                                title={"Eindtijd"}
                                id={"endtime"}
                                value={itemObject.endtime}
                                error={error}
                                editField={{
                                    get: editField,
                                    set: setEditField
                                }}/>
                        </div>
                    </div>
                </div>
            </div>
            <SidebarComponentFieldsSelectResource
                firstItem={false} 
                title={"Ingeplande resource(s)"}
                subTitle={"Kies meerdere resources als ze tegelijkertijd voor deze taak ingepland moeten worden."}
                id={"assigned_to"} 
                value={itemObject.assigned_to}
                type={"edit"}
                planningItemObject={itemObject}
                planningSetItemObject={setItemObject}/>
            {/*<div className={globalStyles['bodysection-field']}>
                <div className={globalStyles['bodysection-field__label']}>Ingeplande resources</div>
                <div className={globalStyles['global-margin-top-item']}>
                    {itemObject.assigned_to.map(resource => (
                        <div className={globalStyles['global-margin-bottom-item']} key={resource.user_id}>
                            <UserComponentInsideList
                                user={resource}/>
                        </div>
                    ))}
                </div>
            </div>*/}
        </div>
    );
}
export default ResourcePlanningManagerSidebar__VIEW__SectionPlanningInfo;