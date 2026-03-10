from flask import Blueprint, request, jsonify
from models import db, Employee, Attendance
from routes.auth import token_required
from datetime import datetime

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/status', methods=['GET'])
@token_required
def get_status(current_user):
    today = datetime.utcnow().date()
    record = Attendance.query.filter_by(employee_id=current_user.employee_id, date=today).first()
    
    if not record:
        return jsonify({
            'employee_id': current_user.employee_id,
            'name': current_user.name,
            'status': 'Absent',
            'check_in': None,
            'check_out': None
        })
    
    return jsonify({
        'employee_id': current_user.employee_id,
        'name': current_user.name,
        'status': record.status,
        'check_in': record.check_in.strftime('%H:%M:%S') if record.check_in else None,
        'check_out': record.check_out.strftime('%H:%M:%S') if record.check_out else None
    })

@attendance_bp.route('/check-in', methods=['POST'])
@token_required
def check_in(current_user):
    today = datetime.utcnow().date()
    record = Attendance.query.filter_by(employee_id=current_user.employee_id, date=today).first()
    
    if record and record.check_in:
        return jsonify({'message': 'Already checked in today'}), 400
    
    now = datetime.utcnow()
    if not record:
        record = Attendance(
            employee_id=current_user.employee_id,
            date=today,
            check_in=now,
            status='Present'
        )
        db.session.add(record)
    else:
        record.check_in = now
        record.status = 'Present'
    
    db.session.commit()
    return jsonify({'message': 'Checked in successfully at ' + now.strftime('%H:%M:%S')})

@attendance_bp.route('/check-out', methods=['POST'])
@token_required
def check_out(current_user):
    today = datetime.utcnow().date()
    record = Attendance.query.filter_by(employee_id=current_user.employee_id, date=today).first()
    
    if not record or not record.check_in:
        return jsonify({'message': 'Must check in before checking out'}), 400
    
    if record.check_out:
        return jsonify({'message': 'Already checked out today'}), 400
    
    now = datetime.utcnow()
    record.check_out = now
    db.session.commit()
    return jsonify({'message': 'Checked out successfully at ' + now.strftime('%H:%M:%S')})
