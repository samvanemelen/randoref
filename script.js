var accordion = document.getElementsByClassName("accordion");
var slider = document.getElementById('sizeSlider');
var gridsegments = 3;
var gridthickness = 1;
var trycount = 0;
var returns;

//Dynamically change image size
slider.onchange = function(){
	var image = document.getElementById("image");
	image.style.width = this.value + '%';
	updategrid();
};

//add 'On Click Event' for all accordion types
for (var i = 0; i < accordion.length; i++) {
	accordion[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var panel = this.nextElementSibling;
		if (panel.style.display == "block") {
			panel.style.display = "none";
		} else {
			panel.style.display = "block";
		}
	});
}

function checkhits(){
	//Reading input from webpage
	var searchKey = encodeURIComponent(document.getElementById("term").value);
	var API_key = "10205314-c9ddc3cc542b26e86eaf37cb3";
	var type = document.getElementById("type").value;
	var orientation = document.getElementById("orientation").value;
	var color = document.getElementById("color").value;
	//Creating Search URL for calculating amount of Hits
	var checkURL = 'https://pixabay.com/api/?key='+ API_key + '&per_page=3'+'&q='+ searchKey + '&image_type=' + type + '&orientation=' + orientation;
	if (color != 'all'){
		checkURL += '&colors=' + color;
	};
	waiting = true;
	$.getJSON(checkURL, function(data){
		var Hits = data.totalHits;
		var hitscounter = document.getElementById("hitscounter");
		hitscounter.innerHTML = "Hits: " + Hits + " (Max 500)";
		//funcion is called after each change, so storing these data will save lines of code in update function
		returns = [Hits, checkURL];
	})
}

function updategrid(){
	var grid_segments_val = document.getElementById("grid_segments").value;
	var grid = document.getElementById("grid");
	var color = document.getElementById("color_picker").value;
	//If the amount of grid segments changed, change the body of the table
	if (gridsegments != parseInt(grid_segments_val) && grid_segments_val != ""){
		gridsegments = grid_segments_val;
		var body = "";
		for (var i = 0; i < grid_segments_val; i++){
			body += "<tr>";
			for (var j = 0; j < grid_segments_val; j++){
				body += "<td class = \"bordered\"></td>"
			}
			body += "</tr>"
		}
		grid.innerHTML = body;
	}
	var checked = document.getElementById("checked");
	var gridstyle = document.getElementsByClassName("bordered");
	if (checked.checked){
		var image = document.getElementById("image");
		var slider = document.getElementById('sizeSlider');
		image.style.width = slider.value + '%';
		//if source does not begin with h(ttps), no image is displayed and the grid should not show up
		if (image.src[0] == 'h'){
			var grid_thickness_val = document.getElementById("grid_thickness").value;
			if (grid_thickness_val == ""){grid_thickness_val = 1;}
			//Get image ratio for calculating table height based on width
			var imageRatio = image.naturalHeight/image.naturalWidth;
			//image width is in percentage. Multiply to get width in pixels
			var pixWidth = parseInt(image.style.width) * $(window).width() / 100;
			grid.style.width = image.style.width;
			grid.style.height = imageRatio*pixWidth + 'px';
			grid.style.marginLeft = (100-parseInt(image.style.width))/2 + "%";
			grid.style.marginRight = (100-parseInt(image.style.width))/2 + "%";
			for (var i = 0; i < gridstyle.length; i++){
				gridstyle.item(i).style.border = grid_thickness_val + "px solid " + color;
			}
		}
	} else {
		for (var i = 0; i < gridstyle.length; i++){
			//when grid is not shown, set border size to 0px.
			gridstyle.item(i).style.border = "0px";
		}
	}

}
function update(){

	if (trycount > 3){
		alert("Something went wrong, try again")
		return
	}
	var image = document.getElementById("image");
	image.src = '';
	var Hits = returns[0];
	var URL = returns[1];
	var pages = Math.floor(Hits/3); //if we view results in pages of 3 items, this gives the total amount of pages
	var page = Math.floor(Math.random() * pages + 1); //randomly select a page
	var imageNum = Math.floor(Math.random() * 3.9); //randomly select image 1, 2 or 3
	URL += '&page='+ page; //add page number to request.
	$.getJSON(URL, function(data){
		var image = document.getElementById("image");
		var quality = document.getElementById("quality").value;
		try{
			switch (quality){
				case 'high':
				image.src = data.hits[imageNum].largeImageURL;
				break;
				case 'medium':
				image.src = data.hits[imageNum].webformatURL;
				break;
				case 'low':
				image.src = data.hits[imageNum].previewURL;
				break;
			};
			trycount = 0
			setTimeout(updategrid, 500);

		}
		catch(err){
			console.log(err);
			trycount += 1;
			update();
		}
		
	});
}

checkhits();
