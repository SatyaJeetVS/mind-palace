export interface Resource {
    title: string;
    url?: string;
    description?: string;
    type: string;
}

export interface Assessment {
    title: string;
    description: string;
    questions: any[];
}

export interface SubTopic {
    id: string;
    title: string;
    description: string;
    learning_objectives: string[];
    content: string;
    difficulty_level: string;
    estimated_time_minutes: number;
    prerequisites: string[];
    resources: Resource[];
    assessments: Assessment[];
    is_completed: boolean;
    progress_percentage: number;
    parent_id?: string;
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    learning_objectives: string[];
    content: string;
    difficulty_level: string;
    estimated_time_minutes: number;
    prerequisites: string[];
    resources: Resource[];
    assessments: Assessment[];
    is_completed: boolean;
    progress_percentage: number;
    subtopics: SubTopic[];
}

export interface ChangeHistory {
    timestamp: Date;
    description: string;
    version: number;
}

export interface Curriculum {
    id: string;
    title: string;
    description: string;
    main_topic: string;
    user_id: string;
    topics: Topic[];
    created_at: Date;
    updated_at: Date;
    version: number;
    change_history: ChangeHistory[];
    overall_progress: number;
} 