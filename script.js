var accordion = document.getElementsByClassName("accordion");

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

	var slider = document.getElementById('sizeSlider');
	slider.onchange = function(){
		var image = document.getElementById("image");
		image.style.width = this.value + '%';
		updategrid();
	};

	function checkhits(){
		var searchKey = encodeURIComponent(document.getElementById("term").value);
		var API_key = "10205314-c9ddc3cc542b26e86eaf37cb3";
		var type = document.getElementById("type").value;
		var orientation = document.getElementById("orientation").value;
		var color = document.getElementById("color").value;
		var checkURL = 'https://pixabay.com/api/?key='+ API_key + '&per_page=3'+'&q='+ searchKey + '&image_type=' + type + '&orientation=' + orientation;
		if (color != 'all'){
			checkURL += '&colors=' + color;
		};
		$.getJSON(checkURL, function(data){
			var Hits = data.totalHits;
			var hitscounter = document.getElementById("hitscounter");
			hitscounter.innerHTML = "Hits: " + Hits + " (Max 500)"
		})};

		function updategrid(){
			var checked = document.getElementById("checked");
			var grid = document.getElementById("grid");
			if (checked.checked){
				grid.style.display = "<table>";
				var image = document.getElementById("image");
				if (image.style.width != 0){
					var imageRatio = image.naturalHeight/image.naturalWidth;
					var pixWidth = parseInt(image.style.width) * $(window).width() / 100;
					grid.style.width = image.style.width;
					grid.style.height = parseInt(imageRatio*pixWidth) + 'px';
					console.log(parseInt(image.style.width));
					console.log(grid.style.width);
					grid.style.marginLeft = (100-parseInt(image.style.width))/2 + "%";
					grid.style.marginRight = (100-parseInt(image.style.width))/2 + "%";
					grid.style.display = "<table>";
				}
			} else {
				console.log("display of")
				grid.style.display = "none";
			}
			
		}
		function update(){
			checkhits();
			var image = document.getElementById("image");
			image.src = '';
			var searchKey = encodeURIComponent(document.getElementById("term").value);
			var API_key = "10205314-c9ddc3cc542b26e86eaf37cb3";
			var type = document.getElementById("type").value;
			var orientation = document.getElementById("orientation").value;
			var color = document.getElementById("color").value;
			var checkURL = 'https://pixabay.com/api/?key='+ API_key + '&per_page=3'+'&q='+ searchKey + '&image_type=' + type + '&orientation=' + orientation;
			if (color != 'all'){
				checkURL += '&colors=' + color;
			}
			$.getJSON(checkURL, function(data){
				var Hits = data.totalHits;
				var pages = Math.floor(Hits/3);
				var page = Math.floor(Math.random() * pages + 1);
				var imageNum = Math.floor(Math.random() * 3);
				console.log(Hits, pages, page, imageNum);
				var URL = 'https://pixabay.com/api/?key='+ API_key + '&per_page=3&page='+ page +'&q='+ searchKey + '&image_type=' + type + '&orientation=' + orientation;
				if (color != 'all'){
					URL += '&colors=' + color;
				};
				$.getJSON(URL, function(data){
					var image = document.getElementById("image");
					var quality = document.getElementById("quality").value;
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
					updategrid();
				});
			});
			
		};