const resultData = document.getElementById('result');



$("#btn1").on('click', function(){

    $.ajax({
        url: "libs/php/wiki.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q : $('#userInput').val()
            
        },
        
        success: function (result) {
            console.log(result.data);
            resultData.innerHTML = result.data.map(item => item.summary);
            
    
            
        },
        error: function (error) {
            // Handle your error code here
              console.log(error);
            }
    });
    
})

$("#btn2").on('click', function(){

    

    $.ajax({
        url: "libs/php/postalcodeSearch.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#countrySelect').val(),
            postalcode: $('#postalCode').val()
        },
        
        success: function (result) {
            console.log(result);
            resultData.innerHTML = result.data.map(item => {
                return `Country: ${item.adminName1},<br> County: ${item.adminName2},<br> Borough: ${item.placeName}`;
            });
    
            
        },
        error: function (error) {
           
              console.log(error); }
    });
    
})

$("#btn3").on('click', function(){

    

    $.ajax({
        url: "libs/php/timezone.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#lat').val(),
            lng: $('#lng').val()
        },
        
        success: function (result) {
            console.log(result);

            resultData.innerHTML = `Country: ${result.data.countryName}, <br> Timezone: ${result.data.timezoneId},<br> Time: ${result.data.time}, <br> Sunrise: ${result.data.sunrise}, <br> Sunset: ${result.data.sunset}`;
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
    });
    
})