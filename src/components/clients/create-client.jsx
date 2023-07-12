import React, { Fragment,useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Row } from "reactstrap";
import axios from 'axios';
import {  Link, useNavigate, useParams } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import { NumericFormat } from 'react-number-format';
import Breadcrumb from "../common/breadcrumb";
import ApiUrls from "../../constants/apiUrl";

const Create_client = () => {	

	const baseUrl = ApiUrls.base+"th_clients/clients.php"

	const history = useNavigate()
	const {id = ''}=useParams();
	const [edit, setEdit] = useState(false)

	const [data, setData] = useState([])

	const reqGet=async()=>{
		await axios.get(baseUrl).then(response=>{
			setData(response.data)	

			let cli = response.data.find(obj => obj.id.toString() === id.toString())

			if(cli){
				setEdit(true)
				client.dni = cli.dni
				let names = cli.name.toString().split(" ")
				client.name = names[0]
				client.last = names[1]
				client.email = cli.email
				client.dir = cli.dir
				client.phone = cli.phone
			}
		})
	}

	const [client, setClient] = useState({
		dni: '',
		name: '',
		last: '',
		email: '',
		dir: '',
		phone: '',
	})

	const hanCli=e=>{
		const{name, value}=e.target
		setClient((prevState)=>({
			...prevState,
			[name]: value,
		}))
	}

	function contrData(){
		if(client.dni.length<10){
			toast.error("Cedula o Ruc incompleto")
			return false
		}else{
			if(!edit){
				if(data.some(value => value.dni === client.dni)){
					toast.error("Cedula o Ruc ya existe")				
					return false
				}
			}
		} 		
		if(client.name.length<3){
			toast.error("Nombre incompleto")
			return false
		}else if(client.last.length<3){
			toast.error("Apellido incompleto")
			return false
		}else if(client.email.length<1){
			toast.error("Email incompleto")
			return false
		}else if(client.email.length>1){
			let validate = /\S+@\S+\.\S+/.test(client.email)
			if(!validate){
				toast.error("El Email no es valido")
				return false
			}else{
				if(!edit){
					if(data.some(value => value.email === client.email)){
						toast.error("Email ya existe")				
						return false
					}
				}
			}				
		}if(client.dir.length<3){
			toast.error("Direccion incompleta")
			return false
		}else if(client.phone.length<10){
			toast.error("Telefono incompleto")
			return false
		}else{
			return true		
		}		
	}

	const reqPost=async()=>{
		if(contrData()){
			var f = new FormData()
			if(edit){
				f.append("METHOD",'PUT')
				f.append("id",id)
			}else{
				f.append("METHOD",'ADD')
			}
			f.append("dni", client.dni)
			f.append("name", client.name)
			f.append("last", client.last)
			f.append("email", client.email)
			f.append("dir", client.dir)
			f.append("phone", client.phone)
			await axios.post(baseUrl, f).then(response=>{
				setClient('')
			}).catch(err=>{
				console.log(err)
			})
			history(`${process.env.PUBLIC_URL}/clients/list-clients`)
		}		
	}

	useEffect(()=>{
		reqGet()
	},[])

	return(
		<Fragment>
			<Breadcrumb title={!edit?"Crear nuevo cliente":"Editar cliente"}/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Detalles del Cliente</h5>
							</CardHeader>
							<CardBody>
								<Form className="needs-validation">
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span>Cedula/Ruc
										</Label>
										<div className="col-md-8">
											<NumericFormat
												customInput={Input}
												allowLeadingZeros={true}
												allowNegative={false}												
												maxLength={13}
												decimalScale={0}
												name="dni"		
												onChange={hanCli}	
												displayType={!edit?'input':'text'}
												value={client.dni || ''}								
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span>Nombre
										</Label>
										<div className="col-md-8">
											<Input
												maxLength={50}
												name="name"		
												onChange={hanCli}
												value={client.name || ''}

											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span>Apellido
										</Label>
										<div className="col-md-8">
											<Input
												maxLength={50}
												name="last"
												onChange={hanCli}
												value={client.last || ''}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span>Email
										</Label>
										<div className="col-md-8">
											<Input
												maxLength={100}
												name="email"
												onChange={hanCli}
												value={client.email || ''}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span>Direccion
										</Label>
										<div className="col-md-8">
											<Input
												maxLength={150}
												name="dir"
												onChange={hanCli}
												value={client.dir || ''}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span>Telefono	
										</Label>
										<div className="col-md-8">
											<NumericFormat
												allowLeadingZeros={true}
												allowNegative={false}
												decimalScale={0}
												customInput={Input}
												maxLength={10}
												name="phone"
												onChange={hanCli}
												value={client.phone || ''}
											/>
										</div>
									</div>									
									<div className="button-container-2">
										<Button onClick={()=>reqPost()}>
											{edit?"Editar":"Guardar"}
										</Button>
										<Link to='/clients/list-clients'>
											<Button color="primary">
												Descartar
											</Button>
										</Link>
									</div>
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
			<ToastContainer theme="dark"/>
		</Fragment>		
	)
}

export default Create_client;
