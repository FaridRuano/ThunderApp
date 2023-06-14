import React, { Fragment,useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Row } from "reactstrap";
import Breadcrumb from "../common/breadcrumb";
import axios from 'axios';
import {  useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import { NumericFormat } from 'react-number-format';


const Create_shoe = () => {
	const baseUrl = "http://localhost:80/modelsKowac/models/kc_shoes/shoes.php";	

	const history = useNavigate();	    
	
	const [selectedShoe, setselectedShoe] = useState({
		model: '',
		sole: '',
		material: '',
		color: '',
		size: '',
		price: '',
		descr: '',
		quant: '',
	});

	const handleChange=e=>{		
		const{name, value}=e.target;
		setselectedShoe((prevState)=>({
			...prevState,
			[name]: value,
		}))		
	}	

	useEffect(()=>{
    },[])

	function isEmpty(){
		let key = false;
		let model = selectedShoe.model;
		let sole = selectedShoe.sole;
		let material = selectedShoe.material;
		let color = selectedShoe.color;
		let size = selectedShoe.size;		
		let quant = selectedShoe.quant;		


		if(model.length<3){
			toast.error("Modelo incompleto");
			key = true;
		}
		if(sole.length<2){
			toast.error("Suela incompleta");
			key = true;
		}
		if(material.length<3){
			toast.error("Material incompleto");
			key = true;
		}	
		if(color.length<3){
			toast.error("Color incompleto");
			key = true;
		}	
		if(size.length<2){
			toast.error("Talla incompleta");
			key = true;
		}			
		if(quant.length<1){
			toast.error("Cantidad incompleta");
			key = true;
		}	
		return key;
	}

	const requestPost=async()=>{	
		let emptiness = false;
		emptiness = isEmpty();		
				
		if(!emptiness){		
			var f = new FormData();   
			f.append("model", selectedShoe.model);
			f.append("sole", selectedShoe.sole);
			f.append("material", selectedShoe.material);
			f.append("color", selectedShoe.color);
			f.append("size", selectedShoe.size);
			f.append("price", selectedShoe.price);
			f.append("descr", selectedShoe.descr);
			f.append("quant", selectedShoe.quant);
			f.append("METHOD", "ADD");
			await axios.post(baseUrl, f).then(response=>{
				setselectedShoe('');
			}).catch(error=>{
			console.log(error);
			});		
			toast.success("Agregado Exitosamente!");
			routeChange();
		}
	}	
	const routeChange = () => {
		history(`${process.env.PUBLIC_URL}/shoes/list-shoes`);
	};

	return (
		<Fragment>			
			<Breadcrumb title=""/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Agregar zapatos</h5>
							</CardHeader>
							<CardBody>
								<Form className="needs-validation">
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Modelo
										</Label>
										<div className="col-md-8">
											<Input
												className="form-control"
												maxLength={50}																
												name="model"
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Suela
										</Label>
										<div className="col-md-8">
											<Input
												className="form-control"
												maxLength={50}																
												name="sole"
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Material
										</Label>
										<div className="col-md-8">
											<Input
												className="form-control"
												maxLength={50}																
												name="material"
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Color
										</Label>
										<div className="col-md-8">
											<Input
												className="form-control"
												maxLength={50}																
												name="color"
												onChange={handleChange}
											/>
										</div>
									</div>									
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Talla
										</Label>
										<div className="col-md-2">
											<NumericFormat  
												className="form-control"
												customInput={Input}
												name='size'
												maxLength={2}												
												allowNegative={false}
												decimalScale={0}
												allowLeadingZeros={false}
												onChange={handleChange}
												/>												
										</div>																												
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Cantidad
										</Label>
										<div className="col-md-2">
											<NumericFormat  
												className="form-control"
												customInput={Input}
												name='quant'
												maxLength={2}												
												allowNegative={false}
												decimalScale={0}
												allowLeadingZeros={false}
												onChange={handleChange}
												/>												
										</div>																												
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Descripcion
										</Label>
										<div className="col-md-8">
											<Input
												className="form-control"
												maxLength={150}																
												name="descr"
												onChange={handleChange}
											/>
										</div>
									</div>																															
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Precio
										</Label>
										<div className="col-md-2">
											<NumericFormat  
												className="form-control"
												customInput={Input}
												name='price'
												maxLength={5}												
												allowNegative={false}
												decimalScale={2}
												allowLeadingZeros={false}
												onChange={handleChange}
												/>												
										</div>																												
									</div>																								
									<Button type="button" color="primary" onClick={()=>requestPost()}>
										Guardar
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

export default Create_shoe;
