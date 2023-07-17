import React from 'react'
import { Fragment } from 'react'
import Loading from '../../../assets/images/gifs/loading.gif'

const LoadingComponent = () => {
  return (
    <Fragment>
        <div className='no-data-warp'>
            <img src={Loading} className="no-data-gif" alt="No Data" />
            <span className='no-data-text'>Cargando...</span>
        </div>
    </Fragment>
    
  )
}

export default LoadingComponent