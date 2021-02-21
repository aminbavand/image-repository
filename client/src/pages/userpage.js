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
      isLoggedIn: false,
      images: 0,
      imagesNames: {},
      imagedata: null

      };
    
    


      async componentDidMount() {
        //storing token in page local storage:
        await this.storetoken();

        //geting user information from the server
        await this.getuserinfo();
        
        //geting user images information from the server
        await this.getuserimagesinfo();

        //getting images from the server
        await this.getimages()

      }


      async storetoken(){
        if (typeof this.state.token != 'undefined'){
          localStorage.setItem('TOKEN', this.state.token)
        }
      }

      async getuserinfo(){

        const url = "/api/user/" + this.props.match.params["userId"];      
        await axios.get(url, {
          headers: {
            'x-access-token': localStorage.getItem('TOKEN')
          }
        })
        .then((response) => {
          this.setState({ admin: response.data['user']['admin'] });
          this.setState({ name: response.data['user']['name'] });
          this.setState({ publicID: response.data['user']['public_id'] });
          this.setState({ images: response.data['user']['images'] });
          this.setState({ isLoggedIn: true });
        }).catch((error) => {
          this.setState({ isLoggedIn: false });
          });

      }



      async getuserimagesinfo(){
        const url2 = "/api/get_images_names/" + this.props.match.params["userId"];      
        await axios.get(url2, {
          headers: {
            'x-access-token': localStorage.getItem('TOKEN')
          }
        })
        .then((response) => {
          var names = {}
          for (var i=0; i < this.state.images; i++) {
            names[i] = response.data['images_names'][i]
          }          
          this.setState({ imagesNames: names });
          // console.log(this.state.imagesNames)
      
        }).catch((error) => {      
          this.setState({ isLoggedIn: false });
          });

      }



      async getimages(){
        
        // for (var i=0; i < this.state.images; i++) {
        const i=0
        const url3 = "/api/get_images/" + this.props.match.params["userId"] + "/" + this.state.imagesNames[i];   
        console.log(url3)
        await axios.get(url3, {
          headers: {
            'x-access-token': localStorage.getItem('TOKEN')
          }
        })
        .then((response) => {
          // console.log("Hello1")
          // console.log(response.data["image_url"])
          // console.log("Hello2")


          // let matrixData = response;
              
          // let matrixBlob = new Blob([matrixData.data], {type:"image/jpeg"});   
                

          // let fileReader = new FileReader();
          // fileReader.readAsDataURL(matrixBlob); 

          // console.log(fileReader)        

          // fileReader.onload = () => { 
          //     let result = fileReader.result;               
          //     this.setState({ imagedata: result});           
          // }

          // var x = new Buffer(response.data, 'binary').toString('base64');
          // console.log(x);
          const imgstr = response.data["image_url"]
          this.setState({imagedata: 'data:image/png;base64,'+imgstr})


        }).catch((error) => {      
          this.setState({ isLoggedIn: false });
          });
        

        
      }




      // renderImages(){
      //   if (this.state.isLoggedIn) {
      //     var imagesNamesList = [];
      //     for (var i = 0; i < this.state.images; i++) {
      //       imagesNamesList.push(this.state.imagesNames[i]);
      //     }
      //     return imagesNamesList; 

      //   }
      // }

      // renderImage(i){
      //     return (
      //       this.state.imagesNames[i]
      //     );
      //   }
      


      renderUploadImage() {
        if (this.state.isLoggedIn) {
          return (
            <ReactUploadImage token={localStorage.getItem('TOKEN')}/>
          );
        }
      }


      renderUserInfo() {
        if (this.state.isLoggedIn) {
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

              <div>
                Number of uploaded images: {this.state.images}
              </div>
            </div>
          );
        }
      }


      renderTimeOut() {
        if (this.state.isLoggedIn==false) {
          return (
          <h1>
            Please Log In!
          </h1>
          );
        }
      }







      render() {
    
    
        return (
          <div>
    
          
            {this.renderUserInfo()}


            {this.renderUploadImage()}
            
            {this.renderTimeOut()}

     
            <img src={this.state.imagedata} width="150" />
   
            {/* <img             
            src="https://i.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
            alt="new"
            /> */}


            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/signup">Sign Up Page</Link></li>


          </div>
        );

      }

    
}

export default UserPage;

