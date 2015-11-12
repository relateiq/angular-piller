var moduleName = 'SearchDisplay';

module.exports = moduleName;

angular.module(moduleName, [])

.factory('SearchDisplaySrvc', function() {
  var SearchDisplaySrvc = {};
  var matchesEl = document.querySelector('.matches');
  var onSearchDisplayKeydownListener;

  SearchDisplaySrvc.showSearchMatches = showSearchMatches;

  function showSearchMatches(pillerInstance, pillCorpus, matches) {
    matchesEl.innerHTML = '';

    matches.forEach(function(match, i) {
      var div = document.createElement('div');
      div.textContent = match.text;
      div.setAttribute('data-pill-id', match.id);

      if (i === 0) {
        setAsActive(div);
      }

      matchesEl.appendChild(div);
    });

    if (matches.length) {
      addSearchDisplayListeners(pillerInstance, pillCorpus);
    } else {
      removeSearchDisplayListeners(pillerInstance);
    }
  }

  function addSearchDisplayListeners(pillerInstance, pillCorpus) {
    removeSearchDisplayListeners(pillerInstance);
    onSearchDisplayKeydownListener = onSearchDisplayKeydown.bind(null, pillerInstance, pillCorpus);
    pillerInstance.ui.textarea.addEventListener('keydown', onSearchDisplayKeydownListener);
  }

  function removeSearchDisplayListeners(pillerInstance) {
    pillerInstance.ui.textarea.removeEventListener('keydown', onSearchDisplayKeydownListener);
  }

  function onSearchDisplayKeydown(pillerInstance, pillCorpus, e) {
    var handled = false;

    switch (e.which) {
      case 38: // UP_ARROW
        moveSearchSelection(-1);
        handled = true;
        break;
      case 40: // DOWN_ARROW
        moveSearchSelection(1);
        handled = true;
        break;
      case 9: // TAB
        if (!e.shiftKey) {
          selectSearchMatch(pillerInstance, pillCorpus);
          handled = true;
        }
      case 13: // ENTER
        selectSearchMatch(pillerInstance, pillCorpus);
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
    }
  }

  function selectSearchMatch(pillerInstance, pillCorpus) {
    var activeIndex = getActiveIndex();

    if (activeIndex < 0) {
      return;
    }

    var activeMatch = matchesEl.children[activeIndex];

    if (!activeMatch) {
      return;
    }

    var pillId = matchesEl.children[activeIndex].getAttribute('data-pill-id');
    var selectedPill;

    pillCorpus.some(function(pill) {
      if (pillId === pill.id) {
        selectedPill = pill;
        return true;
      }
    });

    pillerInstance.selectSearchMatch(selectedPill);
    matchesEl.innerHTML = '';
    removeSearchDisplayListeners(pillerInstance);
  }

  function getActiveIndex() {
    var activeIndex;

    Array.prototype.slice.call(matchesEl.children).some(function(child, i) {
      if (child.hasAttribute('active')) {
        activeIndex = i;
        return true;
      }
    });

    return activeIndex;
  }

  function moveSearchSelection(direction) {
    var origActiveIndex = getActiveIndex();
    var newActiveIndex = Math.max(0, Math.min(origActiveIndex + direction, matchesEl.children.length - 1));

    if (origActiveIndex !== newActiveIndex) {
      setAsNotActive(matchesEl.children[origActiveIndex]);
      setAsActive(matchesEl.children[newActiveIndex]);
    }
  }

  function setAsActive(el) {
    el.setAttribute('active', '');
    el.style.backgroundColor = '#dddddd';
  }

  function setAsNotActive(el) {
    el.removeAttribute('active');
    el.style.backgroundColor = '';
  }

  return SearchDisplaySrvc;
});