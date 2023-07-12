import React, { Fragment,useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Row } from "reactstrap";
import axios from 'axios';
import {  Link, useNavigate, useParams } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import Breadcrumb from "../common/breadcrumb";
import ApiUrls from "../../constants/apiUrl";

const Create_user = () => {	

	const baseUrl = ApiUrls.base+"th_users/users.php"

	const history = useNavigate()
	const {id = ''}=useParams();
	const [edit, setEdit] = useState(false)

	const [data, setData] = useState([])

	const reqGet=async()=>{
		await axios.get(baseUrl).then(response=>{
			setData(response.data)	

			let us = response.data.find(obj => obj.id.toString() === id.toString())

			if(us){
				setEdit(true)				
				user.email = us.email
				user.user_name = us.user_name
				user.permision = us.permision
				console.log(us)
				let names = us.name.toString().split(" ")
				user.name = names[0]
				user.last = names[1]
			}
		})
	}

	const [user, setuser] = useState({		
		name: '',
		last: '',
		email: '',
		user_name: '',
		permision: '',
	})

	const hanUser=e=>{
		const{name, value}=e.target
		setuser((prevState)=>({
			...prevState,
			[name]: value,
		}))
	}

	function contrData(){
		if(user.name.length<3){
			toast.error("Nombre incompleto")
			return false
		}else if(user.last.length<3){
			toast.error("Apellido incompleto")
			return false
		}else if(user.email.length<1){
			toast.error("Email incompleto")
			return false
		}else if(user.email.length>1){
			let validate = /\S+@\S+\.\S+/.test(user.email)
			if(!validate){
				toast.error("El Email no es valido")
				return false
			}else{
				if(!edit){
					if(data.some(value => value.email === user.email)){
						toast.error("Email ya existe")				
						return false
					}					
				}
				
			}				
		}if(user.user_name.length<3){
			toast.error("Usuario incompleto")
			return false
		}else if(user.user_name.length>1){
			if(!edit){
				if(data.some(value => value.user_name === user.user_name)){
					toast.error("Usuario ya existe")				
					return false
				}					
			}
		}if(user.permision.length<1){
			toast.error("Nivel de acceso incompleto")
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
			f.append("name", user.name)
			f.append("last", user.last)
			f.append("email", user.email)
			f.append("user_name", user.user_name)
			f.append("perm", user.permision)
			await axios.post(baseUrl, f).then(response=>{
				setuser('')
			}).catch(err=>{
				console.log(err)
			})
			history(`${process.env.PUBLIC_URL}/users/list-users`)
		}		
	}

	useEffect(()=>{
		reqGet()
	},[])

	return(
		<Fragment>
			<Breadcrumb title={!edit?"Crear nuevo usuario":"Editar Usuario"}/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Detalles del usuario</h5>
							</CardHeader>
							<CardBody>
								<Form className="needs-validation">									
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span>Nombre
										</Label>
										<div className="col-md-8">
											<Input
												maxLength={50}
												name="name"		
												onChange={hanUser}
												value={user.name || ''}

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
												onChange={hanUser}
												value={user.last || ''}
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
												onChange={hanUser}
												value={user.email || ''}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span>Usuario
										</Label>
										<div className="col-md-8">
											<Input
												maxLength={50}
												name="user_name"
												onChange={hanUser}
												value={user.user_name || ''}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Nivel de acceso
										</Label>
										<div className="col-md-8">
											<select						
												className="form-control" 
												name="permision"
												onChange={hanUser}
												value={user.permision || ''}
												>		
													<option value="">Selecciona</option>
													<option value="AA">Administrador</option>
													<option value="AV">Vendedor</option>
													<option value="AI">Bodegero</option>													
											</select>
										</div>
									</div>									
									<div className="button-container-2">
										<Button onClick={()=>reqPost()}>
											{edit?"Editar":"Guardar"}
										</Button>
										<Link to='/users/list-users'>
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

export default Create_user;
