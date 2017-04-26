import React from 'react'
import { IndexLink, Link } from 'react-router'
import { RiotApi } from '../../riot-api';
import './Header.scss'

export const Header = () => (
    <div>
        <h1>{RiotApi.Instance.Summoner.Name()} in League Of Legends</h1>

        <IndexLink to='/' activeClassName='route--active'>
            Home
        </IndexLink>
        {' · '}
        <Link to='/matches' activeClassName='route--active'>
            Recent matches
        </Link>
    </div>
)

export default Header
