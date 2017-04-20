import React from 'react'
import { connect } from 'react-redux'

class SummonerCard extends React.Component {

    static propTypes = {
        customRender: React.PropTypes.func,
        summonerIcon: React.PropTypes.string,
        profileInfo: React.PropTypes.object
    };

    render () {
        const { customRender, profileInfo } = this.props

        if (customRender) {
            return this.customRender(profileInfo)
        }

        let profileLoading = !profileInfo

        if (profileLoading) {
            return this.getLoadingRender()
        }

        return this.renderContent(profileInfo)
    }

    renderContent (profileInfo) {
        const { summonerIcon } = this.props

        return (
            <div>
                <div>
                    <img src={summonerIcon}/>

                    <p>Level: { profileInfo.summonerLevel }</p>

                </div>
            </div>
        )
    }

    getLoadingRender () {
        return (
            <div>
                Profile Loading...
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const mapStateToProps = (state) => {
    return {
        summonerIcon: state.riot.summonerIcon,
        profileInfo: state.riot.profileInfo
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SummonerCard)
