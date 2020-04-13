// JavaScript Document

//self executing anonymous function
(function () {
    "use strict";
    let newsUrl = 'https://newsapi.org/v2/top-headlines?apiKey=42e54a01fdc844a3be2f81bd21073306&country=ca';
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


    function displayNews() {
        let newsContainer = document.querySelector("#news-container");
        newsList = newsList.slice(0, 5);
		newsList.forEach(function (item, index) {
            let template = document.getElementById('news-template').content.cloneNode(true);
            template.querySelector('.news-item-title').innerHTML = item.title;
            template.querySelector('.news-item-description').innerHTML = item.description;
            template.querySelector('#news-item-image').style.backgroundImage = `url(${item.urlToImage})`;
            console.log(item.urlToImage);
            
			newsContainer.appendChild(template);
		});
    }

    loadNews(newsUrl, displayNews);
})();