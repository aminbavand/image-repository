from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import psycopg2


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres_password@db/postgres'
db = SQLAlchemy(app)




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)#primary key is unique. id: 1,2,3,4,...
    name = db.Column(db.String(50))
    password = db.Column(db.String(80))
    # admin = db.Column(db.Boolean)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(50))
    complete = db.Column(db.Boolean)


@app.route('/createdatabase', methods=['GET'])
def database_creation():    
    db.create_all()
    return jsonify({'message':'database created'})



# @app.route('/login', methods=['GET'])
# def get_all_users():

#     users = User.query.all()

#     output = []

#     for user in users:
#         user_data = {}
#         user_data['name'] = user.name
#         user_data['password'] = user.password
#         # user_data['admin'] = user.admin
#         output.append(user_data)

#     return jsonify({'users': output})




@app.route('/last-user-info', methods=['GET'])
def get_all_users():

    users = User.query.all()
    output = []

    user = users[-1]
    user_data = {}
    user_data['name'] = user.name
    user_data['password'] = user.password
    # user_data['admin'] = user.admin
    output.append(user_data)

    return jsonify({'users': user_data})



@app.route('/login', methods=['POST'])
def hello111():    
    data = request.get_json()

    new_user = User(name=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message' : data['username']})


if __name__ == '__main__':

    app.run(host='0.0.0.0')



