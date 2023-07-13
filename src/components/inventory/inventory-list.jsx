import React, { Fragment } from "react";
import Breadcrumb from "../common/breadcrumb";
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Col, Container, Row, Input, Button,  } from "reactstrap";
import { Link } from "react-router-dom";
import {useState} from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {jsPDF} from 'jspdf'
import 'jspdf-autotable'
import { ToastContainer,toast } from "react-toastify";
import ApiUrls from "../../constants/apiUrl";

const InventoryList = () => {
	const baseUrl = ApiUrls.base+"th_inventory/inventory.php"

    const [data, setData] = useState([]);		
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [filtered, setFiltered] = useState([]);

	const col=[		
		{
			name: 'Opciones',
			cell: (row) => (
				<div className="i-icon-container">
					<span className="i-icon-st" onClick={(e) => {						
						if (window.confirm("Estas seguro que deseas eliminar?"))
						requestDelete(row.id);
					}}>
						<i
							className="fa fa-trash"
							style={{								
								color: "#DF2E2B",
							}}
						/>
					</span>
					<Link to={`/inventory/add-inventory/${row.id}`}>
						<span className="i-icon-st">
							<i
								className="fa fa-edit"
								style={{									
									color: "#0ECFEE",
								}}
							/>
						</span>
					</Link>
					<Link to={`/inventory/prod-inventory/${row.id}`}>
						<span className="i-icon-st">
							<i
								className="fa fa-archive"
								style={{									
									color: "#591BD5",
								}}
							/>
						</span>
					</Link>						
				</div>
				
			),
			width: '110px',
			center: true,
		},
		{
			name: 'ID',
			selector: row => row.id,
			width: '70px',
			left: true,		
			center: true,
		},
		{
			name: 'Nombre',
			selector: row => row.name,		
			minWidth: '200px',
			style: {
				fontWeight: '700'
			},
			wrap: true

		},		
		{
			name: 'Precio',
			selector: row => row.price,
			sortable: true,
			cell: (row) => (
				<span>$ {row.price}</span>
			)
		},
		{
			name: 'Cantidad',
			selector: row => row.quant,
			sortable: true,
		},
		{
			name: 'Proveedor',
			selector: row => row.provider,
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
	}

	const ExpandedComponent = ({ data }) => (
			<div style={{margin: '10px', marginLeft:'50px',padding: '1opx'}}><span><h2 style={{fontSize: '12px'}}>Descripcion:</h2><p>{JSON.stringify(data.descrip, null, 2)}</p></span></div>		
	)

	const requestGet=async()=>{
		setLoading(true);
        await axios.get(baseUrl).then(response=>{
            setData(response.data)
			setFiltered(response.data)
        })
		setLoading(false);
    }

	const requestDelete=async(id)=>{
        var f = new FormData();
        f.append("METHOD", "DELETE");
		f.append("id", id);
        await axios.post(baseUrl, f).then(response=>{
            requestGet()
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
		const result = data.filter(pro =>{
			return pro.name.toLowerCase().match(search.toLowerCase())
		})
		setFiltered(result);
	},[search])

	useEffect(()=>{
		requestGet()
	},[])

	return (
		<Fragment>
			<Breadcrumb title="Stock"/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>							
							<CardBody >				
								<Row xl="2">
									<Col xs style={{marginBottom: '10px'}}>
										<Link to="/inventory/add-inventory/" className="btn btn-primary">
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
			</Container>
			<ToastContainer theme="colored"/>
		</Fragment>
	);
};

export default InventoryList;
