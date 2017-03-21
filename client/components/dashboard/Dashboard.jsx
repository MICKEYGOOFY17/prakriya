import React from 'react';
import Request from 'superagent';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const styles = {
	container: {
		margin: 'auto'
	},
	heading: {
		textAlign: 'center'
	},
	card: {
		width: '400px'
	}
}

export default class Dashboard extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			user: {}
		}
		this.getUser = this.getUser.bind(this);
	}
	componentDidMount() {
		this.getUser()
	}
	getUser() {
		let th = this
		Request
			.get('/dashboard/user')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				if(err)
					console.log(err) 
				else {
					th.setState({
						user: res.body
					})
					console.log(th.state.user)
				}
			})
	}

	render() {
		return(
			<div style={styles.container}>
				<h1 style={styles.heading}>This is the dashboard</h1>
				<Card style={styles.card} >
			    <CardHeader
			      title={this.state.user.name}			      
			      subtitle={this.state.user.username}
			      avatar="../assets/images/avt-default.jpg"
			    />
			    <CardMedia
			      overlay={<CardTitle title={this.state.user.name} subtitle={this.state.user.username} />}
			    >
			      <img src="../assets/images/avt-default.jpg" />
			    </CardMedia>
			  </Card>				
			</div>
		)
	}

}