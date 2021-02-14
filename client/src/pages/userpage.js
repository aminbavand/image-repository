import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class UserPage extends Component {
    state = {
      };
    
    
    
      render() {
    
    
        return (
          <div>
    
            <div>
              You have just logged in or signed up.   
              token is {this.props.location.data}                       
            </div>
            {/* {console.log(this.state.token)} */}

            {/* {console.log(this.props.location.data)} */}
            
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/signup">Sign Up Page</Link></li>
            {/* {console.log(this.props.match)} */}
           

    
          </div>
        );

      }

    
}

export default UserPage;

