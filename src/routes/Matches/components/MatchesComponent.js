import React from 'react'
import MatchCard from 'components/MatchCard'

export default class MatchesComponent extends React.Component {

    static propTypes:{
        loadMatches: React.PropTypes.func.isRequired
        };

    componentDidMount () {
        this.props.loadMatches()
    }

    render () {
        const { matches } = this.props

        if (!matches) {
            return (
                <div>
                    Loading matches
                </div>
            )
        }

        return (
            <div className='matches-holder col-md-12'>

                { this.getOverallScore(matches) }

                { this.renderMatches(matches) }
            </div>
        )
    }

    getOverallScore (matches) {
        let wins = 0

        for (let i = 0; i < matches.length; i++) {
            wins += (matches[ i ].stats.win) | 0
        }

        return (
            <div>
                <div>{`${wins} wins out of ${matches.length} games`}</div>
                { wins > (matches.length * 2 / 3) ? 'I am doing ok' : 'My internet was bad. I was drunk... also other reasons' }
            </div>
        )
    }

    renderMatch (match) {
        return (
            <MatchCard key={match.gameId} match={match}/>
        )
    }

    renderMatches (matches) {
        return (
            <div>
                { matches.map((match) => {
                    return this.renderMatch(match)
                }) }
            </div>
        )
    }
}
