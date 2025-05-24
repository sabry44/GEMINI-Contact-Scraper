
export interface ExtractedContacts {
  emails: string[];
  phoneNumbers: string[];
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedPassage?: {
    content: string;
    title?: string;
    uri?: string;
  };
  // other types of chunks if applicable
}
