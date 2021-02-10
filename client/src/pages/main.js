import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";

class Main extends Component {
  state = {
    username: '',
    password: '',
    values: '2',
    isSubmitted: false
  };


  
  async componentDidMount() {

    const val = await axios.get('/api/last-user-info');
    const a = val.data["users"]["name"];
    this.setState({ values: a});

  }




  handleSubmit = async (event) =>{
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');
    const response = await axios.post('api/user',{"username":username, "password":password},{}); 
    this.setState({ isSubmitted: true});

    // this.setState({ username: '' });
    // this.setState({ password: '' });
  
  }





  render() {


    if (this.state.isSubmitted){
        return(<Redirect to = "/newpage"/>) ;
    }




    return (
      <div>
        {/* <form onSubmit={this.handleSubmit}>
          <label>Enter index:</label>

          <input
            value={this.state.inputNum}
            onChange={(event) => this.setState({ inputNum: event.target.value })}
          />


          <button>Submit</button>
        </form> */}



        <form  onSubmit={this.handleSubmit}>
          username
          <input
           value={this.state.username} type="text" name="username" id="username" 
           onChange={(event) => this.setState({ username: event.target.value })}
          />
          password
          <input
           value={this.state.password} type="text" name="password" id="password" 
           onChange={(event) => this.setState({ password: event.target.value })}
          />
          <input type="submit" value="Submit" />
        </form>
        


        {/* <h3>Calculated Values:</h3> */}






        <div>
          The last user is {this.state.values}
        </div>



      </div>
    );
  }
}

export default Main;
