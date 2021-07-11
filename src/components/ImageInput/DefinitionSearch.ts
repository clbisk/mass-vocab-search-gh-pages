import axios from "axios";
import YANDEX_API_KEY from '../../yandex_key.json';
import DEEPL_API_KEY from '../../deepL_api_key.json';

const lemmatizeUrl: String = 'https://us-east4-true-bit-315318.cloudfunctions.net/lemmatize';

function searchDefinitions(detections: Array<any>) {
    const defnPromises = detections.map((detection, i) => {
        if (i === 0) return;    //skip the complete text one

        const punctuation = /[.,/#!$%^&*;:{}=\-_`~()]/g;
        const text = detection.description.replace(punctuation, "").toLowerCase();
        if (text.length === 0) return;

        return axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${YANDEX_API_KEY.key}&lang=ru-en&text=${text}`).then(result => {
            Object.assign(detection, { definition: result.data });
            return detection;
        });
    });

    return Promise.all(defnPromises).then(results => {
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

        return Promise.all(searchAgainPromises).then(results => {
            return results.filter(val => val !== undefined);
        });
    })
}

export { searchDefinitions }