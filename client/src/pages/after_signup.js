import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class AfterSignup extends Component {
    state = {
      };
    
    
    
    
      render() {
    
  
    
    
        return (
          <div>
    
            <div>
              You have just signed up.
            </div>


                
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/signup">Sign Up Page</Link></li>

           

    
          </div>
        );

      }

    
}

export default AfterSignup;