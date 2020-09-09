# Gymento

## Description

<p>
Gymento is a Gym social media application built to make the communication between trainers and trainees easier.
</p>

- Users can register, login, logout, add, update, and delete photos, videos and descriptions to their profile.
- The front-end is written with React and deployed on Google Firebase
- The back-end is written with Node and deployed on Heroku
- The application uses MongoDB Atlas Cloud Service

## Links

<p>Here is the link to the deployed application: <a href="https://gymento.web.app/" target="_blank" rel="external">Demo</a></p>

## Technical Details

<p>
This application was developed in MERN (MongoDB, Express, React, Node) stack. It utilizes JWT for Authentication and Authorization.
</p>
<p>
Here are the other technical features used in this application: 
</p>

- Hashed Password
- Google Maps and Geocoding API
- React Hooks (useEffect, Custom Hook, useRef, useState)
- React CSS Animation
- Local Storage
- JSON Web Token (JWT)
- Auto login/logout and Token Expiration
- File Upload
- Backend Route Protection with Auth Middleware
- Error Handling
- Backend Deployment on Heroku
- Frontend Deployment on Firebase

## Guideline

1. Just simply go to Authenticate page and if you do not have an accoutn, use the Switch to Signup button and fill and submit the form to create an account.
2. You can go to add places page and add a favorite gym with a picture and description and the address.
3. When a user is sigend in, they can add, remove or edit a place and also view other users' places.
4. When a user signin, the specified token will remain on their local machine for half an hour. During that time, if the user close the page and open it again, they will remain signed in. After half an hour, the user will be logged out automatically due to the expiration time of the token.

## Future Developement

- There is an issue of files being deleted after a certain amount of time when Uploading a file into Heroku or Firebase directly while using the free tier layer. In the future developements, this issue will be resolved using an external Cloud-based storage service such as AWS S3 Buckets or Dropbox API.
- In the current application, the main focus has been on the implementation of Authentication and Authorization and adding the basic functionalities such as file upload and Google Maps and Geocoding APIs. There are more features and functionalities to be added to the project such as live chat, video chat, uploading videos, scheduler, calendar, training tracker, etc.
