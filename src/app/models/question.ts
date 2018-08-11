/**
 * Question object interface for a lyriquiz question
 */
export interface Question {
    lyricSnippet?: string;
    artist?: string;
    songname?: string;
    columns?: number;
    washout?:[{
        artist?: string;
        songname?: string;
    }]
}
