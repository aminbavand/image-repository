import React from 'react'
import axios from 'axios';


class ReactUploadImage extends React.Component {

    state = {
        file: null,
        token: this.props.token
    }


    onFormSubmit = async (event) =>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('myImage',this.state.file);

        const img=formData.get('myImage');
        console.log(img);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'x-access-token': localStorage.getItem('TOKEN')
            }
        };

        await axios.post("/api/imageupload",formData,config)
            .then((response) => {
                alert("The file is successfully uploaded");
                window.location.reload();
            }).catch((error) => {
                window.location.reload();
        });

     }



    onChange = async (event) =>{
        this.setState({file:event.target.files[0]});
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <h2>Upload a new image here</h2>
                <input type="file" name="myImage" onChange= {this.onChange} />
                <button type="submit">Upload</button>
            </form>
        )
    }
}

export default ReactUploadImage