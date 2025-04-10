// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useState } from 'react';
// Global / Page / Layout components
import GlobalComponentMember from '../Member';
import GlobalComponentTeamCard from '../team/Card';
// Page styles
import globalStyles from '../../styles/global.module.scss';

const GlobalComponentCreateTeam = (props) => {
    const [currentView, setCurrentView] = useState(1);

    return (
        <div className={globalStyles['global-create-teamview']}>
            <div className={cn([
                globalStyles['global-create-teamview__left'],
                globalStyles['global-border-column'],
                globalStyles['global-border-radius']
            ])}>
                <div className={globalStyles['block-header']}>
                    <div className={cn([
                        globalStyles['global-grid-2'],
                        globalStyles['global-tabs'],
                        globalStyles['global-margin-bottom']
                    ])}>
                        <button href="/projects/info" className={cn({
                            [globalStyles['global-tabs__item-flex']]:true,
                            [globalStyles['global-transition-duration']]:true,
                            [globalStyles['global-tabs__active']]:currentView == 1,
                            [globalStyles['global-tabs__inactive']]:currentView != 1
                        })} onClick={() => setCurrentView(1)}>
                            <i className={globalStyles['global-tabs__item-icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['user'].toSvg({height: "1vw", widfth: "1vw"})}}></i>
                            Deelnemers
                        </button>
                        <button href="/projects/info" className={cn({
                            [globalStyles['global-tabs__item-flex']]:true,
                            [globalStyles['global-transition-duration']]:true,
                            [globalStyles['global-tabs__active']]:currentView == 2,
                            [globalStyles['global-tabs__inactive']]:currentView != 2
                        })} onClick={() => setCurrentView(2)}>
                            <i className={globalStyles['global-tabs__item-icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: "1vw", widfth: "1vw"})}}></i>
                            Teams
                        </button>
                    </div>
                    <div className={globalStyles['block-header__title']}>
                        {
                            currentView == 1
                            &&
                            "Beschikbare deelnemers"
                            ||
                            "Beschikbare teams"
                        }
                    </div>
                    <div className={cn([
                        globalStyles['block-header__subtitle'],
                        globalStyles['global-color-subtext'],
                        globalStyles['global-margin-subtext']
                    ])}>
                        {
                            currentView == 1
                            &&
                            "Klik op deelnemer om toe te voegen"
                            ||
                            "Klik op team om toe te voegen"
                        }
                    </div> 
                    {
                        currentView == 1      
                        &&                  
                        <select className={cn([
                            globalStyles['global-select'],
                            globalStyles['global-transition-duration']
                        ])}>
                            <option>Toon iedereen</option>
                            <option>Toon teamleiders</option>
                            <option>Toon teamleden</option>
                        </select>     
                    }
                </div>
                <div className={globalStyles['block-content']}>
                    <div className={globalStyles['block-content__wrapper']}>
                    
                            {
                                currentView == 1
                                &&
                                <>
                                    <div className={globalStyles['global-seperator-with-text']}>
                                        <div className={globalStyles['global-seperator-with-text__line']}></div>
                                        <div className={globalStyles['global-seperator-with-text__content']}>Teamleiders</div>
                                        <div className={globalStyles['global-seperator-with-text__line']}></div>
                                    </div>
                                    <div className={globalStyles['global-members-row']}>
                                        {
                                            props.participants.teamleaders.length > 0
                                            &&
                                            Object.keys(props.participants.teamleaders).map(item => (
                                                <GlobalComponentMember key={props.participants.teamleaders[item].key} attributes={props.participants.teamleaders[item]}/>
                                            ))
                                            ||
                                            <div className={globalStyles['global-emptymessage']}>
                                                Er zijn nog geen teamleiders
                                                <button className={cn([
                                                    globalStyles['global-button'],
                                                    globalStyles['global-button-hover'],
                                                    globalStyles['global-transition-duration'],
                                                    globalStyles['global-margin-top']
                                                ])} onClick={() => setCurrentStage(2)}>
                                                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                                    Teamleider aanmaken
                                                </button>
                                            </div>                                   
                                        }
                                    </div>
                                    <div className={globalStyles['global-seperator-with-text']}>
                                        <div className={globalStyles['global-seperator-with-text__line']}></div>
                                        <div className={globalStyles['global-seperator-with-text__content']}>Teamleden</div>
                                        <div className={globalStyles['global-seperator-with-text__line']}></div>
                                    </div>
                                    <div className={globalStyles['global-members-row']}>
                                        {
                                            props.participants.members.length > 0
                                            &&
                                            Object.keys(props.participants.members).map(item => (
                                                <GlobalComponentMember key={props.participants.members[item].key} attributes={props.participants.members[item]}/>
                                            ))
                                            ||
                                            <div className={globalStyles['global-emptymessage']}>
                                                Er zijn nog geen teamleden
                                                <button className={cn([
                                                    globalStyles['global-button'],
                                                    globalStyles['global-button-hover'],
                                                    globalStyles['global-transition-duration'],
                                                    globalStyles['global-margin-top']
                                                ])} onClick={() => setCurrentStage(2)}>
                                                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                                    Teamlid aanmaken
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </>
                                ||                  
                                <div className={globalStyles['global-row-teams']}>
                                    {
                                        props.teams.length > 0
                                        &&
                                        Object.keys(props.teams).map(item => (
                                            <GlobalComponentTeamCard key={props.teams[item].key} attributes={props.teams[item]}/>
                                        ))
                                        ||
                                        <div className={globalStyles['global-emptymessage']}>
                                            Er zijn nog geen teams
                                            <button className={cn([
                                                globalStyles['global-button'],
                                                globalStyles['global-button-hover'],
                                                globalStyles['global-transition-duration'],
                                                globalStyles['global-margin-top']
                                            ])} onClick={() => setCurrentStage(2)}>
                                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                                Team aanmaken
                                            </button>
                                        </div>
                                    }
                                </div>
                            }
                    </div>
                </div>
            </div>
            <div className={cn([
                globalStyles['global-create-teamview__right'],
                globalStyles['global-border-column'],
                globalStyles['global-border-radius']
            ])}>
                <div className={globalStyles['block-header']}>
                    <div className={globalStyles['block-header__title']}>Gekozen teams & deelnemers</div>
                </div>
                <div className={globalStyles['block-content']}>
                    <div className={globalStyles['block-content__wrapper']}>
                        <div className={globalStyles['global-seperator-with-text']}>
                            <div className={globalStyles['global-seperator-with-text__line']}></div>
                            <div className={globalStyles['global-seperator-with-text__content']}>Teams</div>
                            <div className={globalStyles['global-seperator-with-text__line']}></div>
                        </div>
                        {
                            props.addedToProject.teams.length > 0
                            &&
                            <div className={globalStyles['global-grid-5']}>
                                {Object.keys(props.addedToProject.teams).map(item => (
                                    <GlobalComponentTeamCard key={props.addedToProject.teams[item].key} attributes={props.addedToProject.teams[item]}/>
                                ))}
                            </div>
                            ||
                            <div className={globalStyles['global-emptymessage']}>Er zijn nog geen teams toegevoegd</div>
                        }
                        <div className={globalStyles['global-seperator-with-text']}>
                            <div className={globalStyles['global-seperator-with-text__line']}></div>
                            <div className={globalStyles['global-seperator-with-text__content']}>Deelnemers zonder team</div>
                            <div className={globalStyles['global-seperator-with-text__line']}></div>
                        </div>
                        {
                            props.addedToProject.participants.length > 0
                            &&
                            <div className={globalStyles['global-grid-5']}>
                                {Object.keys(props.addedToProject.participants).map(item => (
                                    <GlobalComponentMember key={props.addedToProject.participants[item].key} attributes={props.addedToProject.participants[item]}/>
                                ))}
                            </div>
                            ||
                            <div className={globalStyles['global-emptymessage']}>Er zijn nog geen deelnemers toegevoegd</div>
                        }
                    </div>
                </div>
            </div>
        </div>   
    );
}
export default GlobalComponentCreateTeam;