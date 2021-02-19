import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactUploadImage from './imageUpload';


class UserPage extends Component {
    state = {
      token: this.props.location.data,
      publicID: '',
      name: '',
      admin: '',
      isLoggedIn: false
      };
    
    
      




      async componentDidMount() {
        if (typeof this.state.token != 'undefined'){
          localStorage.setItem('TOKEN', this.state.token)
        }

        

        const url = "/api/user/" + this.props.match.params["userId"];      


        const response = await axios.get(url, {
          headers: {
            'x-access-token': localStorage.getItem('TOKEN')
          }
        });

        this.setState({ isLoggedIn: true });

        console.log(this.state.isLoggedIn)

        
        console.log(response)

        this.setState({ admin: response.data['user']['admin'] });
        this.setState({ name: response.data['user']['name'] });
        this.setState({ publicID: response.data['user']['public_id'] });
      }

      renderUploadImage() {
        if (this.state.isLoggedIn) {
          return <ReactUploadImage />;
        }
      }







      render() {
    
    
        return (
          <div>
    
            
            You have just logged in or signed up.
            

            <h2>
              user information:
            </h2>

            <div>
              NAME: {this.state.name}
            </div>

            <div>
              ID: {this.state.publicID}
            </div>

            <div>
              ADMIN: {String(this.state.admin)}
            </div>

  



            {/* <ReactUploadImage /> */}

            {this.renderUploadImage()}


            
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/signup">Sign Up Page</Link></li>





        
    
          </div>
        );

      }

    
}

export default UserPage;

