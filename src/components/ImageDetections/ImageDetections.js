import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import './ImageDetections.scss';

class ImageDetections extends React.Component {
	constructor() {
		super();
	}

	renderDefinition(detection) {
		if (detection.definitions) {
			const defnsList = detection.definitions.map(defs => {
				defs.map(def => {
					if (def === undefined) return;
					console.log("def", def);
					return (<li>{def}</li>);
				})
			});
			return (<><div className="part-of-speech">{detection.partOfSpeech}</div><ol>{defnsList}</ol></>);

		} else if (detection.definition.translations.length > 0) {
			if (detection.definition.translations[0] === '' || detection.definition.translations[0] === undefined) return ("no definition found :(")
			const defnsList = detection.definition.translations.map(tr => {
				return (<li>{tr.text}</li>);
			});
			return (<ol>{defnsList}</ol>);

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
			return "right side up";
		}
		
		else {
			console.log("the image was flipped at some point during detection and I simply don't know why :/");
			if (p1.x < p0.x && Math.abs(p1.x - p0.x) > Math.abs(p0.x - p3.x)) {
				console.log("2 3\n1 0");
				return "upside-down";
			}
				
			if (p2.x > p1.x && Math.abs(p2.x - p1.x) > Math.abs(p1.x - p0.x)) {
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
						{this.renderDefinition(detection)}
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
						<div className="text-overlay" style={{ top: adjustedTop, left: adjustedLeft, height: adjustedHeight, width: adjustedWidth }}></div>
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
					<img src={URL.createObjectURL(this.props.images[0])} height={window.innerHeight} top="0px" />
				</div>
			</div>
		);
	}
}

export default ImageDetections;