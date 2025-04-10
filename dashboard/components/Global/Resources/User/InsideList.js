// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
//import Image from 'next/image'
import { 
    GLOBALFUNC__UserInitials,
    GLOBALFUNC__TranslateUserRole,
    GLOBALFUNC__CalculatePercentage
} from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const UserComponentInsideList = (props) => {
    const FUNC__imageLoader = ({src, width, quality}) => {
        return `${src}?w=${width}&q=${quality || 100}`
    }

    return (
        <>
        <div className={cn({
            [globalStyles['global-user-in-list']]:true,
            [globalStyles['global-user-in-list__centered']]:true,
            [globalStyles['global-user-in-list__clickable']]:props.clickable,
            [globalStyles['global-text-align-start']]:props.clickable,
            [globalStyles['global-hover-standard']]:props.clickable,
            [globalStyles['global-transition-duration']]:props.clickable
        })}>
            {/*
                props.user.profile_photo.thumbnail != ''
                &&
                <Image
                loader={FUNC__imageLoader}
                    src={props.user.profile_photo.thumbnail}
                    className={globalStyles['global-photo-thumbnail-wrapper__single']}
                    width={30}
                    height={30}
                    alt={'Profiel foto van ' + props.user.firstname + ' ' + props.user.lastname}/>
            }
            {
                props.user.profile_photo.thumbnail == ''
                &&
                <div className={globalStyles['global-photo-thumbnail-wrapper__single']}>
                    <i className={globalStyles['icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['user'].toSvg({height: '1vw', width: '1vw', fill: '#272727'})}}></i>
                </div>
            */}
            <div className={globalStyles['global-photo-thumbnail-wrapper__single']}>
                {GLOBALFUNC__UserInitials(
                    props.user.firstname,
                    props.user.lastname
                )}
            </div>
            <div>
                <div className={globalStyles['global-display-flex']}>
                    {props.user.firstname} {props.user.lastname} {props.showAdminIcon && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['shield'].toSvg({height: "1vw", width: "1vw"})}}></i>}
                </div>
                <div className={cn([
                    globalStyles['global-fontsize-subtext'],
                    globalStyles['global-margin-subtext'],
                    globalStyles['global-text-align-start']
                ])}>{GLOBALFUNC__TranslateUserRole(props.user.role)} ({props.user.label})</div>
            </div>
        </div>
        {
            props.showOccupation
            &&
            <div className={cn([
                globalStyles['global-user-in-list__occupation'],
                globalStyles['global-margin-bottom']
            ])}>
                <div className={cn(
                    globalStyles['global-margin-bottom-item'],
                    globalStyles['global-fontweight-bold'],
                    globalStyles['global-text-align-center']
                )}>Bezetting week 21</div>
                <div className={globalStyles['occupation-container']}>
                    <div>
                        <div className={cn([
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-text-align-center']
                        ])}>Planbaar</div>
                        <div  className={globalStyles['global-text-align-center']}>
                            {props.user.hours_per_week == null ? '0' : props.user.hours_per_week} uur
                        </div>
                    </div>
                    <div className={globalStyles['global-seperator__vertical']}></div>
                    <div>
                        <div className={cn([
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-text-align-center']
                        ])}>Ongepland</div>
                        <div className={globalStyles['global-text-align-center']}>
                            {
                                props.user.occupation.week == null
                                &&
                                '0 uur'
                                ||
                                (props.user.hours_per_week - props.user.occupation.week.hours) + ' uur'
                            }
                        </div>
                    </div>
                    <div className={globalStyles['global-seperator__vertical']}></div>
                    <div>
                        <div className={cn([
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-text-align-center']
                        ])}>Ingepland</div>
                        <div className={globalStyles['occupation-container__indicator']}>
                            <div className={globalStyles['indicator-percentage']}>
                            <div 
                                className={globalStyles['indicator-percentage__filler']} 
                                style={{width: props.user.occupation.week == null ? 0 : GLOBALFUNC__CalculatePercentage(
                                    props.user.occupation.week.hours,
                                    props.user.hours_per_week
                                )+"%"}}></div>
                            </div>
                            <div className={globalStyles['global-text-align-end']}>
                                {props.user.occupation.week == null ? '0' : props.user.occupation.week.hours} uur
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    );
}
export default UserComponentInsideList;