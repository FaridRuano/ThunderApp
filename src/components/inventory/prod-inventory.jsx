import React, { Fragment, useEffect, useState } from 'react'
import { CardHeader, Col, Row, Card, Input } from 'reactstrap'
import Breadcrumb from "../common/breadcrumb";
import { Autocomplete } from '@mui/joy';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import ApiUrls from '../../constants/apiUrl';
import DataTable from 'react-data-table-component';
import EmptyComponent from '../common/nodata/empty-comp';


const ProductInventory = () => {

	const baseUrl = ApiUrls.base+"th_inventory/inventory.php"

	const {id = ''}=useParams()
  const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
  const [prod, setProduct] = useState('')
  const [prodObj, setProdObj] = useState('')

  const reqData=async()=>{
		setLoading(true);
        await axios.get(baseUrl+'?METHOD=INDEGET').then(response=>{
          setData(response.data)
          if(id !== ''){          
            const matchProd = response.data.find(obj => obj.id === parseInt(id))
            if(matchProd){
              setProdObj(matchProd)
              setProduct(matchProd.name)
            }
          }
        })
		setLoading(false);
  }

  useEffect(()=>{
    reqData()
  },[])

  const op_prod = data.map(item => item.name) 
 
  return (
    <Fragment>
      <Breadcrumb title="Inventario" parent="Menu" />
      <Card>
        <CardHeader>
          <Row>
            <Col>
              <h5>
                {!prodObj ? "Seleccione un producto" : "Producto Seleccionado"}
              </h5>
            </Col>
            <Col>
              <Autocomplete                
                options={op_prod}
                value={prod}
                onChange={(event, newValue) => {
                  setProduct(newValue)
                  const matchProd = data.find(obj => obj.name === newValue)
                  if(matchProd){
                    setProdObj(matchProd)
                  }else{
                    setProdObj('')
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />  
            </Col>
          </Row>
          <hr/>          
          {!prodObj ? (
            <span>No se ha seleccionado un producto</span>
          ):(
            <Fragment>
              <DataTable
                noDataComponent={<EmptyComponent/>}
              />
            </Fragment>
          )}
        </CardHeader>
      </Card>
    </Fragment>
  )
}

export default ProductInventory