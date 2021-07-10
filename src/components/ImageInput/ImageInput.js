import axios from 'axios';
import React from 'react';
import ImageDetections from '../ImageDetections/ImageDetections';
import './ImageInput.scss';
import YANDEX_API_KEY from '../../yandex_key.json';
import DEEPL_API_KEY from '../../deepL_api_key.json';

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
        const defnPromises = this.state.textDetections.map((detection, i) => {
            if (i === 0) return;    //skip the complete text one

            const punctuation = /[.,/#!$%^&*;:{}=\-_`~()]/g;
            const text = detection.description.replace(punctuation, "").toLowerCase();
            if (text.length === 0) return;

            return axios.get(`https://en.wiktionary.org/api/rest_v1/page/definition/${text}?redirect=false`).then(result => {
                const partOfSpeech = result.data.ru[0].partOfSpeech;

                var root = null;
                const rootTag = 'of <span class="form-of-definition-link"><i class="Cyrl mention" lang="ru"><a rel="mw:WikiLink" href="/wiki/';
                const rootDetailTag = '<span class="form-of-definition use-with-mention';
                const letterTag = 'Letter "<span';
                const defs = result.data.ru.map(item => {
                    const innerDefs = item.definitions;
                    const innerDef = innerDefs.map(innerItem => {
                        const def = innerItem.definition;
                        const hasRoot = def.indexOf(rootTag);
                        if (hasRoot !== -1) {
                            const rootStart = innerDefs[0].definition.slice(hasRoot + rootTag.length);
                            root = rootStart.slice(0, rootStart.indexOf('#Russian'));
                            return;
                        }
                        const isDetail = def.indexOf(rootDetailTag);
                        const isLetter = def.indexOf(letterTag);
                        if (isDetail === -1 || isLetter === -1) return;
                        return def;
                    });

                    return innerDef;
                });

                Object.assign(detection, {root: partOfSpeech, definitions: defs.filter(val => val !== undefined), root: root});
                return detection;

            }).catch(function(error) {
                //definition not found
                if (error.response.status === 404) return;

                console.error(error);
            });
        });

        Promise.all(defnPromises).then(results => {
            // console.log("wiktionary results", results);
            const searchAgainPromises = results.map(detection => {
                if (detection === undefined) return;

                if (detection.root !== null) {
                    return axios.get(`https://en.wiktionary.org/api/rest_v1/page/definition/${detection.root}?redirect=false`).then(result => {
                        Object.assign(detection, { rootDefinitions: result });
                        return detection;
                    }).catch(function(error) {
                        //definition not found
                        if (error.response.status === 404) return;
                        
                        console.error(error);
                    });
                }

                if (detection.definitions === undefined) {
                    const punctuation = /[.,/#!$%^&*;:{}=\-_`~()]/g;
                    const text = detection.description.replace(punctuation, "").toLowerCase();

                    return axios.get(`https://api-free.deepl.com/v2/translate?auth_key=${DEEPL_API_KEY.key}&text=${text}&target_lang=EN`).then(defn => {
                        Object.assign(detection, { definition: defn.data });
                        return detection;
                    });
                } else { return detection }
            })

            Promise.all(searchAgainPromises).then(results => {
                // console.log("wiktionary + deepl results", results.filter(val => val !== undefined));
                this.setState({ definedDetections: results.filter(val => val !== undefined), detectionsLoaded: true });
            });
        })
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