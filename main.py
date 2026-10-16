from flask import Flask,request,jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

@app.route('/backend',methods=['POST'])
def authorise() :

    data = request.get_json()
    username = data.get('username','').strip()
    password = data.get('password','')
    action = data.get('action', '') 

    if not username or not password:
        return jsonify({'message': 'Please enter the blank'})
    
    db = sqlite3.connect('accounts.db')
    db.execute('CREATE TABLE IF NOT EXISTS accounts(username TEXT UNIQUE, password TEXT)')
    c = db.cursor()
    c.execute('SELECT password FROM accounts where username = ?',(username,))
    row =c.fetchone()

    if action == 'register':
        if row is not None:
            db.close()
            return jsonify({'success':False,'message':'account already exists'})
        hash = generate_password_hash(password)
        c.execute('INSERT INTO accounts VALUES(?,?)',(username,hash))
        db.commit()
        db.close()
        return jsonify({'success':True,'message': 'registered successfully'})
    
    elif action == 'login':
        db.close()
        if row is None or not check_password_hash(row[0],password):
            return jsonify({'message': 'incorrect username or password', 'success':False})
        return jsonify({'message':'Login successfull!', 'success': True})
    else:
        db.close()
        return({'error':'invalid action'})
        
if __name__ == '__main__' :
    app.run(port=5000,debug=True)
        
            
