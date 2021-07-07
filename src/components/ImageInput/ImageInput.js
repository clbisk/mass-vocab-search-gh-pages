import axios from 'axios';
import React from 'react';
import ImageUploader from 'react-images-upload';
import ImageDetections from '../ImageDetections/ImageDetections';
import './ImageInput.scss';
import YANDEX_API_KEY from '../../yandex_key.json';
import DEEPL_API_KEY from '../../deepL_api_key.json';

class ImageInput extends React.Component {
    constructor() {
        super();
        this.state = { img_files: null, img_buffers: null, imagesInput: false, textDetections: null, definedDetections: null, detectionsLoaded: false, imageWidth: 0, imageHeight: 0 };
        this.changeImage = this.changeImage.bind(this);
        this.setImageProps = this.setImageProps.bind(this);
    }

    changeImage(event) {
        console.log("adding", event.target.files[0]);
        this.setState({ img_files: event.target.files[0], img_type: '.jpg', imagesInput: true }, this.parseFiles);
    }

    async parseFiles() {
        const promises = this.state.img_files.map(img_file => {
            return this.parseFile(img_file);
        });

        Promise.all(promises).then(strings => {
            this.setState({ img_buffers: strings }, this.getOCR);
        });
    }

    setImageProps(width, height) {
        this.setState({ imageWidth: width, imageHeight: height });
    }

    async parseFile(img_file) {
        const setImageProps = this.setImageProps;

        return new Promise(function (resolve) {
            console.log("starting to read image");
            const reader = new FileReader();
            reader.addEventListener("load", event => {
                var image = new Image();
                image.src = event.target.result;
                console.log("image source", image.src);
                console.log("event", event);

                image.onload = function() {
                    setImageProps(this.width, this.height);
                }

                resolve(reader.result);
            }, false);
            reader.readAsDataURL(img_file);
        });
    }

    async getOCR() {
        console.log("state", this.state);

        return axios.post(`https://us-east4-true-bit-315318.cloudfunctions.net/documentTextDetection`, { img: this.state.img_buffers[0] }).then(result => {
            this.setState({ textDetections: result.data.textAnnotations, fullText: result.data.fullTextAnnotation }, this.getDefinitions);
        });
    }

    async getDefinitions() {
        const defnPromises = this.state.textDetections.map((detection, i) => {
            if (i === 0) return;    //skip the complete text one

            const punctuation = /[.,/#!$%^&*;:{}=\-_`~()]/g;
            const text = detection.description.replace(punctuation, "").toLowerCase();
            if (text.length === 0) return;

            return axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${YANDEX_API_KEY.key}&lang=ru-en&text=${text}`).then(result => {
                Object.assign(detection, { definition: result.data });
                return detection;
            });
        });

        Promise.all(defnPromises).then(results => {
            const searchAgainPromises = results.map(detection => {
                if (detection === undefined) return;

                if (detection.def === undefined || detection.def.length === 0) {
                    const punctuation = /[.,/#!$%^&*;:{}=\-_`~()]/g;
                    const text = detection.description.replace(punctuation, "").toLowerCase();

                    return axios.get(`https://api-free.deepl.com/v2/translate?auth_key=${DEEPL_API_KEY.key}&text=${text}&target_lang=EN`).then(defn => {
                        Object.assign(detection, { definition: defn.data });
                        return detection;
                    });
                } else { return detection }
            })

            Promise.all(searchAgainPromises).then(results => {
                this.setState({ definedDetections: results.filter(val => val !== undefined), detectionsLoaded: true });
            });
        })
    }

    render() {
        return this.state.detectionsLoaded ? (
            <div className="ImageInput"><ImageDetections detections={this.state.definedDetections} images={this.state.img_files} imageWidth={this.state.imageWidth} imageHeight={this.state.imageHeight} fullText={this.state.fullText} /></div>
        ) : this.state.imagesInput ? (
            <div className="ImageInput">Loading image text...</div>
        ) : (
            <div className="ImageInput">
               <input type='file' id='single' onChange={this.changeImage} />
            </div>
        );
    }
}

export default ImageInput;