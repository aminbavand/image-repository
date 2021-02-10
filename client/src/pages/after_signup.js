import React, { Component } from 'react';
import { Redirect } from "react-router-dom";


class AfterSignup extends Component {
    state = {
        gotoHome: false
      };
    
    
    
      handlgoHome = async (event) =>{
        event.preventDefault();
    
        this.setState({ gotoHome: true});  
      }
    
    
    
    
      render() {
    
    
        if (this.state.gotoHome){
            return(<Redirect to = "/home"/>) ;
        }
    
    
    
    
        return (
          <div>
    
            <div>
              You have just signed up.
            </div>

            <form  onSubmit={this.handlgoHome}>        
            <input type="submit" value="go to home" />
            </form>
           

    
          </div>
        );

      }

    
}

export default AfterSignup;