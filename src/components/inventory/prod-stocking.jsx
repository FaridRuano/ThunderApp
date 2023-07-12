import React, { Fragment, useEffect, useState } from 'react'
import { CardHeader, Col, Row, Card, CardBody, Input } from 'reactstrap'
import Breadcrumb from "../common/breadcrumb"
import { Autocomplete } from '@mui/joy'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import dayjs from "dayjs"
import ApiUrls from '../../constants/apiUrl'
import { ToastContainer, toast } from 'react-toastify'

const ProductStocking = () => {

	const baseUrl = ApiUrls.base + "th_inventory/inventory.php"

	const {id = ''}=useParams()
  const [date, setDate] = useState([dayjs().format('YYYY-MM-DD')])
  const [data, setData] = useState([])
  const [serial, setSerial] = useState('')
  const [facCod, setFacCod] = useState('')
	const [loading, setLoading] = useState(false)
  const [prod, setProduct] = useState('')
  const [prodObj, setProdObj] = useState('')

  const reqData=async()=>{
		setLoading(true)
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

  const postData = async () =>{   
    if(getReady()){
      var f = new FormData()
			f.append("id", prodObj.id)
			f.append("serial", serial)
			f.append("date", date)
			f.append("fac", facCod)
			f.append("METHOD", "INDEADD")
			await axios.post(baseUrl, f).then(response=>{
				setSerial('')        
			}).catch(error=>{
			console.log(error)
			})
			toast.success("Agregado Exitosamente!")
    }else{
			toast("Existen campos vacios")
    }
  }
  
  function getReady(){
    let fac = facCod.length
    let se = serial.length
    if(fac > 1 && se > 1){
      return true      
    }
    return false
  }

  useEffect(()=>{
    reqData()
  },[])

  const op_ced = data.map(item => item.name) 
 
  function onChangeDate(value){
		let d = dayjs(value).format('YYYY-MM-DD')
		setDate(d);
	}
  
  return (
    <Fragment>
      <Breadcrumb title="Compras" parent="Menu" />
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
        </CardHeader>
        <CardBody>
          {!prodObj ? (
            <span>No se ha seleccionado un producto</span>
          ):(
            <Fragment>
              <Row>
                <h5>Informacion de la compra</h5>
              </Row>
              <div className='space-10'/>              
              <div style={{display : 'block',marginBottom : '10px', alignItems : 'center'}}>
                  <Col>
                    <Row  md="2" sm="1" xs="1" style={{display: 'flex', flexDirection : 'row', alignItems : 'center', marginBottom : '10px'}}> 
                      <Col>
                          <h4>No. Factura</h4>
                      </Col>
                      <Col>
                        <Input
                          placeholder='#123140'
                          value={facCod}
                          onChange={(e)=>{setFacCod(e.target.value)}}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row  md="2" sm="1" xs="1" style={{display: 'flex', flexDirection : 'row', alignItems : 'center'}}>
                      <Col>
                        <h4>Fecha</h4>
                      </Col>
                      <Col>
                        <LocalizationProvider dateAdapter={AdapterDayjs} style={{minWidth:'100%'}}>
                        <DesktopDatePicker
                          inputFormat="YYYY-MM-DD"																								                          
                          openTo="day"
                          views={['month', 'day']}
                          minDate={dayjs('2017-01-01')}
                          value={date}
                          onChange={(newValue) => {
                            onChangeDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}                          
                        />
                        </LocalizationProvider>
                      </Col>                      
                    </Row>
                  </Col>
              </div>
              <div className='space-10'/>              
              <Row md="2" sm="1" xs="1">                
                <Col>
                  <h4>Proveedor</h4>
                </Col>
                <Col>
                  <p>{prodObj.provider}</p>
                </Col>
              </Row>
              <div className='space-10'/>              
            </Fragment>
          )}
          </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className='input-button-inde'>
            <Input
              placeholder='Serial de producto'
              disabled={!prodObj}   
              value={serial}
              onChange={(e)=>{setSerial(e.target.value)}}                             
            />
            <button className="btn btn-primary" disabled={!prodObj} onClick={postData}>
              Ingresar
            </button>
          </div>          
        </CardBody>
      </Card>
      <ToastContainer theme='dark'/>
    </Fragment>
  )
}

export default ProductStocking