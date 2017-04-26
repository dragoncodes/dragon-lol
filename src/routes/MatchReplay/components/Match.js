import React from 'react'
import { RiotApi } from 'riot-api'
import { Participant, FrameData } from '../models'
import Champion from 'components/Champion'
import SummonerSpell from 'components/SummonerSpellCard'
import { MatchScene } from '../scene'
import MatchCard from 'components/MatchCard'

import './match.scss'

export default class MatchesComponent extends React.Component {

    static propTypes:{
        loadMatch: React.PropTypes.func.isRequired,
        match: React.PropTypes.object,
        routerParams: React.PropTypes.any
        };

    constructor () {
        super();

        this.state = {
            friendlyTeamId: 0,
            friendlyTeam: [],

            enemyTeamId: 0,
            enemyTeam: [],

            frameData: [],

            frame: 1
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return !!nextProps.match && nextState.frameData.length > 0;
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.match) {

            this.initScene(nextProps.match)
            this.getMyParticipantId(nextProps.match)
        }
    }

    getMyParticipantId (match) {

        const { participantIdentities } = match;

        // If Player Data is provided for the match
        if (match.participantIdentities[ 0 ].player) {

            // Profile should already be loaded here
            // So no need for action/dispatch calls
            RiotApi.Instance.Summoner.Profile().then((profile) => {
                const myId = profile.id;
                let myParticipantId = 0;

                for (let i = 0; i < participantIdentities.length; i++) {
                    if (myId == participantIdentities[ i ].player.summonerId) {
                        myParticipantId = participantIdentities[ i ].participantId;

                        break;
                    }
                }

                this.buildTeams(myParticipantId, match);
            });
        } else {
            this.buildTeams(null, match);
        }
    }

    buildTeams (participantId, match) {
        const { participants, participantIdentities } = match;

        let enemyTeamId = null;
        let friendlyTeamId = null;

        if (!!participantId) {
            for (let i = 0; i < participants.length; i++) {
                if (participantId == participants[ i ].participantId) {
                    friendlyTeamId = participants[ i ].teamId;

                    // Participants are sorted by teamId
                    if (i <= 5) {
                        enemyTeamId = participants[ 6 ].teamId;
                    } else {
                        enemyTeamId = participants[ 0 ].teamId;
                    }
                    break;
                }
            }
        } else {
            friendlyTeamId = match.teams[ 0 ].teamId;
            enemyTeamId = match.teams[ 1 ].teamId;
        }

        const friendlyTeam = [];
        const enemyTeam = [];

        for (let i = 0; i < participants.length; i++) {
            const participant = new Participant(participants[ i ], participantIdentities[ i ].player);
            if (friendlyTeamId === participants[ i ].teamId) {
                friendlyTeam.push(
                    participant
                );
            } else {
                enemyTeam.push(
                    participant
                );
            }
        }

        if (match.teams[ 0 ].teamId == friendlyTeamId) {
            friendlyTeam.isWinner = match.teams[ 0 ].winner;
            enemyTeam.isWinner = match.teams[ 1 ].winner;
        } else {
            friendlyTeam.isWinner = match.teams[ 1 ].winner;
            enemyTeam.isWinner = match.teams[ 0 ].winner;
        }

        this.setState({
            friendlyTeam,
            friendlyTeamId,

            enemyTeamId,
            enemyTeam
        });

        this.buildFrameData(match);
    }

    participant (participantId) {
        if (participantId <= 5) {
            return this.state.friendlyTeam[ participantId - 1 ];
        } else {
            return this.state.enemyTeam[ participantId - 6 ];
        }
    }

    buildFrameData (match) {
        const { timeline } = match;

        console.time('FrameData');
        const frameData = [];

        for (let i = 0; i < timeline.frames.length; i++) {
            frameData[ i ] = new FrameData(timeline.frames[ i ]);
        }

        this.setState({
            frameData
        });

        this.matchScene.frameData = frameData[ this.state.frame ];
    }

    componentDidMount () {

        const { loadMatch, routeParams, match } = this.props;
        const { matchId } = routeParams;

        if (match && match.matchId == matchId) {
            this.getMyParticipantId(match);
        } else {
            loadMatch(matchId);
        }
    }

    handleChangeFrame (event) {
        let frame = event.target.value || 1;

        if (frame < 0 || frame > this.state.frameData.length - 1) {
            frame = this.state.frameData.length - 1;
        }

        this.setState({
            frame
        })

        this.matchScene.frameData = this.state.frameData[ frame ];
    }

    render () {
        const { match } = this.props

        const { frameData, frame } = this.state

        if (!match || !frameData[ frame ]) {
            return (
                <div>
                    Loading match
                </div>
            )
        }

        return (
            <div className='match-holder col-md-12'>

                <div className="metadata-holder">
                    <div className='region'>{this.renderRegion(match.region)}</div>
                    <div className='mode'>{this.renderMatchMode(match.matchMode)}</div>
                    <div className='queueType'>{this.renderQueueType(match.queueType)}</div>
                </div>

                <div className="col-md-12">
                    <input type="number" max={frameData.length - 1} value={frame} min='1'
                           onChange={this.handleChangeFrame.bind(this)}/>
                    &thinsp;minute
                </div>

                <div className="feed-holder col-md-12">
                    <div className="kill-feed">
                        { frameData[ frame ].getKillFeed().map(this.renderKillFeedItem.bind(this)) }
                    </div>

                    <div ></div>
                </div>


                <div className="col-md-3 friendly-team team-holder">
                    { this.state.friendlyTeam.isWinner ? 'WIN' : 'LOSE' }
                    {this.renderFriendlyTeam()}
                </div>

                <div ref={
                    el => {
                        this.matchScene.setNode(el);
                    }
                } className="col-md-6 match-scene"></div>

                <div className="col-md-3 enemy-team team-holder">
                    { this.state.enemyTeam.isWinner ? 'WIN' : 'LOSE' }
                    {this.renderEnemyTeam()}
                </div>
            </div>
        )
    }

    renderQueueType (queueType) {
        let type = ''
        switch (queueType) {
            case 'TEAM_BUILDER_RANKED_SOLO':
                type = 'Ranked Team Builder'

                break;
            case 'RANKED_FLEX_SR':
                type = 'Ranked Flex'

                break;

            case 'TEAM_BUILDER_DRAFT_UNRANKED_5x5':
                type = 'Normal 5v5 Draft Pick'

                break;

            case 'ARSR_5x5':
                type = 'ARAM Urf'

                break;

            case 'ARAM_5x5':
                type = 'ARAM'

                break;
            case 'GROUP_FINDER_5x5':
                type = 'Team Builder';
                break;

            case 'BOT_5x5_INTRO':
            case 'BOT_5x5_BEGINNER':
            case 'BOT_5x5_INTERMEDIATE':
                type = 'Bots Game'
                break;

            case 'RANKED_SOLO_5x5':
                type = 'Ranked Solo 5v5'
                break;

            case 'NORMAL_5x5_DRAFT':
                type = 'Normal 5v5 Draft Pick'
                break;

            case 'NORMAL_5x5_BLIND':
                type = 'Normal 5v5 Blind Pick'
                break;

            case 'CUSTOM':
                type = 'Custom game'
                break;

            default :
                type = 'Other';
        }

        return type;
    }

    renderMatchMode (matchMode) {
        let mode = matchMode.toLowerCase();
        mode = mode.replace(mode[ 0 ], mode[ 0 ].toUpperCase());
        return mode;
    }

    renderRegion () {
        return "EU West"
    }

    initScene (match) {

        if (!this.matchScene) {
            this.matchScene = new MatchScene(match);
        }
    }

    renderKillFeedItem (kill, index) {

        const victimParticipant = this.participant(kill.victimId),
            killerParticipant = this.participant(kill.killerId),
            assistingParticipants = [];

        for (let i = 0; i < kill.assists.length; i++) {
            assistingParticipants.push(this.participant(kill.assists[ i ]));
        }

        return (
            <div className="kill-holder col-md-6" key={index}>

                { assistingParticipants.map((assistPart, index) => {
                    return (
                        <Champion key={index} customRender={this.getChampionRender.bind(this, true)}
                                  showName={false}
                                  championId={assistPart.championId}/>
                    )
                }) }

                {
                    !killerParticipant ? <img src={RiotApi.Instance.Misc.MinionsImageUrl()} alt="Minions"/> :
                        <Champion customRender={this.getChampionRender.bind(this, false)} showName={false}
                                  championId={killerParticipant.championId}/>
                }

                <img src="http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/score.png" alt="Killed"/>

                <Champion customRender={this.getChampionRender.bind(this, false)} showName={false}
                          championId={victimParticipant.championId}/>
            </div>
        )
    }

    getChampionRender (isAssist, champions, championId) {

        return (
            <img className={isAssist ? 'assists-champ' : 'kill-participant'} src={champions[championId].image}/>
        );
    }

    renderEnemyTeam () {
        const { enemyTeam } = this.state;
        return (this.renderTeam(enemyTeam));
    }

    renderFriendlyTeam () {
        const { friendlyTeam } = this.state;
        return (this.renderTeam(friendlyTeam));
    }

    renderFrameData (participantId, frameIndex) {

        frameIndex -= 1;
        participantId -= 1;

        const frame = this.state.frameData[ frameIndex ].getParticipantFrame(participantId);

        return (
            <div className="frame">

                <div className="frame-details ">
                    <div>
                        {frame.isDead ? "Dead" : '' }
                        {frame.creepScore} <img src={RiotApi.Instance.Misc.MinionsImageUrl()} alt="Minions"/>
                    </div>

                    <div>Level: {frame.level} </div>
                    <div>
                        {frame.gold} / {frame.totalGold}
                        <img src={RiotApi.Instance.Misc.GoldImageUrl()} alt="Gold"/>
                    </div>
                </div>

                <div className="frame-events">
                </div>

            </div>
        );
    }

    getStyleForRank (rank) {

        let borderColor = 'bronze';
        switch (rank) {
            case 'SILVER':

                borderColor = 'silver'
                break;

            case 'GOLD':

                borderColor = 'gold';

                break;

            case 'PLATINUM':

                borderColor = '#E5E4E2';
                break;

            case 'MASTER':

                break;
        }

        return {
            borderColor
        }
    }

    renderTeam (team) {
        return (
            <div className="team">
                { team.map((participant) =>(
                    <div className="col-md-12" key={participant.id}>
                        <div className="col-md-5">

                            <div className="name-holder" title={participant.name}>
                                {participant.name}
                            </div>

                            <div className="champion-frame" style={this.getStyleForRank(participant.rank)}>
                                <Champion showName={false} championId={participant.championId}/>
                            </div>
                            <div style={{float: 'right'}}>
                                <SummonerSpell imageWidth='25em' summonerSpellId={participant.summonerSpells[0]}/>
                            </div>
                            <div >
                                <SummonerSpell imageWidth='25em' summonerSpellId={participant.summonerSpells[1]}/>
                            </div>

                        </div>
                        <div className="col-md-7">
                            {this.renderFrameData(participant.id, this.state.frame)}
                        </div>
                    </div>
                )) }
            </div>
        )
    }
}
