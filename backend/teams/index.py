'''
Business: API для управления хоккейными командами
Args: event с httpMethod, body, queryStringParameters
Returns: JSON с данными команд или результатом операции
'''

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создание подключения к БД"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    # Получение всех команд
    if method == 'GET':
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT * FROM teams ORDER BY position ASC')
        teams = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps([dict(team) for team in teams], default=str)
        }
    
    # Проверка пароля для изменений
    request_headers = event.get('headers', {})
    admin_password = request_headers.get('X-Admin-Password') or request_headers.get('x-admin-password')
    
    if admin_password != 'vmhl2000':
        return {
            'statusCode': 401,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Добавление команды
    if method == 'POST':
        name = body_data.get('name', '')
        logo_url = body_data.get('logo_url', '')
        
        # Получаем максимальную позицию
        cursor.execute('SELECT COALESCE(MAX(position), 0) + 1 AS next_pos FROM teams')
        next_position = cursor.fetchone()['next_pos']
        
        cursor.execute(
            'INSERT INTO teams (name, logo_url, position) VALUES (%s, %s, %s) RETURNING *',
            (name, logo_url, next_position)
        )
        team = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps(dict(team), default=str)
        }
    
    # Обновление команды
    if method == 'PUT':
        team_id = body_data.get('id')
        fields = []
        values = []
        
        for field in ['name', 'logo_url', 'games_played', 'wins', 'losses', 'ot_losses', 'goals_for', 'goals_against', 'points', 'position']:
            if field in body_data:
                fields.append(f'{field} = %s')
                values.append(body_data[field])
        
        if fields:
            values.append(team_id)
            cursor.execute(
                f'UPDATE teams SET {", ".join(fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *',
                values
            )
            team = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps(dict(team) if team else {}, default=str)
            }
    
    # Удаление команды
    if method == 'DELETE':
        team_id = body_data.get('id')
        cursor.execute('DELETE FROM teams WHERE id = %s', (team_id,))
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'success': True})
        }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': headers,
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
