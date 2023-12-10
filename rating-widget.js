  customElements.define('rating-widget', class extends HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });

      const widgetBox = document.createElement('div');

      const resultMessage = document.createElement('p');
      resultMessage.textContent = '';

      widgetBox.appendChild(resultMessage);

      const starsSpan = document.createElement('span');

      for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = '★';
        star.setAttribute('data-rating', i + 1);
        starsSpan.appendChild(star);
      }

      widgetBox.appendChild(starsSpan);

      shadow.appendChild(widgetBox);

      starsSpan.addEventListener('mouseover', (event) => {
        const ratingNum = event.target.getAttribute('data-rating');
        this.updateRating(ratingNum);
      });
  
      starsSpan.addEventListener('mouseout', () => {
        const currentRating = this.querySelector('input[name="rating"]').value;
        this.updateRating(currentRating);
      });
  

      starsSpan.addEventListener('click', (event) => {
        const ratingNum = event.target.getAttribute('data-rating');

        if (ratingNum) {

            this.querySelector('input[name="rating"]').value = ratingNum;

            //this.querySelector('input[name="sentBy"]').value = 'JS';

            const headers = new Headers();
            headers.append('X-Sent-By', 'JavaScript');


            this.updateRating(ratingNum);
            this.updateMessage(ratingNum);


            const form = this.querySelector('form');
            const formData = new FormData(form);
            formData.append('sentBy', 'JS');

            fetch(form.action, {
                method: 'post',
                headers: headers,
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                console.log('Server response:', data);
                })
                .catch(error => {
                console.error('Error:', error);
            });


        }
 


      });


      // CSS style for the stars and the header
      const style = document.createElement('style');
      style.textContent = `
        span {
          cursor: pointer;
          font-size: 40px;
        }
        p {
            font-size:20px;
            font-family: cursive;
            margin: 0;
        }
      `;

      shadow.appendChild(style);
    }



    updateMessage(ratingNum) {
        const paragrah = this.shadowRoot.querySelector('p');
        if(ratingNum < 4) {
            paragrah.textContent = 'Thanks for the ' + ratingNum + ' stars rating!';
            paragrah.textContent = 'Thanks for your feedback of ' + ratingNum + ' stars. We\'ll try to do better!';
        }
        else{
            paragrah.textContent = 'Thanks for the ' + ratingNum + ' stars rating!';
        }
    }


    updateRating(ratingNum) {
      const stars = this.shadowRoot.querySelectorAll('span[data-rating]');

      stars.forEach(star => {
        const rating = star.getAttribute('data-rating');
        if(rating <= ratingNum) {
            star.style.color = 'gold';
        }
        else{
            star.style.color = 'gray';
        }
      });
    }

  });



customElements.define('weather-widget', class extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                span{
                    margin-right: 6px;
                    font-family: Helvetica;
                    font-size: 20px;
                }

                #weather_container{
                    border:3px solid yellow;
                    border-radius:20px;
                    display: inline-block;
                    background-color: Beige;
                    padding: 10px;
                    text-align: center;

                }
                h2{
                    border: 0px;
                    padding: 0px;
                    margin: 0px;
                    font-family: Lucida Handwriting;
                    color: DeepSkyBlue;
                
                }
                #condition, #tem {
                    color: LightSalmon;
                }
                #hum{
                    color:DodgerBlue;
                }
                #wind{
                    color: BurlyWood;
                }

            </style>
            <div id="weather_container">
                <h2>Curent Weather</h2>
                <img id="weather_icon" src="" alt="Weather Icon">
                <br>
                <span id="condition"></span>
                <span id="tem"></span>
                <span id="hum"></span>
                <br>
                <span id="wind"></span>
            </div>
            `


        shadow.appendChild(template.content.cloneNode(true));

        const conditionP = shadow.querySelector('span[id="condition"]');
        const iconW = shadow.querySelector('img');
        const temP = shadow.querySelector('span[id="tem"]');
        const humP = shadow.querySelector('span[id="hum"]');
        const windP = shadow.querySelector('span[id="wind"]');

        const apiUrl = `https://api.weather.gov/gridpoints/SGX/53,20/forecast`;

        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const currentWeather = data.properties.periods[0];

            const temperature = currentWeather.temperature + " " + currentWeather.temperatureUnit;
            const conditions = currentWeather.shortForecast;
            const wind = currentWeather.windSpeed + " " + currentWeather.windDirection;
            const humidity = "Humidity " + currentWeather.relativeHumidity.value + "%";
            const iconUrl = currentWeather.icon;

            conditionP.innerHTML = conditions;
            temP.innerHTML = temperature;
            windP.innerHTML = 'Wind ' + wind;
            humP.innerHTML = humidity;
            iconW.src = iconUrl;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-widget').innerHTML = 'Current Weather Conditions Unavailable';
        });

    }

});