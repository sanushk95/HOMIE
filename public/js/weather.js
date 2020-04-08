$(document).ready(function(){

    $('#submitCity').click(function(){

        //get value from input field
        var city = $("#city").val();

        //check not empty
        if (city != ''){

            $.ajax({

                url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric" + "&APPID=e7b467b78cd7cea3b40036b2cbba06c9",
                type: "GET",
                dataType: "jsonp",
                success: function(data){
                    
                 

                    var information = show(data);
                    $("#show").html(information);
                }
            });

        }else{
            $('#error').html('Field cannot be empty');
        }

    });
})


function show(data){
    return "<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'><p>"+ data.main.temp +"°C"+"<p>" + "<p>"+ data.weather[0].main +"</p>";
}
