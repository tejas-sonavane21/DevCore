// API Service for Project Forge
// Handles all API calls to the Flask backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ==================== Types ====================

export interface ProjectTemplate {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
    features: string[];
    live_preview_url: string | null;
    is_featured: boolean;
    created_at: string;
}

export interface PortfolioProject {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    tags: string[];
    live_link: string | null;
    github_link: string | null;
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
    color_theme: 'primary' | 'secondary';
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

// ==================== API Functions ====================

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'An error occurred');
    }

    return data.data as T;
}

// ==================== Project Templates ====================

export async function getProjectTemplates(): Promise<ProjectTemplate[]> {
    return fetchApi<ProjectTemplate[]>('/api/templates');
}

export async function getProjectTemplate(id: string): Promise<ProjectTemplate> {
    return fetchApi<ProjectTemplate>(`/api/templates/${id}`);
}

// ==================== Portfolio Projects ====================

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
    return fetchApi<PortfolioProject[]>('/api/portfolio');
}

// ==================== Team Members ====================

export async function getTeamMembers(): Promise<TeamMember[]> {
    return fetchApi<TeamMember[]>('/api/team');
}

// ==================== Contact Form ====================

export async function submitContactForm(data: ContactFormData): Promise<void> {
    await fetchApi<void>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ==================== Fallback Data (when API is unavailable) ====================

export const fallbackTemplates: ProjectTemplate[] = [
    {
        id: '1',
        title: 'AI-Powered Attendance System',
        description: 'Face recognition-based attendance management with real-time tracking and comprehensive reporting dashboard.',
        image_url: null,
        difficulty: 'Advanced',
        tags: ['Python', 'OpenCV', 'Flask', 'MySQL'],
        features: ['Face Detection', 'Real-time Tracking', 'Report Generation'],
        live_preview_url: null,
        is_featured: true,
        created_at: new Date().toISOString(),
    },
    // Add more fallback templates as needed
];

export const fallbackPortfolio: PortfolioProject[] = [
    {
        id: '1',
        title: 'AI Traffic Management System',
        description: 'Real-time traffic analysis using computer vision and ML algorithms.',
        image_url: null,
        tags: ['Python', 'TensorFlow', 'OpenCV'],
        live_link: null,
        github_link: null,
        is_featured: true,
        created_at: new Date().toISOString(),
    },
    // Add more fallback projects as needed
];

export const fallbackTeam: TeamMember[] = [
    {
        id: '1',
        name: 'Alex Chen',
        role: 'Python Expert',
        bio: 'Helping students ace their vivas since 2023.',
        skills: ['Python', 'Django', 'Machine Learning'],
        avatar_url: null,
        github_url: '#',
        linkedin_url: '#',
        color_theme: 'primary',
        display_order: 1,
    },
    {
        id: '2',
        name: 'Jordan Dev',
        role: 'Frontend Wizard',
        bio: 'Making sure your project looks stunning.',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
        avatar_url: null,
        github_url: '#',
        linkedin_url: '#',
        color_theme: 'secondary',
        display_order: 2,
    },
    {
        id: '3',
        name: 'Sam Kumar',
        role: 'Database Architect',
        bio: 'The one who makes sure your data flows smoothly.',
        skills: ['MySQL', 'PostgreSQL', 'System Design'],
        avatar_url: null,
        github_url: '#',
        linkedin_url: '#',
        color_theme: 'primary',
        display_order: 3,
    },
];
