import os
from flask import Flask
from flask_cors import CORS
from config import config

def create_app(config_name=None):
    """Application factory for Flask app."""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Setup CORS
    CORS(app, origins=app.config.get('CORS_ORIGINS', ['http://localhost:5173']))
    
    # Register blueprints
    from routes.api import api_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(api_bp)
    app.register_blueprint(admin_bp)
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Project Forge API is running'}
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
