import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  state = {

  };




  render() {



    return (
      <div>



        
        <li><Link to="/login">Login Page</Link></li>
        <li><Link to="/signup">Sign Up Page</Link></li>


        
       
        



      </div>
    );
  }
}

export default Home;
