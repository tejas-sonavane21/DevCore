from flask import Blueprint, jsonify, request
from supabase_client import get_supabase_client
import traceback

api_bp = Blueprint('api', __name__, url_prefix='/api')


# ==================== Project Templates ====================

@api_bp.route('/templates', methods=['GET'])
def get_templates():
    """Get all project templates."""
    try:
        supabase = get_supabase_client()
        response = supabase.table('project_templates').select('*').order('display_order', nullsfirst=False).order('created_at', desc=True).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        print(f"ERROR in /api/templates: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@api_bp.route('/templates/<template_id>', methods=['GET'])
def get_template(template_id):
    """Get a single project template by ID."""
    try:
        supabase = get_supabase_client()
        response = supabase.table('project_templates').select('*').eq('id', template_id).single().execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        print(f"ERROR in /api/templates/{template_id}: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 404


# ==================== Portfolio Projects ====================

@api_bp.route('/portfolio', methods=['GET'])
def get_portfolio():
    """Get all portfolio projects."""
    try:
        supabase = get_supabase_client()
        response = supabase.table('portfolio_projects').select('*').order('display_order', nullsfirst=False).order('created_at', desc=True).execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        print(f"ERROR in /api/portfolio: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== Team Members ====================

@api_bp.route('/team', methods=['GET'])
def get_team():
    """Get all team members."""
    try:
        supabase = get_supabase_client()
        response = supabase.table('team_members').select('*').order('display_order').execute()
        return jsonify({'success': True, 'data': response.data}), 200
    except Exception as e:
        print(f"ERROR in /api/team: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== Contact Form ====================

@api_bp.route('/contact', methods=['POST'])
def submit_contact():
    """Submit a contact form."""
    try:
        data = request.get_json()
        print(f"Received contact form data: {data}")
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'{field} is required'}), 400
        
        supabase = get_supabase_client()
        response = supabase.table('contact_submissions').insert({
            'name': data['name'],
            'email': data['email'],
            'message': data['message'],
            'project_type': data.get('project_type', ''),
            'phone': data.get('phone', '')
        }).execute()
        
        print(f"Supabase response: {response}")
        return jsonify({'success': True, 'message': 'Contact form submitted successfully'}), 201
    except Exception as e:
        print(f"ERROR in /api/contact: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
