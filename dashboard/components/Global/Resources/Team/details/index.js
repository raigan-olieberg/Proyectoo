import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { usePathname } from 'next/navigation'
// Page components
import GlobalComponentMember from '../../Member';
// Page styles
import styles from '../../../styles/singleproject.module.scss';
import globalStyles from '../../../styles/global.module.scss';

const GlobalComponentTeamDetails = (props) => {
    const currentPage = usePathname();
    const ARR__managers = [
        {
            id: 1,
            role: "manager",
            label: "uitvoerder",
            name: "Lieke Wigmans"
        }
    ];
    const ARR__teamleaders = [
        {
            id: 4,
            role: "teamleader",
            label: "uitvoerder",
            name: "Esmee Wigmans"
        }
    ];
    const ARR__members = [
        {
            id: 7,
            role: "member",
            label: "uitvoerder",
            name: "Gijsbert Wigmans"
        },
        {
            id: 8,
            role: "member",
            label: "uitvoerder",
            name: "Luuk Wigmans"
        },
        {
            id: 9,
            role: "member",
            label: "uitvoerder",
            name: "Joost Wigmans"
        },
        {
            id: 10,
            role: "member",
            label: "uitvoerder",
            name: "Mohammed Wigmans"
        },
        {
            id: 11,
            role: "member",
            label: "uitvoerder",
            name: "Ricardo Wigmans"
        },
    ];
    const grid = () => {
        let gridClass = "";
       
            if(ARR__members.length >= 5){
                gridClass = "global-grid-5"
            } else {
                gridClass = "global-grid-"+ARR__members.length
            }
        
        return gridClass;
    }
    /*
    *
    *
    * 
    * 
        Rendered view
    *
    *
    * 
    * 
    */
    return (
        <>
            {
                currentPage.includes('/projects')
                &&
                <div className={cn([
                    globalStyles['global-row-teams__item'],
                    globalStyles['global-center-item']
                ])}>
                    <img className={cn([
                        globalStyles['global-margin-bottom'],
                        globalStyles['global-center-item'],
                        globalStyles['global-photo-big']
                    ])} src="../img/female1-150.jpg"/>
                    <div>
                        <div className={cn([
                            globalStyles['global-row-teams__item_name'],
                            globalStyles['global-margin-bottom-small']
                        ])}>Team a</div>
                        <div className={styles['item-icon']}><i className={styles['global-color-green']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-down'].toSvg({height: "5vw", width: "5vw"})}}></i></div>
                    </div>
                </div>
            }
            <div className={cn({
                [globalStyles['global-members-row']]:true,
                [globalStyles['global-no-margin']]:true
            })}>
                <div className={globalStyles['created-team']}>
                    <div className={globalStyles['created-team__item']}>
                        <div className={globalStyles['item-wrapper']}>
                            {
                                ARR__managers.length == 0
                                && 
                                <div className={globalStyles['item-wrapper__loader-single']}>
                                        <div className={cn([
                                        globalStyles['item-photo'],
                                        globalStyles['global-margin-bottom'],
                                        globalStyles['global-center-item'],
                                        globalStyles['global-photo-big']
                                    ])}></div>
                                    <div>Hier komt één manager</div>
                                </div>
                                ||
                                <>
                                    {Object.keys(ARR__managers).map(item => (
                                        currentPage.includes('/projects')
                                        &&
                                        <GlobalComponentMember key={ARR__managers[item].id} />
                                        ||
                                        <button
                                            key={ARR__members[item].id}
                                            className={cn([
                                                globalStyles['item-wrapper__member-single'],
                                                globalStyles['global-hover-standard'],
                                                globalStyles['global-transition-duration'],
                                                globalStyles['global-border-radius']
                                            ])}
                                        >
                                            <img src="../img/female1-150.jpg" className={cn([
                                                globalStyles['global-margin-bottom'],
                                                globalStyles['global-center-item'],
                                                globalStyles['global-photo-big']
                                            ])}/>
                                            <div>{ARR__members[item].name}</div>
                                            <div className={cn([
                                                globalStyles['global-margin-subtext'],
                                                globalStyles['global-fontsize-subtext'],
                                            ])}>{ARR__members[item].role} | {ARR__members[item].label}</div>
                                        </button>
                                    ))}
                                </>
                            }
                            <div className={globalStyles['item-wrapper__connector']}>
                                <div className={cn([
                                    globalStyles['vertical-line'],
                                    globalStyles['global-color-seperator']
                                ])}></div>
                            </div>
                        </div>
                        <div className={globalStyles['item-wrapper']}>
                            {
                                ARR__teamleaders.length == 0
                                && 
                                <div className={globalStyles['item-wrapper__loader-single']}>
                                        <div className={cn([
                                        globalStyles['item-photo'],
                                        globalStyles['global-margin-bottom'],
                                        globalStyles['global-center-item'],
                                        globalStyles['global-photo-big']
                                    ])}></div>
                                    <div>Hier komt één teamleider</div>
                                </div>
                                ||
                                <>
                                    {Object.keys(ARR__teamleaders).map(item => (
                                        currentPage.includes('/projects')
                                        &&
                                        <GlobalComponentMember  key={ARR__teamleaders[item].id} />
                                        ||
                                        <button
                                            key={ARR__members[item].id}
                                            className={cn([
                                                globalStyles['item-wrapper__member-single'],
                                                globalStyles['global-hover-standard'],
                                                globalStyles['global-transition-duration'],
                                                globalStyles['global-border-radius']
                                            ])}
                                        >
                                            <img src="../img/female1-150.jpg" className={cn([
                                                globalStyles['global-margin-bottom'],
                                                globalStyles['global-center-item'],
                                                globalStyles['global-photo-big']
                                            ])}/>
                                            <div>{ARR__members[item].name}</div>
                                            <div className={cn([
                                                globalStyles['global-margin-subtext'],
                                                globalStyles['global-fontsize-subtext'],
                                            ])}>{ARR__members[item].role} | {ARR__members[item].label}</div>
                                        </button>
                                    ))}
                                </>
                            }
                            <div className={globalStyles['item-wrapper__connector']}>
                                <div className={cn([
                                    globalStyles['vertical-line'],
                                    globalStyles['global-color-seperator']
                                ])}></div>
                                <div className={cn([
                                    globalStyles['horizontal-line'],
                                    globalStyles['global-color-seperator']
                                ])}></div>
                            </div>
                        </div>
                        <div className={cn({
                            [globalStyles['item-wrapper']]:true,
                            [globalStyles['global-margin-top']]:true,
                            [globalStyles[grid(ARR__members.length )]]:ARR__members.length > 0
                        })}>
                            {
                                ARR__members.length == 0
                                && 
                                <div className={globalStyles['item-wrapper__loader-single']}>
                                        <div className={cn([
                                        globalStyles['item-photo'],
                                        globalStyles['global-margin-bottom'],
                                        globalStyles['global-center-item'],
                                        globalStyles['global-photo-big']
                                    ])}></div>
                                    <div>Hier komen teamleden</div>
                                </div>
                                ||
                                <>
                                    {Object.keys(ARR__members).map(item => (
                                        currentPage.includes('/projects')
                                        &&
                                        <GlobalComponentMember  key={ARR__members[item].id} />
                                        ||
                                        <button
                                            key={ARR__members[item].id}
                                            className={cn([
                                                globalStyles['item-wrapper__member-grid'],
                                                globalStyles['global-hover-standard'],
                                                globalStyles['global-transition-duration'],
                                                globalStyles['global-border-radius']
                                            ])}
                                        >
                                            <img src="../img/female1-150.jpg" className={cn([
                                                globalStyles['global-margin-bottom'],
                                                globalStyles['global-center-item'],
                                                globalStyles['global-photo-big']
                                            ])}/>
                                            <div>{ARR__members[item].name}</div>
                                            <div className={cn([
                                                globalStyles['global-margin-subtext'],
                                                globalStyles['global-fontsize-subtext'],
                                            ])}>{ARR__members[item].role} | {ARR__members[item].label}</div>
                                        </button>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default GlobalComponentTeamDetails;