import React, { Fragment } from "react";
import Breadcrumb from "../common/breadcrumb";
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Col, Container, Row, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import {useState} from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {jsPDF} from 'jspdf'
import 'jspdf-autotable'
import { ToastContainer,toast } from "react-toastify";
import { height } from "@mui/system";



const List_shoes = () => {
	const baseUrl = "http://localhost:80/modelsKowac/models/kc_shoes/shoes.php";	

    const [data, setData] = useState([]);		
	const [loading, setLoading] = useState(false);

	const col=[		
		{
			name: 'ID',
			selector: row => row.id,	
			maxWidth: '50px',
			right: true,		
		},
		{
			name: 'Modelo',
			selector: row => row.model,		
			minWidth: '200px',
			style: {
				fontWeight: '700'
			},

		},
		{
			name: 'Suela',
			selector: row => row.sole,
			minWidth: '150px'
		},
		{
			name: 'Material',
			selector: row => row.mate,
			minWidth: '150px'
		},
		{
			name: 'Color',
			selector: row => row.color,
			minWidth: '150px'

		},			
		{
			name: <i className="fa fa-tag"
					style={{
						width: 35,
						fontSize: 20,
						padding: 11,
						color: "#D85336",
					}}
					></i>,
			selector: row => row.size,
			center: true,
			maxWidth: '100px',
			sortable: true,
		},
		{
			name: <i className="fa fa-usd"
					style={{
						width: 35,
						fontSize: 20,
						padding: 11,
						color: "#2B88AE",
					}}
					></i>,
			selector: row => row.price,
			center: true,
			maxWidth: '100px',
			sortable: true,
		},
		{
			name: <i className="fa fa-server"
					style={{
						width: 35,
						fontSize: 20,
						padding: 11,
						color: "#602BAE",
					}}
					></i>,
			selector: row => row.quant,
			center: true,
			maxWidth: '100px',
			sortable: true,
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
				padding: '15px',
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

	const ExpandedComponent = ({ data }) =>
			<CardHeader><span><h5>Descripcion:</h5><p>{JSON.stringify(data.descr, null, 2)}</p></span></CardHeader>		

	const requestGet=async()=>{
		setLoading(true);
        await axios.get(baseUrl).then(response=>{
            setData(response.data);
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
	useEffect(()=>{
        requestGet();
    },[])
	
	const columnsPDF = [
		{title: "ID", field: "id"},
		{title: "Nombre", field: "cli"},
		{title: "Email", field: "email"},
		{title: "Telefono", field: "tel"},
		{title: "Direccion", field: "dir"},
		{title: "T. Emergencia", field: "eme"},
		{title: "F. Registro", field: "reg"},

	]

	const downloadPdf=()=>{
		const doc=new jsPDF()
		doc.text("Kowac Clientes",20,10)
		doc.autoTable({
			theme: "grid",
			columns:columnsPDF.map(col => ({ ...col, dataKey: col.field })),
			body:data,
		})
		doc.save('kowac_clientes.pdf')
		toast.info("Reporte Completado!");
	}
		

	return (
		<Fragment>
			<Breadcrumb title="Stock"/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Lista de Zapatos</h5>
							</CardHeader>
							<CardBody >				
								<Row xl="3">
									<Col>
										<Card className="col" >
											<Link to="/shoes/create-shoe" className="btn btn-primary">
												Nuevo Zapato
											</Link>
										</Card>
									</Col>									
									<Col>
										<Card className="col">										
											<Button className="btn btn-secondary" onClick={() => downloadPdf()}>
												Exportar a PDF
											</Button>
										</Card>	
									</Col>								
									<Col md>
										<Card>
											<Input
												className="form-control"
												maxLength={50}																
												name="color"
												/>
										</Card>												
									</Col>																			
								</Row>									
																																										
								<div id="shoesStockTable">
									<DataTable
										progressPending={loading}
										pagination
										expandableRows
										expandableRowsComponent={ExpandedComponent}
										columns={col}
										data={data}
										pageSize={6}
										noDataComponent="No hay datos para mostrar"
										customStyles={customStyles}
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

export default List_shoes;
