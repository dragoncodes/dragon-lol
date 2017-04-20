import React from 'react'
import Champion from 'components/Champion'
import ProgressBar from 'components/ProgressBar'
import { connect } from 'react-redux'

class TopChampions extends React.Component {

    static propTypes = {
        customRender: React.PropTypes.func,
        profileInfo: React.PropTypes.object,
        topChampions: React.PropTypes.array
    };

    render () {
        const { customRender, topChampions, profileInfo } = this.props

        if (customRender) {
            return this.customRender(topChampions, profileInfo)
        }

        let topChampionsLoading = !topChampions || !profileInfo

        if (topChampionsLoading) {
            return (
                <div>Loading best champions</div>
            )
        }

        return this.renderChampions(topChampions, profileInfo)
    }

    renderChampions (topChampions, profileInfo) {
        return (
            <div className='top-champions'>
                { topChampions.map((el, index) => {
                    return (
                        <div key={index} className='top-champion col-md-4'>
                            <Champion championId={el.championId}/>

                            <p> Champ Level: { el.championLevel } </p>
                            <ProgressBar progress={el.championPointsSinceLastLevel} width={6}
                                         maxProgress={el.championPointsUntilNextLevel + el.championPointsSinceLastLevel}/>
                        </div>
                    )
                }) }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const mapStateToProps = (state) => ({
    // summonerIcon: state.rito.summonerIcon,
    profileInfo: state.riot.profileInfo,
    topChampions: state.riot.topChampions

})

export default connect(mapStateToProps, mapDispatchToProps)(TopChampions)
