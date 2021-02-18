from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import psycopg2
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt#for creating the token (stands for JSON web token)
from functools import wraps
import datetime


app = Flask(__name__)

app.config['SECRET_KEY'] = 'secretkey12345'#the key which we use to send info
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres_password@db/postgres'
db = SQLAlchemy(app)




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)#primary key is unique. id: 1,2,3,4,...
    public_id = db.Column(db.String(50))
    name = db.Column(db.String(50))
    password = db.Column(db.String(80))
    admin = db.Column(db.Boolean)






def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try: 
            # data = jwt.decode(token, app.config['SECRET_KEY'])
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms="HS256")
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated





@app.route('/user', methods=['GET'])
@token_required
def get_all_users(current_user):
    if not current_user.admin:
        return jsonify({'message' : 'Cannot perform that function!'})

    users = User.query.all()

    output = []

    for user in users:
        user_data = {}
        user_data['public_id'] = user.public_id
        user_data['name'] = user.name
        user_data['password'] = user.password        
        user_data['admin'] = user.admin
        output.append(user_data)

    return jsonify({'users': output})




@app.route('/user', methods=['DELETE'])
@token_required
def delete_all_users(current_user):
    if not current_user.admin:
        return jsonify({'message' : 'Cannot perform that function!'})

    users = User.query.all()

    for user in users:
        db.session.delete(user)

    db.session.commit()

    return jsonify({'message' : 'All users have been deleted!'})




@app.route('/user/<public_id>', methods=['PUT'])
@token_required
def promote_user(current_user, public_id):
    if not current_user.admin:
        return jsonify({'message' : 'Cannot perform that function!'})

    user = User.query.filter_by(public_id=public_id).first()

    if not user:
        return jsonify({'message' : 'No user found!'})

    user.admin = True
    db.session.commit()

    return jsonify({'message' : 'The user has been promoted!'})



@app.route('/user/<public_id>', methods=['GET'])
@token_required
def get_one_user(current_user,public_id):
    # if not current_user.admin and current_user.public_id is not public_id:
    #     return jsonify({'message' : 'Cannot perform that function!'})

    user = User.query.filter_by(public_id=public_id).first()

    if not user:
        return jsonify({'message' : 'no user found'})

    user_data = {}
    user_data['public_id'] = user.public_id
    user_data['name'] = user.name
    user_data['password'] = user.password
    user_data['admin'] = user.admin

    return jsonify({'user' : user_data})




@app.route('/user/<public_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, public_id):
    if not current_user.admin and current_user.public_id is not public_id:
        return jsonify({'message' : 'Cannot perform that function!'})


    user = User.query.filter_by(public_id=public_id).first()

    if not user:
        return jsonify({'message' : 'no user found'})

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message' : 'The user has been deleted!'})




@app.route('/imageupload', methods=['POST'])
def image_upload():

    data = request.files['myImage']
    imagestr = './images/' + data.name
    data.save(imagestr)

    return jsonify({'message' : 'The user has been deleted!'})










@app.route('/last-user-info', methods=['GET','POST'])
def last_user():
    if request.method=='POST':
        data = request.get_json()

        hashed_password = generate_password_hash(data['password'], method='sha256')

        new_user = User(public_id=str(uuid.uuid4()), name=data['username'], password=hashed_password, admin=False)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message' : 'The user has been created!'})

    if request.method=='GET':
        users = User.query.all()
        output = []

        user = users[-1]
        user_data = {}
        user_data['name'] = user.name
        user_data['password'] = user.password
        user_data['admin'] = user.admin
        output.append(user_data)

        return jsonify({'users': user_data})

    




@app.route('/login', methods=['POST'])
def login():


    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401)


    user = User.query.filter_by(name=auth.username).first()


    if not user:
        return make_response('Could not verify', 401)

    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'public_id' : user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=0.2)}, app.config['SECRET_KEY'])

        return jsonify({'token' : token, 'publicID': user.public_id})

    return make_response('Could not verify', 401)







@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(public_id=str(uuid.uuid4()), name=data['username'], password=hashed_password, admin=False)

    db.session.add(new_user)
    db.session.commit()



    token = jwt.encode({'public_id' : new_user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=0.2)}, app.config['SECRET_KEY'])



    return jsonify({'token' : token, 'publicID': new_user.public_id})








@app.route('/createdatabase', methods=['GET'])
def database_creation():    
    db.create_all()
    return jsonify({'message':'database created'})


@app.route('/deletedatabase', methods=['GET'])
def tables_deletion():    
    db.drop_all()
    return jsonify({'message':'tables deleted'})


if __name__ == '__main__':

    app.run(host='0.0.0.0',debug=True)



