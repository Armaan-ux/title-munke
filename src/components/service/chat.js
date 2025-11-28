import axios from "axios";

export async function ChatService(payload) {
    const res = await axios.post("https://quhlojc2zcr5ysnwbz2oljrshi0zmmlk.lambda-url.us-east-1.on.aws/", payload);
    return res.data;
}