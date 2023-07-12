import React, { Fragment } from "react"
import Breadcrumb from "../common/breadcrumb"
import DataTable from 'react-data-table-component'
import { Button, Card, CardBody, CardHeader, Col, Container, Input, Row } from "reactstrap"
import { Link } from "react-router-dom"
import {useState} from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {jsPDF} from 'jspdf'
import 'jspdf-autotable'
import { ToastContainer,toast } from "react-toastify"
import ApiUrls from "../../constants/apiUrl"

const List_users = () => {
	const baseUrl = ApiUrls.base+"th_users/users.php"
	
	const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);		
	const [search, setSearch] = useState("");
	const [filtered, setFiltered] = useState([]);

	const col=[
		{
			name: "",
			cell: (row) => (
				<div className="i-icon-container">
					<span className="i-icon-st" onClick={(e) => {						
						if (window.confirm("Estas seguro que deseas eliminar?"))
						requestDelete(row.id);
					}}>
						<i
							className="fa fa-trash"
							style={{								
								color: "#e4566e",
							}}
						></i>
					</span>
					<Link to={`/users/create-user/${row.id}`}>
						<span className="i-icon-st">
							<i
								className="fa fa-pencil"	
								style={{
									color: "#33E9FF"
								}}						
							/>
						</span>
					</Link>
				</div>
				),			
			sortable: false,
			width: '80px',
			center: true,
		},		
		{
			name: 'Usuario',
			selector: row => row.user_name,
			width: "130px",
			center: true,
		},
		{
			name: 'Nombre',
			selector: row => row.name,
			width: "150px",
		},
		{
			name: 'Email',
			selector: row => row.email,
			width: '200px',
		},
		{
			name: 'Nivel de Acceso',
			selector: row => row.permision,
			center: true,
		},						
	]

	const cusTable = {
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
	}
	
	const requestGet=async()=>{
		setLoading(true);
        await axios.get(baseUrl).then(response=>{
            setData(response.data);
			setFiltered(response.data)
        })
		setLoading(false);
    }

	const requestDelete=async(id)=>{
        var f = new FormData();
        f.append("METHOD", "DELETE");
		f.append("id", id);
        await axios.post(baseUrl, f).then(response=>{
			requestGet();
            toast.success("Eliminado Exitosamente!");
        }).catch(error=>{
          console.log(error);
        })
    }

	useEffect(()=>{
		requestGet()
		const result = data.filter(client =>{
			return client.name.toLowerCase().match(search.toLowerCase());
		});

		setFiltered(result);
	},[search])
	
	const columnsPDF = [
		{title: "ID", field: "id"},
		{title: "CED", field: "dni"},
		{title: "Nombre", field: "name"},
		{title: "Email", field: "email"},
		{title: "Telefono", field: "phone"},
		{title: "Direccion", field: "dir"},
	]

	const downloadPdf=()=>{
		const doc=new jsPDF()
		doc.text("Thunder Clientes",20,10)
		doc.autoTable({
			theme: "grid",
			columns:columnsPDF.map(col => ({ ...col, dataKey: col.field })),
			body:data,
		})
		doc.save('thunder_clientes.pdf')
		toast.info("Reporte Completado!");
	}

	return (
		<Fragment>
			<Breadcrumb title="Usuarios" parent="Menu" />
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Lista de Usuarios</h5>
							</CardHeader>
							<CardBody >				
								<Row xl="2">
									<Col xs style={{marginBottom: '10px'}}>
										<Link to="/users/create-user/" className="btn btn-primary">
											<i className="fa fa-plus"/>
										</Link>	
										<span> </span>								
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
								<div>
									<DataTable
										progressPending={loading}									
										pagination
										columns={col}
										data={filtered}
										pageSize={6}
										noDataComponent="No hay datos para mostrar" 
										customStyles={cusTable}
									/>
									<ToastContainer theme="colored"/>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default List_users;
