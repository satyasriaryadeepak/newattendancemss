from flask import Blueprint, request, jsonify
from models import db, Employee, Attendance
from routes.auth import token_required
from werkzeug.security import generate_password_hash
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/employees', methods=['GET'])
@token_required
def get_employees(current_user):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin access required'}), 403
    
    employees = Employee.query.all()
    output = []
    for emp in employees:
        # Check today's status
        today = datetime.utcnow().date()
        attendance = Attendance.query.filter_by(employee_id=emp.employee_id, date=today).first()
        status = attendance.status if attendance else 'Absent'
        
        output.append({
            'id': emp.id,
            'employee_id': emp.employee_id,
            'name': emp.name,
            'is_admin': emp.is_admin,
            'status': status
        })
    return jsonify(output)

@admin_bp.route('/employees', methods=['POST'])
@token_required
def create_employee(current_user):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin access required'}), 403
    
    data = request.get_json()
    if not data or not data.get('employee_id') or not data.get('name') or not data.get('password'):
        return jsonify({'message': 'Missing data'}), 400
    
    if Employee.query.filter_by(employee_id=data.get('employee_id')).first():
        return jsonify({'message': 'Employee ID already exists'}), 400
    
    hashed_password = generate_password_hash(data.get('password'), method='pbkdf2:sha256')
    new_emp = Employee(
        employee_id=data.get('employee_id'),
        name=data.get('name'),
        password_hash=hashed_password,
        is_admin=data.get('is_admin', False)
    )
    db.session.add(new_emp)
    db.session.commit()
    return jsonify({'message': 'Employee created successfully'})

@admin_bp.route('/employees/<int:id>', methods=['DELETE'])
@token_required
def delete_employee(current_user, id):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin access required'}), 403
    
    emp = Employee.query.get(id)
    if not emp:
        return jsonify({'message': 'Employee not found'}), 404
    
    # Also delete their attendance records
    Attendance.query.filter_by(employee_id=emp.employee_id).delete()
    db.session.delete(emp)
    db.session.commit()
    return jsonify({'message': 'Employee deleted successfully'})

@admin_bp.route('/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin access required'}), 403
    
    today = datetime.utcnow().date()
    total_employees = Employee.query.count()
    present_today = Attendance.query.filter_by(date=today, status='Present').count()
    absent_today = total_employees - present_today
    
    return jsonify({
        'total': total_employees,
        'present': present_today,
        'absent': absent_today
    })

@admin_bp.route('/reports', methods=['GET'])
@token_required
def get_reports(current_user):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin access required'}), 403
    
    date_str = request.args.get('date')
    if date_str:
        try:
            filter_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format'}), 400
    else:
        filter_date = datetime.utcnow().date()
        
    records = Attendance.query.filter_by(date=filter_date).all()
    output = []
    for rec in records:
        emp = Employee.query.filter_by(employee_id=rec.employee_id).first()
        output.append({
            'employee_id': rec.employee_id,
            'name': emp.name if emp else 'Unknown',
            'date': rec.date.strftime('%Y-%m-%d'),
            'check_in': rec.check_in.strftime('%H:%M:%S') if rec.check_in else '-',
            'check_out': rec.check_out.strftime('%H:%M:%S') if rec.check_out else '-',
            'status': rec.status
        })
    return jsonify(output)
