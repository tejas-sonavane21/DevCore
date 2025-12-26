from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "DevForge API is running",
        "version": "1.0.0"
    })

@app.route('/api/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400
        
        # In production, you would:
        # - Send email notification
        # - Store in database
        # - Add to CRM
        
        print(f"New contact submission: {data}")
        
        return jsonify({
            "status": "success",
            "message": "Thank you for reaching out! We'll get back to you within 24 hours."
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/services', methods=['GET'])
def get_services():
    """Return list of services"""
    services = {
        "students": [
            {"id": 1, "name": "Documentation", "description": "SRS, UML, Reports"},
            {"id": 2, "name": "Source Code", "description": "Clean, commented code"},
            {"id": 3, "name": "Explanation", "description": "Viva preparation, walkthrough"},
        ],
        "business": [
            {"id": 1, "name": "Web Design", "description": "Modern, responsive websites"},
            {"id": 2, "name": "SEO", "description": "Search engine optimization"},
            {"id": 3, "name": "MVP Development", "description": "Fast prototyping"},
        ]
    }
    return jsonify(services)

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    """Return portfolio projects"""
    projects = [
        {"id": 1, "title": "E-Commerce Platform", "tags": ["React", "Node.js"]},
        {"id": 2, "title": "AI Chatbot", "tags": ["Python", "TensorFlow"]},
        {"id": 3, "title": "Healthcare Portal", "tags": ["React", "Django"]},
    ]
    return jsonify(projects)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
