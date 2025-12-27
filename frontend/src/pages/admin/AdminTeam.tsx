import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => {
    const auth = localStorage.getItem('admin_auth');
    return auth ? { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' } : {};
};

interface TeamMember {
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

const emptyMember: Partial<TeamMember> = {
    name: '',
    role: '',
    bio: '',
    skills: [],
    avatar_url: '',
    github_url: '',
    linkedin_url: '',
    color_theme: 'primary',
    display_order: 0,
};

const AdminTeam = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
    const [skillsInput, setSkillsInput] = useState('');

    const { data: members = [], isLoading } = useQuery<TeamMember[]>({
        queryKey: ['admin', 'team'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/team`, { headers: getAuthHeader() });
            const data = await res.json();
            return data.data || [];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (member: Partial<TeamMember>) => {
            const res = await fetch(`${API_BASE_URL}/admin/team`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(member),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'team'] });
            closeModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...member }: Partial<TeamMember> & { id: string }) => {
            const res = await fetch(`${API_BASE_URL}/admin/team/${id}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(member),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'team'] });
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE_URL}/admin/team/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader(),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'team'] });
        },
    });

    const openCreateModal = () => {
        setEditingMember({ ...emptyMember, display_order: members.length });
        setSkillsInput('');
        setIsModalOpen(true);
    };

    const openEditModal = (member: TeamMember) => {
        setEditingMember({ ...member });
        setSkillsInput(member.skills.join(', '));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;

        const memberData = {
            ...editingMember,
            skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
        };

        if (editingMember.id) {
            updateMutation.mutate(memberData as TeamMember);
        } else {
            createMutation.mutate(memberData);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this team member?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Team Members</h1>
                    <p className="text-muted-foreground">Manage your team members</p>
                </div>
                <Button variant="glow" onClick={openCreateModal}>
                    <Plus size={18} className="mr-2" />
                    Add Member
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : members.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No team members yet. Click "Add Member" to create one.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => (
                        <div key={member.id} className="glass-card rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold ${member.color_theme === 'primary'
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-secondary/20 text-secondary'
                                        }`}
                                >
                                    {member.avatar_url ? (
                                        <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        member.name.split(' ').map(n => n[0]).join('')
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(member)}>
                                        <Pencil size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(member.id)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                            <h3 className="font-bold mb-1">{member.name}</h3>
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full mb-2 ${member.color_theme === 'primary'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-secondary/20 text-secondary'
                                }`}>
                                {member.role}
                            </span>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{member.bio}</p>
                            <div className="flex gap-1 flex-wrap">
                                {member.skills.map((skill) => (
                                    <span key={skill} className="text-xs px-2 py-0.5 bg-muted rounded">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                    <div
                        className="relative w-full max-w-2xl glass-card rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {editingMember.id ? 'Edit Team Member' : 'Add Team Member'}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={closeModal}>
                                <X size={18} />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Name *</label>
                                    <Input
                                        value={editingMember.name || ''}
                                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Role *</label>
                                    <Input
                                        value={editingMember.role || ''}
                                        onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                                        placeholder="e.g., Frontend Developer"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Bio</label>
                                <Textarea
                                    value={editingMember.bio || ''}
                                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Color Theme</label>
                                    <select
                                        value={editingMember.color_theme || 'primary'}
                                        onChange={(e) => setEditingMember({ ...editingMember, color_theme: e.target.value as 'primary' | 'secondary' })}
                                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border"
                                    >
                                        <option value="primary">Primary (Blue)</option>
                                        <option value="secondary">Secondary (Green)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Display Order</label>
                                    <Input
                                        type="number"
                                        value={editingMember.display_order || 0}
                                        onChange={(e) => setEditingMember({ ...editingMember, display_order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Avatar Image</label>
                                <ImageUpload
                                    value={editingMember.avatar_url || null}
                                    onChange={(url) => setEditingMember({ ...editingMember, avatar_url: url || '' })}
                                    bucket="images"
                                    folder="team"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">GitHub URL</label>
                                    <Input
                                        value={editingMember.github_url || ''}
                                        onChange={(e) => setEditingMember({ ...editingMember, github_url: e.target.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">LinkedIn URL</label>
                                    <Input
                                        value={editingMember.linkedin_url || ''}
                                        onChange={(e) => setEditingMember({ ...editingMember, linkedin_url: e.target.value })}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Skills (comma-separated)</label>
                                <Input
                                    value={skillsInput}
                                    onChange={(e) => setSkillsInput(e.target.value)}
                                    placeholder="React, TypeScript, Python"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="glow" className="flex-1">
                                    <Save size={16} className="mr-2" />
                                    {editingMember.id ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeam;
