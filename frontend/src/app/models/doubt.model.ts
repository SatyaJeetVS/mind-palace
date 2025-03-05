export interface Doubt {
    id: string;
    question: string;
    topic_id: string;
    curriculum_id: string;
    user_id: string;
    answer?: string;
    is_resolved: boolean;
    created_at: Date;
    updated_at: Date;
    curriculum_updates: string[];
}

export interface DoubtCreate {
    question: string;
    topic_id: string;
    curriculum_id: string;
}

export interface DoubtUpdate {
    answer?: string;
    is_resolved?: boolean;
} 