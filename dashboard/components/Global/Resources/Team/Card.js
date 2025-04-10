import cn from 'classnames';
import Link from 'next/link';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

export function GlobalComponentTeamCard(props) {
    return (
        <>
            {
                (props.isLink != undefined && props.clickable != undefined)
                &&
                <Link href="/teams/info">
                    <img className={cn([
                        globalStyles['global-margin-bottom'],
                        globalStyles['global-center-item'],
                        globalStyles['global-photo-big']
                    ])} src="img/female1-150.jpg" />
                    <div>
                        <div className={globalStyles['global-margin-bottom-small']}>{props.attributes.name}</div>
                        <div className={cn([
                            globalStyles['global-margin-subtext'],
                            globalStyles['global-fontsize-subtext']
                        ])}>Actief in {props.attributes.projects} {props.attributes.projects == 1 && "project" || "projecten"}</div>
                        <div className={cn([
                            globalStyles['global-photo-thumbnail-wrapper'],
                            globalStyles['global-margin-top-item']
                        ])}>
                            {Object.keys(props.attributes.members.slice(0, 8)).map(item => (
                                <img key={props.attributes.members[item].key} className={globalStyles['global-photo-thumbnail-wrapper__multiple']} src="../../../img/female1-80.jpg"/>
                            ))}
                            {
                                props.attributes.members_amount > 8
                                &&
                                <div className={globalStyles['global-photo-thumbnail-wrapper__multiple--last']}>+{(props.attributes.members_amount - 8)}</div>
                            }
                        </div>
                    </div>
                </Link>
            }
            {
                (props.isLink == undefined && props.clickable != undefined)
                &&
                <button className={cn([
                    globalStyles['global-members-row__item'],
                    globalStyles['global-hover-standard'],
                    globalStyles['global-transition-duration'],
                    globalStyles['global-border-radius']
                ])}>
                    <img className={cn([
                        globalStyles['global-margin-bottom'],
                        globalStyles['global-center-item'],
                        globalStyles['global-photo-big']
                    ])} src="../img/female1-150.jpg" />
                    <div>
                        <div className={globalStyles['global-margin-bottom-small']}>{props.attributes.name}</div>
                        <div className={cn([
                            globalStyles['global-margin-subtext'],
                            globalStyles['global-fontsize-subtext']
                        ])}>Actief in {props.attributes.projects} {props.attributes.projects == 1 && "project" || "projecten"}</div>
                        <div className={cn([
                            globalStyles['global-photo-thumbnail-wrapper'],
                            globalStyles['global-margin-top-item']
                        ])}>
                            {Object.keys(props.attributes.members.slice(0, 8)).map(item => (
                                <img key={props.attributes.members[item].key} className={globalStyles['global-photo-thumbnail-wrapper__multiple']} src="../../../img/female1-80.jpg"/>
                            ))}
                            {
                                props.attributes.members_amount > 8
                                &&
                                <div className={globalStyles['global-photo-thumbnail-wrapper__multiple--last']}>+{(props.attributes.members_amount - 8)}</div>
                            }
                        </div>
                    </div>
                </button>
            }
            {
                (props.isLink == undefined && props.clickable == undefined)
                &&
                <div className={cn([
                    globalStyles['global-members-row__item'],
                    globalStyles['global-hover-standard-nocursor'],
                    globalStyles['global-transition-duration']
                ])}>
                    <img className={cn([
                        globalStyles['global-margin-bottom'],
                        globalStyles['global-center-item'],
                        globalStyles['global-photo-big']
                    ])} src="../img/female1-150.jpg" />
                    <div>
                        <div className={globalStyles['global-margin-bottom-small']}>{props.attributes.name}</div>
                        {
                            props.showActiveProjects
                            &&
                            <div className={cn([
                                globalStyles['global-margin-subtext'],
                                globalStyles['global-fontsize-subtext']
                            ])}>Actief in {props.attributes.projects} {props.attributes.projects == 1 && "project" || "projecten"}</div>
                        }
                        <div className={cn([
                            globalStyles['global-photo-thumbnail-wrapper'],
                            globalStyles['global-margin-top-item']
                        ])}>
                            {Object.keys(props.attributes.members.slice(0, 8)).map(item => (
                                <img key={props.attributes.members[item].key} className={globalStyles['global-photo-thumbnail-wrapper__multiple']} src="../../../img/female1-80.jpg"/>
                            ))}
                            {
                                props.attributes.members_amount > 8
                                &&
                                <div className={globalStyles['global-photo-thumbnail-wrapper__multiple--last']}>+{(props.attributes.members_amount - 8)}</div>
                            }
                        </div>
                    </div>
                </div>
            }
            {
                (props.showDeletebutton !== undefined && props.showDeletebutton)
                &&
                <button className={cn([
                    globalStyles['global-delete-button'],
                    globalStyles['global-center-item'],
                    globalStyles['global-color-subtext'],
                    globalStyles['global-fontsize-subtext']
                ])}>Verwijderen</button>
            }
        </>
    );
}