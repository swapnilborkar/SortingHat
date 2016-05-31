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
      if (text === 'Sort') {
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
                    "image_url": "http://i.imgur.com/BiKN0Lc.png?1",
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
                    "image_url": "http://i.imgur.com/O9MDCug.png?1",
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
                    "image_url": "http://i.imgur.com/H6ghdKt.png?1",
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
                    "image_url": "http://i.imgur.com/dnXs5K0.png?1",
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
