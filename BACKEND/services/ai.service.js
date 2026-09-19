import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from "@langchain/mistralai";
import {HumanMessage, SystemMessage, AIMessage} from "langchain";
import { ChatGroq } from "@langchain/groq";


const GeminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});
const MistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  maxRetries: 0,
});
const TitleModel = new ChatGroq({
  model: "openai/gpt-oss-20b",
  apiKey: process.env.GROQ_API_KEY, // from console.groq.com/keys
  maxRetries: 1,
});



export async function generateResponse(messages) {
    const response = await TitleModel.invoke(messages.map(msg => {
        if (msg.role == 'user') {
            return new HumanMessage(msg.content);
        } else if (msg.role == 'assistant') {
            return new AIMessage(msg.content);
        }
    }));
    return response.text;
}

export async function generateChatTittle(messages) {
    const response =  await TitleModel.invoke(
        [
            new SystemMessage(`You are a helpful assistant that generates a title for a chat conversation based on the messages provided.
                
                User will provide you with a series of messages from a chat conversation. Your task is to analyze the content of these messages and generate a concise and relevant title that accurately reflects the main topic or theme of the conversation. The title should be clear, informative, and capture the essence of the discussion. Please ensure that the title is appropriate and does not contain any sensitive or personal information from the messages within 3 to 5 words.`
            ),
            new HumanMessage(`Generate a title for the following chat conversation: ${messages}`)
        ]
    )
    return response.text;
}