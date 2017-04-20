import React from 'react'
import SummonerSpell from 'components/SummonerSpellCard'
import Champion from 'components/Champion'

import './MatchCard.scss'

export default class MatchCard extends React.Component {

    static propTypes:{
        match: React.PropTypes.object.isRequired
        };

    render () {
        const { match } = this.props

        const { stats } = match

        return (
            <div key={match.gameId} className='match-holder col-md-12'>

                <div className='col-md-6'>
                    <Champion showName={false} championId={match.championId}/>

                    <div className='col-md-4'/>
                    <div className='col-md-4 row'>
                        <div className='col-md-2'/>
                        <div className='col-md-4'>
                            <SummonerSpell summonerSpellId={match.spell1}/>
                        </div>
                        <div className='col-md-4'>
                            <SummonerSpell summonerSpellId={match.spell2}/>
                        </div>
                        <div className='col-md-2'/>
                    </div>
                    <div className='col-md-4'/>

                    <div className='match-score'>
                        { (stats.championsKilled || '0') + '/' + (stats.numDeaths || '0') + '/' + (stats.assists || '0')}
                    </div>

                </div>

                <div className='col-md-6'>
                    <div className='my-comment'>
                        { this.getCommentFromDeaths(stats.numDeaths, stats.championsKilled) }
                    </div>

                    <div className='win-lose'>
                        {this.getWinLoseText(stats.win)}
                    </div>
                </div>
            </div>
        )
    }

    getWinLoseText (win) {
        return win ? (<div className='win-text'>WIN</div>) : <div className='lose-text'>LOSE</div>
    }

    getCommentFromDeaths (numDeaths = 0, playersKilled = 0) {
        var text = ''

        let kda = numDeaths === 0 ? playersKilled : playersKilled / numDeaths
        if (kda > 1.4) {
            text = 'I AM A GOD'
        } else if (numDeaths < 2) {
            text = 'I carried so HAARD!'
        } else if (numDeaths <= 6) {
            text = 'I did ok, I think'
        } else {
            text = "I don't want to talk about it"
        }

        return text
    }
}
