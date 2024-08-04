import { useRef, useState } from "react"
import VideoJS from "./Video";


function App() {
  const playerRef = useRef(null);
  const [link, setLink] = useState('');
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: link,
      type: "video/mp4"
    }]
  }

  const hanldePlayerPlay = (player: any): void => {
    playerRef.current = player;
    player.on('waiting', function() {
      console.log('player is waiting');
    })
    player.on('dispose', function() {
      console.log('player will dispose');
    })
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTimeout(function () {
      e.preventDefault();
      setLink(e.target.value);
    }, 1000);
  }

  return (
    <>
    { link 
      ?
      <VideoJS options={videoJsOptions} onReady={hanldePlayerPlay} />
      :
      <input type="text" placeholder="Ссылку на видео" onChange={(e) => handleChange(e)} />
    }
    </>
  )
}

export default App
