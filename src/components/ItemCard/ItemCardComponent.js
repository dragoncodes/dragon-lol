import React from 'react';
import { RiotApi } from 'riot-api'
import { RiotActions } from 'store';
import { connect } from 'react-redux';

import './itemCard.scss'

class ItemCardComponent extends React.Component {
    propTypes:{
        itemId: React.PropTypes.string,
        items: React.PropTypes.array,

        requestItem: React.PropTypes.func.isRequired
        }


    constructor () {
        super();
        this.state = {
            noItem: false
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return !!nextProps.itemId && !!nextProps.items && !!nextProps.items[ nextProps.itemId ] || nextState.noItem;
    }

    componentDidMount () {

        const {itemId} = this.props;

        if (itemId) {
            this.props.requestItem(itemId);
        } else {
            this.setState({
                noItem: true
            });
        }
    }

    render () {
        const {noItem} = this.state;
        if (noItem) {
            return (
                <div className="item">
                    <div className="no-item"></div>
                </div>
            );
        }

        const { itemId, items } = this.props;

        const loading = !items || !items[ itemId ];

        if (loading) {
            return (<div>Loading Item</div>);
        }

        const item = items[ itemId ];

        return (
            <div className="item">
                <img className="item-image" src={item.imageUrl} alt={item.name}/>
            </div>
        );
    }
}

const requestItem = (itemId) => {
    return (dispatch, getState) => {
        return RiotApi.Instance.Misc.Items(itemId).then(
            (item) => {
                dispatch({
                    type: RiotActions.ItemLoaded,
                    item
                })
            }
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    requestItem: (itemId) => {
        dispatch(requestItem(itemId))
    }
})

const mapStateToProps = (state) => ({
    items: state.riot.items
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemCardComponent);