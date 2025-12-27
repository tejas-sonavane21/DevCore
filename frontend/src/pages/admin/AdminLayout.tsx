import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import {
    LayoutDashboard,
    FolderKanban,
    Briefcase,
    Users,
    MessageSquare,
    Menu,
    X,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AdminLayoutProps {
    children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    // Check if user is authenticated
    useEffect(() => {
        const storedAuth = localStorage.getItem('admin_auth');
        if (storedAuth) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Test authentication with the API
            const response = await fetch(`${API_BASE_URL}/admin/templates`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
                }
            });

            if (response.ok) {
                localStorage.setItem('admin_auth', btoa(`${credentials.username}:${credentials.password}`));
                setIsAuthenticated(true);
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to connect to server. Make sure the backend is running.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/templates', icon: FolderKanban, label: 'Templates' },
        { path: '/admin/portfolio', icon: Briefcase, label: 'Portfolio' },
        { path: '/admin/team', icon: Users, label: 'Team' },
        { path: '/admin/contacts', icon: MessageSquare, label: 'Contacts' },
    ];

    const isActive = (path: string, exact?: boolean) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    // Login form
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="glass-card rounded-2xl p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-2 text-center">Admin Login</h1>
                    <p className="text-muted-foreground text-sm text-center mb-6">
                        Enter your credentials to access the admin panel
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Username</label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Password</label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <Button type="submit" variant="glow" className="w-full">
                            Login
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                            ← Back to website
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-muted"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-border">
                        <Link to="/admin" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gradient">DevForge</span>
                        </Link>
                        <span className="text-xs text-muted-foreground">Admin Panel</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path, item.exact)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-border">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8">
                <Outlet />
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
