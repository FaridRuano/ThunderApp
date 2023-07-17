import React, { Fragment, useState, useEffect, useContext } from "react"
import {  useNavigate } from "react-router-dom"
import { AlignLeft} from "react-feather"
import './style.scss'

//images
import logo from "../../../assets/images/thunder-logo2.png"
import { UserContext } from "../../../constants/userData"

const Header = () => {
	
	const [sidebar, setSidebar] = useState(true)	
    const { userData } = useContext(UserContext)
	const history = useNavigate()

	function routeChange() {
		history(`${process.env.PUBLIC_URL}/auth/login`)
	}

	useEffect(()=>{			
		const savedData = JSON.parse(localStorage.getItem('THNDRSRDT'))
		if(!savedData){
			routeChange()
		}
    },[])
		
	const openCloseSidebar = () => {
		if (sidebar) {
			setSidebar(false);
			document.querySelector(".page-main-header").classList.add("open")
			document.querySelector(".page-sidebar").classList.add("open")
			document.querySelector(".footer").classList.add("open")
		} else {
			setSidebar(true);
			document.querySelector(".page-main-header").classList.remove("open")
			document.querySelector(".page-sidebar").classList.remove("open")
			document.querySelector(".footer").classList.remove("open")
		}
	}		

	return (
		<Fragment>
			{/* open */}
			<div className="page-main-header ">
				<div className="main-header-right row">
					<div className="main-header-left d-lg-none col-auto">
						<div className="logo-wrapper">
							<a href="#">
								<img className="blur-up lazyloaded" src={logo} alt="" />
							</a>
						</div>
					</div>
					<div className="mobile-sidebar col-auto p-0">
						<div className="media-body text-end switch-sm">
							<label className="switch">
								<a href="#javaScript" onClick={openCloseSidebar}>
									<AlignLeft />
								</a>
							</label>
						</div>
					</div>
					<div className="nav-right col">						
						<button className="btn-header-sale" onClick={()=>history(`${process.env.PUBLIC_URL}/sales/create-sale`)}>
							<span>
								Vender
							</span>
						</button>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default Header;
