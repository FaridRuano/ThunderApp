import React, { Fragment,useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Row } from "reactstrap"
import Breadcrumb from "../common/breadcrumb"
import axios from 'axios'
import {  useNavigate, useParams } from "react-router-dom"
import { toast,ToastContainer } from "react-toastify"
import { NumericFormat } from 'react-number-format'
import ApiUrls from "../../constants/apiUrl"

const AddService = () => {

	const {id = ''}=useParams();

	const baseUrl = ApiUrls.base+"th_services/services.php"

	const history = useNavigate()
  const [data, setData] = useState([])

  const [edit, setEdit] = useState(false)

	const [service, setService] = useState({
    name: '',
		descrip: '',
		price: '',
	});

	const requestGet=async()=>{
    await axios.get(baseUrl).then(response=>{
      setData(response.data)
			
      let serv = response.data.find(obj => obj.id.toString() === id.toString())
      
      if(serv){
        setEdit(true)
        service.name=serv.name	
        service.descrip=serv.descrip
        service.price=serv.price
      }
    })
  }		
	
	const handleChange=e=>{		
		const{name, value}=e.target;
		setService((prevState)=>({
			...prevState,
			[name]: value,
		}))		
	}	

	function isRepeated(){
		if(edit){
			return false
		}
		if(data.some(obj => obj.name === service.name)){
			toast.error("serviceo ya existe");
			return true
		}		
		return false
	}

	function isEmpty(){
		let name = service.name;
		let price = service.price;		
		if(name.length<3){
			toast.error("Nombre incompleto");
			return true;
		}
		if(price.length<1){
			toast.error("Precio incompleto");
			return true;
		}				
		return false;
	}

	const requestPost=async()=>{	
		let emptiness, repeatness = false;
		emptiness = isEmpty();		
		repeatness = isRepeated();
				
		if(!emptiness && !repeatness){		
			var f = new FormData();   
			f.append("id", id);
			f.append("name", service.name);
			f.append("price", service.price);
			f.append("descrip", service.descrip);			
			if(edit){
				f.append("METHOD", "PUT");
			}else{
				f.append("METHOD", "ADD");
			}
			await axios.post(baseUrl, f).then(response=>{
				setService('');
			}).catch(error=>{
			console.log(error);
			});		
			toast.success("Agregado Exitosamente!");
			routeChange();
		}
	}	

	const routeChange = () => {
		history(`${process.env.PUBLIC_URL}/services/service-list`);
	};

	useEffect(()=>{
        requestGet()
  },[])

	return (
		<Fragment>			
			<Breadcrumb title={!edit?"Crear nuevo servicio":"Editar servicio"}/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Detalles del Servicio </h5>
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
											value={service.name || ''}
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
												value={service.price || ''}
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
												value={service.descrip || ''}
											/>
										</div>
									</div>	
																																			
									<Button type="button" color="secondary" onClick={()=>requestPost()}
										style={{marginRight:'10px'}}
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

export default AddService;
