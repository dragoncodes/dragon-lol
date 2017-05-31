import React from 'react'
import PropTypes from 'prop-types'
import RiotDisclaimer from 'components/RiotDisclaimer'
import Header from '../../components/Header'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
    <div className='container text-center' style={{position: 'relative'}}>
        <Header />

        <div className='core-layout__viewport'>
            {children}
        </div>

        <RiotDisclaimer />
    </div>
)

CoreLayout.propTypes = {
    children: PropTypes.element.isRequired
}

export default CoreLayout
