import React, { Fragment, useState, useEffect } from "react"
import { Card, CardHeader, Container, CardBody, Row, Col, Input, Button } from "reactstrap"
import Breadcrumb from "../common/breadcrumb"
import { Autocomplete } from '@mui/joy'
import SwitchButton from '../common/utils/switch/switch-btn'
import ModalClient from "./modal-client/modal-client"
import { ToastContainer, toast } from "react-toastify"
import { ShoppingCart, Trash, UserPlus } from "react-feather"
import ApiUrls from "../../constants/apiUrl"
import axios from 'axios'
import { NumericFormat } from "react-number-format"
import './styles.scss'


const Create_sale = () => {
	//Url Api
	const baseUrl = ApiUrls.base

	//Numero de Factura
	const [num, setNum] = useState(0)

	//Switch Data
	const [wData, setWData] = useState(false)

	const handleSwitchChange = (newValue) => {
		setWData(newValue)
	}

	//Modal Open
	const [mOpen, setMOpen] = useState(false)
	const handleModalChange = (newValue) => {
		setMOpen(newValue)
	}
	//Modal Submit
	//Cedula modal
	const [cedCli, setCedCli] = useState('')
	const handleFormSubmit = async(value) => {
		setCedCli(value.dni)		
		setCli(value)
		reqData()		
		toast.success('Cliente agregado')
	}

	//Cedula page
	const [ced, setCed] = useState('')

	//Objeto cliente
	const [cli, setCli] = useState(null)

	//Data clientes
	const [cliData, setCliData] = useState(null)

	//Opciones clientes
	const [opCed, setOpCed] = useState([
		'Sin opciones'
	])

	//Product selected
	const [prod, setPro] = useState(null)

	//Data de productos
	const [proData, setProData] = useState(null)

	//Opciones clientes
	const [opPro, setOpPro] = useState([
		'Sin opciones'
	])

	//Switch inventario
	const [wInven, setWInven] = useState(false)
	const hanInvenSwitch = (newValue) => {
		setWInven(newValue)
	}

	//Switch facturas
	const [wFact, setWFact] = useState(false)
	const hanFactSwitch = (newValue) => {
		setWFact(newValue)
	}

	//Datos clientes - productos
	const reqData = async() => {
		await axios.get(baseUrl + "th_clients/clients.php").then(response=>{
			setCliData(response.data)
			setOpCed(response.data.map(item=>item.dni))
		})

		await axios.get(baseUrl + "th_inventory/inventory.php?METHOD=SALE").then(response=>{
			setProData(response.data)
			setOpPro(response.data.map(item=>item.name))
		})

		await axios.get(baseUrl + "th_sales/sales.php?METHOD=NUM").then(response=>{
			setNum(parseInt(response.data.num)+1)
		})
	}

	//Array de items
	const [items, setItems] = useState([])
	const addItem = () => {
		const newItem = proData.find(obj => obj.name === prod)
		let subtotal = newItem.price
		const existingItem = items.find(item => item.name === newItem.name)

		if (existingItem) {
			subtotal = existingItem.price * (existingItem.cant+1)
			const updatedItems = items.map(item => {
			  if (item.name === newItem.name) {
				return { ...item, cant: item.cant + 1, subtotal: parseFloat(subtotal.toFixed(2))}
			  }
			  return item
			})

		setItems(updatedItems)
		}else{
			setItems([...items, { ...newItem, cant: 1, subtotal: subtotal }]);
		}
	}
	const hanItemsCant = (itemNa, newQuantity) => {
		const updatedItems = items.map(item => {
		  if (item.name === itemNa) {
			return { ...item, cant: newQuantity, subtotal: parseFloat((newQuantity * item.price).toFixed(2)) }
		  }
		  return item
		})
	
		setItems(updatedItems)
	}
	const hanItemsDel = (itemNa) => {
		const updatedItems = items.filter(item => item.name !== itemNa)
    	setItems(updatedItems)
	}	
	const [desct, setDesct] = useState(0)
	const calcSubTotal = () => {
		let subtotal = items.reduce((total, item) => total + item.price * item.cant, 0)
		let res 
		if(desct > 100){
			res = subtotal
		}else{
			res = subtotal - (subtotal * desct/100)
		}
		return res.toFixed(2)
	}
	const calcIva = () => {
		return (calcSubTotal() * 0.12).toFixed(2)
	}
	const calcTotal = () => {
		let subtotal = calcSubTotal()
		let iva = calcIva()
		return (parseFloat(subtotal) + parseFloat((iva))).toFixed(2)
	}

	//Registrar venta
	const reqPost=async()=>{        
		if(items.length > 0){
			var f = new FormData()
			f.append("METHOD",'ADD')
			if(wData){
				if(cli){
					f.append("cli", cli.dni)
				}else{
					f.append("cli", cedCli)
				}
			}else{
				f.append("cli", '9999999999999')
			}
			f.append("sub", calcSubTotal())
			f.append("desct", desct)
			f.append("iva", calcIva())
			f.append("total", calcTotal())
			f.append("no", num)
			f.append("items", JSON.stringify(items))	
			await axios.post(baseUrl + "th_sales/sales.php", f).then(response=>{
				if(!wFact){
					test()
				}
				console.log(response.data)
				toast.success('Venta exitosa')
			}).catch(err=>{
				console.log(err)
			})    		
		}else{
			toast.warn('No hay productos')
		}
    }

	const datos_factura = {
		factura_recibida: {
			fecha: null, 
			clave_acceso: null, 
			numero_factura: num, 
			subtotal: calcSubTotal(),
			total_iva: calcIva(), 
			total: calcTotal(),
		},
		cliente:{
			id_cliente: cli ? (cli.dni.length > 10 ? '04' : '05') : '07',
			nombre: wData ? (cli?cli.name.split(' ')[0]:'CONSUMIDOR') : 'CONSUMIDOR',
			apelllido: wData ? (cli?(cli.name.split(' '))[1]:'FINAL'): 'FINAL',
			numero_identificacion: cli ? cli.dni : '9999999999999',
			direccion_cliente: cli ? cli.dir : 'Ambato',
			email: cli ? cli.email : null,			
		},
		detalles_factura : items			
	}

	const test = () => {
		axios.post('http://localhost:5000/send-xml', datos_factura)
			.then((response) => {
			console.log(response.data) 
			})
			.catch((error) => {
			console.error(error) 
		})
	}

	useEffect(()=>{
		reqData()
	  },[])
	return (
		<Fragment>	
			<ToastContainer theme='dark'/>
			<Breadcrumb title={`Nueva Venta - No. 000${num}`}/>
			<Container fluid={true}>
				<Card>
					<CardHeader>						
						<Row>
							<Col>
								<h5>Factura {wData ? 'con':'sin'} datos</h5>
							</Col>
							<Col style={{display:'flex', justifyContent:'end'}}>
								<SwitchButton value={wData} onChange={handleSwitchChange} icon='FileText'/>								
							</Col>
						</Row>
					</CardHeader>
					<CardBody>						
						{wData? 
						(
							<Fragment>
								<Row>
									<h5>Selecciona cliente</h5>
								</Row>
								<Row style={{alignItems: 'center'}}>
									<Col md='10' sm='9' xs='8'>
										<Autocomplete 
										placeholder="Cedula"
										options={opCed}		
										value={cedCli ? cedCli : ced}								
										onChange={(event, newValue) => {
											setCed(newValue)
											setCedCli(null)
											const matchProd = cliData.find(obj => obj.dni === newValue)
											if(matchProd){
											  setCli(matchProd)
											}else{
											  setCli(null)
											}
										  }}
										isOptionEqualToValue={(option, value) => option.id === value.id}
										/>
									</Col>
									<Col>
										<button className="btn btn-primary" onClick={()=>{
											setMOpen(true)
											setCedCli('')
											setCli(null)
											setCed('')
										}
											}>
												<UserPlus/>
										</button>
									</Col>
								</Row>
								<div style={{height: '10px'}}/>
								{cli? (
									<Fragment>
										<Row>
											<Col>
												<p>Nombre</p>
											</Col>
											<Col>
												<p>Email</p>
											</Col>
										</Row>

										<Row>
											<Col>									
												{cli.last ? cli.name+' '+cli.last : cli.name}
											</Col>
											<Col>
												{cli.email}
											</Col>										
										</Row>
									</Fragment>
								):(
									<Fragment/>
								)}									
							</Fragment>
						):
						(
							<Fragment>
								<Row>
									<h5>Consumidor Final</h5>
								</Row>								
							</Fragment>
						)}
						<hr/>
						<Row>
							<Col>
								<h6>{wInven ? 'Controlando inventario' : 'Sin control de inventario'}</h6>
							</Col>
							<Col style={{display:'flex', justifyContent:'end'}}>
								<SwitchButton value={wInven} onChange={hanInvenSwitch} icon='Package'/>								
							</Col>
						</Row>
						<div style={{height: '20px'}}/>
						{wInven?(
							<Fragment>
								
							</Fragment>
						):(
							<Fragment>
								<Row style={{alignItems: 'center'}}>
									<Col md='10' sm='9' xs='8'>
										<Autocomplete
										placeholder="Escoge un producto"
										options={opPro}		
										value={prod}								
										onChange={(event, newValue) => {
											setPro(newValue)											
										  }}
										isOptionEqualToValue={(option, value) => option.id === value.id}
										/>
									</Col>
									<Col>
										<button className="btn btn-primary" disabled={prod == null ? true : false} 
											onClick={()=>(
												addItem(),
												setPro(null)
										)}>
												<ShoppingCart/>
										</button>
									</Col>
								</Row>
								<div style={{height: '20px'}}/>
								{items.length > 0 ? (
									<div className='items-data'>
										<Row style={{alignItems: 'center', minWidth: '600px'}}>
											<Col>
												<h4>Producto</h4>
											</Col>
											<Col>
												<h4>Cantidad</h4>
											</Col>
											<Col>
												<h4>Precio/U</h4>
											</Col>
											<Col>
												<h4>Sub Precio</h4>
											</Col>
											<Col>
											</Col>
										</Row>
										<div style={{height: '10px'}}/>										
										{items.map((item, i)=>(
											<Fragment key={i}>
												<Row style={{alignItems: 'center', minWidth: '600px'}}>
													<Col>
														<p>{item.name}</p>
													</Col>
													<Col>
														<NumericFormat
														customInput={Input}
														value={item.cant}
														onChange={(e)=>{
															if(e.target.value === ''){
																hanItemsCant(item.name, parseInt(1))
															}else{
																hanItemsCant(item.name, parseInt(e.target.value))
															}
														}}
														decimalScale={0}
														allowLeadingZeros={false}
														allowNegative={false}
														
														/>
													</Col>
													<Col>
														<p>$ {item.price}</p>
													</Col>
													<Col>
														<p>$ {item.cant * item.price}</p>
													</Col>
													<Col>
														<span className="del-icon" 
														onClick={()=>{
															hanItemsDel(item.name)
														}}>
															<Trash/>
														</span>
													</Col>
												</Row>
											<div style={{height: '5px'}}/>
											</Fragment>
										))}		
										<hr/>
										<Row>
											<Col style={{textAlign: 'end'}}>
												Subtotal
											</Col>				
											<Col>
												$ {calcSubTotal()}
											</Col>
										</Row>	
										<Row>
											<Col style={{textAlign: 'end'}}>
												Descuento
											</Col>				
											<Col>
												<NumericFormat
												value={desct}
												onChange={(e)=>{
													if(e.target.value === ''){
														setDesct(parseInt(0))
													}else{
														if(e.target.value > 100){
															setDesct(parseInt(100))
														}
														setDesct(parseInt(e.target.value))
													}
												}}
												maxLength={3}
												decimalScale={0}
												allowLeadingZeros={false}
												allowNegative={false}
												style={{
													width: '40px',													
												}}
												/>%
												{desct > 100 ? ' No valido': ''}
											</Col>
										</Row>	
										<Row>
											<Col style={{textAlign: 'end'}}>
												Iva 12%
											</Col>
											<Col>
												$ {calcIva()}
											</Col>
										</Row>		
										<Row>
											<Col style={{textAlign: 'end'}}>
												Total
											</Col>
											<Col>
												$ {calcTotal()}
											</Col>
										</Row>	
									</div>
								):(
									<Fragment/>
								)}									
							</Fragment>
						)
						}
						<hr/>
						<Row>
							<Col>
								<h6>{wFact ? 'No Enviar Factura' : 'Enviar factura'}</h6>
							</Col>
							<Col style={{display:'flex', justifyContent:'end'}}>
								<SwitchButton value={wFact} onChange={hanFactSwitch} icon='CheckSquare'/>								
							</Col>
						</Row>
						<div style={{height: '10px'}}/>
						<Row>
							<Button color="primary" onClick={()=>{
								if (window.confirm("Estas seguro que deseas guardar la factura?")){
									reqPost()
									setCed('')
									setCedCli('')
									setCli(null)
									setDesct(0)
									setNum(num+1)
									setItems([])
								}
								}} disabled={items.length > 0 ? false : true}>Guardar</Button>
						</Row>
					
					</CardBody>
				</Card>
			</Container>			
			<ModalClient isOpen={mOpen} onChange={handleModalChange} onSubmit={handleFormSubmit}/>

		</Fragment>
	);
};

export default Create_sale
