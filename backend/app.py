from flask import Flask
from flask_cors import CORS
from models import db
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.attendance import attendance_bp
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///attendance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-key-mssquare'

# Initialize Database
db.init_app(app)

with app.app_context():
    db.create_all()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(attendance_bp, url_prefix='/api/attendance')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
