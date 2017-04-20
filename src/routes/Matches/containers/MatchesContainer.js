import { connect } from 'react-redux'
import { loadMatches } from '../modules/matches'

import MatchesComponent from '../components/MatchesComponent'

const mapDispatchToProps = {
    loadMatches
}

const mapStateToProps = (state) => {
    return {
        matches: state.matches
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchesComponent)
