import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";

class Startup extends Component {
  state = {
    gotoLogin: false,
    gotoSignup: false
  };




  handleLogin = async (event) =>{
    event.preventDefault();

    this.setState({ gotoLogin: true});
  }



  handleSignup = async (event) =>{
    event.preventDefault();

    this.setState({ gotoSignup: true});  
  }




  render() {


    if (this.state.gotoLogin){
        return(<Redirect to = "/login"/>) ;
    }

    if (this.state.gotoSignup){
        return(<Redirect to = "/signup"/>) ;
    }




    return (
      <div>



        <form  onSubmit={this.handleLogin}>        
        <input type="submit" value="go to login" />
        </form>







        <form  onSubmit={this.handleSignup}>        
        <input type="submit" value="go to sign up" />
        </form>
       
        



      </div>
    );
  }
}

export default Startup;
