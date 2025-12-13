import dotenv from "dotenv";
dotenv.config();
import axios from 'axios';

const AI_API = process.env.AI_URL;
const AI_API_KEY = process.env.AI_API_KEY;

export const ideaGeneratebyAI = async (prompt) => {
    try {
        const response = await axios.post(AI_API, {
            model: "EssentialAI/rnj-1-instruct",
            messages: [
                {"role": "system", "content": "Respond ONLY as: heading||content. No Markdown, labels, formats, * or extras."},
                {"role": "user", "content": `Hey, I want you to generate best ideas based on user prompt. You have to give ideas also one heading and heading and ideas content should be seprated by || so that i can extract both as i want. Here is prompt - ${prompt}` }
            ],
            max_tokens: 100,
            temperature: 0.3
        }, {
            headers: {
                "Authorization": `Bearer ${AI_API_KEY}`,
            }
        });

        const aiMessage = response.data.choices[0]?.message?.content;
        return {
            aiHeading: aiMessage?.split('||')[1].trim(),
            aiContent: aiMessage?.trim(),
            aiCategory: 'AI Generated'
        };

    } catch (error) {
        console.log("Error in AI idea generation", error);
        return null;
    }
}

export const suggestBestIdeabyAI = async (prompts) => {
    try {
        const response = await axios.post(AI_API, {
            model: "EssentialAI/rnj-1-instruct",
            messages: [
                {"role": "system", "content": "Respond ONLY one best idea in given two ideas of user with some creativeness. No Markdown, labels, formats, * or extras."},
                {"role": "user", "content": `Here is the first Idea: ${prompts[0]}. Here is the second Idea: ${prompts[1]}` }
            ],
            max_tokens: 100,
            temperature: 0.5
        }, {
            headers: {
                "Authorization": `Bearer ${AI_API_KEY}`,
            }
        });

        const aiMessage = response.data.choices[0]?.message?.content;
        return aiMessage;

    } catch (error) {
        console.log("Error in suggestBestIdea generation", error);
        return null;
    }
}