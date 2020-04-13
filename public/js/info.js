// JavaScript Document

//self executing anonymous function
(function () {
    "use strict";
    let newsUrl = 'https://newsapi.org/v2/top-headlines?apiKey=42e54a01fdc844a3be2f81bd21073306&country=ca';
    let weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=e7b467b78cd7cea3b40036b2cbba06c9';
    let newsList = [];
    let newsContainer = document.querySelector('#news-container');

    console.log("fired");

    function loadNews(url, callback) {
        var fetchData = {
            method: 'GET'
        }
        fetch(url, fetchData)
            .then(res => res.json())
            .then(
                res => {
                    res.articles.forEach(function (item, index) {
                        newsList.push(item);
                    });
                    callback();
                }
            );
    }

    function loadWeather(url, callback) {
        var fetchData = {
            method: 'GET'
        }
        fetch(url, fetchData)
            .then(res => res.json())
            .then(
                res => {
                    callback(res);//call(res.weather)
                    //console.log(res.weather);
                }
            );
    }


    function displayNews(data) {
        let newsContainer = document.querySelector("#news-container");
        newsList = newsList.slice(0, 3);
        newsList.forEach(function (item, index) {
            let template = document.getElementById('news-template').content.cloneNode(true);
            template.querySelector('.news-item-title').innerHTML = item.title;
            template.querySelector('.news-item-description').innerHTML = item.description;
            template.querySelector('.news-item-image').style.backgroundImage = `url(${item.urlToImage})`;
            //console.log(item.urlToImage);

            newsContainer.appendChild(template);
        });
    }

    function displayWeather(data) {
        let reading = document.querySelector("#weather-reading");
        let temp = document.querySelector("#weather-temp");
        let feel = document.querySelector("#weather-feel");
        let imageContainer = document.querySelector("#weather-icon");

        let forecast = data.weather[0];
        if (forecast) {
            reading.innerHTML = forecast.main;
            temp.innerHTML = data.main.temp + ' ℃';
            feel.innerHTML = data.main.feels_like + ' ℃';
            
        }

        let imgUrl = `http://openweathermap.org/img/w/${forecast.icon}.png`;
        imageContainer.style.backgroundImage = `url(${imgUrl})`;

        console.log(data);
    }


    loadNews(newsUrl, displayNews);
    loadWeather(weatherUrl, displayWeather);
})();