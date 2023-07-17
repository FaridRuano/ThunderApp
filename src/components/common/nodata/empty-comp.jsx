import React from 'react'
import { Fragment } from 'react'
import NoData from '../../../assets/images/gifs/no-data.gif'

const EmptyComponent = () => {
  return (
    <Fragment>
        <div className='no-data-warp'>
            <img src={NoData} className="no-data-gif" alt="No Data" />
            <span className='no-data-text'>No hay datos que mostrar</span>
        </div>
    </Fragment>
  )
}

export default EmptyComponent