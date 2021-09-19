import axios from "axios";
import YANDEX_API_KEY from '../../yandex_key.json';
import DEEPL_API_KEY from '../../deepL_api_key.json';
import { Aspect, Case, Form, Gender, Mood, Number, Person, Proper, Tag, Tense, Voice } from "./consts";

const lemmatizeUrl: string = 'https://us-east4-true-bit-315318.cloudfunctions.net/lemmatize';
const punctuation: RegExp = /[.,/#!$%^&*;:{}=\-_`~()]/g;

function lemmatize(detections: Array<any>, language: string) {
    return axios.post(lemmatizeUrl, { text: detections[0].description, lang: language }).then(result => {
        const tokens = result.data.tokens;
        const contexts = tokens.filter((token: any) => token.lemma.trim().replace(punctuation, "") !== "");
        return contexts;
    });
}

async function addLemmasToDetections(detections: Array<any>, language: string): Promise<Array<any>> {
    if (detections.length < 1) throw Error("no text detected in this image! :(");
    if (detections.length === 1) throw Error("no individual words detected in this image");

    try {
        const contexts: Array<any> = await lemmatize(detections, language);

        if (contexts.length + 1 !== detections.length) throw Error("the amount of words detected and the amount of words lemmatized are different...");

        const lemmatizedDetections = contexts.map((context, i) => {
            const partOfSpeech: keyof typeof Tag = context.partOfSpeech.tag;
            const aspect: keyof typeof  Aspect = context.partOfSpeech.aspect;
            const myCase: keyof typeof Case = context.partOfSpeech.case;
            const form: keyof typeof Form = context.partOfSpeech.form;
            const gender: keyof typeof Gender = context.partOfSpeech.gender;
            const mood: keyof typeof Mood = context.partOfSpeech.mood;
            const number: keyof typeof Number = context.partOfSpeech.number;
            const person: keyof typeof Person = context.partOfSpeech.person;
            const proper: keyof typeof Proper = context.partOfSpeech.proper;
            const tense: keyof typeof Tense = context.partOfSpeech.tense;
            const voice: keyof typeof Voice = context.partOfSpeech.voice;

            Object.assign(detections[i + 1], {
                lemma: context.lemma,
                partOfSpeech: Tag[partOfSpeech],
                aspect: Aspect[aspect],
                case: Case[myCase],
                form: Form[form],
                gender: Gender[gender],
                mood: Mood[mood],
                number: Number[number],
                person: Person[person],
                proper: Proper[proper],
                tense: Tense[tense],
                voice: Voice[voice]
            });

            return detections[i + 1];
        });

        // filter out punctuation detections
        const filteredDetections = lemmatizedDetections.filter((val: any) => val.partOfSpeech !== "Punctuation");
        return filteredDetections;
    } catch (error) {
        throw error;
    }
}

async function searchRussianDefinitions(detections: Array<any>) {
    try {
        const filteredDetections = await addLemmasToDetections(detections, 'ru');

        const defnPromises = filteredDetections.map(detection => {
            // console.log("detection:", detection.description, "lemma:", detection.lemma, "part of speech:", detection.partOfSpeech);
            return axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${YANDEX_API_KEY.key}&lang=ru-en&text=${detection.lemma}`).then(result => {
                Object.assign(detection, { definition: result.data });
                return detection;
            });
        });

        return Promise.all(defnPromises).then(results => {
            const searchAgainPromises = results.map(detection => {
                if (detection.def === undefined || detection.def.length === 0) {
                    return axios.get(`https://api-free.deepl.com/v2/translate?auth_key=${DEEPL_API_KEY.key}&text=${detection.lemma}&target_lang=EN`).then(defn => {
                        Object.assign(detection, { definition: defn.data });
                        return detection;
                    });
                } else { return detection }
            })

            return Promise.all(searchAgainPromises).then(results => {
                return results;
            });
        })
    } catch (error) {
        throw error;
    }
}

// async function searchKoreanDefinitions(detections: Array<any>) {
//     const filteredDetections = await addLemmasToDetections(detections, 'ko');

//     const defnPromises = filteredDetections.map(detection => {
//         return axios.get(`https://krdict.korean.go.kr/api/search?key=CFE52C024B192CE5E56F3B7D8EA5DA3D&translated=y&trans_lang=2&q=${detection.lemma}`).then(result => {
//             Object.assign(detection, { definition: result });
//             return detection;
//         });
//     });

//     return Promise.all(defnPromises).then(results => {
//         return results;
//     });
// }

async function printContext(detections: Array<any>, language: string) {
    const filteredDetections = await addLemmasToDetections(detections, language);

    console.log('filtered detections:', filteredDetections);

    const defnPromises = filteredDetections.map(detection => {
        Object.assign(detection, { definition: {} });
        return detection;
    });

    return Promise.all(defnPromises).then(results => {
        return results;
    });
}

async function searchDefinitions(detections: Array<any>, language: string) {
    try {
        detections = detections.filter(detection => detection.description.trim().replace(punctuation, "") !== "");

        if (language === "ru") {
            const definedDetections = await searchRussianDefinitions(detections);
            return definedDetections;
        } 
        return printContext(detections, language);
    } catch (error) {
        console.error("error occurred during lemmatization :(");
        throw error;
    }
}

export { searchDefinitions }