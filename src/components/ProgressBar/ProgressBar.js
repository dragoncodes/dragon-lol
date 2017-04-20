import React from 'react'

export default class ProgressBar extends React.Component {

    static propTypes:{
        progress: React.PropTypes.number.isRequired,
        maxProgress: React.PropTypes.number.isRequired,
        width: React.PropTypes.number
        };

    componentDidUpdate () {
    }

    componentDidMount () {
    }

    render () {
        const { progress, maxProgress, width } = this.props

        return (
            <div className='progress' style={{ width: width + 'em', margin: '0 auto' }}>

                <div className='progress-bar' role='progressbar' aria-valuenow='70'
                     aria-valuemin='0' aria-valuemax='100' style={{ width: (progress / maxProgress) * 100 + '%' }}>
                    <span className='sr-only'>{progress} / {maxProgress}</span>
                </div>
            </div>
        )
    }
}
