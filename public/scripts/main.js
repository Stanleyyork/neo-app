$( function () {
	//console.log('js works');

	//results element on mainuser.hbs
	var $results = $('#results');

	//empty array w/ an empty object to hold all neo data from NASA API
	var allNeosObj = [];

	//get element count, which can be asteroid count per day if querying in one day time period
	var dailyNeoCount;
		//dailyCountObj = {};
	
	//get asteroid id...for user to save
	var neoId;	

/*	allNeoInfo = {"neoId": [ ], "allNeoContent": [ ]  };*/

	//property names for chart
	var dataPie =[];
	
	
	/*var names = [],
		magnitudes = [],
		missDists = [],
		diameterFt = [],
		apprchDate = [],
		speed = [],
		speeds = {};*/
		


	//MOMENT
	moment().format();
	//save dates
	var today = new moment().format("YYYY-MM-DD"),
		tomorrow = moment().add(1, 'day').format("YYYY-MM-DD"),
		day3 = moment().add(2, 'day').format("YYYY-MM-DD"),
		day4 = moment().add(3, 'day').format("YYYY-MM-DD"),
		day5 = moment().add(4, 'day').format("YYYY-MM-DD"),
		day6 = moment().add(5, 'day').format("YYYY-MM-DD"),
		day7 = moment().add(6, 'day').format("YYYY-MM-DD"),
		toOneWeek = moment().add(7, 'day').format("YYYY-MM-DD");

	//chartjs  	
	var ctx = $("#myChart").get(0).getContext("2d");
	var myNewChart = new Chart(ctx);	

	//url's
	var baseUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-11-27&end_date=2015-11-30&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
	var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

	//HBS
	//compile hb template
	var source = $('#neos-template').html();
	var template = Handlebars.compile(source);

	function getPropsToShow(propsToShow){
			
				//gets each property out of each date's([prop]) neos' 
					for(var i =0; i < allNeosObj.length; i++) {
						
						//path to info in allNeos obj for properties
						neoInfo = allNeosObj[i][today][i];
						console.log(neoInfo);
						console.log(neoInfo.name);
						
						//gets each id for the neo. seperate from switch but prop is sibling of props in switch
						neoId = neoInfo.neo_reference_id;
						//console.log(neoId);

						//value variable for chart
						var value;
						
						/*if (propsToShow.indexOf("names") > -1) {
								//console.log(neoInfo.name);
								value = neoInfo.name;
								console.log(value) }*/
						if (propsToShow.indexOf("magnitude") > -1) {
								value = neoInfo.absolute_magnitude_h;
								console.log(value);
						}  else if (propsToShow.indexOf("missDist") > -1) {
								value = neoInfo.close_approach_data[0].miss_distance.miles;
								console.log(value);
						}	else if (propsToShow.indexOf("diameter") > -1) { 
								value = neoInfo.estimated_diameter.feet.estimated_diameter_max;

						}	else if (propsToShow.indexOf("approachDate") > -1) {
								value = neoInfo.close_approach_data[0].close_approach_date;

						}	else if (propsToShow.indexOf("speed") > -1) {
								value = neoSpeedsInfo.kilometers_per_hour;	
						}
						
						dataPie.push({
							value: value,
					        color:"rgb(255, 0, 0)",
					        highlight: "#FF5A5E",
					        label: "asteroid " + neoInfo.name
						});
					}	
				}	

	//function to get desired property from neo api
	function getProps() {
		//saving each property as an array: if search date is more than 1 day at a time
		for(var prop in allNeosObj) {
			//console.log(allNeosObj);
			getPropsToShow(["names","missDist", "approachDate", "speed"]); 
		}
	}	

	//2 FUNCTIONS HERE TO BUILD CHART
	   	//I. function to arrangeChart and render chart with data(x,y chart cordinates)
	   		//function makeChart(x, y) {

	   		//};

	   		//function make

	   //II. function to set chart w/jquery selector on chart category btns, callsback function makeChart(I. function)
			//want it to be so y cordinate stays constant with data as asteroid "name"
	   		//x cordinate should be the property that is dynamically changed...so what do i put as the css selector?
	   		//function setChart(){$('#magnitude').on("click", function () { alert("clicked magnitude")} }
	   			//boiler function
			   	function setChart() {
				   		$('#magnitude').on('click', function(){
				   			alert('clicked magnitude');
				   		});
				   		$('#diameter').on('click', function(){
				   			alert('clicked diameter');
				   		});
				   		$('#velocity').on('click', function (){
				   			alert('clicked on velocity');
				   		});
			   		}
			   	setChart();
	
	
	//Get req. to my server for username info.
	$.get('/api/dailyneos', function (data){
	 	//get username to render on view
	 	allNeos = data.userName;	
		
		var neosHtml = template({ neos : allNeos });
		//$('#neos-list').append(neosHtml);	
	});	


	//get neos from NASA api
	$.get(rootUrl, function (data){ 
		//saving NASA data to empty array
		allNeosObj.push(data.near_earth_objects);
		console.log(allNeosObj);
		
		//get element count; sibling of near_earth_objects array
		dailyNeoCount = data.element_count;
		//$('#neos-list').append(dailyCountHtml);
		//render daily count 
		$results.append('<h3 class="text-center" id="dailyCount"> The daily neo count is: ' + dailyNeoCount + '</h3>');
		
		//Call getProps
		getProps();	
		//Make chart right after calling getProps
		//pie chart
		var myChart = new Chart(ctx).Doughnut(dataPie);
		
		//render();
 
	});/*closing NASA get request*/	
	

	/*$('#magnitude').on("click", function () {
		alert("clicked");
	});*/

});/*closing load brace*/
