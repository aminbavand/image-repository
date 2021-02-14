import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

class Signup extends Component {
  state = {
    username: '',
    password: '',
    isSubmitted: false,
    token: '',
    publicID: ''
  };




  handleSubmit = async (event) =>{
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');

    const response = await axios.post('api/signup',{"username":username, "password":password},{}); 


    this.setState({ publicID: response.data["publicID"]});
    this.setState({ token: response.data["token"]});

    console.log(this.state.token)
    console.log(this.state.publicID)

    this.setState({ isSubmitted: true});

    this.setState({ username: '' });
    this.setState({ password: '' });
  
    
  }




  render() {


    if (this.state.isSubmitted){
      const url = "/home/" + this.state.publicID;
      return(<Redirect to = {{pathname: url, data:this.state.token}}/>);
    }


    return (
      <div>



        <form  onSubmit={this.handleSubmit}>
          create username
          <input
           value={this.state.username} type="text" name="username" id="username" 
           onChange={(event) => this.setState({ username: event.target.value })}
          />
          create password
          <input
           value={this.state.password} type="password" name="password" id="password" 
           onChange={(event) => this.setState({ password: event.target.value })}
          />
          <input type="submit" value="sign up" />
        </form>
        
        


        <li><Link to="/home">Home</Link></li>
        <li><Link to="/login">Login Page</Link></li>




      </div>
    );
  }
}

export default Signup;
