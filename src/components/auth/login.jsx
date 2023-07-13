import React, { Fragment } from "react";
import LoginTabset from "./loginTabset";
import "../../assets/scss/slick.scss";
import "../../assets/scss/slick-theme.scss";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const Login = () => {	
	return (
		<Fragment>			
			<div className="page-wrapper">
								
				<div className="authentication-box">
					
					<Container>
						<Row>							
							<Col className="">
								<Card className="tab2-card">
									<CardBody>
										<LoginTabset />
									</CardBody>
								</Card>
							</Col>
						</Row>	
										
					</Container>
					
				</div>
					
			</div>
		</Fragment>
	);
};

export default Login;
