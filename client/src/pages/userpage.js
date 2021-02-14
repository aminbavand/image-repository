import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


class UserPage extends Component {
    state = {
      token: this.props.location.data,
      publicID: this.props.match.params["userId"],
      name: '',
      admin: false
      };
    
    
      




      async componentDidMount() {

        const url = "/api/user/" + this.state.publicID;      


        console.log('123hello')
        const response = await axios.get(url, {
          headers: {
            'x-access-token': this.state.token
          }
          });
        this.setState({ admin: response.data['user']['admin'] });
        this.setState({ name: response.data['user']['name'] });

        // console.log(response.data['user']['admin'])
        // console.log(response.data['user']['name'])
        // console.log(response.data['user']['public_id'])


      }







      render() {
    
    
        return (
          <div>
    
            
            You have just logged in or signed up.
            

            <h3>
              user information:
            </h3>

            <div>
              NAME: {this.state.name}
            </div>

            <div>
              ID: {this.state.publicID}
            </div>

            <div>
              ADMIN: {String(this.state.admin)}
            </div>

            
            
            
            {/* <button 
              onClick={ () => this.handleIncrement({id : 1})} >
              increment
            </button> */}


            
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/signup">Sign Up Page</Link></li>
        
    
          </div>
        );

      }

    
}

export default UserPage;

