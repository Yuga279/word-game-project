export interface User {
    id: string;
    username: string;
    email: string;
    avatar_url?: string;
    total_games?: number;
    wins?: number;
}

export interface Game {
    id: string;
    status: 'Waiting' | 'Active' | 'Voting' | 'Completed';
    creator_id: string;
    playerCount?: number;
    players?: User[];
    myWord?: string;
    started_at?: string;
    ended_at?: string;
}

export interface GameResult {
    majorityWord: string;
    minorityWord: string;
    minorityPlayerId: string;
    winner: 'MajorityWins' | 'MinorityWins';
    votes: Record<string, any>;
}
