require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  //console.log(req.body.cityName);
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    " &" +
    unit +
    "&appid=" +
    apiKey;
  https.get(url, function (response) {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL =
          "https://openweathermap.org/img/wn/" + icon + "@2x.png";

        //console.log(temp);
        res.write(
          "<h1>The Temperature in " +
            query +
            " is " +
            temp +
            " degree Celcius.</h1>"
        );
        res.write("<p>The Weather is currently " + description + ".</p>");
        res.write("<img src=" + imageURL + ">");
        res.send();
        // console.log(weatherData);
      });
    } else {
      res.write("Omfooo!!");
    }
  });
});

app.listen(3000 || process.env.PORT, function () {
  console.log("server is runnning");
});
