import React from 'react';
import TracauShoutout from '../TracauShoutout/TracauShoutout';
import DefinedWord from '../DefinedWord/DefinedWord';
import '../../App.scss';
import './SearchedText.scss';
import axios from 'axios';

class SearchedText extends React.Component {
    constructor() {
        super();
        this.state = { isLoaded: false, searchResults: {} };
    }

    search(text) {
        const words = text.split(/[ X\n]/);
        // console.log("searching for words", words);

        var compoundDefs = {};

        const compoundPromises = words.map((word, i) => {
            // check for compound words first
            return this.searchCompoundWord(words, i).then((compoundDef) => {
                if (compoundDef && compoundDef.length > 0) {
                    if (!compoundDef[0].startsWith("See ")) {
                        compoundDefs[word + " " + words[i + 1]] = compoundDef;
                        return Promise.resolve();
                    }
                }
            });
        });

        return Promise.all(compoundPromises).then(() => {
            var definitions = Object.assign({}, compoundDefs);  // shallow copy
            console.log("compound definitions:", definitions);

            const remainingSearchPromises = words.map((word, i) => {
                const compoundPrev = words[i - 1] + " " + word;
                const compoundNext = word + " " + words[i + 1];
                if (!(compoundPrev in compoundDefs) && !(compoundNext in compoundDefs)) {
                    // not part of a compound word
                    return this.tracauSearch(word).then(def => {
                        if (def && def.length > 0) {
                            definitions[word] = def;
                        }
                        // if it could not be defined, we will simply gray out the word
                        return Promise.resolve();
                    });
                } else return Promise.resolve();
            });

            return Promise.all(remainingSearchPromises).then(definitions);
        });
    }

    searchCompoundWord(words, i) {
        if (words.length > i + 1) {
            return this.tracauSearch(words[i] + " " + words[i + 1]);
        } else {
            return Promise.resolve();
        }
    }

    tracauSearch(searchedText) {
        // strip special characters first
        const punctuation = /[.,/#!$%^&*;:{}=\-_`~()]/g;
        const text = searchedText.trim().replace(punctuation, "");

        return axios.get("https://api.tracau.vn/" + tracau_API_key + "/s/" + text + "/vi").then(result => {
            // console.log(`result for ${searchedText}:`, result);

            if (result.data.tratu.length <= 0)
                return false;

            const tracauData = result.data.tratu[0].fields.fulltext;

            const engDefStart = tracauData.indexOf('<article id="dict_vv" data-tab-name="Việt - Anh"');
            var defnTab = tracauData.slice(engDefStart);
            const engDefEnd = defnTab.indexOf('</article>');
            defnTab = defnTab.slice(0, engDefEnd);

            const defnsStartTag = '<table id="definition_T_ve_id" border="0">';
            const defnsStart = defnTab.indexOf(defnsStartTag) + defnsStartTag.length;
            var defns = defnTab.slice(defnsStart);
            const defnsEnd = defns.indexOf('</table>');
            defns = defns.slice(0, defnsEnd);

            const aDefStartTag = '<td id="I_C"><font color="#999">■</font></td><td id="C_C" colspan="2">';
            const entryList = defns.split(aDefStartTag);

            var defnsList = [];
            entryList.slice(1).forEach(def => {
                var parsedDef = def.slice(0, def.indexOf('</td>'));

                // check if tracau is trying to redirect user to a similar word
                const seeOtherTag = 'Xem <font color="#1371BB">';
                const seeOtherTagLower = 'xem <font color="#1371BB">';
                const seeOtherEnd = parsedDef.indexOf('</font>')
                if (parsedDef.startsWith(seeOtherTag) || parsedDef.startsWith(seeOtherTagLower)) {
                    parsedDef = "See " + parsedDef.slice(seeOtherTag.length, seeOtherEnd);
                }

                defnsList.push(parsedDef);
            });

            return defnsList;
        });
    }

    componentDidMount() {
        this.search(this.props.text).then((result) => {
            console.log("search results", result);
            this.setState({ isLoaded: true, searchResults: result });
        })
    }

    render() {
        const footer = (
            <div className="footer">
                <div className="submit-search">
                    <button onClick={this.props.returnToSearch}>Search again</button>
                </div>
                <TracauShoutout></TracauShoutout>
            </div>
        );

        return this.props.text === "" ? (
            <div className="SearchedText">
                <div className="text-display">
                    <div className="vertical-centered">
                        <div>Oops! Looks like no text was input. Would you like to search again?</div>
                    </div>
                </div>

                {footer}
            </div>
        ) : this.state.isLoaded ? (
            <div className="SearchedText">
                <div className="text-display">
                    <div className="vertical-centered">
                        <div className="words-and-definitions">
                            {
                                this.props.text.split(/[ X\n]/).map((word, i) => {
                                    var lastWordDefined = -1;
                                    // if this word was not part of a previous compound word...
                                    if (lastWordDefined === i)
                                        return;

                                    // check for compound words first
                                    const compoundWord = word + " " + this.props.text.split(/[ X\n]/)[i + 1];
                                    if (compoundWord in this.state.searchResults) {
                                        const defn = this.state.searchResults[compoundWord];
                                        return <DefinedWord word={compoundWord} defn={defn} key={i} />
                                    }

                                    // make sure a defition was found
                                    if (word in this.state.searchResults) {
                                        const defn = this.state.searchResults[word];
                                        return <DefinedWord word={word} defn={defn} key={i} />
                                    }

                                    return (<div className="definition-not-found" key={i}>{word}</div>)
                                })
                            }
                        </div>
                    </div>
                </div>

                {footer}
            </div>
        ) : (
            <div className="SearchedText">
                <div className="text-display">
                    <div className="vertical-centered">loading...</div>
                </div>

                {footer}
            </div>
        );
    }
}

const tracau_API_key = "WBBcwnwQpV89";

export default SearchedText;
