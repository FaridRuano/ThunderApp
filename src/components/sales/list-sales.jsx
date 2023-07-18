import React, { Fragment } from "react"
import Breadcrumb from "../common/breadcrumb"
import DataTable from 'react-data-table-component'
import { Card, CardBody, CardHeader, Col, Container, Row, Input, Button,  } from "reactstrap"
import { Link } from "react-router-dom"
import {useState} from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {jsPDF} from 'jspdf'
import 'jspdf-autotable'
import { ToastContainer,toast } from "react-toastify"
import ApiUrls from "../../constants/apiUrl"
import LoadingComponent from "../common/utils/loading/loading-comp"
import EmptyComponent from "../common/utils/nodata/empty-comp"
import { ResponsiveEmbed } from "react-bootstrap"

const ListSales = () => {
	const baseUrl = ApiUrls.base+"th_sales/sales.php"
	
  	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [filtered, setFiltered] = useState([])
	const [detSale, setDetSale] = useState([])

	const col=[		
		{
			name: 'Opciones',
			selector: row => row.quant,
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
				</div>
				
			),
			width: '100px',
			center: true,
		},		
		{
			name: 'No.',
			selector: row => row.num,		
			width: '50px',

		},		
		{
			name: 'Cliente',
			selector: row => row.cli,
			width: '150px',
		},					
		{
			name: 'Subtotal',
			selector: row => row.subtotal,
		},
		{
			name: 'Descuento',
			selector: row => row.desct,
		},
		{
			name: 'Iva',
			selector: row => row.iva,
		},
		{
			name: 'Total',
			selector: row => row.total,
		},
		{
			name: 'Fecha',
			selector: row => row.date,
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

	const ExpandedComponent = ({ data }) => {
		const filteredData = detSale.filter(item => item.sid === data.num)
		return (		
			<div style={{margin: '10px', marginLeft:'50px',padding: '1opx'}}>
				{filteredData.length !== 0 ? (
					<div>
						<Row>
							<Col>
								<h6>Producto</h6>
							</Col>
							<Col>
								<h6>Precio</h6>							
							</Col>
							<Col>
								<h6>Cantidad</h6>
							</Col>
							<Col>
								<h6>Subtotal</h6>
							</Col>
						</Row>
						
						{						
							filteredData.map((its, i)=>(
								<Fragment key={i}>
									<Row>
										<Col>
											{its.name}
										</Col>
										<Col>
											{its.price}
										</Col>
										<Col>
											{its.cant}
										</Col>
										<Col>
											{its.sub}
										</Col>
									</Row>
								</Fragment>
							))
						}
					</div>
				):(
					<EmptyComponent/>
				)}
			</div>		
		)
	}

	const requestGet=async()=>{
		setLoading(true)
        await axios.get(baseUrl).then(response=>{
            setData(response.data)
			setFiltered(response.data)
        })
		await axios.get(baseUrl +  "?METHOD=DET").then(response=>{
            setDetSale(response.data)
        })
		setLoading(false)
    }

	const requestDelete=async(id)=>{
		setLoading(true)
        var f = new FormData()
        f.append("METHOD", "DELETE")
		f.append("id", id)
        await axios.post(baseUrl, f).then(response=>{
            requestGet()
        }).catch(error=>{
          console.log(error)
        })
		toast.success("Eliminado Exitosamente!")
        requestGet()
		setLoading(false)
    }
	
	const columnsPDF = [
		{title: "ID", field: "id"},
		{title: "Cliente", field: "cli"},
		{title: "Total", field: "total"},
	]

	const downloadPdf=()=>{
		const doc=new jsPDF()
		doc.text("Ventas Thunder",20,10)
		doc.autoTable({
			theme: "grid",
			columns:columnsPDF.map(col => ({ ...col, dataKey: col.field })),
			body:data,
		})
		doc.save('thunder_ventas.pdf')
		toast.info("Reporte Completado!");
	}	
	
	useEffect(()=>{
		requestGet()
		const result = data.filter(pro =>{
			return pro.cli.toLowerCase().match(search.toLowerCase())
		})
		console.log(result)

		setFiltered(result);
	},[search])

	useEffect(()=>{
		requestGet()
	},[])

	return (
		<Fragment>
			<Breadcrumb title="Ventas"/>
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardBody >				
								<Row xl="2">
									<Col xs style={{marginBottom: '10px'}}>
										<Link to="/sales/create-sale" className="btn btn-primary">
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
										progressComponent={<LoadingComponent/>}										
										pageSize={6}
										noDataComponent={<EmptyComponent/>}
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

export default ListSales;
