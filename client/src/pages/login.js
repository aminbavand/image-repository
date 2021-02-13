import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";

class Login extends Component {
  state = {
    username: '',
    password: '',
    isSubmitted: false,
    gotoHome: false
  };


  
  async componentDidMount() {

    // const val = await axios.get('/api/last-user-info');
    // const a = val.data["users"]["name"];
    // this.setState({ values: a});

  }




  handleSubmit = async (event) =>{
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');
    const response = await axios.post('api/login',{"username":username, "password":password},{}); 
    this.setState({ isSubmitted: true});

    this.setState({ username: '' });
    this.setState({ password: '' });
  
    
  }


  goBackHome = async (event) =>{
    event.preventDefault();

    this.setState({ gotoHome: true});
  }





  render() {


    if (this.state.isSubmitted){
        return(<Redirect to = "/afterlogin"/>) ;
    }


    if (this.state.gotoHome){
        return(<Redirect to = "/home"/>) ;
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
        
        


        <div>
          <form  onSubmit={this.goBackHome}>        
            <input type="submit" value="go to home" />
          </form>
        </div>




      </div>
    );
  }
}

export default Login;
