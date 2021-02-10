import React, { Component } from 'react';
import axios from 'axios';

class Main extends Component {
  state = {
    username: '',
    password: '',
    isLogin: false,
    values: '2'
  };



  // async componentDidMount() { 

  //   const response = await fetch('/api/values');
  //   // const values1 = await response.get_json;
  //   // this.setState({ data: json });

  // }


  // async componentDidMount() {
  //   const val = await axios.get('/api/login');
  //   this.setState({ values: val.data["message"] });
  //   console.log("hello");
  // }

  
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
    console.log(data);
    console.log(username);
    console.log(password);
    const response = await axios.post('api/login',{"username":username, "password":password},{});
    console.log(response.data);
    // this.state.isLogin = true; 
    this.setState({ isLogin: true });
  
    // return <Redirect to = "/newpage"/>
    console.log(response.data);

    this.setState({ username: '' });
    this.setState({ password: '' });
  
  }





  render() {
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
