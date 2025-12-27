// API Service Layer for DevForge Backend

const API_BASE = '/api';

// Types matching database schema
export interface PortfolioProject {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    tags: string[];
    live_link: string | null;
    is_featured: boolean;
    created_at: string;
}

export interface ProjectTemplate {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
    live_preview_url: string | null;
    is_featured: boolean;
    created_at: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    skills: string[];
    avatar_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    color_theme: string;
    display_order: number;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
    phone?: string;
    project_type?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Fetch portfolio projects
export async function fetchPortfolio(): Promise<PortfolioProject[]> {
    const response = await fetch(`${API_BASE}/portfolio`);
    const result: ApiResponse<PortfolioProject[]> = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch portfolio');
    }
    return result.data || [];
}

// Fetch project templates
export async function fetchTemplates(): Promise<ProjectTemplate[]> {
    const response = await fetch(`${API_BASE}/templates`);
    const result: ApiResponse<ProjectTemplate[]> = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch templates');
    }
    return result.data || [];
}

// Fetch team members
export async function fetchTeam(): Promise<TeamMember[]> {
    const response = await fetch(`${API_BASE}/team`);
    const result: ApiResponse<TeamMember[]> = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch team');
    }
    return result.data || [];
}

// Submit contact form
export async function submitContact(data: ContactFormData): Promise<void> {
    const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result: ApiResponse<null> = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to submit contact form');
    }
}
