from supabase import create_client, Client
from config import Config

_supabase_client: Client = None

def get_supabase_client() -> Client:
    """Get or create Supabase client instance."""
    global _supabase_client
    if _supabase_client is None:
        if not Config.SUPABASE_URL or not Config.SUPABASE_KEY:
            raise ValueError("Supabase URL and Key must be set in environment variables")
        _supabase_client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
    return _supabase_client


def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role key for admin operations."""
    if not Config.SUPABASE_URL or not Config.SUPABASE_SERVICE_KEY:
        raise ValueError("Supabase URL and Service Key must be set for admin operations")
    return create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_KEY)
