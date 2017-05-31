import cache from 'memory-cache'
import conf from '../../config/environments.config';

export const API_URL = conf[process.env.NODE_ENV]({}).api_url;

var _instance = null
export class RiotApi {
    constructor() {
        this.summonerName = location.hash.replace('#', '') || 'DragonCodes'

        this._endPoints = {
            SUMMONER_V3: `/summoner/${this.summonerName}`,
            TOP_CHAMPIONS: '/top-champions/{summonerId}',

            CHAMPION_BY_ID: '/champion/',

            MATCH_HISTORY: '/match-history/{summonerId}',

            SUMMONER_SPELL: '/summoner-spell/{spellId}',

            ITEMS: '/items/{itemId}',

            MATCH_DATA: '/match-data/{matchId}',

            MATCH_TIMELINE: '/match-data/timeline/{matchId}'
        }
    }

    static get Instance() {
        if (!_instance) {
            _instance = new RiotApi()
        }

        return _instance
    }

    get Champions() {
        return {
            ById: (championId) => {
                return this.buildRequest(this._endPoints.CHAMPION_BY_ID + championId)
                    .then((data) => {
                        if (data.image.full) {
                            data.image = '//ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + data.image.full
                        }

                        return data
                    })
            }
        }
    }

    get Summoner() {
        return {

            Name: ()=> {
                return this.summonerName;
            },

            Profile: () => {
                return this.buildRequest(this._endPoints.SUMMONER_V3).then((data) => {
                    this._summonerId = data.id
                    this._accountId = data.accountId

                    return data
                })
            },

            IconUrl: (iconId) => {
                return `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/${iconId}.png`
            },

            TopChampions: () => {
                if (!this._summonerId) {
                    return this.Summoner.Profile().then(() => {
                        return this.getTopChampionsRequest()
                    })
                }

                return this.getTopChampionsRequest()
            },

            RecentMatches: (accountId = this._summonerId) => {
                if (!accountId) {
                    return this.Summoner.Profile().then(() => {
                        return this.getRecentMatchesRequest(this._summonerId)
                    })
                }

                return this.getRecentMatchesRequest(accountId)
            }
        }
    }

    get Misc() {
        return {
            SummonerSpellImage: (spellId = '') => {
                return this.buildRequest(this._endPoints.SUMMONER_SPELL.replace('{spellId}', spellId))
                    .then((summonerSpell) => {
                        if (summonerSpell.image && summonerSpell.image.full) {
                            summonerSpell.imageUrl = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/spell/' + summonerSpell.image.full
                        }

                        return summonerSpell
                    })
            },

            Items: (itemId = '') => {
                return this.buildRequest(this._endPoints.ITEMS.replace('{itemId}', itemId))
                    .then((item) => {
                        item.imageUrl = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/' + item.image.full

                        return item
                    })
            },

            MinionsImageUrl: () => {
                return 'http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/minion.png'
            },

            GoldImageUrl: () => {
                return 'http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/gold.png'
            },

            Match: (matchId) => {
                if (!this._summonerId) {
                    return this.Summoner.Profile().then(() => {
                        return this.getMatchReplayRequest(matchId)
                    })
                }

                return this.getMatchReplayRequest(matchId)
            }
        }
    }

    getMatchReplayRequest(matchId) {
        return Promise.all([
            this.buildRequest(this._endPoints.MATCH_DATA.replace('{matchId}', matchId)),
            this.buildRequest(this._endPoints.MATCH_TIMELINE.replace('{matchId}', matchId))
        ]).then((data)=> {

            const matchData = data[0];
            const timelineData = data[1];

            const result = {
                ...matchData,

                timeline: {
                    ...timelineData
                }
            };

            return result;
        });
    }

    getRecentMatchesRequest(summonerId) {
        return this.buildRequest(this._endPoints.MATCH_HISTORY.replace('{summonerId}', summonerId)).then((payload) => {
            return payload.games
        })
    }

    getTopChampionsRequest() {
        return this.buildRequest(this._endPoints.TOP_CHAMPIONS.replace('{summonerId}', this._summonerId))
    }

    buildRequest(endPoint, overrideURL = null) {
        var url = this.buildUrl(endPoint, overrideURL)

        let promise = new Promise((resolve, reject) => {

            // Check for cached response
            let cachedResponse = cache.get(url)

            if (cachedResponse) {
                resolve(cachedResponse)
            } else {
                if (cache.get('a_' + url)) {
                    return
                }

                fetch(url)
                    .then(response => response.json())
                    .then((response) => {
                        cache.put(url, response, 60 * 1000)

                        cache.del('a_' + url)

                        resolve(response)
                    })
                    .catch((err) => {
                        reject(err)

                        console.error(err)
                    })
            }
        })

        // Fire only one HTTP request per url
        // Return the same promise every time until the response itself has been cached
        if (!cache.get('a_' + url)) {
            cache.put('a_' + url, promise)
        }

        return cache.get('a_' + url)
    }

    buildUrl(endPoint) {
        return API_URL + endPoint
    }
}
