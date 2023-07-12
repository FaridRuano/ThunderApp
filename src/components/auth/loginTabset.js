import React, { Fragment, useState } from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { User } from "react-feather";
import {  useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { toast,ToastContainer } from "react-toastify";
import axios from 'axios';

const LoginTabset = () => {
	const baseUrl = "http://localhost:8080/modelsThunder/models/th_users/users.php";	
	const [selectedUser, setSelectedUser] = useState({
		user: '',
		pass: ''
	  });		
	const [remind, setRemind] = useState(false)

	const handleChange=e=>{		
		const{name, value}=e.target;
		setSelectedUser((prevState)=>({
			...prevState,
			[name]: value,
		}))		
		console.log(selectedUser)
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
	const handleCheck=(e)=>{
		setRemind(!remind)
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
					if(remind){
						localStorage.setItem('user_data',JSON.stringify(response.data));					
					}
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

	const routeChange = () => {
		toast.success("Credenciales Correctas");
		history(`${process.env.PUBLIC_URL}/dashboard`);
	}

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
							<div className="form-terms">
								<div className="custom-control custom-checkbox me-sm-2">
									<Label className="d-block">
										<Input
											className="checkbox_animated"
											id="chk-ani2"
											type="checkbox"
											value={remind}
											onChange={()=>handleCheck(true)}											
										/>
										Reminder Me{" "}										
									</Label>
								</div>
							</div>
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
