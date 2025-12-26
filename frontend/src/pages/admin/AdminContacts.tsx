import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => {
    const auth = localStorage.getItem('admin_auth');
    return auth ? { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' } : {};
};

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    project_type: string | null;
    message: string;
    is_read: boolean;
    submitted_at: string;
}

const AdminContacts = () => {
    const queryClient = useQueryClient();

    const { data: contacts = [], isLoading } = useQuery<ContactSubmission[]>({
        queryKey: ['admin', 'contacts'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/contacts`, { headers: getAuthHeader() });
            const data = await res.json();
            return data.data || [];
        },
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE_URL}/admin/contacts/${id}/read`, {
                method: 'PUT',
                headers: getAuthHeader(),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE_URL}/admin/contacts/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader(),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this contact submission?')) {
            deleteMutation.mutate(id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const unreadCount = contacts.filter(c => !c.is_read).length;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
                    <p className="text-muted-foreground">
                        {contacts.length} total submissions
                        {unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                                {unreadCount} unread
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : contacts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No contact submissions yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`glass-card rounded-xl p-6 ${contact.is_read ? 'opacity-75' : 'border-l-4 border-l-primary'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg">{contact.name}</h3>
                                        {!contact.is_read && (
                                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="flex items-center gap-1 hover:text-primary transition-colors"
                                        >
                                            <Mail size={14} />
                                            {contact.email}
                                        </a>
                                        {contact.phone && (
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="flex items-center gap-1 hover:text-primary transition-colors"
                                            >
                                                <Phone size={14} />
                                                {contact.phone}
                                            </a>
                                        )}
                                        <span className="text-xs">
                                            {formatDate(contact.submitted_at)}
                                        </span>
                                    </div>

                                    {contact.project_type && (
                                        <div className="mb-2">
                                            <span className="text-xs px-2 py-0.5 bg-muted rounded">
                                                {contact.project_type}
                                            </span>
                                        </div>
                                    )}

                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {contact.message}
                                    </p>
                                </div>

                                <div className="flex gap-2 flex-shrink-0">
                                    {!contact.is_read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Mark as read"
                                            onClick={() => markReadMutation.mutate(contact.id)}
                                        >
                                            <Check size={16} />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(contact.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminContacts;
