import Fasttracker from './ft2.js';
/* eslint-disable */
/*
  front end wrapper class for format-specific player classes
  (c) 2015 firehawk/tda
*/

// helper functions for picking up signed, unsigned, little endian, etc from an unsigned 8-bit buffer
function le_word(buffer, offset) {
  return buffer[offset]|(buffer[offset+1]<<8);
}
function le_dword(buffer, offset) {
  return buffer[offset]|(buffer[offset+1]<<8)|(buffer[offset+2]<<16)|(buffer[offset+3]<<24);
}
function s_byte(buffer, offset) {
  return (buffer[offset]<128)?buffer[offset]:(buffer[offset]-256);
}
function s_le_word(buffer, offset) {
  return (le_word(buffer,offset)<32768)?le_word(buffer,offset):(le_word(buffer,offset)-65536);
}
// convert from MS-DOS extended ASCII to Unicode
function dos2utf(c) {
  if (c<128) return String.fromCharCode(c);
  var cs=[
    0x00c7, 0x00fc, 0x00e9, 0x00e2, 0x00e4, 0x00e0, 0x00e5, 0x00e7, 0x00ea, 0x00eb, 0x00e8, 0x00ef, 0x00ee, 0x00ec, 0x00c4, 0x00c5,
    0x00c9, 0x00e6, 0x00c6, 0x00f4, 0x00f6, 0x00f2, 0x00fb, 0x00f9, 0x00ff, 0x00d6, 0x00dc, 0x00f8, 0x00a3, 0x00d8, 0x00d7, 0x0192,
    0x00e1, 0x00ed, 0x00f3, 0x00fa, 0x00f1, 0x00d1, 0x00aa, 0x00ba, 0x00bf, 0x00ae, 0x00ac, 0x00bd, 0x00bc, 0x00a1, 0x00ab, 0x00bb,
    0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x00c1, 0x00c2, 0x00c0, 0x00a9, 0x2563, 0x2551, 0x2557, 0x255d, 0x00a2, 0x00a5, 0x2510,
    0x2514, 0x2534, 0x252c, 0x251c, 0x2500, 0x253c, 0x00e3, 0x00c3, 0x255a, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256c, 0x00a4,
    0x00f0, 0x00d0, 0x00ca, 0x00cb, 0x00c8, 0x0131, 0x00cd, 0x00ce, 0x00cf, 0x2518, 0x250c, 0x2588, 0x2584, 0x00a6, 0x00cc, 0x2580,
    0x00d3, 0x00df, 0x00d4, 0x00d2, 0x00f5, 0x00d5, 0x00b5, 0x00fe, 0x00de, 0x00da, 0x00db, 0x00d9, 0x00fd, 0x00dd, 0x00af, 0x00b4,
    0x00ad, 0x00b1, 0x2017, 0x00be, 0x00b6, 0x00a7, 0x00f7, 0x00b8, 0x00b0, 0x00a8, 0x00b7, 0x00b9, 0x00b3, 0x00b2, 0x25a0, 0x00a0
  ];
  return String.fromCharCode(cs[c-128]);
}

function Modplayer()
{
  this.supportedformats=new Array('mod', 's3m', 'xm');

  this.url="";
  this.format="xm";

  this.state="initializing..";
  this.request=null;

  this.loading=false;
  this.playing=false;
  this.paused=false;
  this.repeat=false;

  this.separation=1;
  this.mixval=8.0;

  this.amiga500=false;

  this.filter=false;
  this.endofsong=false;

  this.autostart=false;
  this.bufferstodelay=4; // adjust this if you get stutter after loading new song
  this.delayfirst=0;
  this.delayload=0;

  this.onReady=function(){};
  this.onPlay=function(){};
  this.onStop=function(){};

  this.buffer=0;
  this.mixerNode=0;
  this.context=null;
  this.samplerate=44100;
  this.bufferlen=4096;

  this.chvu=new Float32Array(32);

  // format-specific player
  this.player=null;

  // read-only data from player class
  this.title="";
  this.signature="....";
  this.songlen=0;
  this.channels=0;
  this.patterns=0;
  this.samplenames=new Array();

  this.player=new Fasttracker();
}



// load module from url into local buffer
Modplayer.prototype.load = function(url)
{
  // try to identify file format from url and create a new
  // player class for it
  this.url=url;
  var ext=url.split('.').pop().toLowerCase().trim();
  if (this.supportedformats.indexOf(ext)==-1) {
    // unknown extension, maybe amiga-style prefix?
    ext=url.split('/').pop().split('.').shift().toLowerCase().trim();
    if (this.supportedformats.indexOf(ext)==-1) {
      // ok, give up
      return false;
    }
  }
  this.format=ext;

  switch (ext) {
    case 'mod':
      this.player=new Protracker();
      break;
    case 's3m':
      this.player=new Screamtracker();
      break;
    case 'xm':
      this.player=new Fasttracker();
      break;
  }

  this.player.onReady=this.loadSuccess;

  this.state="loading..";
  var request = new XMLHttpRequest();
  request.open("GET", this.url, true);
  request.responseType = "arraybuffer";
  this.request = request;
  this.loading=true;
  var asset = this;
  request.onprogress = function(oe) {
    asset.state="loading ("+Math.floor(100*oe.loaded/oe.total)+"%)..";
  };
  request.onload = function() {
    var buffer=new Uint8Array(request.response);
    this.state="parsing..";
    if (asset.player.parse(buffer)) {
      // copy static data from player
      asset.title=asset.player.title
      asset.signature=asset.player.signature;
      asset.songlen=asset.player.songlen;
      asset.channels=asset.player.channels;
      asset.patterns=asset.player.patterns;
      asset.filter=asset.player.filter;
      asset.mixval=asset.player.mixval; // usually 8.0, though
      asset.samplenames=new Array(32)
      for(var i=0;i<32;i++) asset.samplenames[i]="";
      if (asset.format=='xm' || asset.format=='it') {
        for(i=0;i<asset.player.instrument.length;i++) asset.samplenames[i]=asset.player.instrument[i].name;
      } else {
        for(i=0;i<asset.player.sample.length;i++) asset.samplenames[i]=asset.player.sample[i].name;
      }

      asset.state="ready.";
      asset.loading=false;
      asset.onReady();
      if (asset.autostart) asset.play();
    } else {
      asset.state="error!";
      asset.loading=false;
    }
  }
  request.send();
  return true;
}

Modplayer.prototype.loadFromBuffer = function(data) {
  this.state="parsing..";

  this.player.onReady=this.loadSuccess;

  this.state="loading..";
  this.loading=true;

  var buffer=new Uint8Array(data);

  if(this.player.parse(buffer)) {
    // copy static data from player
    this.title=this.player.title;
    this.signature=this.player.signature;
    this.songlen=this.player.songlen;
    this.channels=this.player.channels;
    this.patterns=this.player.patterns;
    this.filter=this.player.filter;
    this.mixval=this.player.mixval; // usually 8.0, though
    this.samplenames=new Array(32);

    for(i=0;i<32;i++) this.samplenames[i]="";
    for(i=0;i<this.player.instrument.length;i++) this.samplenames[i]=this.player.instrument[i].name;

    this.state="ready.";
    this.loading=false;
    this.onReady();
    if (this.autostart) this.play();
  } else {
    this.state="error!";
    this.loading=false;
  }
}




// play loaded and parsed module with webaudio context
Modplayer.prototype.play = function()
{
  if (this.loading) return false;
  if (this.player) {
    if (this.context==null) this.createContext();
    this.player.samplerate=this.samplerate;

    if (this.player.paused) {
      this.player.paused=false;
      return true;
    }
    this.endofsong=false;
    this.player.endofsong=false;
    this.player.paused=false;
    this.player.initialize();
    this.player.flags=1+2;
    this.player.playing=true;
    this.playing=true;

    this.chvu=new Float32Array(this.player.channels);
    for(var i=0;i<this.player.channels;i++) this.chvu[i]=0.0;

    this.onPlay();

    this.player.delayfirst=this.bufferstodelay;
    return true;
  } else {
    return false;
  }
}



// pause playback
Modplayer.prototype.pause = function()
{
  if (this.player) {
    if (!this.player.paused) {
      this.player.paused=true;
    } else {
      this.player.paused=false;
    }
  }
}



// stop playback
Modplayer.prototype.stop = function()
{
  this.paused=false;
  this.playing=false;
  if (this.player) {
    this.player.paused=false;
    this.player.playing=false;
    this.player.delayload=1;
  }
  this.onStop();
}

Modplayer.prototype.setVolume = function(vol) {
    this.gainNode.gain.value = vol;
}



// stop playing but don't call callbacks
Modplayer.prototype.stopaudio = function(st)
{
  if (this.player) {
    this.player.playing=st;
  }
}



// jump positions forward/back
Modplayer.prototype.jump = function(step)
{
  if (this.player) {
    this.player.tick=0;
    this.player.row=0;
    this.player.position+=step;
    this.player.flags=1+2;
    if (this.player.position<0) this.player.position=0;
    if (this.player.position >= this.player.songlen) this.stop();
  }
  this.position=this.player.position;
  this.row=this.player.row;
}



// set whether module repeats after songlen
Modplayer.prototype.setrepeat = function(rep)
{
  this.repeat=rep;
  if (this.player) this.player.repeat=rep;
}



// set stereo separation mode (0=standard, 1=65/35 mix, 2=mono)
Modplayer.prototype.setseparation = function(sep)
{
  this.separation=sep;
  if (this.player) this.player.separation=sep;
}



// set autostart to play immediately after loading
Modplayer.prototype.setautostart = function(st)
{
  this.autostart=st;
}



// set amiga model - changes lowpass filter state
Modplayer.prototype.setamigamodel = function(amiga)
{
  if (amiga=="600" || amiga=="1200" || amiga=="4000") {
    this.amiga500=false;
    if (this.filterNode) this.filterNode.frequency.value=22050;
  } else {
    this.amiga500=true;
    if (this.filterNode) this.filterNode.frequency.value=6000;
  }
}



// amiga "LED" filter
Modplayer.prototype.setfilter = function(f)
{
  if (f) {
    this.lowpassNode.frequency.value=3275;
  } else {
     this.lowpassNode.frequency.value=22050;//22050
  }
  this.filter=f;
  if (this.player) this.player.filter=f;
}



// are there E8x sync events queued?
Modplayer.prototype.hassyncevents = function()
{
  if (this.player) return (this.player.syncqueue.length != 0);
  return false;
}



// pop oldest sync event nybble from the FIFO queue
Modplayer.prototype.popsyncevent = function()
{
  if (this.player) return this.player.syncqueue.pop();
}



// ger current pattern number
Modplayer.prototype.currentpattern = function()
{
  if (this.player) return this.player.patterntable[this.player.position];
}



// get current pattern in standard unpacked format (note, sample, volume, command, data)
// note: 254=noteoff, 255=no note
// sample: 0=no instrument, 1..255=sample number
// volume: 255=no volume set, 0..64=set volume, 65..239=ft2 volume commands
// command: 0x2e=no command, 0..0x24=effect command
// data: 0..255
Modplayer.prototype.patterndata = function(pn)
{
  var i, c, patt;
  if (this.format=='mod') {
    patt=new Uint8Array(this.player.pattern_unpack[pn]);
    for(i=0;i<64;i++) for(c=0;c<this.player.channels;c++) {
      if (patt[i*5*this.channels+c*5+3]==0 && patt[i*5*this.channels+c*5+4]==0) {
        patt[i*5*this.channels+c*5+3]=0x2e;
      } else {
        patt[i*5*this.channels+c*5+3]+=0x37;
        if (patt[i*5*this.channels+c*5+3]<0x41) patt[i*5*this.channels+c*5+3]-=0x07;
      }
    }
  } else if (this.format=='s3m') {
    patt=new Uint8Array(this.player.pattern[pn]);
    for(i=0;i<64;i++) for(c=0;c<this.player.channels;c++) {
      if (patt[i*5*this.channels+c*5+3]==255) patt[i*5*this.channels+c*5+3]=0x2e;
      else patt[i*5*this.channels+c*5+3]+=0x40;
    }
  } else if (this.format=='xm') {
    patt=new Uint8Array(this.player.pattern[pn]);
    for(i=0;i<this.player.patternlen[pn];i++) for(c=0;c<this.player.channels;c++) {
      if (patt[i*5*this.channels+c*5+0]<97)
        patt[i*5*this.channels+c*5+0]=(patt[i*5*this.channels+c*5+0]%12)|(Math.floor(patt[i*5*this.channels+c*5+0]/12)<<4);
      if (patt[i*5*this.channels+c*5+3]==255) patt[i*5*this.channels+c*5+3]=0x2e;
      else {
        if (patt[i*5*this.channels+c*5+3]<0x0a) {
          patt[i*5*this.channels+c*5+3]+=0x30;
        } else {
          patt[i*5*this.channels+c*5+3]+=0x41-0x0a;
        }
      }
    }
  }
  return patt;
}



// check if a channel has a note on
Modplayer.prototype.noteon = function(ch)
{
  if (ch>=this.channels) return 0;
  return this.player.channel[ch].noteon;
}



// get currently active sample on channel
Modplayer.prototype.currentsample = function(ch)
{
  if (ch>=this.channels) return 0;
  if (this.format=="xm" || this.format=="it") return this.player.channel[ch].instrument;
  return this.player.channel[ch].sample;
}



// get length of currently playing pattern
Modplayer.prototype.currentpattlen = function()
{
  if (this.format=="mod" || this.format=="s3m") return 64;
  return this.player.patternlen[this.player.patterntable[this.player.position]];
}



// create the web audio context
Modplayer.prototype.createContext = function()
{
  if ( typeof AudioContext !== 'undefined') {
    this.context = new AudioContext();
  } else {
    this.context = new webkitAudioContext();
  }
  this.samplerate=this.context.sampleRate;
  this.bufferlen=(this.samplerate > 44100) ? 4096 : 2048;

  // Amiga 500 fixed filter at 6kHz. WebAudio lowpass is 12dB/oct, whereas
  // older Amigas had a 6dB/oct filter at 4900Hz.
  this.filterNode=this.context.createBiquadFilter();
  if (this.amiga500) {
    this.filterNode.frequency.value=6000;
  } else {
    this.filterNode.frequency.value=22050;
  }

  // "LED filter" at 3275kHz - off by default
  this.lowpassNode=this.context.createBiquadFilter();
  this.setfilter(this.filter);

  // mixer
  if ( typeof this.context.createJavaScriptNode === 'function') {
    this.mixerNode=this.context.createJavaScriptNode(this.bufferlen, 1, 2);
  } else {
    this.mixerNode=this.context.createScriptProcessor(this.bufferlen, 1, 2);
  }
  this.mixerNode.module=this;
  this.mixerNode.onaudioprocess=Modplayer.prototype.mix;

  this.gainNode = this.context.createGain();

  // patch up some cables :)
  this.mixerNode.connect(this.filterNode);
  this.filterNode.connect(this.lowpassNode);
  this.lowpassNode.connect(this.gainNode);
  this.gainNode.connect(this.context.destination)
}



// scriptnode callback - pass through to player class
Modplayer.prototype.mix = function(ape) {
  var mod;

  if (ape.srcElement) {
    mod=ape.srcElement.module;
  } else {
    mod=this.module;
  }

  if (mod.player && mod.delayfirst==0) {
    mod.player.repeat=mod.repeat;

    var bufs=new Array(ape.outputBuffer.getChannelData(0), ape.outputBuffer.getChannelData(1));
    var buflen=ape.outputBuffer.length;
    mod.player.mix(mod.player, bufs, buflen);

    // apply stereo separation and soft clipping
    var outp=new Float32Array(2);
    for(var s=0;s<buflen;s++) {
      outp[0]=bufs[0][s];
      outp[1]=bufs[1][s];

      // a more headphone-friendly stereo separation
      if (mod.separation) {
        t=outp[0];
        if (mod.separation==2) { // mono
          outp[0]=outp[0]*0.5 + outp[1]*0.5;
          outp[1]=outp[1]*0.5 + t*0.5;
        } else { // narrow stereo
          outp[0]=outp[0]*0.65 + outp[1]*0.35;
          outp[1]=outp[1]*0.65 + t*0.35;
        }
      }

      // scale down and soft clip
      outp[0]/=mod.mixval; outp[0]=0.5*(Math.abs(outp[0]+0.975)-Math.abs(outp[0]-0.975));
      outp[1]/=mod.mixval; outp[1]=0.5*(Math.abs(outp[1]+0.975)-Math.abs(outp[1]-0.975));

      bufs[0][s]=outp[0];
      bufs[1][s]=outp[1];
    }

    mod.row=mod.player.row;
    mod.position=mod.player.position;
    mod.speed=mod.player.speed;
    mod.bpm=mod.player.bpm;
    mod.endofsong=mod.player.endofsong;

    if (mod.player.filter != mod.filter) {
      mod.setfilter(mod.player.filter);
    }

    if (mod.endofsong && mod.playing) mod.stop();

    if (mod.delayfirst>0) mod.delayfirst--;
    mod.delayload=0;

    // update this.chvu from player channel vu
    for(var i=0;i<mod.player.channels;i++) {
      mod.chvu[i]=mod.chvu[i]*0.25 + mod.player.chvu[i]*0.75;
      mod.player.chvu[i]=0.0;
    }
  }


}

export default Modplayer;
