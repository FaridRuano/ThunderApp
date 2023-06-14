import React, { Fragment, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from "reactstrap";

const Datatable = ({ myData, myClass, multiSelectOption, pagination }) => {
	const [open, setOpen] = useState(false);
	const [checkedValues, setCheckedValues] = useState([]);
	const [data, setData] = useState(myData);
	const selectRow = (e, i) => {
		if (!e.target.checked) {
			setCheckedValues(checkedValues.filter((item, j) => i !== item));
		} else {
			checkedValues.push(i);
			setCheckedValues(checkedValues);
		}
	};
	

	const handleRemoveRow = () => {
		const updatedData = myData.filter(function (el) {
			return checkedValues.indexOf(el.id) < 0;
		});
		setData([...updatedData]);
		toast.success("Successfully Deleted !");
	};

	const renderEditable = (cellInfo) => {
		return (
			<div
				style={{ backgroundColor: "#fafafa" }}
				contentEditable
				suppressContentEditableWarning
				onBlur={(e) => {
					data[cellInfo.index][cellInfo.index.id] = e.target.innerHTML;
					setData({ myData: data });
				}}
				dangerouslySetInnerHTML={{
					__html: myData[cellInfo.index][cellInfo.index.id],
				}}
			/>
		);
	};

	const handleDelete = (index) => {
		if (window.confirm("Are you sure you wish to delete this item?")) {
			const del = data;
			del.splice(index, 1);
			setData([...del]);
		}
		toast.success("Cliente Eliminado!");
	};
	const onOpenModal = () => {
		setOpen(true);
	};

	const onCloseModal = () => {
		setOpen(false);
	};

	const Capitalize = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const columns = [];
	for (const key in myData[0]) {
		let editable = renderEditable;
		if (key === "id") {
			editable = null;
		}
		if (key === "cedula") {
			editable = null;
		}
		if (key === "nombre") {
			editable = null;
		}
		if (key === "telefono") {
			editable = null;
		}
		if (key === "direccion") {
			editable = null;
		}
		if (key === "emergencia") {
			editable = null;
		}
		if (key === "inicio") {
			editable = null;
		}

		columns.push({
			name: <b>{Capitalize(key.toString())}</b>,
			header: <b>{Capitalize(key.toString())}</b>,
			selector: row => row[key],
			Cell: editable,
			style: {
				textAlign: "center",
			},
		});
	}

	if (multiSelectOption === true) {
		columns.push({
			name: (
				<button
					className="btn btn-danger btn-sm btn-delete mb-0 b-r-4"
					onClick={(e) => {
						if (window.confirm("Are you sure you wish to delete this item?"))
							handleRemoveRow();
					}}
				>
					Delete
				</button>
			),
			id: "delete",
			accessor: (str) => "delete",
			cell: (row) => (
				<div>
					<span>
						<input
							type="checkbox"
							name={row.id}
							defaultChecked={checkedValues.includes(row.id)}
							onChange={(e) => selectRow(e, row.id)}
						/>
					</span>
				</div>
			),
			style: {
				textAlign: "center",
			},
			sortable: false,
		});
	} else {
		columns.push({
			name: <b>Action</b>,
			id: "delete",
			accessor: (str) => "delete",
			cell: (row, index) => (
				<div>
					<span onClick={() => handleDelete(index)}>
						<i
							className="fa fa-trash"
							style={{
								width: 35,
								fontSize: 20,
								padding: 11,
								color: "#e4566e",
							}}
						></i>
					</span>

					<span>
						<i
							onClick={onOpenModal}
							className="fa fa-pencil"
							style={{
								width: 35,
								fontSize: 20,
								padding: 11,
								color: "rgb(40, 167, 69)",
							}}
						></i>
						<Modal
							isOpen={open}
							toggle={onCloseModal}
						>
							<ModalHeader toggle={onCloseModal}>
								<h5 className="modal-title f-w-600" id="exampleModalLabel2">
									Edit Product
								</h5>
							</ModalHeader>
							<ModalBody>
								<Form>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Nombre :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Apellido :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Email :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Telefono :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Direccion :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Telefono Emergencia :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Plan :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Fecha de Inicio :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									
								</Form>
							</ModalBody>
							<ModalFooter>
								<Button
									type="button"
									color="primary"
									onClick={() => onCloseModal("VaryingMdo")}
								>
									Actualizar
								</Button>
								<Button
									type="button"
									color="secondary"
									onClick={() => onCloseModal("VaryingMdo")}
								>
									Cancelar
								</Button>
							</ModalFooter>
						</Modal>
					</span>
				</div>
			),
			style: {
				textAlign: "center",
			},
			sortable: false,
		});
	}
	return (
		<div>
			<Fragment>
				<DataTable
					data={data}
					columns={columns}
					className={myClass}
					pagination={pagination}
					striped={true}
					center={true}
				/>

				<ToastContainer />
			</Fragment>
		</div>
	);
};

export default Datatable;
