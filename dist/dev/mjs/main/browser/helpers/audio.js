import { CalcObjectBuilder, delay, ObservableClass } from 'webrain';

function waitProperty(object, propertyName, predicate) {
  if (predicate(object[propertyName])) {
    return;
  }

  return new Promise((resolve, reject) => {
    let unsubscribe;

    const onResolve = () => {
      unsubscribe();
      resolve();
    };

    unsubscribe = object.propertyChanged.subscribe(({
      name,
      oldValue,
      newValue
    }) => {
      if (name === propertyName && predicate(newValue)) {
        onResolve();
      }
    });

    if (predicate(object[propertyName])) {
      onResolve();
    }
  });
}

export class AudioPlayer extends ObservableClass {
  constructor(...sources) {
    super();
    this.stopped = true;

    if (typeof window === 'undefined') {
      return;
    }

    this._audio = new Audio();
    this._audio.preload = 'none';
    let unsubscribers = [];

    const bind = (event, handler) => {
      this._audio.addEventListener(event, handler, false);

      unsubscribers.push(() => {
        this._audio.removeEventListener(event, handler, false);
      });
    };

    const unbind = () => {
      if (unsubscribers) {
        unsubscribers.forEach(o => o());
        unsubscribers = null;
      }
    };

    const onStop = () => {
      this.stopped = true;
    };

    const onError = err => {
      this.error = err;
      this.stopped = true;
    };

    bind('canplay', o => {
      console.log('AudioPlayer: canplay');
      this.canPlay = true;
    });
    bind('abort', o => {
      console.log('AudioPlayer: abort');
      onStop();
    });
    bind('emptied', o => {
      console.log('AudioPlayer: emptied'); // onStop()
    });
    bind('error', o => {
      console.log('AudioPlayer: error');
      onError(new Error('Audio load error: ' + this._audio.src));
    });
    bind('stalled', o => {
      console.log('AudioPlayer: stalled'); // onStop()
    });
    bind('waiting', o => {
      console.log('AudioPlayer: waiting'); // onStop()
    });
    bind('suspend', o => {
      console.log('AudioPlayer: suspend'); // onStop()
    });
    bind('ended', o => {
      console.log('AudioPlayer: ended');
      onStop();
    });
    bind('pause', o => {
      console.log('AudioPlayer: pause');
      onStop();
    });
    this._sources = sources.flatMap(source => Array.isArray(source) ? source : [source]).map(source => {
      if (typeof source === 'string') {
        const ext = source.match(/\.(\w+)$/)[1];

        if (!ext) {
          throw new Error(`Unknown file format: ${source}`);
        }

        source = {
          src: source,
          format: `audio/${ext}`
        };
      }

      return source;
    }).map(source => {
      const sourceElement = document.createElement('source');
      Object.assign(sourceElement, source);
      return sourceElement;
    });
  }

  init() {
    if (this._initialized) {
      return;
    }

    this._initialized = true;

    for (let i = 0; i < this._sources.length; i++) {
      this._audio.appendChild(this._sources[i]);
    }
  }

  preload() {
    if (!this._audio) {
      return;
    }

    this._audio.preload = 'auto';
    this.init();
  }

  async waitCanPlay() {
    if (!this._audio) {
      return;
    }

    await waitProperty(this, 'canPlay', o => o);
  }

  async waitEnd() {
    if (!this._audio) {
      return;
    }

    await waitProperty(this, 'stopped', o => o);

    if (this.error) {
      throw this.error;
    }
  }

  async _play(waitEnd) {
    this.stopped = false;
    const wait = waitEnd ? this.waitEnd() : null;

    try {
      console.log('AudioPlayer: play()');
      await this._audio.play();
    } catch (err) {
      this.error = err;
      throw err;
    }

    return wait;
  }

  play(waitEnd = true) {
    if (!this._audio) {
      return;
    }

    this.init();

    if (this.error) {
      this.error = null;
      this.stop();
      console.log('AudioPlayer: load()');

      this._audio.load();
    } else if (this.stopped && this._audio.duration) {
      this._audio.currentTime = 0;

      if (this._audio.currentTime) {
        console.log('AudioPlayer: load()');

        this._audio.load();
      }
    }

    return this._play(waitEnd);
  }

  pause() {
    if (!this._audio) {
      return;
    }

    console.log('AudioPlayer: pause()');

    this._audio.pause();
  }

  resume(waitEnd = true) {
    if (!this._audio) {
      return;
    }

    return this._play(waitEnd);
  }

  stop() {
    if (!this._audio) {
      return;
    }

    console.log('AudioPlayer: pause()');

    this._audio.pause();

    if (this._audio.duration) {
      this._audio.currentTime = 0;
      this.stopped = true;
    }
  }

}
new CalcObjectBuilder(AudioPlayer.prototype).writable('canPlay').writable('stopped', {
  setOptions: {
    afterChange(oldValue, newValue) {
      if (!newValue) {
        this.error = null;
      }

      console.log(newValue ? 'AudioPlayer stopped' : 'AudioPlayer played');
    }

  }
}).writable('error', {
  setOptions: {
    afterChange(oldValue, newValue) {
      if (newValue) {
        this.stopped = true;
      }
    }

  }
});
const _cache = {};
export function getAudio(source) {
  source = new URL(source, document.baseURI).href;
  let item = _cache[source];

  if (!item) {
    _cache[source] = item = new AudioPlayer(source);
    item.preload();
  }

  return item;
}
export class AudioQueue {
  constructor() {
    this._queue = new Set();
  }

  async play(source) {
    if (!source) {
      return;
    }

    if (!(source instanceof AudioPlayer)) {
      source = getAudio(source);
    }

    await source.waitCanPlay(); // add to queue or move to end

    this._queue.delete(source);

    this._queue.add(source);

    return await this._play();
  }

  _play() {
    if (!this._playThenable) {
      this._playThenable = this.__play();
    }

    return this._playThenable;
  }

  async __play() {
    console.log('AudioQueue play');

    try {
      while (true) {
        // get AudioPlayer from queue
        const iterator = this._queue[Symbol.iterator]();

        const iteration = iterator.next();

        if (iteration.done) {
          return;
        }

        const audio = iteration.value;

        try {
          // play and wait
          audio.stop();
          await Promise.race([delay(60000), audio.play()]);
        } catch (ex) {
          console.error(ex);
        } finally {
          // delete AudioPlayer from queue
          this._queue.delete(audio);
        } // silence after play sound


        await delay(1000);
      }
    } finally {
      this._playThenable = null;
      console.log('AudioQueue stopped');
    }
  }

}
export const audioQueue = new AudioQueue();