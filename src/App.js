import React, { useState } from 'react';
const weatherapi=
{
  key:"221d318cc0324ae117537bff37ce444b",
  base:"https://api.openweathermap.org/data/2.5"
}
const placeApi=
{
  key:"0e3c73cfe8a04598a5e08675379368a4",
  base:"https://api.geoapify.com/v1/geocode/autocomplete?text=Gabelsbergerstr%2014%2C%20Regensburg&format=json&apiKey="
}


function App() {

const [query,setquery]=useState('');
const [weather, setWeather]=useState('');
let [placelist, setplacelist]=useState([]);
const[country, setCountry]=useState('');
const [suggestions, setSuggestions]=useState([]);

const kelvintoc= (k)=>
{
  return k-273.15;
} 

//fires up when clicked enter on the search bar
const search = async evt=>
{
  try
  {
    let response;
    let result;
  if(evt.key==="Enter")
  {
    response= await fetch(`${weatherapi.base}/weather?q=${country}&appid=221d318cc0324ae117537bff37ce444b`)
    result= await response.json();
    setWeather(result);
  }
}catch(err)
{
  console.log(err);
}

}

const onChangedHandler=async(text)=>
{
 let response= await fetch(`${placeApi.base}${placeApi.key}`);
 let result= await response.json();
 placelist=result.results;   
  let matches=[];
  if(text.length>0)
  {
    matches=placelist.map(place=>
      {
        const regex= new RegExp(`${text}`);
        return place.country_code.match(regex)

      });
  }
  matches.forEach(element=>
    {
      console.log(`matches:${element.country}`);
    })
 
  setSuggestions(placelist);
  setCountry(text);
}

  const dateBuilder=(d)=>
  {
    let months=["Jan","Feb","Mar","Apr","May","Jun","jul","aug","sept","oct","nov","dec"];
    let days=["sun","mon","tues","wed","thur","fri","sat"];


    let day= days[d.getDay()];
    let date=d.getDate();
    let month= months[d.getMonth()];
    let year =d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  let temperature='';
  
  //changes the weather types and background image base on it.
  let updateWeatherType=()=>
  {

    let weatherType='app';
    if(typeof weather.main !="undefined")
      {
        temperature=Math.round(kelvintoc(weather.main.temp));
        if(temperature>16)
        {
          weatherType='app-warm';

        }else if(temperature<0 && weather.weather[0].main==="Snow")
        {
          weatherType='app-snow';
        }else if(temperature<0)
        {
          weatherType='app-cold';
        }
        else if(weather.weather[0].main==="Mist")
        {
          weatherType='app-mist';
        }
        else
        {
          weatherType='app';
        }
    
      }
   return weatherType;
  }
  
  let weatherType=updateWeatherType();

  const suggestHandler=(text)=>
  {
    setCountry(text);
    setSuggestions([]);
  }

  return (
  
    <div className={weatherType}>
     <main>
      <div className="search-box">
        <input
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={country}
        onKeyPress={search}
        onChange={e=>onChangedHandler(e.target.value)}
        />
        {suggestions && suggestions.map((suggestion,i)=>
        {
          <div key={i} className='search-bar'
            onClick={()=>suggestHandler(suggestion.country)}>
            {suggestion.country}
          
          </div>

        })}
      </div>

        {(typeof weather.main !=="undefined") ? (
        <div>
        <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div><div className="weather-box">
              <div className="temp"> 
              {Math.round(kelvintoc(weather.main.temp))}ºC
               </div>
              <div className="weather">{weather.weather[0].main}</div>
          </div>
          </div>
 
        ):('')}
     </main>
    </div>
  );
}

export default App;
