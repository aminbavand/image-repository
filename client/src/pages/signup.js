import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

class Signup extends Component {
  state = {
    username: '',
    password: '',
    isSubmitted: false,
    publicID: '1'
  };


  
  // async componentDidMount() {

    // const val = await axios.get('/api/last-user-info');
    // const a = val.data["users"]["name"];
    // this.setState({ values: a});

  // }




  handleSubmit = async (event) =>{
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');
    // const a = 'wefwefwuifiuwfowfoin'
    // const options = {
    //   headers: {'x-access-token': a}
    // };
    // console.log(options["headers"]['x-access-token'])
    const response = await axios.post('api/signup',{"username":username, "password":password},{}); 
    // console.log(response.data["token"])
    this.setState({ publicID: response.data["publicID"]});
    this.setState({ isSubmitted: true});

    this.setState({ username: '' });
    this.setState({ password: '' });
  
    
  }




  render() {


    if (this.state.isSubmitted){
      const url = "/home/:" + this.state.publicID;
      return(<Redirect to = {url}/>) ;
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
