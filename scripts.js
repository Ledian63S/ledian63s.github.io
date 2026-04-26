(function () {
  'use strict';

  /* ─── Reading progress bar + active TOC (blog posts only) ─── */
  if (document.querySelector('.post-body')) {
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.prepend(bar);

    const toc = document.querySelector('.post-aside-toc');
    const tocLinks = toc ? Array.from(toc.querySelectorAll('a')) : [];
    const targets = tocLinks.map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);

    const activate = function (id) {
      tocLinks.forEach(function (a) {
        a.classList.toggle('toc-active', a.getAttribute('href') === '#' + id);
      });
    };

    function elOffsetTop(el) {
      var t = 0;
      while (el) { t += el.offsetTop; el = el.offsetParent; }
      return t;
    }

    var offsets = targets.map(elOffsetTop);

    var updateToc = function (sy) {
      if (!targets.length) return;
      var active = 0;
      var threshold = window.innerHeight * 0.45;
      for (var i = targets.length - 1; i >= 0; i--) {
        if (offsets[i] - sy < threshold) { active = i; break; }
      }
      activate(targets[active].id);
    };

    tocLinks.forEach(function (a) {
      a.addEventListener('click', function () {
        activate(a.getAttribute('href').slice(1));
      });
    });

    var lastSY = -1;
    (function rafLoop() {
      var sy = window.scrollY !== undefined ? window.scrollY : document.documentElement.scrollTop;
      if (Math.abs(sy - lastSY) > 0.5) {
        lastSY = sy;
        updateToc(sy);
        var total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = (total > 0 ? (sy / total * 100) : 0) + '%';
      }
      requestAnimationFrame(rafLoop);
    }());

    updateToc(0);
  }

  const noMotion   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Animations play once per page per session — same behaviour as Julia Krantz */
  const sessionKey = 'll_' + location.pathname;
  const firstVisit = !sessionStorage.getItem(sessionKey);
  if (firstVisit) sessionStorage.setItem(sessionKey, '1');

  /* Splash is active on homepage first visit — typewriter must wait for it */
  const splashActive = firstVisit && !noMotion && document.body.classList.contains('home');

  /* ── Page intro: typewriter ── */
  (function () {
    const overlay = document.getElementById('intro');
    if (!overlay) return;
    if (noMotion || !firstVisit) { overlay.remove(); return; }

    function collectTextNodes(root) {
      const skip = '#intro,#cursor,#cookie-banner,#cookie-modal,script,style,noscript';
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          if (!node.parentElement)      return NodeFilter.FILTER_REJECT;
          if (node.parentElement.closest(skip)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const nodes = []; let n;
      while ((n = walker.nextNode())) nodes.push(n);
      return nodes;
    }

    const nodes     = collectTextNodes(document.body);
    const originals = nodes.map(n => n.textContent);
    const positions = nodes.map(n => n.parentElement.getBoundingClientRect().top + window.scrollY);

    nodes.forEach(n => { n.textContent = ''; });

    const cur = document.createElement('span');
    cur.id = 'type-cursor';
    document.body.appendChild(cur);

    function placeCursor(node) {
      try {
        const range = document.createRange();
        range.setStart(node, node.length);
        range.collapse(true);
        const rect = range.getBoundingClientRect();
        const pr   = node.parentElement.getBoundingClientRect();
        const left = rect.height ? rect.left : pr.right;
        const top  = rect.height ? rect.top  : pr.top;
        cur.style.cssText = `position:fixed;left:${left}px;top:${top + 1}px;height:${(rect.height || pr.height) * 0.78}px;width:2px;background:rgba(248,248,248,.75);pointer-events:none;z-index:9998;animation:tc-blink .5s step-end infinite;`;
      } catch (e) {}
    }

    setTimeout(() => {
      overlay.classList.add('fade');
      setTimeout(() => overlay.remove(), 500);

      const sorted = nodes.map((n, i) => ({
        node: n, orig: originals[i], y: positions[i]
      })).sort((a, b) => a.y - b.y);

      const maxY    = sorted[sorted.length - 1]?.y || 1;
      const STAGGER = 550;
      const AFTER   = 160;

      /* Group text nodes by their nearest block ancestor so that inline
         elements (e.g. <a> inside <p>) share the same charMs as the rest
         of the paragraph and don't type at a visibly different speed. */
      const blockLengths = new Map();
      sorted.forEach(({ node, orig }) => {
        const block = node.parentElement?.closest('p,h1,h2,h3,h4,li') ?? node.parentElement;
        blockLengths.set(block, (blockLengths.get(block) || 0) + orig.length);
      });

      sorted.forEach(({ node, orig, y }) => {
        const block   = node.parentElement?.closest('p,h1,h2,h3,h4,li') ?? node.parentElement;
        const groupLen = blockLengths.get(block) || orig.length;
        const charMs  = Math.max(2, Math.min(28, 480 / groupLen));
        const startAt = AFTER + (y / maxY) * STAGGER;
        let i = 0;
        setTimeout(function type() {
          i++;
          node.textContent = orig.slice(0, i);
          placeCursor(node);
          if (i < orig.length) setTimeout(type, charMs);
        }, startAt);
      });

      const last      = sorted[sorted.length - 1];
      const lastBlock = last?.node.parentElement?.closest('p,h1,h2,h3,h4,li') ?? last?.node.parentElement;
      const lastGroupLen = blockLengths.get(lastBlock) || (last?.orig.length || 1);
      const totalMs = AFTER + STAGGER + Math.max(2, Math.min(28, 480 / lastGroupLen)) * (last?.orig.length || 0) + 400;
      setTimeout(() => { cur.style.opacity = '0'; setTimeout(() => cur.remove(), 200); }, totalMs);
    /* On homepage first visit, wait for the splash curtain to rise before
       fading #intro and starting the typewriter — so both happen together */
    }, splashActive ? 2850 : 280);

    setTimeout(() => {
      nodes.forEach((n, i) => { n.textContent = originals[i]; });
      overlay.remove(); cur.remove();
    }, 10000);
  })();

  /* ── Custom cursor ── */
  const curEl = document.getElementById('cursor');
  if (curEl) {
    document.addEventListener('mousemove', e => {
      curEl.style.left = e.clientX + 'px';
      curEl.style.top  = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => curEl.classList.add('big'));
      el.addEventListener('mouseleave', () => curEl.classList.remove('big'));
    });
  }

  /* ── Page transitions ── */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#') || href.startsWith('//')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      const v = document.createElement('div');
      v.className = 'page-veil';
      v.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;z-index:10002;pointer-events:none;transition:opacity .18s ease;';
      document.body.appendChild(v);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        v.style.opacity = '1';
        setTimeout(() => { location.href = a.href; }, 210);
      }));
    });
  });

  /* ── Homepage splash / welcome screen ── */
  (function () {
    if (!document.body.classList.contains('home')) return;
    if (noMotion || !firstVisit) return;

    const splash = document.createElement('div');
    splash.id = 'splash';
    splash.innerHTML = '<div class="splash-logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#000"/><rect class="border-rect" x="1" y="1" width="30" height="30" fill="none" stroke="rgba(248,248,248,0.45)" stroke-width="1"/><text class="logo-text" x="16" y="19" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="500" fill="#f8f8f8" letter-spacing="-0.4">LL</text></svg></div>';
    document.body.appendChild(splash);

    requestAnimationFrame(() => requestAnimationFrame(() => splash.classList.add('visible')));

    /* Border draws in 1.4s, LL text appears at 1.1s — hold then curtain-rise */
    setTimeout(() => {
      splash.classList.add('fade');
      setTimeout(() => splash.remove(), 750);
    }, 2800);
  })();

  /* ── bfcache fix — only clean up on back/forward cache restores ── */
  window.addEventListener('pageshow', e => {
    if (!e.persisted) return;
    document.getElementById('intro')?.remove();
    document.getElementById('splash')?.remove();
    document.querySelectorAll('.page-veil').forEach(el => el.remove());
  });

  /* ── Image slider drag + lightbox ── */
  (function () {
    const slider = document.querySelector('.img-slider');
    if (slider) {
      let isDown = false, startX, scrollLeft;
      slider.addEventListener('mousedown', e => { isDown = true; lb._dragged = false; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
      slider.addEventListener('mouseleave', () => { isDown = false; });
      slider.addEventListener('mouseup', () => { isDown = false; setTimeout(() => { lb._dragged = false; }, 0); });
      slider.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); lb._dragged = true; slider.scrollLeft = scrollLeft - (e.pageX - slider.offsetLeft - startX) * 1.5; });
    }

    const lb = document.createElement('div'); lb.className = 'lightbox';
    const lbPrev = document.createElement('button'); lbPrev.className = 'lightbox-prev'; lbPrev.textContent = '←'; lbPrev.setAttribute('aria-label', 'Previous image');
    const lbNext = document.createElement('button'); lbNext.className = 'lightbox-next'; lbNext.textContent = '→'; lbNext.setAttribute('aria-label', 'Next image');
    const lbImg = document.createElement('img'); lbImg.alt = '';
    const lbCounter = document.createElement('div'); lbCounter.className = 'lightbox-counter';
    lb.appendChild(lbPrev); lb.appendChild(lbImg); lb.appendChild(lbNext); lb.appendChild(lbCounter);
    document.body.appendChild(lb);

    const imgs = Array.from(document.querySelectorAll('.img-slider__item img'));
    let idx = 0;

    function openAt(i) {
      idx = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[idx].src;
      lbImg.alt = imgs[idx].alt;
      lbPrev.style.display = imgs.length > 1 ? '' : 'none';
      lbNext.style.display = imgs.length > 1 ? '' : 'none';
      lbCounter.textContent = imgs.length > 1 ? (idx + 1) + ' / ' + imgs.length : '';
      lb.classList.add('active');
    }

    imgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => { if (lb._dragged) return; openAt(i); });
    });

    lbPrev.addEventListener('click', e => { e.stopPropagation(); openAt(idx - 1); });
    lbNext.addEventListener('click', e => { e.stopPropagation(); openAt(idx + 1); });
    lb.addEventListener('click', e => { if (e.target === lb || e.target === lbImg) lb.classList.remove('active'); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') lb.classList.remove('active');
      if (e.key === 'ArrowLeft') { e.preventDefault(); openAt(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); openAt(idx + 1); }
    });

    /* Touch swipe on lightbox */
    let lbTouchX = null;
    lb.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (lbTouchX === null) return;
      const dx = e.changedTouches[0].clientX - lbTouchX;
      lbTouchX = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) openAt(idx + 1); else openAt(idx - 1);
    }, { passive: true });
  })();

  /* ── Cookie consent ── */
  (function () {
    const banner = document.getElementById('cookie-banner');
    const modal  = document.getElementById('cookie-modal');
    if (!banner) return;
    const stored = localStorage.getItem('cookie_consent');
    if (!stored) {
      banner.style.display = 'flex';
    } else if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: stored === 'granted' ? 'granted' : 'denied' });
    }
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
  })();

  window.cookieAccept = function () {
    localStorage.setItem('cookie_consent', 'granted');
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'granted' });
    const b = document.getElementById('cookie-banner'); if (b) b.style.display = 'none';
  };
  window.cookieDeny = function () {
    localStorage.setItem('cookie_consent', 'denied');
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'denied' });
    const b = document.getElementById('cookie-banner'); if (b) b.style.display = 'none';
  };
  window.cookieCustomize = function () {
    const c = localStorage.getItem('cookie_consent');
    const tog = document.getElementById('toggle-analytics');
    const cell = document.getElementById('cm-cell-analytics');
    const modal = document.getElementById('cookie-modal');
    if (tog) { tog.checked = (c === 'granted'); }
    if (cell) { cell.classList.toggle('cm-cell--active', c === 'granted'); }
    if (modal) modal.classList.add('open');
  };
  window.cookieSavePrefs = function () {
    const tog = document.getElementById('toggle-analytics');
    const val = tog && tog.checked ? 'granted' : 'denied';
    localStorage.setItem('cookie_consent', val);
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: val });
    const modal = document.getElementById('cookie-modal'); if (modal) modal.classList.remove('open');
    const b = document.getElementById('cookie-banner'); if (b) b.style.display = 'none';
  };

  /* ── Mobile hamburger ── */
  (function () {
    const header = document.querySelector('.header');
    const nav    = document.querySelector('.header__nav');
    if (!header || !nav) return;
    const btn = document.createElement('button');
    btn.className = 'header__hamburger';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(btn);
    function close() { nav.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = ''; }
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();

  /* ── Code cloud ── */
  if (!window.matchMedia('(hover:none)').matches) {
    const chars = '{}[]<>/\\01=+*#;:.~&^'.split('');
    let last = 0;
    document.addEventListener('mousemove', e => {
      const now = Date.now();
      if (now - last < 40) return;
      last = now;
      for (let n = 0; n < 2; n++) {
        const el = document.createElement('span');
        el.textContent = chars[Math.floor(Math.random() * chars.length)];
        const ox = (Math.random() - 0.5) * 32, oy = (Math.random() - 0.5) * 32;
        el.style.cssText = 'position:fixed;left:' + (e.clientX + ox) + 'px;top:' + (e.clientY + oy) + 'px;font-family:monospace;font-size:' + (10 + Math.random() * 6).toFixed(0) + 'px;color:var(--fg);opacity:' + (0.25 + Math.random() * 0.35).toFixed(2) + ';pointer-events:none;z-index:9997;transform:translate(-50%,-50%);transition:opacity .55s,transform .55s;will-change:opacity,transform;';
        document.body.appendChild(el);
        const dx = (Math.random() - 0.5) * 50, dy = -15 - Math.random() * 35;
        requestAnimationFrame(() => { el.style.opacity = '0'; el.style.transform = 'translate(calc(-50% + ' + dx.toFixed(0) + 'px),calc(-50% + ' + dy.toFixed(0) + 'px))'; });
        setTimeout(() => el.remove(), 600);
      }
    });
  }

  /* ── Cursor trail ── */
  if (!window.matchMedia('(hover:none)').matches) {
    const N   = 4;
    const pos = Array.from({ length: N }, () => ({ x: -200, y: -200 }));
    let mx = -200, my = -200;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const dots = pos.map((_, i) => {
      const d = document.createElement('div');
      d.className = 'trail-dot';
      const sz = (3.5 - i * 0.55).toFixed(1);
      d.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;opacity:' + (0.28 - i * 0.055).toFixed(3) + ';';
      document.body.appendChild(d);
      return d;
    });
    const L = 0.22;
    requestAnimationFrame(function tick() {
      pos[0].x += (mx - pos[0].x) * L; pos[0].y += (my - pos[0].y) * L;
      for (let i = 1; i < N; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * L;
        pos[i].y += (pos[i - 1].y - pos[i].y) * L;
      }
      dots.forEach((d, i) => { d.style.left = pos[i].x + 'px'; d.style.top = pos[i].y + 'px'; });
      requestAnimationFrame(tick);
    });
  }

  /* ── Blog archive search ── */
  (function () {
    const input = document.getElementById('blog-search-input');
    if (!input) return;
    const items = Array.from(document.querySelectorAll('.blog-item'));
    const noResults = document.getElementById('blog-no-results');
    input.addEventListener('input', function () {
      const q = input.value.trim().toLowerCase();
      var visible = 0;
      items.forEach(function (item) {
        const text = item.textContent.toLowerCase();
        const show = !q || text.includes(q);
        item.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (noResults) noResults.style.display = visible === 0 ? '' : 'none';
    });
  }());

  /* ── Back to top ── */
  (function () {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.textContent = '↑';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    btn.addEventListener('mouseenter', function () {
      const cur = document.getElementById('cursor');
      if (cur) cur.classList.add('big');
    });
    btn.addEventListener('mouseleave', function () {
      const cur = document.getElementById('cursor');
      if (cur) cur.classList.remove('big');
    });
    var bttVisible = false;
    (function bttLoop() {
      var sy = window.scrollY || document.documentElement.scrollTop;
      var should = sy > 400;
      if (should !== bttVisible) {
        bttVisible = should;
        btn.classList.toggle('visible', should);
      }
      requestAnimationFrame(bttLoop);
    }());
  }());

})();
