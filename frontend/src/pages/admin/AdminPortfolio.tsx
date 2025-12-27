import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Save, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => {
    const auth = localStorage.getItem('admin_auth');
    return auth ? { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' } : {};
};

interface PortfolioProject {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    tags: string[];
    live_link: string | null;
    github_link: string | null;
    is_featured: boolean;
    display_order?: number;
}

const emptyProject: Partial<PortfolioProject> = {
    title: '',
    description: '',
    image_url: '',
    tags: [],
    live_link: '',
    github_link: '',
    is_featured: false,
};

const AdminPortfolio = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);
    const [tagsInput, setTagsInput] = useState('');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const { data: projects = [], isLoading } = useQuery<PortfolioProject[]>({
        queryKey: ['admin', 'portfolio'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/portfolio`, { headers: getAuthHeader() });
            const data = await res.json();
            return data.data || [];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (project: Partial<PortfolioProject>) => {
            const res = await fetch(`${API_BASE_URL}/admin/portfolio`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(project),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'portfolio'] });
            closeModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...project }: Partial<PortfolioProject> & { id: string }) => {
            const res = await fetch(`${API_BASE_URL}/admin/portfolio/${id}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(project),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'portfolio'] });
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE_URL}/admin/portfolio/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader(),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'portfolio'] });
        },
    });

    const reorderMutation = useMutation({
        mutationFn: async (order: string[]) => {
            const res = await fetch(`${API_BASE_URL}/admin/portfolio/reorder`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ order }),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'portfolio'] });
        },
    });

    const openCreateModal = () => {
        setEditingProject({ ...emptyProject });
        setTagsInput('');
        setIsModalOpen(true);
    };

    const openEditModal = (project: PortfolioProject) => {
        setEditingProject({ ...project });
        setTagsInput(project.tags.join(', '));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        const projectData = {
            ...editingProject,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        };

        if (editingProject.id) {
            updateMutation.mutate(projectData as PortfolioProject);
        } else {
            createMutation.mutate(projectData);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            deleteMutation.mutate(id);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        // Add a slight delay to allow the dragged element styling
        setTimeout(() => {
            (e.target as HTMLElement).style.opacity = '0.5';
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1';
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        const dragIndex = draggedIndex;

        if (dragIndex === null || dragIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        // Reorder the array
        const newOrder = [...projects];
        const [draggedItem] = newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, draggedItem);

        // Send new order to backend
        const orderIds = newOrder.map(p => p.id);
        reorderMutation.mutate(orderIds);

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Portfolio Projects</h1>
                    <p className="text-muted-foreground">Manage completed portfolio projects. Drag to reorder.</p>
                </div>
                <Button variant="glow" onClick={openCreateModal}>
                    <Plus size={18} className="mr-2" />
                    Add Project
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No projects yet. Click "Add Project" to create one.
                </div>
            ) : (
                <div className="grid gap-2">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            className={`glass-card rounded-xl p-4 flex items-center gap-4 cursor-grab active:cursor-grabbing transition-all duration-200
                                ${dragOverIndex === index ? 'border-2 border-primary border-dashed bg-primary/5' : ''}
                                ${draggedIndex === index ? 'opacity-50' : ''}`}
                        >
                            {/* Drag Handle */}
                            <div className="flex-shrink-0 text-muted-foreground hover:text-foreground cursor-grab">
                                <GripVertical size={20} />
                            </div>

                            {project.image_url && (
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold truncate">{project.title}</h3>
                                    {project.is_featured && (
                                        <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-500 rounded-full">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                                <div className="flex gap-1 mt-2 flex-wrap">
                                    {project.tags.slice(0, 4).map((tag) => (
                                        <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <Button variant="ghost" size="icon" onClick={() => openEditModal(project)}>
                                    <Pencil size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(project.id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                    <div
                        className="relative w-full max-w-2xl glass-card rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {editingProject.id ? 'Edit Project' : 'Add Project'}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={closeModal}>
                                <X size={18} />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Title *</label>
                                <Input
                                    value={editingProject.title || ''}
                                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Description *</label>
                                <Textarea
                                    value={editingProject.description || ''}
                                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={editingProject.is_featured || false}
                                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="is_featured" className="text-sm">Featured Project</label>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Image</label>
                                <ImageUpload
                                    value={editingProject.image_url || null}
                                    onChange={(url) => setEditingProject({ ...editingProject, image_url: url || '' })}
                                    bucket="images"
                                    folder="portfolio"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Live Link</label>
                                    <Input
                                        value={editingProject.live_link || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, live_link: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">GitHub Link</label>
                                    <Input
                                        value={editingProject.github_link || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, github_link: e.target.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Tags (comma-separated)</label>
                                <Input
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                    placeholder="React, Python, Flask"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="glow" className="flex-1">
                                    <Save size={16} className="mr-2" />
                                    {editingProject.id ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPortfolio;
