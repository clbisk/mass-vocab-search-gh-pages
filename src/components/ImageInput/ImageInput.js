import axios from 'axios';
import React from 'react';
import ImageDetections from '../ImageDetections/ImageDetections';
import { searchDefinitions } from './DefinitionSearch';
import './ImageInput.scss';

class ImageInput extends React.Component {
    constructor() {
        super();
        this.state = { img_files: null, img_buffers: null, imagesInput: false, imagesParsed: false, textDetections: null, definedDetections: null, detectionsLoaded: false, imageWidth: 0, imageHeight: 0 };
        this.changeImage = this.changeImage.bind(this);
        this.setImageProps = this.setImageProps.bind(this);
    }

    changeImage(event) {
        this.setState({ img_files: event.target.files, img_type: '.jpg', imagesInput: true }, this.parseFiles);
    }

    async parseFiles() {
        const promises = Array.from(this.state.img_files).map(img_file => {
            return this.parseFile(img_file);
        });

        Promise.all(promises).then(strings => {
            this.setState({ img_buffers: strings, imagesParsed: true }, this.getOCR);
        });
    }

    setImageProps(width, height) {
        this.setState({ imageWidth: width, imageHeight: height });
    }

    async parseFile(img_file) {
        const setImageProps = this.setImageProps;

        return new Promise(function (resolve) {
            const reader = new FileReader();
            reader.addEventListener("load", event => {
                var image = new Image();
                image.src = event.target.result;

                image.onload = function() {
                    setImageProps(this.width, this.height);
                    // console.log("image", this.width, "x", this.height);            
                }

                resolve(reader.result);
            }, false);
            reader.readAsDataURL(img_file);
        });
    }

    async getOCR() {
        return axios.post(`https://us-east4-true-bit-315318.cloudfunctions.net/documentTextDetection`, { img: this.state.img_buffers[0] }).then(result => {
            this.setState({ textDetections: result.data.textAnnotations, fullText: result.data.fullTextAnnotation }, this.getDefinitions);
        });
    }

    async getDefinitions() {
        searchDefinitions(this.state.textDetections).then(results => {
            this.setState({ definedDetections: results, detectionsLoaded: true });
        });
    }

    render() {
        return this.state.detectionsLoaded ? (
            <div className="ImageInput">
                <ImageDetections detections={this.state.definedDetections} images={this.state.img_files} imageWidth={this.state.imageWidth} imageHeight={this.state.imageHeight} fullText={this.state.fullText} />
            </div>
        ) : this.state.imagesParsed ? (
            <div className="ImageInput">
                Loading image text...
                <div>
                    <img src={this.state.img_buffers[0]} height={0.5 * window.innerHeight}></img>
                </div>
            </div>
        ) : (
            <div className="ImageInput">
               <div><input type='file' id='single' onChange={this.changeImage} /></div>
            </div>
        );
    }
}

export default ImageInput;