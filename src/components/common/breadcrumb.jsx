import React from "react";
import { Col, Container, Row } from "reactstrap";

const Breadcrumb = ({title}) => {
	return (
		<Container fluid={true}>
			<div className="page-header">
				<Row>
					<Col lg="6">
						<div className="page-header-left">
							<h3>
								{title}
							</h3>
						</div>
					</Col>					
				</Row>
			</div>
		</Container>
	);
};

export default Breadcrumb;
