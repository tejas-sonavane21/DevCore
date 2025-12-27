import { useState } from "react";
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

interface Template {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
    live_preview_url: string | null;
    is_featured: boolean;
    display_order?: number;
}

const emptyTemplate: Partial<Template> = {
    title: '',
    description: '',
    image_url: '',
    difficulty: 'Intermediate',
    tags: [],
    live_preview_url: '',
    is_featured: false,
};

const AdminTemplates = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Partial<Template> | null>(null);
    const [tagsInput, setTagsInput] = useState('');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Fetch templates
    const { data: templates = [], isLoading } = useQuery<Template[]>({
        queryKey: ['admin', 'templates'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/templates`, { headers: getAuthHeader() });
            const data = await res.json();
            return data.data || [];
        },
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (template: Partial<Template>) => {
            const res = await fetch(`${API_BASE_URL}/admin/templates`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(template),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
            closeModal();
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, ...template }: Partial<Template> & { id: string }) => {
            const res = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(template),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
            closeModal();
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader(),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
        },
    });

    // Reorder mutation
    const reorderMutation = useMutation({
        mutationFn: async (order: string[]) => {
            const res = await fetch(`${API_BASE_URL}/admin/templates/reorder`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ order }),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
        },
    });

    const openCreateModal = () => {
        setEditingTemplate({ ...emptyTemplate });
        setTagsInput('');
        setIsModalOpen(true);
    };

    const openEditModal = (template: Template) => {
        setEditingTemplate({ ...template });
        setTagsInput(template.tags.join(', '));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTemplate(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTemplate) return;

        const templateData = {
            ...editingTemplate,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        };

        if (editingTemplate.id) {
            updateMutation.mutate(templateData as Template);
        } else {
            createMutation.mutate(templateData);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            deleteMutation.mutate(id);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
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
        const newOrder = [...templates];
        const [draggedItem] = newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, draggedItem);

        // Send new order to backend
        const orderIds = newOrder.map(t => t.id);
        reorderMutation.mutate(orderIds);

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Project Templates</h1>
                    <p className="text-muted-foreground">Manage project templates and ideas. Drag to reorder.</p>
                </div>
                <Button variant="glow" onClick={openCreateModal}>
                    <Plus size={18} className="mr-2" />
                    Add Template
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : templates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No templates yet. Click "Add Template" to create one.
                </div>
            ) : (
                <div className="grid gap-2">
                    {templates.map((template, index) => (
                        <div
                            key={template.id}
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

                            {template.image_url && (
                                <img
                                    src={template.image_url}
                                    alt={template.title}
                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold truncate">{template.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${template.difficulty === 'Beginner' ? 'bg-secondary/20 text-secondary' :
                                        template.difficulty === 'Intermediate' ? 'bg-primary/20 text-primary' :
                                            'bg-accent/20 text-accent'
                                        }`}>
                                        {template.difficulty}
                                    </span>
                                    {template.is_featured && (
                                        <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-500 rounded-full">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{template.description}</p>
                                <div className="flex gap-1 mt-2 flex-wrap">
                                    {template.tags.slice(0, 4).map((tag) => (
                                        <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded">{tag}</span>
                                    ))}
                                    {template.tags.length > 4 && (
                                        <span className="text-xs px-2 py-0.5 bg-muted rounded">+{template.tags.length - 4}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <Button variant="ghost" size="icon" onClick={() => openEditModal(template)}>
                                    <Pencil size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(template.id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && editingTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                    <div
                        className="relative w-full max-w-2xl glass-card rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {editingTemplate.id ? 'Edit Template' : 'Add Template'}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={closeModal}>
                                <X size={18} />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Title *</label>
                                <Input
                                    value={editingTemplate.title || ''}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Description *</label>
                                <Textarea
                                    value={editingTemplate.description || ''}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Difficulty</label>
                                    <select
                                        value={editingTemplate.difficulty || 'Intermediate'}
                                        onChange={(e) => setEditingTemplate({ ...editingTemplate, difficulty: e.target.value as Template['difficulty'] })}
                                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={editingTemplate.is_featured || false}
                                        onChange={(e) => setEditingTemplate({ ...editingTemplate, is_featured: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="is_featured" className="text-sm">Featured</label>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Image</label>
                                <ImageUpload
                                    value={editingTemplate.image_url || null}
                                    onChange={(url) => setEditingTemplate({ ...editingTemplate, image_url: url || '' })}
                                    bucket="images"
                                    folder="templates"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Live Preview URL</label>
                                <Input
                                    value={editingTemplate.live_preview_url || ''}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, live_preview_url: e.target.value })}
                                    placeholder="https://..."
                                />
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
                                    {editingTemplate.id ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTemplates;
