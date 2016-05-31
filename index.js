'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am the Sorting Hat! Ah, another Weasley!')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    let sender = event.sender.id
    if (event.message && event.message.text) {
      let text = event.message.text
      if (text === 'Generic') {
          sendGenericMessage(sender)
          continue
      }
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
    }
    if (event.postback) {
      let text = JSON.stringify(event.postback)
      sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
      continue
    }
  }
  res.sendStatus(200)
})

const token = "EAAPsaXrP4nABAEBqegtqaJPD8IqxCXZAkp5WSyTxllVfHFlVoTMiZBXNYYfLJx6tzqMK3ZCMrYZAEkWdD5lP8gGcnpvVVBx5g9gACf386ZAZCL7YxK8zCggZCNusVv60qrUxGqkffT55ESQaWkaQyeCNSdIrNjlB2awRpIBTOXigQZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Gryffindor!",
                    "subtitle": "Oh, another Weasley!",
                    "image_url": "http://66.media.tumblr.com/675069de1700426362c8f4f934d96161/tumblr_inline_n1sirqxtib1r31u6a.gif",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://pottermore.wikia.com/wiki/Gryffindor",
                        "title": "Aparecium"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Slytherin!",
                    "subtitle": "Slytherin will help you on the way to greatness",
                    "image_url": "https://images.pottermore.com/bxd3o8b291gf/5fWByiKsHmU6ccYQ6oqAWk/941bc4445349e194bfa61eaa578f39e7/Slytherin-PM-Crest.jpg?w=1200",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://pottermore.wikia.com/wiki/Slytherin",
                        "title": "Aparecium"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                },

                {
                    "title": "Ravenclaw!",
                    "subtitle": "Wit beyond measure is man's greatest treasure",
                    "image_url": "https://lh3.googleusercontent.com/-SEooZ27bQFY/VRhYQq7KqnI/AAAAAAAABI4/dtdiD7J3tqA/w960-h960/Ravenclaw%2B-%2BKerby%2BRosanes-done.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://pottermore.wikia.com/wiki/Ravenclaw",
                        "title": "Aparecium"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                },

                {
                    "title": "Hufflepuff",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://img05.deviantart.net/2ebe/i/2014/155/8/4/hufflepuff_crest_by_chromomaniac-d7l0e4k.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://pottermore.wikia.com/wiki/Hufflepuff",
                        "title": "Aparecium"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
