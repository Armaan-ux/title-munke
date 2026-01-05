import axios from "axios";
export async function ChatService(payload) {
    const res = await axios.post("https://quhlojc2zcr5ysnwbz2oljrshi0zmmlk.lambda-url.us-east-1.on.aws/", payload);
    return res.data;
}
const llmApi = "https://e3lezi6ve5lpsq3blfdxes2unq0rzeis.lambda-url.us-east-1.on.aws/"

export async function getAiModels(payload) {
    const res = await axios.post(llmApi, payload);
    return res.data;
}

export async function changeDefaultAiModel(payload) {
    const res = await axios.post(llmApi, payload);
    return res.data;
}

export async function getDefaultAiModel(payload) {
    const res = await axios.post(llmApi, payload);
    return res.data;
}