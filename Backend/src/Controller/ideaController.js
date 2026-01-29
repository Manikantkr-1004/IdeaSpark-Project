import { ideaModel } from "../Model/ideaModel.js";
import { ideaGeneratebyAI, suggestBestIdeabyAI } from "../Utils/aiResponse.js";

export const createIdea = async (req, res) => {
    try {
        const { heading, content, category, authorId, visibility, isAi } = req.body;

        if((!heading || !content || !category || !visibility) && !isAi) {
            return res.status(400).json({ message: "Missing required fields", error:"Missing some fields", data: null });
        }
        if(!content && isAi) {
            return res.status(400).json({ message: "Content is required for AI generated ideas", error:"Content missing", data: null });
        }

        let aiNewHeading, aiNewContent, aiNewCategory;
        if(isAi){
            const {aiHeading, aiContent, aiCategory} = await ideaGeneratebyAI(content);
            if(!aiHeading || !aiContent || !aiCategory) {
                return res.status(500).json({ message: "AI failed to generate idea, Try Again!!", error: "AI generation error", data: null });
            }
            aiNewHeading = aiHeading;
            aiNewContent = aiContent;
            aiNewCategory = aiCategory;
        }

        const newIdea = new ideaModel({ 
            heading: isAi ? aiNewHeading : heading, 
            content: isAi ? aiNewContent : content, 
            category: isAi ? aiNewCategory : category, 
            authorId, 
            visibility: isAi ? "private" : visibility 
        });
        await newIdea.save();
        res.status(201).json({ message: "Idea created successfully", error: null, data: newIdea });

    } catch (error) {
        console.log("Error in creating idea", error);
        res.status(500).json({ message: "Internal server error", error: error.message, data: null });
    }
}

export const updateIdea = async (req, res) => {
    try {
        const { ideaId } = req.params;
        const {heading, content, authorId, visibility, category} = req.body;

        const existIdea = await ideaModel.findOne({ _id: ideaId, authorId  });
        if(!existIdea) {
            return res.status(404).json({ message: "Idea not found", error: "No idea with given ID", data: null });
        }

        await ideaModel.findOneAndUpdate({ _id: ideaId, authorId }, { heading, content, category, visibility }, { new: true });
        res.status(200).json({ message: "Idea updated successfully", error: null, data: null });
    } catch (error) {
        console.log("Error in updating idea", error);
        res.status(500).json({ message: "Internal server error", error: error.message, data: null });
    }
}

export const deleteIdea = async (req, res) => {
    try {
        const { ideaId } = req.params;
        const { authorId } = req.body;

        const existIdea = await ideaModel.findOne({ _id: ideaId, authorId });
        if(!existIdea) {
            return res.status(404).json({ message: "Idea not found", error: "No idea with given ID", data: null });
        }

        await ideaModel.findOneAndDelete({ _id: ideaId, authorId });
        res.status(200).json({ message: "Idea deleted successfully", error: null, data: null });
    } catch (error) {
        console.log("Error in deleting idea", error);
        res.status(500).json({ message: "Internal server error", error: error.message, data: null });
    }
}

export const getIdeas = async (req, res) => {
    try {
        const {heading, category} = req.query;
        let filter = {};

        filter.visibility = 'public';
        if(heading) filter.heading = { $regex: `${heading}`, $options: 'i' };
        if(category) filter.category = { $regex: `${category}`, $options: 'i' };

        const ideas = await ideaModel.find(filter).sort({ updatedAt: -1 }).populate("authorId", "name image -_id");
        res.status(200).json({ message: "Ideas fetched successfully", error: null, data: ideas });
    } catch (error) {
        console.log("Error in fetching ideas", error);
        res.status(500).json({ message: "Internal server error", error: error.message, data: null });
    }
}

export const getAuthorIdeas = async (req, res) => {
    try {
        const { authorId } = req.body;
        const {heading, category} = req.query;

        let filter = {};
        filter.authorId = authorId;
        if(heading) filter.heading = { $regex: `${heading}`, $options: 'i' };
        if(category) filter.category = { $regex: `${category}`, $options: 'i' };

        const ideas = await ideaModel.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ message: "Author's ideas fetched successfully", error: null, data: ideas });
    } catch (error) {
        console.log("Error in fetching author's ideas", error);
        res.status(500).json({ message: "Internal server error", error: error.message, data: null });
    }
}

export const suggestBestIdea = async (req, res) => {
    try {
        const { ideas } = req.body;
        if(ideas.length < 2){
            return res.status(400).json({ message: "At least two ideas are required for suggestion", error: "Insufficient ideas", data: null });
        }
        
        const bestIdea = await suggestBestIdeabyAI(ideas);
        if(!bestIdea) {
            return res.status(500).json({ message: "AI failed to suggest best idea", error: "AI suggestion error", data: null });
        }
        res.status(200).json({ message: "Best idea suggested successfully", error: null, data: bestIdea });
    } catch (error) {
        console.log("Error in suggesting best idea", error);
        res.status(500).json({ message: "Internal server error", error: error.message, data: null });
    }
}