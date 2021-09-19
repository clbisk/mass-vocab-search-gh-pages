import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Link } from 'react-router-dom';
import { searchDefinitions } from '../ImageDetections/DefinitionSearch';
import ImageDetections from '../ImageDetections/ImageDetections';
import './ImageInput.scss';
import Mass_Vocab_Search_example from './Mass_Vocab_Search_example.jpg';

class ImageInput extends React.Component {
	constructor() {
		super();
		this.state = { img_files: null, img_buffers: null, imagesInput: false, imagesParsed: false, textDetections: null, definedDetections: null, detectionsLoaded: false, imageWidth: 0, imageHeight: 0 };
		this.changeImage = this.changeImage.bind(this);
		this.setImageProps = this.setImageProps.bind(this);
		this.restartSearch = this.restartSearch.bind(this);
	}

	componentDidCatch(error, info) {
		console.log(error, info);
		this.setState({ errorOccurred: true });
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

				image.onload = function () {
					setImageProps(this.width, this.height);
					// console.log("image", this.width, "x", this.height);            
				}

				resolve(reader.result);
			}, false);
			reader.readAsDataURL(img_file);
		});
	}

	async getOCR() {
		return axios.post(`https://us-east4-true-bit-315318.cloudfunctions.net/documentTextDetection`, { img: this.state.img_buffers[0], lang: "ru" }).then(result => {
			this.setState({ textDetections: result.data.textAnnotations, fullText: result.data.fullTextAnnotation }, this.getDefinitions);
		}).catch(err => {
			console.log("an error occurred during OCR; trying again", err);
			this.getOCR();
		})
	}

	async getDefinitions() {
		searchDefinitions(this.state.textDetections, 'ru').then(results => {
			this.setState({ definedDetections: results, detectionsLoaded: true });
		}).catch(error => {
			console.error(error);
			this.setState({ errorOccurred: true });
		});
	}

	restartSearch() {
		this.setState({ img_files: null, img_buffers: null, imagesInput: false, imagesParsed: false, textDetections: null, definedDetections: null, detectionsLoaded: false, imageWidth: 0, imageHeight: 0 });
	}

	render() {
		const header = (<div className="title"><h1>Image Search</h1></div>);
		const infoPopover = (
			<Popover className="dynamic-text-size" id="info-popover" key="info-popover">
				<Popover.Title className="large-dynamic-text-size">How to Use:</Popover.Title>
				<Popover.Content>
					<div>
						<p>To use this application, simply use the image selector to uplaod an image from your computer that contains Russian text. Mass Vocab Search will do the rest!</p>
						<p>Once the text has loaded, the original image will be displayed with a highlight around each detected word. Move the cursor over each highlight to view the word's definition, as well as information about the word's part of speech, conjugation, and root form.</p>
					</div>
					<img alt="example of loaded image" src={Mass_Vocab_Search_example} height={0.2 * window.innerHeight} />
				</Popover.Content>
			</Popover>
		);
		const infoTrigger = (
			<div className="info-trigger">
				<OverlayTrigger
					key="info-trigger"
					placement='bottom'
					overlay={infoPopover}
				>
					<FontAwesomeIcon icon={faQuestionCircle} onClick={_ => this.props.submitSearch(this.state.text)} />
				</OverlayTrigger>
			</div>
		);

		return this.state.errorOccurred ? (
			<div className="ImageInput">
				{header}
				{infoTrigger}
				<div>An error occured while trying to parse this image. :(</div>
				<button><Link to="/img">Try Again</Link></button>
			</div>
		) : this.state.detectionsLoaded ? (
			<div className="ImageInput">
				<ImageDetections restartSearch={this.restartSearch} detections={this.state.definedDetections} lang="ru" images={this.state.img_files} imageWidth={this.state.imageWidth} imageHeight={this.state.imageHeight} fullText={this.state.fullText} />
			</div>
		) : this.state.imagesParsed ? (
			<div className="ImageInput">
				{header}
				{infoTrigger}
				Loading image text...
				<div>
					<img src={this.state.img_buffers[0]} height={0.5 * window.innerHeight}></img>
				</div>
			</div>
		) : (
			<div className="ImageInput">
				{infoTrigger}
				<div className="up-top">{header}<div className="instructions">Please upload an image containing the Russian text to be defined.</div></div>
				<div><input type='file' id='single' onChange={this.changeImage} /></div>
			</div>
		);
	}
}

export default ImageInput;