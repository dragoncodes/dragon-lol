import { RiotApi } from 'riot-api'

export const RiotActions = {
    ProfileLoaded: 'PROFILE_LOADED',
    TopChampionsLoaded: 'TOP_CHAMPIONS_LOADED',

    ChampionLoaded: 'CHAMPION_LOADED',

    MatchesLoaded: 'MATHCES_LOADED',

    SummonerSpellLoaded: 'SUMMONER_SPELL_LOADED',

    ItemLoaded: 'ITEM_LOADED',

    MatchDataLoaded: 'MATCH_DATA_LOADED'
}

// +======= Actions =========+

export const profileLoaded = (profile) => {
    return {
        type: RiotActions.ProfileLoaded,
        profile
    }
}

export const topChampionsLoaded = (topChampions) => {
    return {
        type: RiotActions.TopChampionsLoaded,
        topChampions
    }
}

// ===========================

/**
 * Reducer
 */
export const riotReducer = (state = {}, action = {}) => {
    switch (action.type) {
        case RiotActions.ProfileLoaded:

            return Object.assign({}, state, {
                profileInfo: action.profile,
                summonerIcon: RiotApi.Instance.Summoner.IconUrl(action.profile.profileIconId)
            })

        case RiotActions.TopChampionsLoaded:

            return Object.assign({}, state, {
                topChampions: action.topChampions
            })

        case RiotActions.ChampionLoaded:

            let oldChampions = state.champions || {}

            let newChampions = {
                ...oldChampions,
                [action.champion.id]: action.champion
            }

            return {
                ...state,
                champions: newChampions
            }

        case RiotActions.SummonerSpellLoaded:

            let oldSummonerImages = state.summonerSpellImages || {}

            let newSummonerSpellImages = {
                ...oldSummonerImages,
                [action.summonerSpell.id]: action.summonerSpell
            }

            return {
                ...state,
                summonerSpellImages: newSummonerSpellImages
            }

        case RiotActions.ItemLoaded:

            let oldItems = state.items || {};

            let newItems = {
                ...oldItems,
                [action.item.id]: action.item
            }

            return {
                ...state,
                items: newItems
            }

        default:
            return state
    }
}
