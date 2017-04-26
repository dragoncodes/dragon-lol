import React from 'react'
import { connect } from 'react-redux'
import { RiotApi } from 'riot-api'
import { RiotActions } from 'store/riot'

class SummonerSpellCard extends React.Component {
    static propTypes:{
        summonerSpellId: React.PropTypes.number.isRequired,
        summonerSpellImages: React.PropTypes.object,

        imageWidth: React.PropTypes.string,
        loadSummonerSpell: React.PropTypes.func.isRequired
        };

    componentDidMount () {
        this.props.loadSummonerSpell(this.props.summonerSpellId)
    }

    shouldComponentUpdate (nextProps, nextState) {
        return !!(nextProps.summonerSpellImages && nextProps.summonerSpellImages[ nextProps.summonerSpellId ])
    }

    render () {
        const { summonerSpellImages = {}, summonerSpellId, imageWidth = '35em' } = this.props

        let summonerSpellImage = summonerSpellImages[ summonerSpellId ]

        if (!summonerSpellImage) {
            return (<div>Loading</div>)
        }

        return (
            <div className='summoner-spell-holder'>
                <img width={imageWidth} src={summonerSpellImage.imageUrl} alt='SummonerSpell'/>
            </div>
        )
    }
}

// Actions
const loadSummonerSpell = (summonerSpellId) => {
    return (dispatch, getState) => {
        return RiotApi.Instance.Misc.SummonerSpellImage(summonerSpellId).then(
            (summonerSpell) => {
                dispatch({
                    type: RiotActions.SummonerSpellLoaded,
                    summonerSpell
                })
            }
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSummonerSpell: (summonerSpellId) => {
            dispatch(loadSummonerSpell(summonerSpellId))
        }
    }
}

const mapStateToProps = (state) => ({
    summonerSpellImages: state.riot.summonerSpellImages
})

export default connect(mapStateToProps, mapDispatchToProps)(SummonerSpellCard)
