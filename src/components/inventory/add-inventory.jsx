import React, { Fragment,useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Row } from "reactstrap"
import Breadcrumb from "../common/breadcrumb"
import axios from 'axios'
import {  useNavigate, useParams } from "react-router-dom"
import { toast,ToastContainer } from "react-toastify"
import { NumericFormat } from 'react-number-format'
import ApiUrls from "../../constants/apiUrl"

const AddInventory = () => {

	const {id = ''}=useParams()

	const baseUrl = ApiUrls.base+"th_inventory/inventory.php"
    const providersUrl = ApiUrls.base+"th_inventory/providers.php"

	const history = useNavigate()
  	const [data, setData] = useState([])

  	const [providers, setProviders] = useState([])
  	const [edit, setEdit] = useState(false)

	const [product, setproduct] = useState({
		name: '',
		price: '',
		descrip: '',
		provider: '',
	});

	const requestGet=async()=>{
        await axios.get(baseUrl).then(response=>{
            setData(response.data)
			
			let prod = response.data.find(obj => obj.id.toString() === id.toString())
			
			if(prod){
				setEdit(true)
				product.name=prod.name	
				product.price=prod.price
				product.provider=prod.provider
				product.descrip=prod.descrip
			}
        })
    }		

	const requestGetProviders=async()=>{
        await axios.get(providersUrl).then(response=>{
            setProviders(response.data);
        })
    }
	
	const handleChange=e=>{		
		const{name, value}=e.target;
		setproduct((prevState)=>({
			...prevState,
			[name]: value,
		}))		
	}	

	function isRepeated(){
		if(edit){
			return false
		}
		if(data.some(value => value.name === product.name)){
			toast.error("Producto ya existe");
			return true
		}

		return false
	}

	function isEmpty(){
		let name = product.name;
		let price = product.price;
		let provider = product.provider;
		if(name.length<3){
			toast.error("Nombre incompleto");
			return true;
		}
		if(price.length<1){
			toast.error("Precio incompleto");
			return true;
		}		
		if(provider.length<1){
			toast.error("Proveedor no seleccionado");
			return true;
		}	
		return false;
	}

	const requestPost=async()=>{	
		let emptiness, repeatness = false
		emptiness = isEmpty()	
		repeatness = isRepeated()
				
		if(!emptiness && !repeatness){		
			var f = new FormData()
			f.append("id", id)
			f.append("name", product.name)
			f.append("price", product.price)
			f.append("descrip", product.descrip)
			let prod = providers.find(obj => obj.name.toString() === product.provider.toString())
			if(prod){
				f.append("provider", prod.id)
			}else{
				f.append("provider", '0');
			}
			if(edit){
				f.append("METHOD", "PUT")
			}else{
				f.append("METHOD", "ADD")
			}
			await axios.post(baseUrl, f).then(response=>{
				setproduct('')
			}).catch(error=>{
			console.log(error)
			});		
			toast.success("Agregado Exitosamente!")
			routeChange()
		}
	}	

	const routeChange = () => {
		history(`${process.env.PUBLIC_URL}/inventory/inventory-list`);
	};

	useEffect(()=>{
        requestGet()
		requestGetProviders()		
    },[])

	return (
		<Fragment>			
			<Breadcrumb title="Crear nuevo producto"/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Detalles del Producto </h5>
							</CardHeader>
							<CardBody>
								<Form className="needs-validation">
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Nombre
										</Label>
										<div className="col-md-8">										
											<Input
											className="form-control"
											maxLength={50}																
											name="name"
											onChange={handleChange}
											value={product.name || ''}
											/>											
										</div>																			
									</div>		
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Precio
										</Label>
										<div className="col-md-8">
                      						<NumericFormat  
												className="form-control"
												customInput={Input}
												name='price'
												maxLength={8}												
												allowNegative={false}
												decimalScale={2}
												onChange={handleChange}
												value={product.price || ''}
												/>	
										</div>
									</div>	      																			     	
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											Descripcion
										</Label>
										<div className="col-md-8">
											<textarea
												className="form-control"
												maxLength={249}																
												name="descrip"
												onChange={handleChange}
												placeholder="Opcional"
												value={product.descrip || ''}
											/>
										</div>
									</div>	
																	
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Proveedor
										</Label>
										<div className="col-md-8">
											<select						
												className="form-control" 
												name="provider"
												onChange={handleChange}
												value={product.provider || ''}
												>		
													<option key="" value="">Selecciona</option>
												{providers.map((element)=>(
                    								<option key={element.id} value={element.name}>{element.name}</option>
                 								))}
											</select>
										</div>
									</div>		
									<Button type="button" color="secondary" onClick={()=>requestPost()}
										style={{marginRight: '10px'}}
									>
										{!edit ? "Guardar" : "Editar"}
									</Button>	
									<Button type="button" color="primary" onClick={()=>routeChange()}>
										Descartar
									</Button>	
									<ToastContainer theme="colored"/>								
								</Form>

							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default AddInventory;
