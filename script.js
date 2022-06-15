$(document).ready(function () {   
    let stateKey = 'spotify_auth_state';
    let user_id = "";
    const AUTHORIZE = "https://accounts.spotify.com/authorize";
    let playlists = null;
    let playlist_id = "";
    let playlist_index = null;
    let userName = "";

    function getHashParams(){
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    function getPlaylists(){
        $.ajax({
            url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists' + '?' + 'limit=1000',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                playlists = response.items;
                console.log(playlists);
                let select = document.getElementById("playlist-options");
                for (let i = 0; i < playlists.length; i++) {
                    let option = document.createElement("option");
                    //check the onwer of the playlist to display only modifiable playlists
                    if (playlists[i].owner.id == user_id || playlists[i].collaborative == true || playlists[i].owner == userName) {
                        option.text = playlists[i].name;
                        select.add(option, 0)
                    }
            }
            }
        });

    }

    // Save the playlist the user wanna shuffle and get the ID
    document.getElementById("shuffle-btn").addEventListener("click", function(){
        console.log($("#playlist-options option:selected").text());
        for(let i = 0; i < playlists.length; i++){
            if($("#playlist-options option:selected").text() == playlists[i].name){
                playlist_id = playlists[i].id;
                playlist_index = i;
                break;
            }
        }
        shufflePlaylist();
    });
    // Create a bar to track progress for long playlists
    function moveBar(totalSongs, currentIndex) {
        if(totalSongs > 0) {
            let currentPercentage = ((currentIndex / totalSongs) * 100).toFixed(2);
            console.log(currentPercentage);
            let elem = document.getElementById("progressBar");
            elem.style.width = currentPercentage + "%";
            elem.innerHTML = currentPercentage + "%";
            width = currentPercentage;
        }
    }


    // To prevent API Rate limit, I used a promise with await
    const wait = ms => new Promise(
        (resolve, reject) => setTimeout(resolve, ms)
      );

    function shufflePlaylist(){
        let currentIndex = playlists[playlist_index].tracks.total, randomIndex;
        // Index to keep track of the percentange of the progress bar
        i = 0;
        const main = async () => {
            while (0 !== currentIndex) {
                moveBar(playlists[playlist_index].tracks.total, i);  
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex --;
                fetch('https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + access_token
                    },
                    body: JSON.stringify({
                        'range_start': currentIndex,
                        'insert_before': randomIndex + 1,
                        'range_length': 2
                    })
                });
                await wait(100);
                i++;
                if(currentIndex === 0){
                    moveBar(playlists[playlist_index].tracks.total, playlists[playlist_index].tracks.total);
                    alert("Shuffle done!");}
                }
        }
        main();
        }
    let generateRandomString = function(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    let params = getHashParams();

    let access_token = params.access_token,
        error = params.error;

    if(error){
        console.log('There was an error during the authentication');
    }
     else {
        if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                $('#login-menu').hide();
                $('#loggedin').show();
                user_id = response.id;
                userName = response.display_name;
                getPlaylists();
            }
        });
        } else {
            $('#login').show();
            $('#loggedin').hide();
        }

        document.getElementById('login-btn').addEventListener('click', function() {
            let client_id = '0e5a68c331404560875b8c350b71038e';
            let redirect_uri = "https://alejoseed.github.io/Shuffletify/index.html";

            let state = generateRandomString(16);

            localStorage.setItem(stateKey, state);
            let scope = 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative '
            
            let url = AUTHORIZE;
            url += "?response_type=token";
            url += "&client_id=" + encodeURIComponent(client_id);
            url += "&scope=" + encodeURIComponent(scope);
            url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
            url += "&state=" + encodeURIComponent(state);
            window.location.href = url;
        }, false);
    }
});
