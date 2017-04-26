import { connect } from 'react-redux'
import { loadMatch } from '../modules/match'

import Match from '../components/Match'

const mapDispatchToProps = {
    loadMatch
}

const mapStateToProps = (state) => {
    return {
        match: state.match
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Match)
