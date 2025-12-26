import { useQuery } from "@tanstack/react-query";
import {
    FolderKanban,
    Briefcase,
    Users,
    MessageSquare,
    TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => {
    const auth = localStorage.getItem('admin_auth');
    return auth ? { 'Authorization': `Basic ${auth}` } : {};
};

const AdminDashboard = () => {
    // Fetch counts for dashboard
    const { data: templates } = useQuery({
        queryKey: ['admin', 'templates'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/templates`, { headers: getAuthHeader() });
            const data = await res.json();
            return data.data || [];
        },
    });

    const { data: portfolio } = useQuery({
        queryKey: ['admin', 'portfolio'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/portfolio`, { headers: getAuthHeader() });
            const data = await res.json();
            return data.data || [];
        },
    });

    const { data: team } = useQuery({
        queryKey: ['admin', 'team'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/team`, { headers: getAuthHeader() });
            const data = await res.json();
            return data.data || [];
        },
    });

    const { data: contacts } = useQuery({
        queryKey: ['admin', 'contacts'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/contacts`, { headers: getAuthHeader() });
            const data = await res.json();
            return data.data || [];
        },
    });

    const unreadContacts = contacts?.filter((c: any) => !c.is_read)?.length || 0;

    const stats = [
        {
            label: 'Project Templates',
            count: templates?.length || 0,
            icon: FolderKanban,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            link: '/admin/templates'
        },
        {
            label: 'Portfolio Projects',
            count: portfolio?.length || 0,
            icon: Briefcase,
            color: 'text-secondary',
            bgColor: 'bg-secondary/10',
            link: '/admin/portfolio'
        },
        {
            label: 'Team Members',
            count: team?.length || 0,
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            link: '/admin/team'
        },
        {
            label: 'Contact Submissions',
            count: contacts?.length || 0,
            icon: MessageSquare,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            link: '/admin/contacts',
            badge: unreadContacts > 0 ? unreadContacts : undefined
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to the Project Forge admin panel
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        to={stat.link}
                        className="glass-card rounded-xl p-6 hover:border-primary/40 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            {stat.badge && (
                                <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded-full">
                                    {stat.badge} new
                                </span>
                            )}
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.count}</div>
                        <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                            {stat.label}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Contacts */}
            <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Recent Contact Submissions</h2>
                    <Link to="/admin/contacts" className="text-sm text-primary hover:underline">
                        View all →
                    </Link>
                </div>

                {contacts && contacts.length > 0 ? (
                    <div className="space-y-3">
                        {contacts.slice(0, 5).map((contact: any) => (
                            <div
                                key={contact.id}
                                className={`p-4 rounded-lg border ${contact.is_read ? 'border-border bg-muted/30' : 'border-primary/30 bg-primary/5'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{contact.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(contact.submitted_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-8">
                        No contact submissions yet
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
