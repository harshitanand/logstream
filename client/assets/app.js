/* eslint-disable no-undef */

'use strict';

window.App = (function app(window, document) {
  let _socket;
  let _logContainer;
  let _filterInput;
  let _filterValue = '';
  let _pauseBtn;
  let _isPaused = false;
  let _skipCounter = 0;
  let _topbar;
  let _body;
  let _linesLimit = Math.Infinity;
  let _newLinesCount = 0;
  let _isWindowFocused = true;
  let _highlightConfig;

  const _filterElement = function(elem) {
    const pattern = new RegExp(_filterValue, 'i');
    const element = elem;
    if (pattern.test(element.textContent)) {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  };

  const _filterLogs = function() {
    const collection = _logContainer.childNodes;
    let i = collection.length;

    if (i === 0) {
      return;
    }

    while (i) {
      _filterElement(collection[i - 1]);
      i -= 1;
    }
    window.scrollTo(0, document.body.scrollHeight);
  };

  const _setFilterValueFromURL = function(filterInput, uri) {
    const _url = new URL(uri);
    const _filterValueFromURL = _url.searchParams.get('filter');
    if (typeof _filterValueFromURL !== 'undefined' && _filterValueFromURL !== null) {
      _filterValue = _filterValueFromURL;
      filterInput.value = _filterValue; // eslint-disable-line
    }
  };

  const _setFilterParam = function(value, uri) {
    const _url = new URL(uri);
    const _params = new URLSearchParams(_url.search.slice(1));
    if (value === '') {
      _params.delete('filter');
    } else {
      _params.set('filter', value);
    }
    _url.search = _params.toString();
    window.history.replaceState(null, document.title, _url.toString());
  };

  const _faviconReset = function() {
    _newLinesCount = 0;
    Tinycon.setBubble(0);
  };

  const _updateFaviconCounter = function() {
    if (_isWindowFocused || _isPaused) {
      return;
    }

    if (_newLinesCount < 99) {
      _newLinesCount += 1;
      Tinycon.setBubble(_newLinesCount);
    }
  };

  const _highlightWord = function(line) {
    let output = line;

    if (_highlightConfig && _highlightConfig.words) {
      Object.keys(_highlightConfig.words).forEach(wordCheck => {
        output = output.replace(wordCheck, `<span style="${_highlightConfig.words[wordCheck]}">${wordCheck}</span>`);
      });
    }

    return output;
  };

  const _highlightLine = function(line, container) {
    if (_highlightConfig && _highlightConfig.lines) {
      Object.keys(_highlightConfig.lines).forEach(lineCheck => {
        if (line.indexOf(lineCheck) !== -1) {
          container.setAttribute('style', _highlightConfig.lines[lineCheck]);
        }
      });
    }

    return container;
  };

  return {
    init: function init(opts) {
      const self = this;

      _logContainer = opts.container;
      _filterInput = opts.filterInput;
      _filterInput.focus();
      _pauseBtn = opts.pauseBtn;
      _topbar = opts.topbar;
      _body = opts.body;

      _setFilterValueFromURL(_filterInput, window.location.toString());

      _filterInput.addEventListener('keyup', function(e) {
        if (e.keyCode === 27) {
          this.value = '';
          _filterValue = '';
        } else {
          _filterValue = this.value;
        }
        _setFilterParam(_filterValue, window.location.toString());
        _filterLogs();
      });

      _pauseBtn.addEventListener('mouseup', function() {
        _isPaused = !_isPaused;
        if (_isPaused) {
          this.className += ' play';
        } else {
          _skipCounter = 0;
          this.classList.remove('play');
        }
      });

      window.addEventListener(
        'blur',
        () => {
          _isWindowFocused = false;
        },
        true
      );
      window.addEventListener(
        'focus',
        () => {
          _isWindowFocused = true;
          _faviconReset();
        },
        true
      );

      _socket = opts.socket;
      _socket
        .on('linescount', limit => {
          _linesLimit = limit;
        })
        .on('line', line => {
          if (_isPaused) {
            _skipCounter += 1;
            self.log(`==> SKIPED: ${_skipCounter} <==`, _skipCounter > 1);
          } else {
            self.log(line);
          }
        });
    },

    log: function log(data, replace = false) {
      const wasScrolledBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
      let div = document.createElement('div');
      const p = document.createElement('p');
      p.className = 'inner-line';

      data = ansi_up.escape_txt_for_html(data); // eslint-disable-line
      data = ansi_up.ansi_to_html(data); // eslint-disable-line
      p.innerHTML = _highlightWord(data);

      div.className = 'line';
      div = _highlightLine(data, div);
      div.addEventListener('click', function click() {
        if (this.className.indexOf('selected') === -1) {
          this.className = 'line-selected';
        } else {
          this.className = 'line';
        }
      });

      div.appendChild(p);
      _filterElement(div);
      if (replace) {
        _logContainer.replaceChild(div, _logContainer.lastChild);
      } else {
        _logContainer.appendChild(div);
      }

      if (_logContainer.children.length > _linesLimit) {
        _logContainer.removeChild(_logContainer.children[0]);
      }

      if (wasScrolledBottom) {
        window.scrollTo(0, document.body.scrollHeight);
      }

      _updateFaviconCounter();
    },
  };
})(window, document);
