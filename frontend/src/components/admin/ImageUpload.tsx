import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ImageUploadProps {
    value: string | null;
    onChange: (url: string | null) => void;
    bucket?: string;
    folder?: string;  // e.g., 'portfolio', 'templates', 'team'
}

const ImageUpload = ({ value, onChange, bucket = "images", folder = "" }: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getAuthHeader = () => {
        const auth = localStorage.getItem('admin_auth');
        return auth ? { 'Authorization': `Basic ${auth}` } : {};
    };

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Build URL with bucket and folder params
            const params = new URLSearchParams({ bucket });
            if (folder) {
                params.append('folder', folder);
            }

            const response = await fetch(`${API_BASE_URL}/admin/upload?${params.toString()}`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: formData,
            });

            const result = await response.json();

            if (result.success && result.url) {
                // Update the parent component with the new URL
                onChange(result.url);
            } else {
                setError(result.error || 'Upload failed');
            }
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const clearImage = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            {/* Show current image or upload area */}
            {value ? (
                // Image Preview when we have a value
                <div className="relative">
                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-border"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '';
                                (e.target as HTMLImageElement).alt = 'Failed to load';
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground mb-1">Image uploaded</p>
                            <p className="text-xs text-muted-foreground truncate">{value}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Replace
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={clearImage}
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            ) : (
                // Upload Area when no image
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                        ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                        ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 size={32} className="animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <Upload size={24} className="text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Drag & drop an image or <span className="text-primary font-medium">click to browse</span>
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
};

export default ImageUpload;
