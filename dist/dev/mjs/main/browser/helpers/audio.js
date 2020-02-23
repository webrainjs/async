export class AudioPlayer {
  constructor(...sources) {
    if (typeof window === 'undefined') {
      this.preload = () => {};

      this.play = () => {};

      this.pause = () => {};

      this.resume = () => {};

      return;
    }

    const audio = new Audio();
    audio.preload = 'none';
    sources = sources.flatMap(source => Array.isArray(source) ? source : [source]).map(source => {
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
    let initialized;

    function init() {
      if (initialized) {
        return;
      }

      initialized = true;

      for (let i = 0; i < sources.length; i++) {
        audio.appendChild(sources[i]);
      }
    }

    this.preload = function () {
      audio.preload = 'auto';
      init();
    };

    let stopped = true;

    this.play = function () {
      if (stopped && audio.duration) {
        audio.currentTime = 0;

        if (audio.currentTime) {
          init();
          audio.load();
        }
      }

      audio.play();
    };

    this.pause = function () {
      audio.pause();
    };

    this.resume = function () {
      audio.play();
    };

    this.stop = function () {
      audio.pause();

      if (audio.duration) {
        audio.currentTime = 0;
        stopped = true;
      }
    };
  }

}