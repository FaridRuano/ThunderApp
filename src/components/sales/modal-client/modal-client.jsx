import React, { Fragment,useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Row } from "reactstrap";
import {  Link, useNavigate, useParams } from "react-router-dom";
import './style.scss'
import ApiUrls from "../../../constants/apiUrl";
import { NumericFormat } from 'react-number-format';
import { toast,ToastContainer } from "react-toastify";
import axios from 'axios';
import { X } from "react-feather";


const ModalClient = ({isOpen, onChange, onSubmit }) => {
    const [isOn, setIsOn] = useState(isOpen)
    const handleSubmit = () => {
        onSubmit(client.dni)
    }

    const handleToggle = () => {
        const newValue = !isOn
        setClient({
            dni: '',
            name: '',
            last: '',
            email: '',
            dir: '',
            phone: '',
        })
        setIsOn(newValue)
        onChange(newValue)
    }
    const baseUrl = ApiUrls.base+"th_clients/clients.php"


    const [data, setData] = useState([])

    const reqGet=async()=>{
        await axios.get(baseUrl).then(response=>{
            setData(response.data)	
        })
    }

    const [client, setClient] = useState({
        dni: '',
        name: '',
        last: '',
        email: '',
        dir: '',
        phone: '',
    })

    const hanCli=e=>{
        const{name, value}=e.target
        setClient((prevState)=>({
            ...prevState,
            [name]: value,
        }))
    }

    function contrData(){
        if(client.dni.length<10){
            toast.error("Cedula o Ruc incompleto")
            return false
        }else{
            if(data.some(value => value.dni === client.dni)){
                toast.error("Cedula o Ruc ya existe")				
                return false
            }
        } 		
        if(client.name.length<3){
            toast.error("Nombre incompleto")
            return false
        }else if(client.last.length<3){
            toast.error("Apellido incompleto")
            return false
        }else if(client.email.length<1){
            toast.error("Email incompleto")
            return false
        }else if(client.email.length>1){
            let validate = /\S+@\S+\.\S+/.test(client.email)
            if(!validate){
                toast.error("El Email no es valido")
                return false
            }else{
                if(data.some(value => value.email === client.email)){
                    toast.error("Email ya existe")				
                    return false
                }
            }				
        }if(client.dir.length<3){
            toast.error("Direccion incompleta")
            return false
        }else if(client.phone.length<10){
            toast.error("Telefono incompleto")
            return false
        }else{
            return true		
        }		
    }

    const reqPost=async()=>{
        if(contrData()){
            var f = new FormData()
            f.append("METHOD",'ADD')
            f.append("dni", client.dni)
            f.append("name", client.name)
            f.append("last", client.last)
            f.append("email", client.email)
            f.append("dir", client.dir)
            f.append("phone", client.phone)
            await axios.post(baseUrl, f).then(response=>{
                handleSubmit()
                setClient('')
                handleToggle()
            }).catch(err=>{
                console.log(err)
            })
        }		
    }

    useEffect(()=>{
        reqGet()
    },[])

  return (
    <Fragment>
        <div className='overlay'/>
        <div className='modal-warp'>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <h5>Detalles del Cliente</h5>
                        </Col>
                        <Col style={{display:'flex', justifyContent:'end'}}>
                            <span onClick={handleToggle} style={{cursor:'pointer'}}><X/></span>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Form className="needs-validation">
                        <div className="form-group row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span>Cedula/Ruc
                            </Label>
                            <div className="col-md-8">
                                <NumericFormat
                                    customInput={Input}
                                    allowLeadingZeros={true}
                                    allowNegative={false}												
                                    maxLength={13}
                                    decimalScale={0}
                                    name="dni"		
                                    onChange={hanCli}	
                                    value={client.dni}								
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span>Nombre
                            </Label>
                            <div className="col-md-8">
                                <Input
                                    maxLength={50}
                                    name="name"		
                                    onChange={hanCli}
                                    value={client.name}

                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span>Apellido
                            </Label>
                            <div className="col-md-8">
                                <Input
                                    maxLength={50}
                                    name="last"
                                    onChange={hanCli}
                                    value={client.last}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span>Email
                            </Label>
                            <div className="col-md-8">
                                <Input
                                    maxLength={100}
                                    name="email"
                                    onChange={hanCli}
                                    value={client.email}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span>Direccion
                            </Label>
                            <div className="col-md-8">
                                <Input
                                    maxLength={150}
                                    name="dir"
                                    onChange={hanCli}
                                    value={client.dir}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span>Telefono	
                            </Label>
                            <div className="col-md-8">
                                <NumericFormat
                                    allowLeadingZeros={true}
                                    allowNegative={false}
                                    decimalScale={0}
                                    customInput={Input}
                                    maxLength={10}
                                    name="phone"
                                    onChange={hanCli}
                                    value={client.phone}
                                />
                            </div>
                        </div>									
                        <div className="button-container-2">
                            <Button onClick={()=>reqPost()}>
                                Guardar
                            </Button>
                            <Button color="primary" onClick={handleToggle}>
                                Descartar
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
        <ToastContainer theme='dark'/>
    </Fragment>
  )
}

export default ModalClient