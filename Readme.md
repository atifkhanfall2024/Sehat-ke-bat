# Sehat ki bat
## setup of project 
- making success db connecions with mongodb
- install important packages
- add secret files into env

## setting up of signup
- name
- email with otp 
- passward secured with hash
- phone number
- roles 
- isVerified
- timestamp


## making signup api secure
- done hashing passward
- making sendotp using email
- also valid expireotp in 1 minutes
- otp hash that someone not use it if my data is also leak 

## making verify api also to verify that otp
- using compare function 
- also check if user is prsent in database or not
- also expires date if date.now is greater than expires date
- change status to true if verified

## making login api
- first i verify email and compare passward
- then generate token using jwt and wrap inside in cookies
- then also set that only those users can login who verify you otp 

## now i need of middleware 
- middle ware also done 

## save image or docx in database
- first install a npm package multer
