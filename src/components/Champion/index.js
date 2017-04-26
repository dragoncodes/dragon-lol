import React from 'react'
import { RiotApi } from 'riot-api'
import { RiotActions } from 'store/riot'
import { connect } from 'react-redux'

import './champion.scss'

class Champion extends React.Component {

    static propTypes = {
        championId: React.PropTypes.number,
        champions: React.PropTypes.any,
        customRender: React.PropTypes.func,

        loadChampion: React.PropTypes.func.isRequired,
        showName: React.PropTypes.bool
    };

    shouldComponentUpdate (nextProps, nextState) {
        // Update only when the champion for this component has arrived

        return !!(nextProps.champions && nextProps.champions[ nextProps.championId ])
    }

    componentDidMount () {
        const props = this.props

        if (props.championId) {
            this.props.loadChampion(props.championId)
        }
    }

    render () {
        const { customRender, champions, championId } = this.props

        let championLoading = !champions || !champions[ championId ]

        if (championLoading) {
            return (
                <div>Loading champion</div>
            )
        }

        if (customRender) {
            return customRender(champions, championId)
        }

        return this.renderChampion(champions[ championId ])
    }

    renderChampion (champion) {
        const { showName = true } = this.props

        return (
            <div className='champion-card'>
                <img crossOrigin='' className='champion-image' src={champion.image}/>

                {showName ? (
                    <div className='champion-title'>
                        { champion.name + ' ' + champion.title }
                    </div>
                ) : null }

            </div>
        )
    }
}

// +=============== Actions ==============
const championLoaded = (champion) => {
    return {
        type: RiotActions.ChampionLoaded,
        champion
    }
}
// =======================================

const mapDispatchToProps = (dispatch) => {
    return {
        loadChampion: (championId) => {
            return RiotApi.Instance.Champions.ById(championId).then(
                (champion) => {
                    dispatch(championLoaded(champion))
                }
            )
        }
    }
}

const mapStateToProps = (state) => ({
    champions: state.riot.champions
})

export default connect(mapStateToProps, mapDispatchToProps)(Champion)
