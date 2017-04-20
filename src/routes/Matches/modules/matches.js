import { RiotActions } from 'store/riot'
import { RiotApi } from 'riot-api'

// ------------------------------------
// Actions
// ------------------------------------

export const loadMatches = () => {
    return (dispatch, getState) => {
        return RiotApi.Instance.Summoner.RecentMatches().then(
            (payload) => {
                dispatch({
                    type: RiotActions.MatchesLoaded,
                    matches: payload.games
                })
            }
        )
    }
}

export const actions = {
    loadMatches
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function matchesReducer (state = initialState, action = {}) {
    switch (action.type) {

        case RiotActions.MatchesLoaded:

            return action.matches

        default:
            return state
    }
};
