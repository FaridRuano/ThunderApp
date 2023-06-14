import React, { Fragment } from "react";
import Breadcrumb from "../common/breadcrumb";
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Col, Container, Row, Input, Button, Label, Form  } from "reactstrap";
import { Link } from "react-router-dom";
import {useState} from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {jsPDF} from 'jspdf'
import 'jspdf-autotable'
import { ToastContainer,toast } from "react-toastify";
import { NumericFormat } from 'react-number-format';


const ProvidersList = () => {
	const baseUrl = "http://localhost:8080/modelsThunder/models/th_inventory/providers.php";	

  const [data, setData] = useState([]);		
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [filtered, setFiltered] = useState([]);

  const [provider, setprovider] = useState({
		name: '',
		ruc: '',
		phone: '',
		address: '',
		country: '',
		email: '',
		saler: '',
	});

  const handleChange=e=>{		
		const{name, value}=e.target;
		setprovider((prevState)=>({
			...prevState,
			[name]: value,
		}))		
    console.log(provider)
	}

  function isRepeated(){
		let pro = provider.name;
		let repeatedPro = data.some(value => value.name === pro);	
		let key = false;
		if(repeatedPro){
			toast.error("Proveedor ya existe");
			key = true;
		}		

		return key;
	}

	function isEmpty(){
		let key = false;
		let name = provider.name;		    
		let ruc = provider.ruc;		
		let email = provider.email;		

		if(name.length<2){
			toast.error("Nombre incompleto");
			key = true;
		}
		if(ruc.length<5){
			toast.error("Ruc incompleto");
			key = true;
		}		
		if(email.length>0){
		if(isValidEmail()){
				key = true;
		}			
		}				
		return key;
	}

  function isValidEmail(){
		let email = provider.email;
		let validate = /\S+@\S+\.\S+/.test(email);
		if(!validate){
			toast.error("Email no es valido");
		}
		return !validate;
	}

	const requestPost=async()=>{	
		let emptiness, repeatness = false;
		emptiness = isEmpty();
		repeatness = isRepeated();
				
		if(!emptiness && !repeatness){		
			var f = new FormData();   
			f.append("name", provider.name);
			f.append("address", provider.address);
			f.append("saler", provider.saler);
			f.append("phone", provider.phone);
			f.append("email", provider.email);
			f.append("country", provider.country);
			f.append("ruc", provider.ruc);		
			f.append("METHOD", "ADD");
			await axios.post(baseUrl, f).then(response=>{
				setprovider({name: '',
				ruc: '',
				phone: '',
				address: '',
				country: '',
				email: '',
				saler: '',});
        requestGet();
			}).catch(error=>{
			console.log(error);
			});		      
			toast.success("Agregado Exitosamente!");
		}
	}	

	const col=[		
		{
			name: 'Opciones',
			selector: row => row.quant,
			cell: (row) => (
				<div>
					<span style={{cursor:'pointer'}} onClick={(e) => {						
						if (window.confirm("Estas seguro que deseas eliminar?"))
						requestDelete(row.id);
					}}>
						<i
							className="fa fa-trash"
							style={{
								width: 35,
								fontSize: 20,
								padding: 11,
								color: "#DF2E2B",
							}}
						/>
					</span>
					<Link to="/inventory/add-inventory">
						<span style={{cursor:'pointer'}}>
							<i
								className="fa fa-edit"
								style={{
									width: 35,
									fontSize: 20,
									padding: 11,
									color: "#0ECFEE",
								}}
							/>
						</span>
					</Link>
					
						
				</div>
				
			),
			width: '100px',
		},
		{
			name: 'RUC',
			selector: row => row.ruc,	
			width: '150px',
			right: true,		
			center: true,
		},
		{
			name: 'Proveedor',
			selector: row => row.name,		
			style: {
				fontWeight: '700'
			},
			wrap: true
		},		
		{
			name: 'Contacto',
			selector: row => row.saler,
      wrap:true						
		},
    {
			name: 'Email',
			selector: row => row.email,
			sortable: true,
      wrap:true
		},
		{
			name: 'Telefono',
			selector: row => row.phone,
			sortable: true,
			wrap: true
		},
		{
			name: 'País',
			selector: row => row.country,
			minWidth: '150px',
			wrap: true,
		},						
	]

	const customStyles = {
		rows: {
			style: {
				minHeight: '52px',
			},
		},
		headCells: {
			style: {
				padding: '10px',
				fontSize: '0.9rem',
				fontWeight: 'bold',
				background: 'rgba(236, 240, 241 ,0.4)', 
			},
		},
		cells: {
			style: {
				padding: '15px',	
			},
		},
	};

	const ExpandedComponent = ({ data }) => (
			<div style={{margin: '10px', marginLeft:'50px',padding: '1opx'}}><span><h2 style={{fontSize: '12px'}}>Dirección:</h2><p>{JSON.stringify(data.address, null, 2)}</p></span></div>		
	)

	const requestGet=async()=>{
		setLoading(true);
        await axios.get(baseUrl).then(response=>{
            setData(response.data);
			setFiltered(response.data);
        })
		setLoading(false);
    }

	const requestDelete=async(id)=>{
        var f = new FormData();
        f.append("METHOD", "DELETE");
		    f.append("id", id);
        await axios.post(baseUrl, f).then(response=>{
            setData(data.filter(row=>row.id!==id));
        }).catch(error=>{
          console.log(error);
        })
		    toast.success("Eliminado Exitosamente!");
        requestGet();
    }
	
	const columnsPDF = [
		{title: "ID", field: "id"},
		{title: "Nombre", field: "name"},
		{title: "Precio", field: "price"},
		{title: "Cantidad", field: "quant"},
		{title: "Proveedor", field: "provider"},
	]

	const downloadPdf=()=>{
		const doc=new jsPDF()
		doc.text("Stock Thunder",20,10)
		doc.autoTable({
			theme: "grid",
			columns:columnsPDF.map(col => ({ ...col, dataKey: col.field })),
			body:data,
		})
		doc.save('thunder_stock.pdf')
		toast.info("Reporte Completado!");
	}	

	useEffect(()=>{
        requestGet();
    },[])
	useEffect(()=>{
		const result = data.filter(pro =>{
			return pro.name.toLowerCase().match(search.toLowerCase());
		});

		setFiltered(result);
	},[search])

	return (
		<Fragment>
			<Breadcrumb title="Proveedores"/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Lista de Proveedores</h5>
							</CardHeader>
							<CardBody >				
								<Row xl="2">
									<Col xs style={{marginBottom: '10px'}}>																	
										<Button className="btn btn-secondary" onClick={() => downloadPdf()}>
											<i className="fa fa-file"/>
										</Button>
									</Col>																							
									<Col md="9" style={{marginBottom: '10px'}}>
										<Input											
											placeholder="Buscar"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											/>
									</Col>																			
								</Row>									
																																										
								<div id="shoesStockTable">
									<DataTable
										progressPending={loading}
										pagination
										expandableRows
										expandableRowsComponent={ExpandedComponent}
										columns={col}
										data={filtered}
										pageSize={6}
										noDataComponent="No hay datos para mostrar"
										customStyles={customStyles}
									/>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>	
        		<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Agregar Proveedor</h5>
							</CardHeader>
							<CardBody >				
               					<Form className="needs-validation">
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Nombre
										</Label>
										<div className="col-md-8">										
											<input
											className="form-control"
											maxLength={99}																
											name="name"
											onChange={handleChange}
                     						value={ provider.name || "" }
											/>											
										</div>																			
									</div>		
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> RUC
										</Label>
										<div className="col-md-8">
                      						<NumericFormat  
												className="form-control"
												customInput={Input}
												name='ruc'
												maxLength={13}												
												allowNegative={false}
                        						allowLeadingZeros={true}
												decimalScale={0}
												onChange={handleChange}
												value={ provider.ruc || "" }
												/>	
										</div>
									</div>	
                  					<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Vendedor
										</Label>
										<div className="col-md-8">										
											<Input
												className="form-control"
												maxLength={49}																
												name="saler"
												onChange={handleChange}
												placeholder="Opcional"
												value={provider.saler || ""}
											/>											
										</div>																			
									</div>	
                  					<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Email
										</Label>
										<div className="col-md-8">
                      					<Input
											className="form-control"
											maxLength={99}																
											name="email"
											onChange={handleChange}
											placeholder="Opcional"
											value={provider.email || ""}
											/>	
										</div>
									</div>	
                  					<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Telefono
										</Label>
										<div className="col-md-8">
                     		 			<Input
											className="form-control"
											maxLength={19}																
											name="phone"
											onChange={handleChange}
											placeholder="Opcional"
											value={provider.phone || ""}
											/>	
										</div>
									</div>		                  	
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Dirección
										</Label>
										<div className="col-md-8">
											<textarea
												className="form-control"
												maxLength={249}																
												name="address"
												onChange={handleChange}
												placeholder="Opcional"
												value={provider.address || ""}
											/>
										</div>
									</div>	
																	
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> País
										</Label>
										<div className="col-md-8">
											<select						
												className="form-control" 
												name="country"
												onChange={handleChange}
												value={provider.country || ''}
												>		
													<option value="">Seleccionar</option>
													<option value="Ecuador">Ecuador</option>
													<option value="China">China</option>
													<option value="Usa">USA</option>
													<option value="Europa">Europa</option>
													<option value="Otro">Otro</option>
											
											</select>
										</div>
									</div>										
									<Button type="button" color="secondary" onClick={requestPost}>
										Guardar
									</Button>	
									<ToastContainer theme="colored"/>								
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>			
			</Container>
			<ToastContainer theme="colored"/>
		</Fragment>
	);
};

export default ProvidersList;
