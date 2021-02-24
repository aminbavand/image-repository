# Image Repository 

This repository contains the code for a simple image repository with react and flask using docker and deployed in AWS elastic beanstalk. The database used for storing users information is postgreSQL from Amazon RDS. The images are stored in Amazon S3 bucket. For managing the database in the server side, Flask-SQLAlchemy is used.

## Getting Started

This project is in progress and this file will keep getting updated based on the last version of the application. If the date of the last commit for this readme.md file is sooner than the other files, the following instructions might not work properly. Sorry for the inconvenience!

### Prerequisites

For running the developement version, please ensure you have Docker installed in your computer. For deploying the project, you need AWS, docker hub, github, and travis-ci accounts.

### Running the Development Version

1. Clone the repository
```
$ git clone git@github.com:aminbavand/image-repository.git
```

2. Check into the cloned repository
```
$ cd image-repository
```

3. The committed code is for the deployment version. To make it suitable for testing the developement version, apply the following changes in ./server/app.py:   1) comment line 29.       2) Uncomment line 30    3)Uncomment lines 164-184     4)Comment line 188-206     5)Uncomment lines 224-232       6)Comment lines 235-247
    

4. Build and run the application with Docker:
```
$ Docker compose up --build
```

5. Open your browser and enter this url to create the database:
```
localhost:3050/api/createdatabase
```

6. Go to this url
```
localhost:3050/home
```

7. Setup an account and upload your images there. Enjoy your image repository!