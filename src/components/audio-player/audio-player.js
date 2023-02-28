import { useState, forwardRef } from "react";
import { FaPlayCircle, FaPauseCircle, FaVolumeMute, FaVolumeUp, FaRedoAlt, FaUndoAlt} from 'react-icons/fa';
import { formatTime, formatHumanReadTime } from "../../helpers/formatTime";
import DropdownMenu from "../dropdown-menu/dropdown-menu";
import "./audio-player.css";

const AudioPlayer = forwardRef((props, ref) => {
    const {src, transcript} = props;

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [mediaTime, setMediaTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);

    const togglePlaying = () => {
        setIsPlaying(!isPlaying);
        isPlaying ? ref.current.pause() : ref.current.play();
    };

    const onLoadedMetadata = () => {
        setDuration(ref.current.duration);
    };

    const onTimeUpdate = () => {
        setMediaTime(ref.current.currentTime);
    };

    const onScrubberChange = (event) => {
        const newTime = event.target.value;
        setMediaTime(newTime);
        ref.current.currentTime = newTime;
    };

    const onRewind = () => {
        const { currentTime } = ref.current;
        const newTime = Math.max(currentTime - 15, 0);
        setMediaTime(newTime);
        ref.current.currentTime = newTime;
    };

    const onFastForward = () => {
        const { currentTime } = ref.current;
        const newTime = Math.min(currentTime + 15, duration);
        setMediaTime(newTime);
        ref.current.currentTime = newTime;
    };

    const rates = [0.75, 1, 1.5, 2];

    const changeRate = (rate) => {
        setPlaybackRate(rate);
        ref.current.playbackRate = rate;
    };

    const toggleMuted = () => {
        setIsMuted(!isMuted);
        ref.current.muted = !isMuted;
    };

    const onVolumeChange = () => {
        if (ref.current.muted || ref.current.volume === 0) {
            setIsMuted(true);
        } else if (!ref.current.muted) {
            setIsMuted(false);
            setVolume(ref.current.volume);
        }
    };

    const onVolumeScrubberChange = (event) => {
        const newVolume = Number(event.target.value);
        setVolume(newVolume);
        ref.current.volume = newVolume;
    };

    const buttonText = (
        <>
            <span className="visually-hidden">Playback Rate</span>
            <span>{playbackRate}</span>
        </>
    );

    return (
        <>
            <div>
                <button onClick={togglePlaying}>
                    {isPlaying ? (
                        <>
                            <span className="visually-hidden">Pause</span>
                            <FaPauseCircle aria-hidden="true" />
                        </>
                    ) : (
                        <>
                            <span className="visually-hidden">Play</span>
                            <FaPlayCircle aria-hidden="true" />
                        </>
                    )}
                </button>
                <span className="elapsed">Elapsed Time: {formatTime(mediaTime)}</span>
                <span className="duration">Total Time: {formatTime(duration)}</span>
                <label htmlFor="time-scrubber">scrubber</label>
                <input 
                    id="time-scrubber" 
                    type="range" 
                    value={mediaTime} 
                    min={0} max={duration} 
                    onChange={onScrubberChange} 
                    aria-valuetext={formatHumanReadTime(mediaTime)}
                />
                <button aria-label="Rewind 15 seconds" onClick={onRewind}>
                    <FaUndoAlt aria-hidden="true" />
                    <span>15s</span>
                </button>
                <button aria-label="Fast-Forward 15 seconds" onClick={onFastForward}>
                    <FaRedoAlt aria-hidden="true" />
                    <span>15s</span>
                </button>
                <DropdownMenu 
                    className="audio__playback-wrapper" 
                    buttonClass="audio__playback-toggle" 
                    menuClass="audio__rates-wrapper" 
                    buttonText={buttonText} 
                    onOptionClick={changeRate}
                    options={rates} 
                />
                <button onClick={toggleMuted}>
                    {isMuted ? (
                        <>
                            <span className="visually-hidden">Unmute</span>
                            <FaVolumeMute aria-hidden="true" />
                        </>
                    ) : (
                        <>
                            <span className="visually-hidden">Mute</span>
                            <FaVolumeUp aria-hidden="true" />
                        </>
                    )}
                </button>
                <label htmlFor="volume-scrubber">Volume:</label>
                <input 
                    id="volume-scrubber" 
                    type="range" 
                    value={isMuted ? 0 : volume} 
                    min={0} 
                    max={1} 
                    step={0.1} 
                    onChange={onVolumeScrubberChange}
                />
            </div>
            <audio 
                ref={ref} 
                onLoadedMetadata={onLoadedMetadata} 
                onTimeUpdate={onTimeUpdate} 
                onPlay={() =>  setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={onVolumeChange}
                src={src} 
                controls 
            />
            <div>{transcript}</div>
        </>
    );
});

export default AudioPlayer;
