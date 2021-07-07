import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import './ImageDetections.scss';

class ImageDetections extends React.Component {
    constructor() {
        super();
    }

    renderDefinition(detection) {
        if (detection.definition.def && detection.definition.def.length > 0) {
            const defnsList = detection.definition.def[0].tr.map(tr => {
                return (<li>{tr.text}</li>);
            });
            return (<ol>{defnsList}</ol>);
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
        const blocks = this.props.fullText.pages[0].blocks;
        const firstWord = blocks[0].paragraphs[0].words[0];
        const secondWord = blocks[0].paragraphs[0].words[1] ? blocks[0].paragraphs[0].words[1] : ((blocks[0].paragraphs[1] && blocks[0].paragraphs[1].words[0]) ? blocks[0].paragraphs[1].words[0] : blocks[1].paragraphs[0].words[0]);
        const firstWordBox = firstWord.boundingBox.vertices;
        const secondWordBox = secondWord.boundingBox.vertices;

        const firstYTop = Math.min(firstWordBox[0].y, firstWordBox[1].y, firstWordBox[2].y, firstWordBox[3].y);
        const firstXLeft = Math.min(firstWordBox[0].x, firstWordBox[1].x, firstWordBox[2].x, firstWordBox[3].x);
        const firstYBottom = Math.max(firstWordBox[0].y, firstWordBox[1].y, firstWordBox[2].y, firstWordBox[3].y);
        const firstXRight = Math.max(firstWordBox[0].x, firstWordBox[1].x, firstWordBox[2].x, firstWordBox[3].x);
        const secondYTop = Math.min(secondWordBox[0].y, secondWordBox[1].y, secondWordBox[2].y, secondWordBox[3].y);
        const secondXLeft = Math.min(secondWordBox[0].x, secondWordBox[1].x, secondWordBox[2].x, secondWordBox[3].x);
        const secondYBottom = Math.max(secondWordBox[0].y, secondWordBox[1].y, secondWordBox[2].y, secondWordBox[3].y);
        const secondXRight = Math.max(secondWordBox[0].x, secondWordBox[1].x, secondWordBox[2].x, secondWordBox[3].x);
        const firstWidth = firstXRight - firstXLeft;
        const firstHeight = firstYBottom - firstYTop;

        if (secondXLeft > (firstXLeft + firstWidth) && secondYTop > (firstYTop + firstHeight)) {
            console.log("looks right side up");
            return "right side up";
        } else {
            console.log("the image was flipped at some point during detection and I simply don't know why :/");
            
            if (secondYTop > (firstYTop + firstHeight)) {
                return "rotated left, flipped";
            } else if (secondYBottom < firstYBottom - (firstHeight)) {
                return "rotated left";
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
            }

            const popover = (
                <Popover className="dynamic-text-size" id={detection.description} key={detection.description + yTop + "-popover"}>
                    <Popover.Title className="large-dynamic-text-size">{detection.description}</Popover.Title>
                    <Popover.Content>
                        {this.renderDefinition(detection)}
                    </Popover.Content>
                </Popover>
            );

            return (
                <div key={detection.description + yTop}>
                    <OverlayTrigger
                        key={detection.description}
                        placement='top'
                        overlay={popover}
                    >
                        <div className="text-overlay" style={{ top: topProp, left: leftProp, height: heightProp, width: widthProp }}></div>
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
                    <img src={URL.createObjectURL(this.props.images[0])} width={this.props.imageWidth} height={this.props.imageHeight} />
                </div>
            </div>
        );
    }
}

export default ImageDetections;