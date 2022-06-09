$(document).ready(function () {
    var stateKey = 'spotify_auth_state';
    let user_id = "";
    const AUTHORIZE = "https://accounts.spotify.com/authorize";

    function getHashParams(){
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    function getPlaylists(){
        $.ajax({
            url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                console.log(response);
            }
        });
    }

    let generateRandomString = function(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (var i = 0; i < length; i++) {
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
            }
        });
        } else {
            $('#login').show();
            $('#loggedin').hide();
        }

        document.getElementById('login-btn').addEventListener('click', function() {
            let client_id = '0e5a68c331404560875b8c350b71038e';
            let redirect_uri = "http://127.0.0.1:5500/public/index.html";

            let state = generateRandomString(16);

            localStorage.setItem(stateKey, state);
            let scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';
            
            let url = AUTHORIZE;
            url += "?response_type=token";
            url += "&client_id=" + encodeURIComponent(client_id);
            url += "&scope=" + encodeURIComponent(scope);
            url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
            url += "&state=" + encodeURIComponent(state);
            url += "&show_dialog=true";
            window.location.href = url;
        }, false);
    }
    
    document.getElementById('retrieve_playlists').addEventListener('click', function() {
        getPlaylists();
    }, false);
            
//////
});