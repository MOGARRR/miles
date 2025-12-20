import React from 'react'

interface ProductItemProps {
  id: number
}

const adminProductpage: React.FC<ProductItemProps> = ({id}) => {
  return (
    <div>
    <div>IM EDIT PRODUCTPAGE {id}</div>
    <div>IM EDIT PRODUCTPAGE {id}</div>
    <div>IM EDIT PRODUCTPAGE {id}</div>
    <div>IM EDIT PRODUCTPAGE {id}</div>
    <div>IM EDIT PRODUCTPAGE {id}</div>
    <div>IM EDIT PRODUCTPAGE {id}</div>
    </div>
    
  )
}

export default adminProductpage