import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

const imgStyle = {
	width: "100%",
	height: "150px",
	objectFit: "contain",
	objectPosition: "50% 50%",
};



const FileCard =(props) => {

	return (
		<Card
			bg={(props.selectedItem !== undefined && props.selectedItem._id === props._id) ? "primary" : undefined}
		>
			{(props.thumbnailUrl) && (
				<Card.Img variant="top" src={props.thumbnailUrl} style={imgStyle}/>
			)}
			{(props.title || props.description) && (
				<Card.Body>
					<Card.Title>{props.title}</Card.Title>
					<Card.Text>{props.description}</Card.Text>
				</Card.Body>
			)}
			<ListGroup className="list-group-flush small">
				{(props.fileName) && (<ListGroupItem>{props.fileName}</ListGroupItem>)}				
			</ListGroup>
		</Card>
	);
};

export default FileCard;