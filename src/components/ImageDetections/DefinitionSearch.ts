import axios from "axios";
import YANDEX_API_KEY from '../../yandex_key.json';
import DEEPL_API_KEY from '../../deepL_api_key.json';
import { Aspect, Case, Form, Gender, Mood, Number, Person, Proper, Tag, Tense, Voice } from "./consts";

const lemmatizeUrl: string = 'https://us-east4-true-bit-315318.cloudfunctions.net/lemmatize';

async function searchDefinitions(detections: Array<any>) {
    const contexts: Array<any> = await lemmatize(detections);
    const lemmatizedDetections = contexts.map((context, i) => {
        const partOfSpeech: keyof typeof Tag = context.partOfSpeech.tag;
        const aspect: keyof typeof Aspect = context.partOfSpeech.aspect;
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
}

function lemmatize(detections: Array<any>) {
    return axios.post(lemmatizeUrl, { text: detections[0].description }).then(result => {
        return result.data.tokens;
    });
}

export { searchDefinitions }