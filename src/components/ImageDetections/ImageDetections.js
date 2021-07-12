import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import './ImageDetections.scss';

class ImageDetections extends React.Component {
	renderPartOfSpeech(detection) {
		const conjugations = detection.partOfSpeech === "Verb"? (
			<div className="conjugations">
				{detection.aspect !== ""? (<div key="aspect">{detection.aspect}</div>) : null}
				{detection.form === "Short form"? (<div key="form">Short Form</div>) : null}
				{detection.mood === "Imperative"? (<div key="mood">Imperative</div>) : null}
				<div key="number/person">{this.getPronoun(detection)}</div>
				{detection.tense !== ""? (<div key="tense">{detection.tense}</div>) : null}
				{detection.voice !== ""? (<div key="voice">{detection.voice}</div>) : null}
			</div>
		) : detection.partOfSpeech === "Noun"? (
			<div className="conjugations">
				{detection.case !== ""? (<div key="case">{detection.case}</div>) : null}
				{detection.gender !== ""? (<div key="gender">{detection.gender}</div>) : null}
				{detection.number !== ""? (<div key="number">{detection.number}</div>) : null}
			</div>
		) : detection.partOfSpeech === "Adjective"? (
			<div className="conjugations">
				{detection.case !== ""? (<div key="case">{detection.case}</div>) : null}
				{detection.gender !== ""? (<div key="gender">{detection.gender}</div>) : null}
				{detection.number !== "Plural"? (<div key="number">Plural</div>) : null}
			</div>
		) : null;

		return (
			<div className="context">
				<div className="part-of-speech">{detection.partOfSpeech}</div>
				{conjugations}
			</div>
		);
	}

	getPronoun(detection) {
		if (detection.person === "First") {
			if (detection.number === "Singular") return "Я"
			return "Мы";
		} else if (detection.person === "Second") {
			if (detection.number === "Singular") return "Ты";
			return "Вы";
		} else if (detection.person === "Third") {
			if (detection.number === "Singular") return "Он/Она/Оно";
			return "Они";
		} else {
			if (detection.number === "Singular") return "Reflexive (singular)";
			return "Reflexive (plural)";
		}
	}

	renderDefinition(detection) {
		if (detection.definition.def && detection.definition.def.length > 0) {
			const defnsList = detection.definition.def[0].tr.map(tr => {
				return (<li key={tr.text + detection.boundingPoly.vertices[0]}>{tr.text}</li>);
			});
			return (<ol key={detection.description + detection.boundingPoly.vertices[0] + "list"}>{defnsList}</ol>);

		} else if (detection.definition.translations.length > 0) {
			if (detection.definition.translations[0] === '' || detection.definition.translations[0] === undefined) return ("no definition found :(")
			const defnsList = detection.definition.translations.map(tr => {
				return (<li key={tr.text + detection.boundingPoly.vertices[0]}>{tr.text}</li>);
			});
			return (<ol key={detection.description + detection.boundingPoly.vertices[0] + "list"}>{defnsList}</ol>);

		} else return ("no definition found :(");
	}

	detectImageRotation() {
		// pages -> blocks -> paragraphs -> words
		const detection = this.props.detections[0];
		const p0 = detection.boundingPoly.vertices[0];
		const p1 = detection.boundingPoly.vertices[1];
		const p2 = detection.boundingPoly.vertices[3];
		const p3 = detection.boundingPoly.vertices[2];

		if (p1.x > p0.x && Math.abs(p1.x - p0.x) > Math.abs(p1.x - p3.x)) {
			// console.log("0 1\n3 2");
			return "right side up";
		}
		
		else {
			console.log("the image was flipped at some point during detection and I simply don't know why :/");
			if (p1.x < p0.x && Math.abs(p1.x - p0.x) > Math.abs(p0.x - p3.x)) {
				console.log("2 3\n1 0");
				return "upside-down";
			}
				
			if (p2.x > p1.x && Math.abs(p2.x - p1.x) > Math.abs(p1.x - p0.x)) {
				// console.log("1 2\n0 3");
				return "rotated left";
			}
				
			if (p1.x > p2.x && Math.abs(p1.x - p2.x) > Math.abs(p1.x - p0.x)) {
				console.log("3 0\n2 1");
				return "rotated right";
			}
		}
	}

	renderDetectionsOnImage() {
		const rotation = this.detectImageRotation();

		const detections = this.props.detections.map((detection, i) => {
			const p0 = detection.boundingPoly.vertices[0];
            const p1 = detection.boundingPoly.vertices[1];
            const p2 = detection.boundingPoly.vertices[3];
            const p3 = detection.boundingPoly.vertices[2];

			const yTop = Math.min(p0.y, p1.y, p2.y, p3.y);
            const xLeft = Math.min(p0.x, p1.x, p2.x, p3.x);
            const yBottom = Math.max(p0.y, p1.y, p2.y, p3.y);
            const xRight = Math.max(p0.x, p1.x, p2.x, p3.x);

            const height = yBottom - yTop;
            const width = xRight - xLeft;

            var topProp = yTop;
            var leftProp = xLeft;
            var heightProp = height;
            var widthProp = width;

			if (rotation !== "right side up") {
				if (rotation === "rotated left") {
					// console.log("correcting left rotation");
					topProp = xLeft;
                    leftProp = this.props.imageWidth - yBottom;
                    heightProp = xRight - xLeft;
                    widthProp = yBottom - yTop;
				}

				if (rotation === "rotated right") {
					console.log("correcting right rotation");
					topProp = xLeft;
                    leftProp = this.props.imageWidth - yBottom;
                    heightProp = xRight - xLeft;
                    widthProp = yBottom - yTop;
				}

				if (rotation === "upside-down") {
					console.log("correcting upside-down rotation");
					topProp = xLeft;
                    leftProp = this.props.imageWidth - yBottom;
                    heightProp = xRight - xLeft;
                    widthProp = yBottom - yTop;
				}
			}

			const popover = (
				<Popover className="dynamic-text-size" id={detection.description} key={detection.description + topProp + "-popover"}>
					<Popover.Title className="large-dynamic-text-size">{detection.description}</Popover.Title>
					<Popover.Content>
						{this.renderPartOfSpeech(detection)}
						{detection.lemma !== detection.description? (<div className="conjugation-of"><div>Conjugation of</div><div className="lemma">{detection.lemma}</div></div>) : null}
						<div className="lemma-definition">{this.renderDefinition(detection)}</div>
					</Popover.Content>
				</Popover>
			);

			const adjustedImageHeight = window.innerHeight;
			const adjustedImageWidth = window.innerHeight * (this.props.imageWidth / this.props.imageHeight);

			const adjustedTop = (topProp / this.props.imageHeight) * adjustedImageHeight;
			const adjustedLeft = (leftProp / this.props.imageWidth) * adjustedImageWidth;
			const adjustedHeight = (heightProp / this.props.imageHeight) * adjustedImageHeight;
			const adjustedWidth = (widthProp / this.props.imageWidth) * adjustedImageWidth;

			return (
				<div key={detection.description + topProp}>
					<OverlayTrigger
						key={detection.description}
						placement='top'
						overlay={popover}
					>
						<div key={adjustedTop + "-text-overlay"} className="text-overlay" style={{ top: adjustedTop, left: adjustedLeft, height: adjustedHeight, width: adjustedWidth }}></div>
					</OverlayTrigger>
				</div>
			);
		});

		return detections;
	}

	render() {
		return (
			<div className="ImageDetections">
				<div className="img-box">
					{this.renderDetectionsOnImage()}
					<img key="original-image" src={URL.createObjectURL(this.props.images[0])} height={window.innerHeight} top="0px" />
				</div>
			</div>
		);
	}
}

export default ImageDetections;