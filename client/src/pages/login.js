import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UserPage from './userpage';

class Login extends Component {
  state = {
    username: '',
    password: '',
    isSubmitted: false
  };


  
  // async componentDidMount() {

  //   const val = await axios.get('/api/login');
  //   // const a = val.data["users"]["name"];
  //   // this.setState({ values: a});

  // }




  handleSubmit = async (event) =>{
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');
    const response = await axios.post('api/login',{"username":username, "password":password},{}); 
    console.log(response)
    // const token = await axios.get('/api/login');
    this.setState({ isSubmitted: true});

    this.setState({ username: '' });
    this.setState({ password: '' });
  
    
  }





  render() {


    if (this.state.isSubmitted){
      const a = "/home/:66666"      
      return(<Redirect to = {a}/>) ;
    }



    return (
      <div>



        <form  onSubmit={this.handleSubmit}>
          username
          <input
           value={this.state.username} type="text" name="username" id="username" 
           onChange={(event) => this.setState({ username: event.target.value })}
          />
          password
          <input
           value={this.state.password} type="password" name="password" id="password" 
           onChange={(event) => this.setState({ password: event.target.value })}
          />
          <input type="submit" value="login" />
        </form>
        
        


        <li><Link to="/home">Home</Link></li>
        <li><Link to="/signup">Sign Up page</Link></li>




      </div>
    );
  }
}

export default Login;
