import React from 'react'
// import axios from 'axios';


class ImageRender extends React.Component {

    state = {
        imagedata: this.props.imagedata,
        imageNum: this.props.imageNum
    }

    deleteimage = async () =>{
        this.props.imageDeleteNumberCallback(this.state.imageNum);
    }


    render() {
        return (

            <div>
                <img src={this.state.imagedata} width="300" />

                <button onClick={this.deleteimage}>
                    Delete
                </button>

            </div> 

        )
    }
}

export default ImageRender