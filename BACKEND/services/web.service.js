import {tavily} from "@tavily/core";
if(!process.env.TAVILY_API_KEY) {
    throw new Error("Tavily API key is not set in the environment variables.");
}

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
// const response = await tvly.search("Who is Leo Messi?");

export const WebSearch = async (query) => {
    try{
        const response = await tvly.search(query,{
            maxResults: 5,
            searchDepth: "basic",
        });
        return response;
    } catch (error) {
        console.error("Error searching the web:", error);
        throw error;
    }
}