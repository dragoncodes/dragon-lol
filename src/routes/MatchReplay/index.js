import { injectReducer } from 'store/reducers'
import MatchReplay from './containers/MatchContainer';

export default (store) => ({
    path: 'replay-match/:matchId',
    ///*  Async getComponent is only invoked when route matches   */
    getComponent (nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
         and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
             dependencies for bundling   */
            const Match = require('./containers/MatchContainer').default
            const reducer = require('./modules/match').default

            /*  Add the reducer to the store on key 'counter'  */
            injectReducer(store, { key: 'match', reducer })

            /*  Return getComponent   */
            cb(null, Match)

            /* Webpack named bundle   */
        }, 'replay-match')
    }
});
