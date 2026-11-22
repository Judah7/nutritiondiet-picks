(function () {
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('site-menu');
  if (toggle && menu && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.focus();
      }
    });
  }
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  window.ndpLoadBlog = function (data) {
    try {
      var grid = document.getElementById('blog-grid');
      if (!grid || !data || !data.feed || !data.feed.entry) return;
      var known = 'https://nutritiondietpicks.blogspot.com/2026/11/a-simple-weekly-meal-prep-routine-that.html';
      var entries = data.feed.entry.slice(0, 4);
      entries.forEach(function (entry) {
        var link = '';
        (entry.link || []).forEach(function (l) {
          if (l.rel === 'alternate' && l.type === 'text/html') link = l.href || '';
        });
        if (!link || link.replace(/\/$/, '') === known.replace(/\/$/, '')) return;
        if (link.indexOf('nutritiondietpicks.blogspot.com') === -1) return;
        var title = (entry.title && (entry.title.$t || entry.title)) || 'Blog post';
        var raw = (entry.summary && entry.summary.$t) || (entry.content && entry.content.$t) || '';
        var tmp = document.createElement('div');
        tmp.innerHTML = raw;
        var excerpt = (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
        if (excerpt.length > 180) excerpt = excerpt.slice(0, 177) + '…';
        var published = (entry.published && entry.published.$t) || '';
        var dateLabel = '';
        if (published) {
          var d = new Date(published);
          if (!isNaN(d.getTime())) {
            dateLabel = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          }
        }
        var card = document.createElement('a');
        card.className = 'blog-card';
        card.href = link;
        card.target = '_blank';
        card.rel = 'noopener';
        var meta = document.createElement('p');
        meta.className = 'meta';
        meta.textContent = dateLabel || 'From the blog';
        var h = document.createElement('h3');
        h.textContent = title;
        var p = document.createElement('p');
        p.textContent = excerpt;
        var more = document.createElement('span');
        more.className = 'more';
        more.textContent = 'Read on the blog →';
        card.appendChild(meta);
        card.appendChild(h);
        if (excerpt) card.appendChild(p);
        card.appendChild(more);
        grid.appendChild(card);
      });
    } catch (err) {
      /* keep the static fallback card */
    }
  };

  if (document.getElementById('blog-grid')) {
    var s = document.createElement('script');
    s.src = 'https://nutritiondietpicks.blogspot.com/feeds/posts/default?alt=json-in-script&callback=ndpLoadBlog';
    s.async = true;
    s.onerror = function () {};
    document.body.appendChild(s);
  }
})();
