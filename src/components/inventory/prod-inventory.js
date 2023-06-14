import React, { Fragment, useEffect, useState } from 'react'
import { CardHeader, Col, Row, Card, Input } from 'reactstrap'
import Breadcrumb from "../common/breadcrumb";
import { Autocomplete } from '@mui/joy';
import axios from 'axios'
import { useParams } from 'react-router-dom';


const ProductInventory = () => {

	const baseUrl = "http://localhost:8080/modelsThunder/models/th_inventory/inventory.php"

	const {id = ''}=useParams()
  const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
  const [prod, setProduct] = useState('')
  const [prodObj, setProdObj] = useState('')

  const reqData=async()=>{
		setLoading(true);
        await axios.get(baseUrl).then(response=>{
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

  const op_ced = data.map(item => item.name) 
 

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
                options={op_ced}
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
              <Row>
                <h5>Informacion de la compra</h5>
              </Row>
              <div className='space-10'/>
              <Row md="2" sm="1" xs="1">
                <Col>
                  <Row>
                    <Col>
                      <h4>Proveedor</h4>
                    </Col>
                    <Col>
                      <p>{prodObj.provider}</p>
                    </Col>                
                  </Row>
                </Col>
                <Col>
                    <Row>
                      <Col>
                        <h4>Precio</h4>
                      </Col>
                      <Col>
                        <p>
                          <i className='fa fa-dollar'/>
                          {prodObj.price}
                        </p>
                      </Col>
                    </Row>
                </Col>
              </Row>
              <div className='space-10'/>
              <Row>
                  <Col>
                    <Row>
                      <Col>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row>
                      <Col>
                      </Col>
                      <Col>
                      </Col>
                    </Row>
                  </Col>
              </Row>
              <Row>
                <Col>
                    <Input
                      placeholder='Codigo de producto'
                    />
                </Col>
              </Row>
            </Fragment>
          )}
        </CardHeader>
      </Card>
    </Fragment>
  )
}

export default ProductInventory