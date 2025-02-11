const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'deeadcger',
    api_key: 135543718884773,
    api_secret: 'FNo7GbZ9NKz_w8lnDNHKKji_2zQ'
})
console.log('successfully connected to cloudinary')

module.exports = cloudinary;