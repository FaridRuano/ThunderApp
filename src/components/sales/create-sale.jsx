import React, { Fragment, useState, useEffect } from "react";
import { Card, CardHeader, Container, CardBody, Row, Col } from "reactstrap";
import Breadcrumb from "../common/breadcrumb";
import { Autocomplete } from '@mui/joy'
import SwitchButton from '../common/utils/switch/switch-btn'
import ModalClient from "./modal-client/modal-client";
import { ToastContainer, toast } from "react-toastify";
import { UserPlus } from "react-feather";
import ApiUrls from "../../constants/apiUrl";
import axios from 'axios'


const Create_sale = () => {
	const baseUrl = ApiUrls.base + "th_clients/clients.php"

	const [wData, setWData] = useState(false)
	const [mOpen, setMOpen] = useState(false)
	const [cedCli, setCedCli] = useState('')
	const [ced, setCed] = useState('')
	const [cli, setCli] = useState(null)
	const [cliData, setCliData] = useState(null)
	const [opCed, setOpCed] = useState([
		'Sin opciones'
	])

	const reqCliData = async() => {
		await axios.get(baseUrl).then(response=>{
			setCliData(response.data)
			setOpCed(response.data.map(item=>item.dni))
		})
	}

	const handleFormSubmit = (value) => {
		setCedCli(value)		
		reqCliData()
		toast.success('Cliente agregado')
	}

	const handleModalChange = (newValue) => {
		setMOpen(newValue)
	}

	const handleSwitchChange = (newValue) => {
		setWData(newValue)
	}

	useEffect(()=>{
		reqCliData()
	  },[])
	return (
		<Fragment>	
			<ToastContainer theme='dark'/>
			<Breadcrumb title="Nueva Venta"/>
			<Container fluid={true}>
				<Card>
					<CardHeader>						
						<Row>
							<Col>
								<h5>Factura {wData ? 'con':'sin'} datos</h5>
							</Col>
							<Col style={{display:'flex', justifyContent:'end'}}>
								<SwitchButton value={wData} onChange={handleSwitchChange}/>								
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
									<Col md='10' sm='9' xs='8' x>
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
										<button className="btn btn-primary" onClick={()=>setMOpen(true)}><UserPlus/></button>
									</Col>
								</Row>
							</Fragment>
						):
						(
							<Row>
								<h5>Consumidor Final</h5>
							</Row>
						)}
					</CardBody>
				</Card>
			</Container>
			{mOpen ? 
			(
				<ModalClient isOpen={mOpen} onChange={handleModalChange} onSubmit={handleFormSubmit}/>
			):(
				<Fragment/>
			)}
		</Fragment>
	);
};

export default Create_sale;
