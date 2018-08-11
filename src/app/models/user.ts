import { Song } from "./song";

/**
 * User object interface for firestore
 */
export interface User {
    userid?: string;
    songs?: Song[];
    totalscore?: number;
    user?: {
        name: string;
    };
}
