-- =====================================================
-- Migration Script: Remove Unused Columns
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Remove github_link column from portfolio_projects
ALTER TABLE portfolio_projects DROP COLUMN IF EXISTS github_link;

-- Remove features column from project_templates
ALTER TABLE project_templates DROP COLUMN IF EXISTS features;
