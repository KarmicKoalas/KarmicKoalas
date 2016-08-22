# We Go Too![](/landing/assets/logo.png)

We Go Too is an IOS app which provides a social layer on top of maps' functionality, allowing users to create routes, search for existing routes around the world and invite friends to join them on those routes, with a real time GPS and chat connection. WeGoToo was conceived of by a team of four full-stack software engineers: [Rebecca Gray](https://github.com/rebeccagray), [Konstantin Zamaraev](https://github.com/zamaraevk), [Alexius Hale-Dubuque](https://github.com/alexiushaledubuque), and [Bohee Park](https://github.com/boheepark)

#####[Visit the app](http://WeGoToo.herokuapp.com/)

## Tech Stack
![Tech Stack](/landing/assets/wegotootechstack.001.jpeg)

## Architecture
![Architecture](/landing/assets/WeGoToo.001.jpeg)

## Features
- General Features
  - IOS Client
  - RESTful API
  - MySql relational database
- Map Features
  - Draw or record a route
  - Post the route to our database
  - Search for a route by keyword
- Social Features
  - Create an event to share a route with other users
  - Invite users to join a private event via email
  - Manage your upcoming events
- Real-time Features
  - Join your friends in a scheduled event
  - See invited users GPS locations in real time on your device
  - Message invited users within the event in real time


## Future Features
- Update the phone calendar or google calendars with planned events
- Search routes by proximity on a heat map
- Rate routes, and sort by ranking
- Integrate Google Places to provide information about points of interest and photos
- Integrate Yelp to provide information about local restaurants and services
- Integrate voice activated control and messaging
- Create custom interfaces for special interest groups
- Android deployment

## Setup
During development, we have the server running on localhost port 8000, but before running locally, be sure to run:
- `npm install` to install our dependencies
- create a mySql database using the structure in the server/db/config.js file

We used the [dotenv](https://github.com/bkeepers/dotenv) npm package to configure our development variables. Create a config.env file in the server directory with the following variables and their values:
DB_HOST
DB_USER
DB_PASS
DB_NAME
GOOGLE_MAPS_API
NODEMAILER


## Contributing
Please refer to the [CONTRIBUTING.md](docs/CONTRIBUTING.md) file to see how to contribute to our project.

## Style Guide
Please refer to the [STYLE-GUIDE.md](docs/STYLE-GUIDE.md) file to see our style guide.

## Testing
For server-side testing, we used Mocha and Require. To run all tests:
```
start the local server and run npm test

```

## Team
We are a team of 4 full-stack software engineers. If you have any questions, please feel free to contact us!

[Rebecca Gray](https://www.linkedin.com/in/rebeccagray) | [Github](https://github.com/rebeccagray)

[Konstantin Zamaraev](https://www.linkedin.com/in/zamaraevk) | [Github](https://github.com/zamaraevk)

[Alexius Hale-Dubuque](https://www.linkedin.com/in/alexiushaledubuque) | [Github](https://github.com/alexiushaledubuque)

[Bohee Park](https://www.linkedin.com/in/boheepark) | [Github](https://github.com/boheepark)
