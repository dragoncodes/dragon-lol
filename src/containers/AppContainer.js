import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory, Router, useRouterHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createHistory } from 'history'
import con from '../../config/environments.config';

class AppContainer extends Component {

    static propTypes = {
        routes: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
    }

    shouldComponentUpdate () {
        return false
    }

    render () {
        const { routes, store } = this.props

        const history = useRouterHistory(createHistory)({
            basename: '/' + con[process.env.NODE_ENV]({}).base_public_path
        })

        return (
            <Provider store={store}>
                <div style={{ height: '100%' }}>
                    <Router history={history} children={routes}/>
                </div>
            </Provider>
        )
    }
}

export default AppContainer
