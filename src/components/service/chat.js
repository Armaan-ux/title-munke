import { Auth } from "aws-amplify";
import axios from "axios";
async function getAuthToken() {
  try {
    return (await Auth?.currentSession())?.getIdToken()?.getJwtToken();
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}
export async function ChatService(payload) {
    const res = await axios.post("https://quhlojc2zcr5ysnwbz2oljrshi0zmmlk.lambda-url.us-east-1.on.aws/", payload);
    return res.data;
}

export async function getAiModels() {
    const res = await axios.get("url");
    return res.data;
}

export async function changeDefaultAiModel(modalName) {
    const data = {
  "action": "save_llm_by_admin",
  "llm_name": "gpt-4",
  "admin_id": "b42804c8-2031-706c-6b38-e2e1a3bd5797",
  "userType": "broker"
}
    const token = await getAuthToken();
    const res = await axios.post("https://gia0egoc93.execute-api.us-east-1.amazonaws.com/dev/choose-llm", data, {headers: {Authorization: `Bearer ${token}`}});
    return res.data;
}

export async function getDefaultAiModel() {
    const res = await axios.get("url");
    return res.data;
}