(function () {
  'use strict';

  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Page intro: typewriter ── */
  (function () {
    const overlay = document.getElementById('intro');
    if (!overlay) return;
    if (noMotion || window.matchMedia('(max-width: 768px)').matches) { overlay.remove(); return; }

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

      sorted.forEach(({ node, orig, y }) => {
        const charMs  = Math.max(2, Math.min(28, 480 / orig.length));
        const startAt = AFTER + (y / maxY) * STAGGER;
        let i = 0;
        setTimeout(function type() {
          i++;
          node.textContent = orig.slice(0, i);
          placeCursor(node);
          if (i < orig.length) setTimeout(type, charMs);
        }, startAt);
      });

      const last    = sorted[sorted.length - 1];
      const totalMs = AFTER + STAGGER + Math.max(2, Math.min(28, 480 / (last?.orig.length || 1))) * (last?.orig.length || 0) + 400;
      setTimeout(() => { cur.style.opacity = '0'; setTimeout(() => cur.remove(), 200); }, totalMs);
    }, 280);

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

  /* ── bfcache fix ── */
  window.addEventListener('pageshow', () => {
    document.getElementById('intro')?.remove();
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
})();
