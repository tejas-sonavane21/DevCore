-- =====================================================
-- Database Migration Script for Project Forge
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: project_templates
-- Stores final year project templates/ideas
-- =====================================================
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
    tags JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    live_preview_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table: portfolio_projects
-- Stores completed portfolio projects
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    live_link TEXT,
    github_link TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table: team_members
-- Stores team member information
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    bio TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    avatar_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    color_theme VARCHAR(20) DEFAULT 'primary',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table: contact_submissions
-- Stores contact form submissions
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    project_type VARCHAR(100),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add display_order column to portfolio_projects and project_templates
ALTER TABLE portfolio_projects ADD COLUMN display_order INTEGER DEFAULT 0;
ALTER TABLE project_templates ADD COLUMN display_order INTEGER DEFAULT 0;

-- =====================================================
-- Indexes for better query performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_templates_difficulty ON project_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON project_templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_team_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_contacts_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contact_submissions(is_read);

-- =====================================================
-- Trigger for updating updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_project_templates_updated_at ON project_templates;
CREATE TRIGGER update_project_templates_updated_at
    BEFORE UPDATE ON project_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON portfolio_projects;
CREATE TRIGGER update_portfolio_projects_updated_at
    BEFORE UPDATE ON portfolio_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for templates, portfolio, and team
CREATE POLICY "Public read access for templates" ON project_templates
    FOR SELECT USING (true);

CREATE POLICY "Public read access for portfolio" ON portfolio_projects
    FOR SELECT USING (true);

CREATE POLICY "Public read access for team" ON team_members
    FOR SELECT USING (true);

-- Public insert access for contact submissions
CREATE POLICY "Public insert access for contacts" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Service role has full access (for admin operations)
CREATE POLICY "Service role full access templates" ON project_templates
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access portfolio" ON portfolio_projects
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access team" ON team_members
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access contacts" ON contact_submissions
    FOR ALL USING (auth.role() = 'service_role');
