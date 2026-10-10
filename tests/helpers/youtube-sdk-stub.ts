/** Deterministic SDK contract stub: exercises real production helpers without network. */
export const youtubeSdkStub = `
window.sdkPlayers=[];
window.YT={Player:class {
  constructor(iframe,options){this.events=options.events;this.time=0;this.level=100;
    this.muted=false;this.destroyed=false;window.sdkPlayers.push(this);
    setTimeout(()=>this.events.onReady({target:this}),0);}
  getDuration(){return 120;} getCurrentTime(){return this.time;}
  getVolume(){return this.level;} isMuted(){return this.muted;}
  playVideo(){this.events.onStateChange({target:this,data:1});}
  pauseVideo(){this.events.onStateChange({target:this,data:2});}
  seekTo(time){this.time=time;}
  setVolume(level){this.level=level;} mute(){this.muted=true;} unMute(){this.muted=false;}
  destroy(){this.destroyed=true;}
}};
window.onYouTubeIframeAPIReady?.();`;
