let redirect_uri = "http://127.0.0.1:5500/public/index.html";

let access_token = "";
let refresh_token = "";


const AUTHORIZE = "https://accounts.spotify.com/authorize";


function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

    if (window.location.search.length > 0){
        handleRedirect()
    }
}

function handleRedirect(){
    fetchAccessToken();
    window.history.pushState("", "", redirect_uri);
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0){
        const params = new URLSearchParams(queryString);
        code = params.get("code");
    }
    return code;
}

function fetchAccessToken(){
/*
    My implementation did not work, trying to come up with one that works.
    So far, I think I will have to implement it with PKCE as the website said because I'm 
    Gonna be running this on a website that is not a server.
    Another thing I can do is use firebase but this is not react so idk
*/
}

function refreshAccessToken(){
// Gotta come up with a way to refresh the access token
}


function requestAuthorization(){
    let url = AUTHORIZE;
    url += "?client_id=0e5a68c331404560875b8c350b71038e";
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}


$(document).ready(function(){
    requestAuthorization();
});
