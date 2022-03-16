import React from 'react'

const Alerta = ({children}) => {
  return (
    <div className='text-center my-4 bg-red-900 text-white font-bold p-3 uppercase font-style: italic'>
        {children}
    </div>
  )
}

export default Alerta