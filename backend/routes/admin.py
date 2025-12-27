from functools import wraps
from flask import Blueprint, jsonify, request, Response
from supabase_client import get_supabase_admin_client
from config import Config
import base64

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


def check_auth(username, password):
    """Check if a username/password combination is valid."""
    return username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD


def authenticate():
    """Send a 401 response that enables basic auth."""
    return Response(
        'Authentication required', 401,
        {'WWW-Authenticate': 'Basic realm="Admin Panel"'}
    )


def requires_auth(f):
    """Decorator for routes that require authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated


# ==================== Project Templates CRUD ====================

@admin_bp.route('/templates', methods=['GET'])
@requires_auth
def list_templates():
    """List all project templates."""
    try:
        supabase = get_supabase_admin_client()
        response = supabase.table('project_templates').select('*').order('display_order', nullsfirst=False).order('created_at', desc=True).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/templates', methods=['POST'])
@requires_auth
def create_template():
    """Create a new project template."""
    try:
        data = request.get_json()
        supabase = get_supabase_admin_client()
        response = supabase.table('project_templates').insert(data).execute()
        return jsonify({'success': True, 'data': response.data}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/templates/<template_id>', methods=['PUT'])
@requires_auth
def update_template(template_id):
    """Update a project template."""
    try:
        data = request.get_json()
        supabase = get_supabase_admin_client()
        response = supabase.table('project_templates').update(data).eq('id', template_id).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/templates/<template_id>', methods=['DELETE'])
@requires_auth
def delete_template(template_id):
    """Delete a project template."""
    try:
        supabase = get_supabase_admin_client()
        supabase.table('project_templates').delete().eq('id', template_id).execute()
        return jsonify({'success': True, 'message': 'Template deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/templates/reorder', methods=['POST'])
@requires_auth
def reorder_templates():
    """Reorder project templates by updating display_order."""
    try:
        data = request.get_json()
        order = data.get('order', [])  # List of IDs in new order
        
        supabase = get_supabase_admin_client()
        
        for index, template_id in enumerate(order):
            supabase.table('project_templates').update({'display_order': index}).eq('id', template_id).execute()
        
        return jsonify({'success': True, 'message': 'Order updated'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== Portfolio Projects CRUD ====================

@admin_bp.route('/portfolio', methods=['GET'])
@requires_auth
def list_portfolio():
    """List all portfolio projects."""
    try:
        supabase = get_supabase_admin_client()
        response = supabase.table('portfolio_projects').select('*').order('display_order', nullsfirst=False).order('created_at', desc=True).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/portfolio', methods=['POST'])
@requires_auth
def create_portfolio():
    """Create a new portfolio project."""
    try:
        data = request.get_json()
        supabase = get_supabase_admin_client()
        response = supabase.table('portfolio_projects').insert(data).execute()
        return jsonify({'success': True, 'data': response.data}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/portfolio/<project_id>', methods=['PUT'])
@requires_auth
def update_portfolio(project_id):
    """Update a portfolio project."""
    try:
        data = request.get_json()
        supabase = get_supabase_admin_client()
        response = supabase.table('portfolio_projects').update(data).eq('id', project_id).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/portfolio/<project_id>', methods=['DELETE'])
@requires_auth
def delete_portfolio(project_id):
    """Delete a portfolio project."""
    try:
        supabase = get_supabase_admin_client()
        supabase.table('portfolio_projects').delete().eq('id', project_id).execute()
        return jsonify({'success': True, 'message': 'Project deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/portfolio/reorder', methods=['POST'])
@requires_auth
def reorder_portfolio():
    """Reorder portfolio projects by updating display_order."""
    try:
        data = request.get_json()
        order = data.get('order', [])  # List of IDs in new order
        
        supabase = get_supabase_admin_client()
        
        for index, project_id in enumerate(order):
            supabase.table('portfolio_projects').update({'display_order': index}).eq('id', project_id).execute()
        
        return jsonify({'success': True, 'message': 'Order updated'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== Team Members CRUD ====================

@admin_bp.route('/team', methods=['GET'])
@requires_auth
def list_team():
    """List all team members."""
    try:
        supabase = get_supabase_admin_client()
        response = supabase.table('team_members').select('*').order('display_order').execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/team', methods=['POST'])
@requires_auth
def create_team_member():
    """Create a new team member."""
    try:
        data = request.get_json()
        supabase = get_supabase_admin_client()
        response = supabase.table('team_members').insert(data).execute()
        return jsonify({'success': True, 'data': response.data}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/team/<member_id>', methods=['PUT'])
@requires_auth
def update_team_member(member_id):
    """Update a team member."""
    try:
        data = request.get_json()
        supabase = get_supabase_admin_client()
        response = supabase.table('team_members').update(data).eq('id', member_id).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/team/<member_id>', methods=['DELETE'])
@requires_auth
def delete_team_member(member_id):
    """Delete a team member."""
    try:
        supabase = get_supabase_admin_client()
        supabase.table('team_members').delete().eq('id', member_id).execute()
        return jsonify({'success': True, 'message': 'Team member deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== Contact Submissions (Read/Delete only) ====================

@admin_bp.route('/contacts', methods=['GET'])
@requires_auth
def list_contacts():
    """List all contact submissions."""
    try:
        supabase = get_supabase_admin_client()
        response = supabase.table('contact_submissions').select('*').order('submitted_at', desc=True).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/contacts/<contact_id>', methods=['DELETE'])
@requires_auth
def delete_contact(contact_id):
    """Delete a contact submission."""
    try:
        supabase = get_supabase_admin_client()
        supabase.table('contact_submissions').delete().eq('id', contact_id).execute()
        return jsonify({'success': True, 'message': 'Contact deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/contacts/<contact_id>/read', methods=['PUT'])
@requires_auth
def mark_contact_read(contact_id):
    """Mark a contact submission as read."""
    try:
        supabase = get_supabase_admin_client()
        response = supabase.table('contact_submissions').update({'is_read': True}).eq('id', contact_id).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== Image Upload ====================

@admin_bp.route('/upload', methods=['POST'])
@requires_auth
def upload_image():
    """Upload an image to Supabase Storage."""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        # Get the bucket name and folder from query params
        bucket = request.args.get('bucket', 'images')
        folder = request.args.get('folder', '')  # e.g., 'portfolio', 'templates', 'team'
        
        supabase = get_supabase_admin_client()
        
        # Generate unique filename with folder path
        import uuid
        ext = file.filename.rsplit('.', 1)[-1] if '.' in file.filename else 'png'
        filename = f"{uuid.uuid4()}.{ext}"
        
        # Create full path with folder if provided
        if folder:
            filepath = f"{folder}/{filename}"
        else:
            filepath = filename
        
        # Upload to Supabase Storage
        response = supabase.storage.from_(bucket).upload(
            filepath,
            file.read(),
            {'content-type': file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(bucket).get_public_url(filepath)
        
        return jsonify({'success': True, 'url': public_url, 'filename': filepath}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

