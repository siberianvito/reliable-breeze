/* Reliable Breeze accessibility menu. Self-contained: injects its own styles and markup. */
(function () {
  var KEY = 'rb-a11y';
  var OPTIONS = [
    { id: 'text', label: 'Bigger text', levels: ['Off', 'Large', 'Larger'] },
    { id: 'contrast', label: 'High contrast' },
    { id: 'links', label: 'Highlight links' },
    { id: 'font', label: 'Readable font' },
    { id: 'spacing', label: 'Text spacing' },
    { id: 'motion', label: 'Pause animations' },
    { id: 'cursor', label: 'Large cursor' }
  ];
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
  var root = document.documentElement;

  var TEXT = 'main p,main h1,main h2,main h3,main li,main dl,main label,main input,main select,main textarea,.btn,.tag,.nav-links a,.foot a,.foot p,.foot h4,.mono:not(.legal)';
  var css = ''
    + '.a11y-btn{position:fixed;right:20px;bottom:20px;z-index:1000;width:54px;height:54px;border-radius:50%;border:2px solid #fff;background:#0a5aa8;color:#fff;cursor:pointer;display:grid;place-items:center;box-shadow:0 6px 22px rgba(6,26,48,.28);padding:0}'
    + '.a11y-btn:hover{background:#063a73}.a11y-btn svg{width:30px;height:30px}'
    + '.a11y-btn:focus-visible,.a11y-panel button:focus-visible,.a11y-panel a:focus-visible{outline:3px solid #ffbf47;outline-offset:2px}'
    + '.a11y-panel{position:fixed;right:20px;bottom:86px;z-index:1000;width:min(340px,calc(100vw - 32px));max-height:calc(100vh - 110px);overflow:auto;background:#fff;color:#0a1826;border:1px solid #0a1826;box-shadow:0 18px 50px rgba(6,26,48,.25);font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.4;zoom:1!important}'
    + '.a11y-panel[hidden]{display:none}'
    + '.a11y-head{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid #dfe6ed}'
    + '.a11y-head h2{font:700 17px/1.2 Inter,Arial,sans-serif;letter-spacing:0;margin:0}'
    + '.a11y-close{border:0;background:none;width:34px;height:34px;font-size:24px;line-height:1;cursor:pointer;color:#0a1826}'
    + '.a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:14px 18px}'
    + '.a11y-opt{min-height:64px;padding:10px 12px;text-align:left;border:1px solid #9aa8b6;background:#fff;color:#0a1826;font:500 14px/1.25 Inter,Arial,sans-serif;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;gap:6px}'
    + '.a11y-opt small{font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:#44566a}'
    + '.a11y-opt[aria-pressed="true"]{background:#0a5aa8;border-color:#0a5aa8;color:#fff}.a11y-opt[aria-pressed="true"] small{color:#fff}'
    + '.a11y-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 18px;border-top:1px solid #dfe6ed}'
    + '.a11y-reset{border:1px solid #0a1826;background:#0a1826;color:#fff;font:600 13px Inter,Arial,sans-serif;padding:10px 14px;cursor:pointer}'
    + '.a11y-foot a{color:#0a5aa8;text-decoration:underline;font-size:14px}'
    + '.hud.br{right:96px!important}'
    /* --- modes --- */
    + 'html.a11y-text-1 :is(' + TEXT + '){zoom:1.12}html.a11y-text-2 :is(' + TEXT + '){zoom:1.25}'
    + 'html.a11y-text-1 .cap :is(h1,h2),html.a11y-text-2 .cap :is(h1,h2){zoom:1}'
    + 'html.a11y-contrast{--ink:#000;--ink-2:#0a1826;--ink-3:#2b3947;--blue:#00468c;--blue-deep:#002a55;--line:#5b6876;--line-2:#c9d2db;--red:#a30007}'
    + 'html.a11y-contrast .grid-bg{display:none}'
    + 'html.a11y-contrast .sectors .lede,html.a11y-contrast .sector p,html.a11y-contrast .sector .mono,html.a11y-contrast .capcard p{color:#fff}'
    + 'html.a11y-contrast .capcard::before,html.a11y-contrast .band::after{background:rgba(0,12,28,.78)}'
    + 'html.a11y-contrast .phase .big{color:#000;-webkit-text-stroke-color:#000}'
    + 'html.a11y-contrast .manifesto p.big span{color:#000}'
    + 'html.a11y-contrast .versus .row>:first-child{color:#2b3947}'
    + 'html.a11y-links a:not(.a11y-panel a){text-decoration:underline!important;text-underline-offset:3px;outline:2px solid #ffbf47;outline-offset:2px}'
    + 'html.a11y-font{--display:Verdana,Arial,sans-serif;--body:Verdana,Arial,sans-serif;--mono:Verdana,Arial,sans-serif}'
    + 'html.a11y-font :is(h1,h2,h3,.btn,.brand b){font-stretch:100%;letter-spacing:0}'
    + 'html.a11y-spacing :is(main p,main li,main dd,.foot a,.foot p){line-height:1.9!important;letter-spacing:.05em;word-spacing:.14em}'
    + 'html.a11y-motion *,html.a11y-motion *::before,html.a11y-motion *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'
    + 'html.a11y-motion .rv{opacity:1!important;transform:none!important}'
    + 'html.a11y-motion .unit{transform:none!important}html.a11y-motion .band img{transform:none!important}'
    + 'html.a11y-cursor,html.a11y-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'44\' height=\'44\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M4 2l14 11h-7l4 8-3 1.5-4-8-4 5z\' fill=\'%23000\' stroke=\'%23fff\' stroke-width=\'1.4\'/%3E%3C/svg%3E") 6 3,auto!important}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function apply() {
    OPTIONS.forEach(function (o) {
      var v = state[o.id] || 0;
      if (o.levels) {
        for (var i = 1; i < o.levels.length; i++) root.classList.toggle('a11y-' + o.id + '-' + i, v === i);
      } else {
        root.classList.toggle('a11y-' + o.id, !!v);
      }
    });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  apply(); // before first paint of the menu, so saved preferences hold on every page

  function build() {
    var btn = document.createElement('button');
    btn.className = 'a11y-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Accessibility options');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'a11y-panel');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4.6" r="2.1"/><path d="M20 8.2c-2.6.7-5.300 1-8 1s-5.400-.3-8-1l-.5 1.900c1.900.5 3.800.8 5.700 1v3.600L7.300 21l1.900.6 2.200-5.600h1.200l2.200 5.600 1.900-.6-1.900-6.300v-3.600c1.900-.2 3.800-.5 5.700-1z"/></svg>';

    var panel = document.createElement('div');
    panel.className = 'a11y-panel';
    panel.id = 'a11y-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Accessibility options');
    panel.innerHTML = '<div class="a11y-head"><h2>Accessibility</h2><button type="button" class="a11y-close" aria-label="Close accessibility options">&times;</button></div>'
      + '<div class="a11y-grid"></div>'
      + '<div class="a11y-foot"><button type="button" class="a11y-reset">Reset all</button><a href="accessibility.html">Accessibility statement</a></div>';
    var grid = panel.querySelector('.a11y-grid');
    var live = document.createElement('div');
    live.setAttribute('aria-live', 'polite');
    live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';

    function paint() {
      OPTIONS.forEach(function (o) {
        var b = grid.querySelector('[data-id="' + o.id + '"]'), v = state[o.id] || 0;
        b.setAttribute('aria-pressed', v ? 'true' : 'false');
        b.querySelector('small').textContent = o.levels ? o.levels[v] : (v ? 'On' : 'Off');
      });
    }
    OPTIONS.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'a11y-opt'; b.dataset.id = o.id;
      b.innerHTML = '<span>' + o.label + '</span><small></small>';
      b.addEventListener('click', function () {
        var n = o.levels ? o.levels.length : 2;
        state[o.id] = ((state[o.id] || 0) + 1) % n;
        apply(); paint();
        live.textContent = o.label + ': ' + b.querySelector('small').textContent;
      });
      grid.appendChild(b);
    });
    paint();

    function open(yes) {
      panel.hidden = !yes;
      btn.setAttribute('aria-expanded', yes ? 'true' : 'false');
      if (yes) panel.querySelector('.a11y-close').focus(); else btn.focus();
    }
    btn.addEventListener('click', function () { open(panel.hidden); });
    panel.querySelector('.a11y-close').addEventListener('click', function () { open(false); });
    panel.querySelector('.a11y-reset').addEventListener('click', function () {
      state = {}; apply(); paint(); live.textContent = 'All accessibility options reset';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) open(false);
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    });
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    document.body.appendChild(live);
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
