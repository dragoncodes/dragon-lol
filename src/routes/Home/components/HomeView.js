import React from 'react'
import SummonerCard from 'components/SummonerCard'
import TopChampions from 'components/TopChampions'
import './HomeView.scss'

export default class HomeView extends React.Component {

    constructor () {
        super()

        this.state = {}
    }

    componentDidMount () {

    }

    render () {
        return (
            <div>
                <SummonerCard />

                <div className='label-top-champs'>My Best Champions</div>
                <TopChampions />
            </div>
        )
    }

}
