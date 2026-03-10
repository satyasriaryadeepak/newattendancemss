from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Employee
import jwt
import datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = 'super-secret-key-mssquare'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            if 'Bearer ' in token:
                token = token.split(' ')[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = Employee.query.filter_by(employee_id=data['employee_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('employee_id') or not data.get('password'):
        return jsonify({'message': 'Missing credentials'}), 400

    user = Employee.query.filter_by(employee_id=data.get('employee_id')).first()

    if not user:
        return jsonify({'message': 'User not found'}), 401

    if check_password_hash(user.password_hash, data.get('password')):
        token = jwt.encode({
            'employee_id': user.employee_id,
            'is_admin': user.is_admin,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({
            'token': token,
            'user': {
                'name': user.name,
                'employee_id': user.employee_id,
                'is_admin': user.is_admin
            }
        })

    return jsonify({'message': 'Wrong password'}), 401

@auth_bp.route('/init-admin', methods=['POST'])
def init_admin():
    # Helper to create the first admin if none exists
    if Employee.query.filter_by(is_admin=True).first():
        return jsonify({'message': 'Admin already exists'}), 400
    
    hashed_password = generate_password_hash('admin123', method='pbkdf2:sha256')
    new_admin = Employee(employee_id='ADMIN01', name='Admin', password_hash=hashed_password, is_admin=True)
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({'message': 'Admin created successfully'})
