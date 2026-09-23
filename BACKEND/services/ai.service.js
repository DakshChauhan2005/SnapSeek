import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from "@langchain/mistralai";
import {HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import { ChatGroq } from "@langchain/groq";
import * as z from "zod";
import { WebSearch } from "./web.service.js";

const GeminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});
const MistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  maxRetries: 0,
});
const GroqModel = new ChatGroq({
  model: "openai/gpt-oss-20b",
  apiKey: process.env.GROQ_API_KEY, // from console.groq.com/keys
  maxRetries: 1,
  streaming: true,
});

const WebSearchTool = tool(
    async ({ query }) => WebSearch(query),
    {
        name: "WebSearch",
        description: "Useful for when you need to answer questions about current events or the world. Input should be a search query.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the web."),
        }),
    }
);

const agent = createAgent({
    model: GroqModel,
    tools: [WebSearchTool],
});


// export async function generateResponse(messages) {
//     const response = await agent.invoke({
//         messages: messages.map(msg => {
//             if (msg.role == 'user') {
//                 return new HumanMessage(msg.content);
//             } else if (msg.role == 'assistant') {
//                 return new AIMessage(msg.content);
//             }
//         })
//     });
//     return response.messages[response.messages.length - 1].text;
// }
export async function generateResponse(messages, onEvent) {
    const stream = await agent.stream({
        messages: messages.map(msg => 
            msg.role === 'user' ?
            new HumanMessage(msg.content) :
            new AIMessage(msg.content)
        ),
    },{streamMode: "messages"});
    let fullText = '';

    for await (const [chunk, metadata] of stream) {
        if (chunk._getType() !== "ai") continue; 
        // chunk is an AIMessageChunk — has .content (text delta) and .tool_call_chunks
        if ( chunk.tool_call_chunks?.length) {
            for (const tc of chunk.tool_call_chunks) {
                if (tc.name) onEvent({ type: "tool_call", name: tc.name });
            } 
        }
        if (chunk.content) {
            fullText += chunk.content;
            onEvent({ type: "token", content: chunk.content });
        }
    }

    onEvent({ type: "done", content: fullText });
    return fullText;
}



export async function generateChatTittle(messages) {
    const response =  await GroqModel.invoke(
        [
            new SystemMessage(`You are a helpful assistant that generates a title for a chat conversation based on the messages provided.
                
                User will provide you with a series of messages from a chat conversation. Your task is to analyze the content of these messages and generate a concise and relevant title that accurately reflects the main topic or theme of the conversation. The title should be clear, informative, and capture the essence of the discussion. Please ensure that the title is appropriate and does not contain any sensitive or personal information from the messages within 3 to 5 words.`
            ),
            new HumanMessage(`Generate a title for the following chat conversation: ${messages}`)
        ]
    )
    return response.text;
}