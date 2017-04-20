import { connect } from 'react-redux'

import HomeComponent from '../components/HomeView'

const mapDispatchToProps = {}

const mapStateToProps = (state) => ({
    profileInfo: state.riot.profileInfo,
    topChampions: state.riot.topChampions,
    summonerIcon: state.riot.summonerIcon
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent)
