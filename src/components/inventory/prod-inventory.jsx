import React, { Fragment, useEffect, useState } from 'react'
import { CardHeader, Col, Row, Card, CardBody } from 'reactstrap'
import Breadcrumb from "../common/breadcrumb"
import { Autocomplete } from '@mui/joy'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import ApiUrls from '../../constants/apiUrl'
import DataTable from 'react-data-table-component'
import EmptyComponent from '../common/utils/nodata/empty-comp'
import { ToastContainer, toast } from 'react-toastify'
import LoadingComponent from '../common/utils/loading/loading-comp'


const ProductInventory = () => {

	const baseUrl = ApiUrls.base+"th_inventory/inventory.php"

	const {id = ''}=useParams()
  const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
  const [prod, setProduct] = useState('')
  const [prodObj, setProdObj] = useState('')
  const [prodList, setProdList] = useState('')

  const reqData=async()=>{
		setLoading(true)
      await axios.get(baseUrl).then(response=>{
        setData(response.data)
        if(id !== ''){          
          const matchProd = response.data.find(obj => obj.id === parseInt(id))
          if(matchProd){
            setProdObj(matchProd)
            setProduct(matchProd.name)              

            axios.get(baseUrl + '?id=' + matchProd.id).then(response=>{
              setProdList(response.data)
            })
          }
        }
      })	
    setLoading(false)
    	
  }

  const reqProd=async(pid)=>{
    setLoading(true)
    await axios.get(baseUrl + '?id=' + pid).then(response=>{
      setProdList(response.data)
    })
    setLoading(false)
  }

  const inCols=[		
		{
			name: 'Opciones',
			cell: (row) => (
				<div className="i-icon-container">
          <span className="i-icon-st" onClick={(e) => {						
						if (window.confirm("Estas seguro que deseas eliminar?"))
						reqDelIte(row.id);
					}}>
            <i
							className="fa fa-trash"
							style={{								
								color: "#DF2E2B",
							}}
						/>
          </span>
				</div>
				
			),
			width: '110px',
			center: true,
		},
		{
			name: 'Serial',
			selector: row => row.serial,
			minWidth: '200px',
			style: {
				fontWeight: '700'
			},
			wrap: true

		},		
		{
			name: 'N. Compra',
			selector: row => row.comp,						
		},
		{
			name: 'Fecha',
			selector: row => row.date,
			sortable: true,
		},
				
	]

  const reqDelIte=async(idd)=>{
    var f = new FormData();
    f.append("METHOD", "DELITE");
    f.append("id", idd);
    await axios.post(baseUrl, f).then(response=>{      
      reqProd(prodObj.id)
    }).catch(error=>{
      console.log(error)
    })
    toast.success("Eliminado Exitosamente!");
}

  useEffect(()=>{
    reqData()
    
  },[])

  const op_prod = data.map(item => item.name) 
 
  return (
    <Fragment>
      <ToastContainer theme='dark'/>
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
                    reqProd(matchProd.id)
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
                <DataTable
                  progressPending={loading}
                  noDataComponent={<EmptyComponent/>}
                  data={prodList}
                  progressComponent={<LoadingComponent/>}
                  columns={inCols}
                />
              </Fragment>
            )}
          </CardBody>
      </Card>
    </Fragment>
  )
}

export default ProductInventory