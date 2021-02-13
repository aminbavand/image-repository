import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";

class test extends Component {
  state = {
    username: '',
    password: '',
    values: '2',
    isSubmitted: false,
    gotoHome: false
  };


  
  async componentDidMount() {

    const val = await axios.get('/api/last-user-info');
    const a = val.data["users"]["name"];
    this.setState({ values: a});
    console.log(a)

  }




  handleSubmit = async (event) =>{
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');
    const response = await axios.post('api/last-user-info',{"username":username, "password":password},{}); 
    this.setState({ isSubmitted: true});

    // this.setState({ username: '' });
    // this.setState({ password: '' });
  
  }





  goBackHome = async (event) =>{
    event.preventDefault();

    this.setState({ gotoHome: true});
  }







  render() {


    if (this.state.isSubmitted){
        return(<Redirect to = "/newpage"/>) ;
    }


    if (this.state.gotoHome){
      return(<Redirect to = "/home"/>) ;
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
           value={this.state.password} type="password" name="password" id="password" 
           onChange={(event) => this.setState({ password: event.target.value })}
          />
          <input type="submit" value="Submit" />
        </form>
        


        {/* <h3>Calculated Values:</h3> */}






        <div>
          The last user is {this.state.values}
        </div>


        <div>
          <form  onSubmit={this.goBackHome}>        
            <input type="submit" value="go to home" />
          </form>
        </div>



      </div>
    );
  }
}

export default test;
