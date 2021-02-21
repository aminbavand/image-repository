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
        var imagesList = [];
        for (var i=0; i < this.state.images; i++) {
          
          var url3 = "/api/get_images/" + this.props.match.params["userId"] + "/" + this.state.imagesNames[i];

          await axios.get(url3, {
            headers: {
              'x-access-token': localStorage.getItem('TOKEN')
            }
          })
          .then((response) => {
            var imgstr = response.data["image_url"]
            imagesList.push('data:image/png;base64,'+imgstr);
          }).catch((error) => {      
            this.setState({ isLoggedIn: false });
            });        
        }
        
        this.setState({imagedata: imagesList})

      }




      renderImages(){
        if (this.state.isLoggedIn) {
          if (this.state.imagedata){
            
            var imagesrenders = [<h3>Your images:</h3>]
            
            for (var i = 0; i < this.state.images; i++) {
              imagesrenders.push(
                <div>
                  <img src={this.state.imagedata[i]} width="300" />
                </div>              
              )
            }
            return imagesrenders
          }
        }
      }


      


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


              <h3>
                Hello {this.state.name}! Welcome to your image repository!
              </h3>

              <h3>
                Your public ID is: {this.state.publicID}
              </h3>

              <h3>
                Your admin status is: {String(this.state.admin)}
              </h3>

              <h3>
                You have uploaded {this.state.images} images so far.
              </h3>
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



            {this.renderImages()}

            {this.renderUploadImage()}


            {this.renderTimeOut()}


            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/signup">Sign Up Page</Link></li>


          </div>
        );

      }

    
}

export default UserPage;

