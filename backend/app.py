from flask import Flask
from flask_cors import CORS
from auth.routes import auth_bp
from models_sqlite import init_db

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, origins=['http://localhost:5173'])
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    init_db()
    print("Backend server starting on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)