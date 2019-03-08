# EPIC-Mail [App](https://neorusse.github.io/epic-mail/)

## Project Description

A web [app](https://neorusse.github.io/epic-mail/) that helps people exchange messages/information over the internet.

## Table of Content

[Features](#features)<br/>
[Optional Features](#optional-features)<br/>
[Project Management](#project-management)<br/>
[Technology Used](#technology-used)<br/>
[Installation](#installation)<br/>
[API End Points](#api-end-points)<br/>
[License](#license)<br/>
[Credits](#credits)<br/>
[Author](#author)

## Features

Users can sign up.<br/>
Users can login.<br/>
Users can create groups.<br/>
Users can send a message to individuals.<br/>
Users can view their inbox and read messages.<br/>
Users can retract sent messages.<br/>
Users can save an email as draft and send it later or delete it.

## Optional Features

User can reset password.<br/>
Integrate Twilio and deliver messages via SMS.<br/>
Users can upload a profile photo.

## Project Management

Project is managed with [Pivotal Tracker](https://www.pivotaltracker.com) and can be accessed via this link [EPICMail](https://www.pivotaltracker.com/n/projects/2314418).

## Technology Used

## Installation

## API End Points

<table>

<tr><th>HTTP VERB</th><th>ENDPOINT</th><th>FUNCTIONALITY</th></tr>
<tr><td>POST</td> <td>api/v1/auth/signup</td>  <td>Enable user to signup</td></tr>

<tr><td>POST</td> <td>api/v1/auth/signin</td>  <td>Enable user to signup</td></tr>

<tr><td>POST</td> <td>api/v1/messages</td>  <td>Enable user to send email</td></tr>

<tr><td>GET</td> <td>api/v1/messages</td> <td>Retrieve all received emails</td></tr>

<tr><td>GET</td> <td>api/v1/messages/unread</td> <td>Retrieve all received unread emails</td></tr>

<tr><td>GET</td> <td>api/v1/messages/sent</td> <td>Retrieve all received sent emails</td></tr>

<tr><td>GET</td> <td>api/v1/messages/:id</td> <td>Retrieve a single sent email<td></tr>

<tr><td>DELETE</td> <td>api/v1/messages/:id</td> <td>Delete an email<td></tr>

</table>

## License

## Credits

[Build A RESTful Api With Node.js And Express.js Part One - Ayobami Adelakun](https://medium.com/@purposenigeria/build-a-restful-api-with-node-js-and-express-js-d7e59c7a3dfb)

## Author

[Russell Nyorere](https://neorusse.github.io/)
