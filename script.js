console.log('jbajbj');
let currentsong = new Audio()
let songs
let curfolder 
function formatTime(seconds) {
    // Ensure seconds is an integer
    seconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zeros if necessary
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    remainingSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Return the formatted time string
    return `${minutes}:${remainingSeconds}`;
}

const playmusic = (track, pause = false) => {
    const trackurl = `http://127.0.0.1:3000${curfolder}/${encodeURIComponent(track)}`;
    document.querySelector(".songinfo").innerHTML = track.split(".")[0].replaceAll("%20", " ")
    currentsong.src = trackurl
    if (!pause) {
        currentsong.play()
        play.src = "svg/pause.svg"
    }
    else {
        play.src = "svg/play.svg"
    }
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00"
}
async function getsongs(folder) {
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let x = await a.text()
    let div = document.createElement("div")
    div.innerHTML = x;
    let b = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < b.length; index++) {
        const element = b[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs
}
async function main() {
    curfolder = "/songs/ncs"
    songs = await getsongs(curfolder)
    playmusic(songs[0], true)
    let songul = document.querySelector(".songlist")
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<div class="boxx"><div class="first ">
                    <img class="invert" src="svg/music.svg" alt="">
                    <div class="info">${song.replace(/%20/g, " ")}</div>
                </div>
                <div class="second">
                    <div class="playnow">Play Now</div>
                    <img src="svg/play.svg" alt="" class="invert">
                </div> </div>`
    }

    Array.from(document.querySelector(".songlist").querySelectorAll(".boxx")).forEach(e => {

        e.addEventListener("click", element => {
            const songname = e.querySelector(".first").querySelector(".info").innerHTML.trim()
            playmusic(songname)
        })
    })
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "svg/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "svg/play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    document.querySelector(".hamberger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    })

    previous.addEventListener("click", () => {
        // Extract the song name from the URL
        let currentSongName = decodeURIComponent(currentsong.src.split("/").pop());
        let index = songs.indexOf(currentSongName);
    
        // Play the previous song if it exists
        if (index - 1 >= 0) {
            playmusic(songs[index - 1]);
        }
    });
    
    next.addEventListener("click", () => {
        // Extract the song name from the URL
        let currentSongName = decodeURIComponent(currentsong.src.split("/").pop());
        let index = songs.indexOf(currentSongName);
    
        // Play the next song if it exists
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1]);
        }
    });
    
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentsong.volume = parseInt(e.target.value)/100
        
    })
}

main()