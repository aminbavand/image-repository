import React, { Component } from 'react';
import { Redirect } from "react-router-dom";


class AfterLogin extends Component {
    state = {
        gotoHome: false,
        gotoSignup: false
      };
    
    
    
      handlgoHome = async (event) =>{
        event.preventDefault();
    
        this.setState({ gotoHome: true});  
      }

      handlgoSignup = async (event) =>{
        event.preventDefault();
    
        this.setState({ gotoSignup: true});  
      }
    
    
    
    
      render() {
    
    
        if (this.state.gotoHome){
            return(<Redirect to = "/home"/>) ;
        }

        if (this.state.gotoSignup){
          return(<Redirect to = "/signup"/>) ;
      }
    
    
    
    
        return (
          <div>
    
            <div>
              You have just logged in.
            </div>
            
            <form  onSubmit={this.handlgoHome}>        
            <input type="submit" value="go to home" />
            </form>

            <form  onSubmit={this.handlgoSignup}>        
            <input type="submit" value="go to sign up" />
            </form>
           

    
          </div>
        );

      }

    
}

export default AfterLogin;