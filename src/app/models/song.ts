/**
 * Song object interface for a single spotify song json
 */
export interface Song {
    name?: string;
    artists?: artist[];
    album?: {
        name?: string;
    }
}

export interface artist {
    name?: string;
}
