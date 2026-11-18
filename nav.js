/* Shared navigation: services dropdown + mobile menu (built from the desktop links). */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  var links = nav.querySelector('.nav-links'), cta = nav.querySelector('.nav-cta');

  // --- dropdown ---
  var dds = [].slice.call(nav.querySelectorAll('.dd'));
  function closeAll(except) {
    dds.forEach(function (d) {
      if (d === except) return;
      d.classList.remove('open');
      d.querySelector('.dd-btn').setAttribute('aria-expanded', 'false');
    });
  }
  dds.forEach(function (d) {
    var b = d.querySelector('.dd-btn');
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('open');
      closeAll(d);
      d.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.dd')) closeAll(); });

  // --- mobile menu ---
  if (!links || !cta) return;
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'menu-btn';
  btn.setAttribute('aria-label', 'Menu'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'mnav');
  btn.innerHTML = '<i></i>';
  cta.appendChild(btn);

  var panel = document.createElement('nav');
  panel.className = 'mnav'; panel.id = 'mnav'; panel.setAttribute('aria-label', 'Menu');
  var html = '';
  [].slice.call(links.children).forEach(function (el) {
    if (el.tagName === 'A') {
      html += '<a href="' + el.getAttribute('href') + '">' + el.textContent + '</a>';
    } else if (el.classList.contains('dd')) {
      html += '<h2>' + el.querySelector('.dd-btn').textContent.trim() + '</h2><div class="sub">';
      [].slice.call(el.querySelectorAll('.dd-panel a')).forEach(function (a) {
        var t = a.querySelector('b') ? a.querySelector('b').textContent : a.textContent;
        html += '<a href="' + a.getAttribute('href') + '">' + t + '</a>';
      });
      html += '</div>';
    }
  });
  html += '<a class="cta" href="contact.html">Request a quote</a>';
  panel.innerHTML = html;
  nav.parentNode.insertBefore(panel, nav.nextSibling);

  function setMenu(open) {
    panel.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  }
  btn.addEventListener('click', function () { setMenu(!panel.classList.contains('open')); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAll();
    if (panel.classList.contains('open')) { setMenu(false); btn.focus(); }
  });
  addEventListener('resize', function () { if (innerWidth > 1300 && panel.classList.contains('open')) setMenu(false); });
})();
