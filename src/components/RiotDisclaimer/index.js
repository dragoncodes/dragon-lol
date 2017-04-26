import React from 'react';

import './riotDisclaimer.scss';

export default class RiotDisclaimer extends React.Component {

    static propTypes:{
        gameName: React.PropTypes.string
        }

    render () {

        const {gameName = "ReactiveLeague"} = this.props;

        return (
            <div className="riot-disclaimer">
                {gameName} isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or
                anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games
                are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
            </div>
        );
    }
}