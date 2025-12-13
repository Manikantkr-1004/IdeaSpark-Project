
export interface createIdeaType {
    heading: string,
    content: string,
    category: string,
    visibility: 'private' | 'public',
    isAi: boolean
}

export interface ideaDataType {
    _id: string,
    heading: string,
    content: string,
    category: string,
    authorId: string,
    visibility: string,
    createdAt: string,
    updatedAt: string
}

export interface ideaPublicDataType {
    _id: string,
    heading: string,
    content: string,
    category: string,
    authorId: {name: string, profileImg: string}
    visibility: string,
    createdAt: string,
    updatedAt: string
}