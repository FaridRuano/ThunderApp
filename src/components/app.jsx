import React, { useState } from "react";
import Sidebar from "./common/sidebar";
import Footer from "./common/footer";
import Header from "./common/header";
import { Outlet } from "react-router-dom";

const App = (props) => {
	
	return (
		<div>
			<div className="page-wrapper">
				<Header />
				<div className="page-body-wrapper">
					<Sidebar />
					<div className="page-body"><Outlet/></div>
					<Footer />
				</div>
			</div>			
		</div>
	);
};
export default App;
