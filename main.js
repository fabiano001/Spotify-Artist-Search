"use strict";

$(".search-button").on("click", onSearchSpotifyAPI);

function onSearchSpotifyAPI(event){
	event.preventDefault();
	console.debug("Searching");

	// make call to ajax, pass callback function
	var searchQuery = "https://api.spotify.com/v1/search?type=artist&limit=50&q=" + $(".query-input").val().replace(/ /g , "+");
	console.debug(searchQuery);
	var request = $.get(searchQuery);

	function handleArtists(resultsJson){
		////console.debug(resultsJson.artists.items);

		var searchResults = $(".search-results");

		// Clear previous results and search query input field
		searchResults.empty();
		$(".query-input").val("");

		resultsJson.artists.items.forEach(function(artist){

			if(artist.images.length>0){
				var htmlSnippet = "<div class=\"col-sm-4\"><a type=\"artist\" href=\"#\"><h3 data-toggle=\"modal\" data-target=\"#myModal\" artistName=\"" + artist.name + "\" id=\"" + artist.id + "\" class=\"artist-name\">" + artist.name 
				+ "</h3><div class=\"img-frame\"><img data-toggle=\"modal\" data-target=\"#myModal\" artistName=\"" + artist.name + "\" id=\"" + artist.id + "\" class=\"artist-img\" src=\"" + artist.images[1].url + "\"></a></div></div>";
				
				searchResults.append(htmlSnippet);
			}
			
		});

		$("a[type=\"artist\"]").on("click", function (event){
			console.log("event id: " + event.target.id);
			getAlbumsSpotifyAPI(event.target.id);
		});
	}

	function handleError (err1, err2, err3) {
		console.error('OH NO!!', err1, err2, err3);
	}

	request.done(handleArtists);
	request.fail(handleError);
}

function getAlbumsSpotifyAPI(id){
	event.preventDefault();
	console.debug("Retrieving Albums for artist id " + id);

	// make call to ajax, pass callback function
	var searchQuery = "https://api.spotify.com/v1/artists/" + id + "/albums";
	console.debug(searchQuery);
	var request = $.get(searchQuery);

	function handleArtitsAlbum(resultsJson){
		
		var prevAlbum = "";

		$(".modal-title").text("Choose Album");

		var modalBody = $(".modal-body");
		modalBody.empty();

		resultsJson.items.forEach(function(album){

			if(album.name!=prevAlbum){
				// add each album to the modal body
				var htmlSnippet = '<a class="album-tracks" href="#"><div class="album-title" id="' + album.id + '">' + album.name 
					+ '</div><div class="album-img"><img id="' + album.id + '" src="' + album.images[1]["url"] + '"></div></a>';
				modalBody.append(htmlSnippet)

				prevAlbum = album.name;

			}
			
		});

		$(".album-tracks").on("click", function(event){
			console.log("event: " + event.target);
			getAlbumTracksSpotifyAPI(event.target.id)
		});

	}

	function handleError (err1, err2, err3) {
    console.error('OH NO!!', err1, err2, err3);
  }

	request.done(handleArtitsAlbum);
	request.fail(handleError);
}

function getAlbumTracksSpotifyAPI(id){
	event.preventDefault();
	console.debug("Retrieving Tracks for album id " + id);

	// make call to ajax, pass callback function
	var searchQuery = "https://api.spotify.com/v1/albums/" + id + "/tracks";
	console.debug(searchQuery);
	var request = $.get(searchQuery);

	function handleAlbumTracks(resultsJson){

		$(".modal-title").text("Album's Tracks");

		var modalBody = $(".modal-body");
		modalBody.empty();

		resultsJson.items.forEach(function(track){

			// add each track to the modal body
			var htmlSnippet = '<a class="track-link" href="' + track.preview_url + ' target="_blank"><div class="track-title" id="' + track.id + '">' + track.name + '</div></a>';

			modalBody.append(htmlSnippet);
			
		});

		$(".album-tracks").on("click", function(event){
			getAlbumTracksSpotifyAPI(event.target.id)
		});

	}

	function handleError (err1, err2, err3) {
    console.error('OH NO!!', err1, err2, err3);
  }

	request.done(handleAlbumTracks);
	request.fail(handleError);
}