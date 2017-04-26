import { RiotActions } from 'store/riot'
import { RiotApi } from 'riot-api'

// ------------------------------------
// Actions
// ------------------------------------

export const loadMatch = (matchId) => {
    return (dispatch, getState) => {
        return RiotApi.Instance.Misc.Match(matchId).then(
            (match) => {
                dispatch({
                    type: RiotActions.MatchDataLoaded,
                    match
                })
            }
        )
    }
}

export const actions = {
    loadMatch
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function matchesReducer (state = initialState, action = {}) {
    switch (action.type) {

        case RiotActions.MatchDataLoaded:

            return action.match

        default:
            return state
    }
};
