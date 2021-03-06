var request = require('request');
var express = require('express'),
    router = express.Router();

var INSTAGRAM_URL = 'https://api.instagram.com/oauth/access_token'
var CLIENT_ID = '42fbdc7bccea4ae79de1e006299c16f6'
var CLIENT_SECRET = 'fff93c2f2f714a3490c707beea73b711'
var REDIRECT_URL = 'https://instagate.dotcloudapp.com/redirect'
var JSONoutput = ''
var access_token = ''
var baseURI = 'https://api.instagram.com/v1/media/popular?access_token='

exports.getInstaGateHome = function (req, res) {

    res.render('pages/index');

};

exports.handleRedirect = function (req, res) {

    var CODE = req.query.code
    var access_token = '', profile_picture = '', id = '', full_name = '', username = ''
    console.log('code: ', CODE);
    console.log('request POST with the Code to : ', INSTAGRAM_URL);
    request({
        url: INSTAGRAM_URL, //INSTAGRAM_URL to hit
        method: 'POST',
        form: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URL,
            code: CODE
        }
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            console.log('Error: ' + error);
            console.log('Invalid Status Code Returned:', response.statusCode);
        } else {
            JSONoutput = JSON.parse(body.toString());
            id = JSONoutput.user.id
            username = JSONoutput.user.username
            full_name = JSONoutput.user.full_name
            access_token: JSONoutput.access_token
            console.log('JSONoutput: ', JSONoutput.access_token);
            URI = baseURI + JSONoutput.access_token;
            console.log("request GET  : ", URI);

            request(URI, function (error, response, body) {
                if (error || response.statusCode != 200) {
                    console.log('Error:', error);
                    console.log('Invalid Status Code Returned:', response.statusCode);
                }
                else {
                    JSONoutput = JSON.parse(body.toString());
                    res.render('pages/redirect', {
                        profile_picture: profile_picture,
                        id: id,
                        username: username,
                        full_name: full_name,
                        data_array: JSONoutput.data
                    });
                }
            });
        }
    });
};