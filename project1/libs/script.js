

let countryFlag;
const flagContainer = document.getElementById('flags');
const resultConvert = document.getElementById('conversion');
const amount = document.getElementById('amount');
const convert = document.getElementById('convertButton');
const finalAmount = document.getElementById('finalRate');
const icon1 = document.getElementById('todayIcon');
const icon2 = document.getElementById('day1Icon');
const maxTemp0 = document.getElementById('todayMaxTemp');
const minTemp0 = document.getElementById('todayMinTemp');
const maxTemp1 = document.getElementById('day1MaxTemp');
const minTemp1 = document.getElementById('day1MinTemp');
const maxTemp2 = document.getElementById('day2MaxTemp');
const minTemp2 = document.getElementById('day2MinTemp');
const day1Date = document.getElementById('day1Date');
const day2Date = document.getElementById('day2Date');
const icon3 = document.getElementById('day2Icon');
const modalLabel = document.getElementById('weatherModalLabel');
const lastUpdated = document.getElementById('lastUpdated');
// const feelsLike = document.getElementById('feelslike');
const description = document.getElementById('todayConditions');
const dateForecast = document.getElementById('date');
const maxTemp = document.getElementById('maxtemp');
const minTemp = document.getElementById('mintemp');
const description2 = document.getElementById('weatherDescriptionForecast');
const countryContainer = document.getElementById('country');
const getRate = document.getElementById('exchangeRate');
const baseCurrency = document.getElementById('fromAmount');
let userCurrency = "";
let capitalCity = '';
let fetched = false;




var streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
  );
  
  var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );
  var basemaps = {
    "Streets": streets,
    "Satellite": satellite
  };
  
  var map = L.map("map", {
    layers: [streets]
  }).setView([54.5, -4], 6);

airports = L.markerClusterGroup({
    polygonOptions: {
      fillColor: '#fff',
      color: '#000',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }}).addTo(map);

    hotels = L.markerClusterGroup({
        polygonOptions: {
          fillColor: '#fff',
          color: '#000',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5
        }}).addTo(map);

    hospitals = L.markerClusterGroup({
            polygonOptions: {
              fillColor: '#fff',
              color: '#000',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.5
            }}).addTo(map);
        universities = L.markerClusterGroup({
                    polygonOptions: {
                    fillColor: '#fff',
                    color: '#000',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.5
                    }}).addTo(map);
                    
    
    
 overlays = {
"Airports": airports,
"Hotels": hotels,
"Hospitals": hospitals,
"Universities": universities,

};

  
  var layerControl = L.control.layers(basemaps, overlays).addTo(map);
  let myLayer;
  myLayer = L.geoJSON().addTo(map);
  
  var myIcon = L.ExtraMarkers.icon({
    icon: 'fa-plane',
    markerColor: 'white',
    iconColor: 'black',
    shape: 'penta',
    prefix: 'fa'
});

var myHotelIcon = L.ExtraMarkers.icon({
    icon: 'fa-hotel',
    markerColor: 'green',
    iconColor: 'black',
    shape: 'penta',
    prefix: 'fa'
});

var myUniversityIcon = L.ExtraMarkers.icon({
    icon: 'fa-graduation-cap',
    markerColor: 'yellow',
    iconColor: 'black',
    shape: 'square',
    prefix: 'fa'
});

var myHospitalIcon = L.ExtraMarkers.icon({
    icon: 'fa-hospital',
    markerColor: 'blue',
    shape: 'square',
    prefix: 'fa'
});


L.easyButton("fa-info fa-lg", function (btn, map) {
    $("#myModal").modal("show");
  }).addTo(map); 

L.easyButton("fa-solid fa-cloud-moon-rain", function (btn, map) {
    $("#weatherModal").modal("show");
  }).addTo(map);

L.easyButton("fa-solid fa-calendar-days", function (btn, map) {
    $("#Public-holidays").modal("show");
  }).addTo(map);


L.easyButton("fa-solid fa-newspaper", function (btn, map) {
    $("#modal4").modal("show");
    }).addTo(map);

L.easyButton("fa-solid fa-money-bill fa-xl", function (btn, map) {
    $("#currencyConversion").modal("show");
    }).addTo(map);

L.easyButton("fa-solid fa-globe fa-xl", function (btn, map) {
        $("#modal3").modal("show");
      }).addTo(map);

  
map.locate({setView: true, maxZoom: 8});

function onLocationFound(e) {
     var radius = e.accuracy;
        
   // L.circle(e.latlng, radius).addTo(map);
    
 }



map.on('locationfound', onLocationFound);


let longitude;
let latitude;




if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        longitude = lng;
        latitude = lat;

        fetchOpenCage(lat, lng);
        selectCountry();
        
        
      },
      function(error) {
        if (error.code === error.PERMISSION_DENIED) {
         
        } else {
          
        }
      }
    );
  } else {
    
  }
 

function getCountries() {
    if(fetched) return;

    $.ajax({
        type: "GET",
        url: "libs/php/getCountryList.php",
        dataType: "json",
        success: function (result) {

        
            var options = '<option value=""></option>';
            for (var i = 0; i < result.length; i++) {
                options += '<option value="' + result[i][1] + '">' + result[i][0] + '</option>';
            }
            $('#countryContainer').html(options);
            



            countryContainer.addEventListener('change', function (e){
                const target = e.target;
                const longitude = target.options[target.selectedIndex].dataset.lng;
                const latitude = target.options[target.selectedIndex].dataset.lat;
                let countryCode = target.value;
                let Countries = target.options[target.selectedIndex].innerHTML;
                let unspacedCountryName = Countries.split(" ").length > 1 ? Countries.split(" ").join("") : Countries;
                userCurrency = target.options[target.selectedIndex].dataset.currencies;
                

                //getWeather(latitude, longitude);
                getCountryInfo(countryCode);
                getWiki(unspacedCountryName);
                getNews(countryCode);
                allMarkers(countryCode);
                getConversion(userCurrency);
                getBorder(countryCode);
                getFlag(countryCode);
                getHolidays(countryCode);
                selectCountry(countryCode);
               
                
                
               
            
            

            map.setView([longitude, latitude], 12);
             
        });
  

        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
}

$(document).ready(function () {
    

    getCountries();

             

});

function getHolidays(countryCode) {
$.ajax({
    url: "libs/php/holidays.php",
    type: "GET",
    dataType: "json",

    data: {
        country : countryCode
    },
    success: function (result) {
    var holidays = JSON.parse(result);
      

                
                 holidays.response.holidays.forEach(function(holiday) {
                     $('#holidayName').append('<div>' + holiday.name + '</div>');
                     $('#holidayDate').append('<div>' + new moment (holiday.date.iso).format('DD-MM-YYYY') + '</div>');
                     $('#holidayType').append('<div>' + holiday.type + '</div>');
                    
                 });
    },
    error: function (jqXHR, textStatus, errorThrown) {
       
    }
});
}


function getBorder(countryCode) {
    $.ajax({
        
        url: "libs/php/getB.php",
     type: "GET",
    data: {
       countryCode: countryCode
     },
      success: function (data) {
        

// Clear existing layers if needed (optional)
myLayer.clearLayers();

// Add the new polygon data and set its style
myLayer.addData(data).setStyle(polyStyle);

// Fit the map to the bounds of the polygon
const bounds = myLayer.getBounds();
map.fitBounds(bounds);

// Get the bounds of the polygon
const north = bounds.getNorth();
const south = bounds.getSouth();
const east = bounds.getEast();

// Polygon styling
function polyStyle() {
return {
color: "#994444",
weight: 7,
opacity: 0.5,
fillColor: "#fcb6b6",
fillOpacity: 0.45
};
}
},
error: function (xhr, status, error) {


}



});
}
function calcResult() {
    result = $('#fromAmount').val() * $('#exchangeRate').val();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
});
     const formattedNumber = formatter.format(result);
    
    $('#toAmount').val(formattedNumber);
    
};

function getConversion(userCurrency) {
    $.ajax({
        url: "libs/php/conversion.php",
        type: "GET",
        dataType: "json",
        
        success: function (result) {
            
           

        
        },
        error : function (jqXHR, textStatus, errorThrown) { 
            const errorResult = JSON.parse(jqXHR.responseText.replace("*", ""));
            const keys = Object.keys(errorResult.data.rates);
            const value = Object.values(errorResult.data.rates);
            const allCountryCode = [...getRate.options];
            
            

            getRate.innerHTML = keys.map(key => {    
            
                    // Check if keys exist before accessing properties
                    const currencyDigits = value[keys.indexOf(key)];
            
                    return `<option value='${currencyDigits}'>${key}</option>`;
            
            });
            
            getRate.addEventListener('change', function (e) {

                calcResult();
                  
            })
            baseCurrency.addEventListener('change', function (e) {
                    
                calcResult();
            })
            baseCurrency.addEventListener('keyup', function (e) {
                        
                    calcResult();
            })
           for(let i = 0; i < getRate.options.length; i++) {
               if(getRate.options[i].innerHTML === userCurrency) {
                            getRate.selectedIndex = i;
                            calcResult();
                            break;
                        }
           }
    
 
        }
    });

}




function getCountryInfo(countryCode) {
    const populationValue = document.getElementById('population');
            $.ajax({
                url: "libs/php/countryName.php",
                type: "POST",
                
                dataType: "json",
                data: {
                    countryCode : countryCode
                },
                success: function (result) {
                    const number = result.data[0].population;
                    const formatter = new Intl.NumberFormat('en-US', {
                       style: 'decimal',
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 0
             });
                    const formattedNumber = formatter.format(number);
                    const capitalCity = result.data[0].capital;

                   countryName.innerHTML = result.data[0].countryName;
                   capitalCity.innerHTML = capitalCity;
                   populationValue.innerHTML = formattedNumber;
                   document.getElementById('language').innerHTML = result.data[0].languages;
                   document.getElementById('continent').innerHTML = result.data[0].continentName;
                   document.getElementById('currency').innerHTML = result.data[0].currencyCode;
                   document.getElementById('areaInSqKm').innerHTML = result.data[0].areaInSqKm;
                   document.getElementById('isoAlpha2').innerHTML = result.data[0].countryCode;
                   document.getElementById('isoAlpha3').innerHTML = result.data[0].isoAlpha3;
        
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    
                }
            });
            }

function getWiki(countryName) {   
            $.ajax({
                url: "libs/php/wiki.php",
                type: "POST",
                
                dataType: "json",
                data: {
                  q : countryName
                },
                success: function (result) {
                    document.getElementById('initialInfo').innerHTML = result.data[0].summary;
                    wiki.innerHTML = `<a href="https://${result.data[0].wikipediaUrl}" target="_blank">Click Here To Read More</a>`
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    
                }
            });
        }

        function getNews(countryCode) {
            $.ajax({
                url: "libs/php/News.php",
                type: "GET",
                
                dataType: "json",
                data: {
                    
                   country : countryCode
                    
                },
                success: function (result) {
                  
                 const articles = result.data.articles;
                 const newsContainer = document.getElementById('News');
                 newsContainer.innerHTML = articles.map(article => {
                    return `<table class="table table-borderless">
                
                    <tr>
          
                      <td rowspan="2" width="50%">
                        <img class="img-fluid rounded" src="${article.image}" alt="" title="">
                      </td>
                      
                      <td>
                        <a href="${article.url}" class="fw-bold fs-6 text-black" target="_blank">${article.title}</a>
                      </td>
                      
                    </tr>
                    
                    <tr>
                                
                      <td class="align-bottom pb-0">
                        
                        <p class="fw-light fs-6 mb-1" id="publishedAt">${new moment(article.publishedAt).format('dddd, Do MMMM')}</p>
                        
                      </td>            
                      
                    </tr>
                    
                  </table>`
                 })
                   
                    
                    
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    
                }
            });
        }

function getWeather(capitalCity) {
    $.ajax({
        url: "libs/php/getWeather.php",
        type: "GET",
        
        dataType: "json",
         data: {
             city : capitalCity
         },
        success: function (result) {
          
            modalLabel.innerHTML =`${result?.location?.name}, ${result?.location?.country}`;
            maxTemp0.innerHTML = result?.forecast?.forecastday[0]?.day?.maxtemp_c;
            minTemp0.innerHTML = result?.forecast?.forecastday[0]?.day?.mintemp_c;
            icon1.src = result?.forecast?.forecastday[0]?.day?.condition?.icon;
            description.innerHTML = result?.forecast?.forecastday[0]?.day?.condition?.text;
            
            day1Date.innerHTML =  new moment(result?.forecast?.forecastday[1]?.date).format('ddd, Do MMM');
            maxTemp1.innerHTML = result?.forecast?.forecastday[1]?.day?.maxtemp_c;
            minTemp1.innerHTML = result?.forecast?.forecastday[1]?.day?.mintemp_c;
            icon2.src = result?.forecast?.forecastday[1]?.day?.condition?.icon;
                   
            day2Date.innerHTML = new moment(result?.forecast?.forecastday[2]?.date).format('ddd, Do MMM');
            maxTemp2.innerHTML = result?.forecast?.forecastday[2]?.day?.maxtemp_c;
            minTemp2.innerHTML = result?.forecast?.forecastday[2]?.day?.mintemp_c;
            icon3.src = result?.forecast?.forecastday[2]?.day?.condition?.icon;
                   
           
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });


  }

  function selectCountry(countryCode){
    $.ajax({
        type: "GET",
        url: "libs/php/countries.php",
        dataType: "json",
        success: function (result) {
            
           if(countryCode){
            const currentCountry = result.data.filter(country => country.cca2 === countryCode)[0].capital[0];
            const unspacedCapitalCity = currentCountry.split(" ").length > 1 ? currentCountry.split(" ").join("%20") : currentCountry;
            capitalCity = unspacedCapitalCity;
            
           }
           getWeather(capitalCity);

        
       
            countryContainer.innerHTML = result.data.map(country => {
                
    
                return `<option data-lng="${country.latlng[0]}" data-lat="${country.latlng[1]}" data-currencies="${country.currencies ? Object.keys(country.currencies)[0] : ""}" value="${country.cca2}">${country.name.common}</option>`;
            }).join(""); // Added the join() function to concatenate the option elements properly
    
            $("#country").html($("#country option").sort(function (a, b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
            }));
    
            // Automatically select the country of location
            let userCountry = ""; // Set the user's country based on the location
            $("#country option").each(function () {
                if ($(this).text() === userCountry) {
                    $(this).prop('selected', true);
                    return false; // Break out of the loop once the country is selected
                    
                }
            });
        },
        error: function (xhr, status, error) {
           
        }
    });
    
}

function getFlag(countryCode) {
    $.ajax({
        url: "libs/php/countryFlag.php",
        type: "GET",
        
        dataType: "json",
        data: {
            countryCode : countryCode
        },
        success: function (result) {
            countryFlag = result;
            flagContainer.src = countryFlag;

            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            countryFlag = jqXHR.responseText;
            flagContainer.src = countryFlag;

        }
    });
}

  function allMarkers(countryCode) {
    $.ajax({
        url: "libs/php/markers.php",
        type: "POST",
        
        dataType: "json",
        data: {
            q : "airport",
            country : countryCode
        },
        success: function (result) {

           
            for (let i = 0; i < result.data.geonames.length; i++) {
                const marker = L.marker([result.data.geonames[i].lat, result.data.geonames[i].lng], {icon: myIcon});
                marker.bindTooltip(` ${result.data.geonames[i].asciiName}`, {direction: 'top', sticky: true}).addTo(airports);
            }
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });

    $.ajax({
        url: "libs/php/markers.php",
        type: "POST",
        
        dataType: "json",
        data: {
            q : "hospital",
            country : countryCode
        },
        success: function (result) {

            
            for (let i = 0; i < result.data.geonames.length; i++) {
                const marker = L.marker([result.data.geonames[i].lat, result.data.geonames[i].lng], {icon: myHospitalIcon});
                marker.bindTooltip(`${result.data.geonames[i].asciiName}`, {direction: 'top', sticky: true}).addTo(hospitals);
            }
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
           
        }
    });

    $.ajax({
        url: "libs/php/markers.php",
        type: "POST",
        
        dataType: "json",
        data: {
            q : "university",
            country : countryCode
        },
        success: function (result) {

            
            for (let i = 0; i < result.data.geonames.length; i++) {
                const marker = L.marker([result.data.geonames[i].lat, result.data.geonames[i].lng], {icon: myUniversityIcon});
                marker.bindTooltip(`${result.data.geonames[i].asciiName}`, {direction: 'top', sticky: true}).addTo(universities);
            }
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });

    $.ajax({
        url: "libs/php/markers.php",
        type: "POST",
        
        dataType: "json",
        data: {
            q : "hotel",
            country : countryCode
        },
        success: function (result) {

           
            for (let i = 0; i < result.data.geonames.length; i++) {
                const marker = L.marker([result.data.geonames[i].lat, result.data.geonames[i].lng], {icon: myHotelIcon});
                marker.bindTooltip(`${result.data.geonames[i].asciiName}`, {direction: 'top', sticky: true}).addTo(hotels);
            }
           
        },
       

    });

}

map.addLayer(airports);
    map.addLayer(hospitals);
    map.addLayer(universities);
    map.addLayer(hotels);


  function fetchOpenCage(lat, lng){
    $.ajax({
        url: "libs/php/opencage.php",
        type: "GET",
        
        dataType: "json",
        data: {
            lat : lat,
            lng : lng
        },
        
        success: function (result) {
            

            let countryCode = result.data.results[0].components.country_code.toUpperCase();
            userCurrency = result.data.results[0].annotations.currency.iso_code;
            let countryName = result.data.results[0].components.country;
            let unspacedCountryName = countryName.split(" ").length > 1 ? countryName.split(" ").join("") : countryName;
            
            
            
            getCountryInfo(countryCode);
            allMarkers(countryCode);
            getWiki(unspacedCountryName);
            getNews(countryCode);
            getBorder(countryCode);
            getConversion(userCurrency);
            getCountries();
            getFlag(countryCode);
            getHolidays(countryCode);
            selectCountry(countryCode);
        
            

            $.ajax({
                type: "GET",
                url: "libs/php/getCountryList.php",
                dataType: "json",
                success: function (result) {
        
                    let currencyCode = "";
                   
                    var options = '<option value=""></option>';
                    for (var i = 0; i < result.length; i++) {
                        options += '<option value="' + result[i][1] + '">' + result[i][0] + '</option>';
                    }
                    $('#countryContainer').html(options);
                    
            //     // automatically select the country of location
            setTimeout(() => {
                for(let i = 0; i < countryContainer.length; i++) {
                    if(countryContainer[i].innerHTML === countryName) {
                                 countryContainer.selectedIndex = i;
                                 break;
                             }
        
                   
                    }
            }, 1000);
            
        }, error: function (jqXHR, textStatus, errorThrown) {
                
           }});
        }
    });
}


  
  