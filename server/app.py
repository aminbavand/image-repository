from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import psycopg2
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt#for creating the token (stands for JSON web token)
from functools import wraps
import datetime
import base64
import os
from s3_demo import list_files, download_file, upload_file, delete_file



UPLOAD_FOLDER = "images"
BUCKET = "elasticbeanstalk-us-east-2-710852728941"


app = Flask(__name__)


pguser = os.environ['PGUSER']
pgpass = os.environ['PGPASSWORD']
pgdb = os.environ['PGDATABASE']
pghost = os.environ['PGHOST']


app.config['SECRET_KEY'] = 'secretkey12345'#the key we use to send info
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + pguser + ':' + pgpass + '@' + pghost + '/' + pgdb
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres_password@db/postgres'
db = SQLAlchemy(app)




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)#primary key is unique. id: 1,2,3,4,...
    public_id = db.Column(db.String(50))
    name = db.Column(db.String(50))
    password = db.Column(db.String(80))
    admin = db.Column(db.Boolean)
    imagesNumNow = db.Column(db.Integer)#number of the current user's available images in the server
    imagesNumAll = db.Column(db.Integer)#number of the current users all uploads

class ImagesInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50))
    name = db.Column(db.String(60))





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
        user_data['images'] = user.imagesNumNow
        output.append(user_data)

    return jsonify({'users': output})




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
    if not current_user.admin and (current_user.public_id != public_id):
        return jsonify({'message' : 'Cannot perform that function!'})

    user = User.query.filter_by(public_id=public_id).first()

    if not user:
        return jsonify({'message' : 'no user found'})

    user_data = {}
    user_data['public_id'] = user.public_id
    user_data['name'] = user.name
    user_data['password'] = user.password
    user_data['admin'] = user.admin
    user_data['images'] = user.imagesNumNow

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




# @app.route('/imageupload', methods=['POST'])
# @token_required
# def image_upload(current_user):

#     data = request.files['myImage']
    
#     imgname = current_user.public_id + str(current_user.imagesNumAll)
    
#     imagestr = './images/' + imgname + '.png'
    
#     data.save(imagestr)

#     new_image = ImagesInfo(public_id=current_user.public_id, name=imgname)
#     current_user.imagesNumAll = current_user.imagesNumAll + 1
#     current_user.imagesNumNow = current_user.imagesNumNow + 1

#     db.session.add(new_image)
#     db.session.commit()

#     return jsonify({'message' : 'Image Uploaded!'})



@app.route('/imageupload', methods=['POST'])
@token_required
def image_upload(current_user):

    f = request.files['myImage']
    imgname = current_user.public_id + str(current_user.imagesNumAll)
    imagestr = imgname + '.png'
    f.save(os.path.join(UPLOAD_FOLDER, imagestr))
    imgadrs = "images/" + imagestr
    upload_file(imgadrs, BUCKET)


    new_image = ImagesInfo(public_id=current_user.public_id, name=imgname)
    current_user.imagesNumAll = current_user.imagesNumAll + 1
    current_user.imagesNumNow = current_user.imagesNumNow + 1

    db.session.add(new_image)
    db.session.commit()

    return jsonify({'message' : 'Image Uploaded!'})



@app.route('/get_images_names/<public_id>', methods=['GET'])
@token_required
def get_images_names(current_user,public_id):

    images = ImagesInfo.query.filter_by(public_id=public_id).all()
    names = []
    for image in images:
        name = image.name
        names.append(name)

    return jsonify({'images_names' : names})



# @app.route('/get_images/<public_id>/<imagename>', methods=['GET'])
# @token_required
# def get_images(current_user,public_id,imagename):
    
#     imagestr = './images/' + imagename + '.png'
#     with open(imagestr, "rb") as img_file:
#         my_string = base64.b64encode(img_file.read())

#     return jsonify({'image_url' : my_string.decode('utf-8')})



@app.route('/get_images/<public_id>/<imagename>', methods=['GET'])
@token_required
def get_images(current_user,public_id,imagename):
    

    imagestr = imagename + ".png"

    output = download_file(imagestr, BUCKET)
    
    with open(output, "rb") as img_file:
        my_string = base64.b64encode(img_file.read())

    return jsonify({'image_url' : my_string.decode('utf-8')})




# @app.route('/imagedelete', methods=['POST'])
# @token_required
# def image_delete(current_user):
    
#     data = request.get_json()
    
#     imagestr = './images/' + data["deletename"] + '.png'
#     os.remove(imagestr)
    
#     image = ImagesInfo.query.filter_by(name=data["deletename"]).first()

#     current_user.imagesNumNow = current_user.imagesNumNow -1

#     db.session.delete(image)
#     db.session.commit()

#     imagestr = data["deletename"] + ".png"

#     return jsonify({'message' : imagestr})


@app.route('/imagedelete', methods=['POST'])
@token_required
def image_delete(current_user):
    
    data = request.get_json()
    
    image = ImagesInfo.query.filter_by(name=data["deletename"]).first()

    current_user.imagesNumNow = current_user.imagesNumNow -1

    db.session.delete(image)
    db.session.commit()

    imagestr = data["deletename"] + ".png"
    delete_file(imagestr, BUCKET)

    return jsonify({'message' : imagestr})






@app.route('/login', methods=['POST'])
def login():


    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401)


    user = User.query.filter_by(name=auth.username).first()


    if not user:
        return make_response('Could not verify', 401)

    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'public_id' : user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])

        return jsonify({'token' : token, 'publicID': user.public_id})

    return make_response('Could not verify', 401)







@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()


    exists = db.session.query(db.exists().where(User.name == data['username'])).scalar()
    if exists is True:
        return make_response('Could not verify', 401)

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(public_id=str(uuid.uuid4()), name=data['username'], password=hashed_password, admin=False, imagesNumAll=0, imagesNumNow=0)

    db.session.add(new_user)
    db.session.commit()



    token = jwt.encode({'public_id' : new_user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])



    return jsonify({'token' : token, 'publicID': new_user.public_id})




@app.route('/test1', methods=['GET'])
def test_api1():    
    return jsonify({'message':'Hello'})

# @app.route('/test2', methods=['GET'])
# def test_api2():    
#     pguser = os.environ['PGUSER']
#     pgpass = os.environ['PGPASSWORD']
#     pgdb = os.environ['PGDATABASE']
#     pghost = os.environ['PGHOST']

#     a = 'postgresql://' + pguser + ':' + pgpass + '@' + pghost + '/' + pgdb
#     return jsonify({'message':a})




@app.route('/createdatabase', methods=['GET'])
def database_creation():    
    db.create_all()
    return jsonify({'message':'database created'})


@app.route('/deletedatabase', methods=['GET'])
def tables_deletion():    
    db.drop_all()
    return jsonify({'message':'tables deleted'})


# @app.route('/firstadmin/<public_id>', methods=['GET'])
# def first_admin(public_id):

#     user = User.query.filter_by(public_id=public_id).first()

#     if not user:
#         return jsonify({'message' : 'No user found!'})

#     user.admin = True
#     db.session.commit()

#     return jsonify({'message' : 'The user has been promoted!'})





if __name__ == '__main__':

    app.run(host='0.0.0.0',debug=True)