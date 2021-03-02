import React from 'react'
import ImageRender from './imageRender';


class ImagesRender extends React.Component {

    state = {
        imagedata: this.props.imagedata,
        images: Array.from(Array(this.props.images).keys())
    }

    deleteImage = (deleteNumber) => {
        this.props.imageDeleteNumberCallback(deleteNumber);
    }


    render() {
        return (

            <div>
                <h3>Your images:</h3>
                {this.state.images.map(image => (
                    <div>
                        <ImageRender imagedata={this.state.imagedata[image]} imageNum={image} 
                        imageDeleteNumberCallback={this.deleteImage}/>
                    </div>
                           
                ))}

            </div>


        )
    }
}

export default ImagesRender