import React, { Fragment, useState, useEffect, useContext } from "react"
import { Tabs, TabList, TabPanel, Tab } from "react-tabs"
import { User } from "react-feather"
import {  useNavigate } from "react-router-dom"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { toast,ToastContainer } from "react-toastify"
import axios from 'axios'
import ApiUrls from "../../constants/apiUrl"
import { UserContext } from "../../constants/userData"

const LoginTabset = () => {
	const baseUrl = ApiUrls.base+"th_users/users.php"
	const { updateUser } = useContext(UserContext)  
	const [selectedUser, setSelectedUser] = useState({
		user: '',
		pass: ''
	  });		

	const handleChange=e=>{		
		const{name, value}=e.target;
		setSelectedUser((prevState)=>({
			...prevState,
			[name]: value,
		}))		
	}
	const history = useNavigate();

	function isEmpty(){
		let key = false;
		let user = selectedUser.user;
		let pass = selectedUser.pass;

		if(user===''){
			toast.error("Usuario vacio");
			key = true;
		}
		if(pass ===''){
			toast.error("Contrasena vacia");
			key = true;
		}	
		return key;
	}

	const requestPost=async()=>{			
		if(!isEmpty()){
			let user = 0;
			var f = new FormData();
			f.append("user", selectedUser.user);
			f.append("pass", selectedUser.pass);
			f.append("METHOD", "LOGIN");
			await axios.post(baseUrl, f).then(response=>{
				user = response.data.id;	
				if(user>0){
					console.log(response.data)
					updateUser(response.data)
					selectedUser.user='';
					selectedUser.pass='';
					toast.success("Inicio Exitoso!");					
					routeChange();
				}else{
					toast.error("Datos incorrectos");															
				}		
			}).catch(error=>{
			console.log(error);
			});		
		}else{

		}		
	}			

	const savedData = JSON.parse(localStorage.getItem('THNDRSRDT'))

	function routeChange() {
		toast.success("Credenciales Correctas");
		history(`${process.env.PUBLIC_URL}/dashboard`);
	}

	useEffect(()=>{
		if(savedData)  {
		  routeChange()
		}
	},[])

	return (
		<div>
			<Fragment>
				<Tabs>
					<TabList className="nav nav-tabs tab-coupon">
						<Tab className="nav-link">
							<User />
							Login
						</Tab>						
					</TabList>
					<TabPanel>
						<Form className="form-horizontal auth-form">
							<FormGroup>
								
								<Input
									required=""
									name="user"
									type="text"
									className="form-control"
									placeholder="Username"
									id="exampleInputEmail1"
									onChange={handleChange}
									value={selectedUser.user}
								/>
							</FormGroup>
							<FormGroup>
								<Input
									required=""
									name="pass"
									type="password"
									className="form-control"
									placeholder="Password"
									onChange={handleChange}
									value={selectedUser.pass}
								/>
							</FormGroup>							
							<div className="form-button">
								<Button type="button" color="primary" onClick={()=>requestPost()}>
									Ingresar
								</Button>
							</div>						
						</Form>
						<ToastContainer theme="colored"/>								
					</TabPanel>					
				</Tabs>
			</Fragment>
		</div>
	);
};

export default LoginTabset;
