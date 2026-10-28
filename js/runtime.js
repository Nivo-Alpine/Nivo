/* Nivo — petit moteur de données pour la version site web.
   Charge data/<id>.json, calcule les jeux dérivés (dash.calc) et prévient la page (dash.onData).
   Même interface que le tableau de bord d'origine : la page n'a pas besoin de changer. */
(function(){
  var DATASETS = ['zones', 'cristal', 'rose', 'faces', 'forecast', 'trend', 'history', 'learn', 'status'];
  var store = {}, calcs = {}, listeners = [], meta = null;
  var v = Date.now(); // évite les vieilles versions en cache après la mise à jour quotidienne

  DATASETS.forEach(function(id){ store[id] = {status: 'loading', data: []}; });

  function notify(){
    Object.keys(calcs).forEach(function(id){
      var c = calcs[id], ins = c.inputs.map(function(i){ return store[i]; });
      if (ins.some(function(s){ return !s || s.status === 'error'; })) { store[id] = {status: 'error', data: []}; return; }
      if (ins.some(function(s){ return s.status !== 'ok'; })) { store[id] = {status: 'loading', data: []}; return; }
      try { store[id] = {status: 'ok', data: c.fn.apply(null, ins.map(function(s){ return s.data; })) || []}; }
      catch (e) { console.error('[Nivo] calcul ' + id, e); store[id] = {status: 'error', data: []}; }
    });
    listeners.forEach(function(fn){ try { fn(); } catch (e) { console.error('[Nivo]', e); } });
  }

  window.dash = {
    colors: ['#3E7CC4', '#E0782F', '#2E9E6E', '#8D6FD1', '#D0477A', '#7A8794'],
    data: function(id){ return store[id] || {status: 'error', data: []}; },
    calc: function(id, def){ calcs[id] = def; store[id] = {status: 'loading', data: []}; },
    onData: function(fn){ listeners.push(fn); fn(); },
    meta: function(){ return meta; }
  };

  var pending = DATASETS.length, timer = null;
  function schedule(){ clearTimeout(timer); timer = setTimeout(notify, 30); }
  DATASETS.forEach(function(id){
    fetch('data/' + id + '.json?v=' + v).then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(d){ store[id] = {status: 'ok', data: Array.isArray(d) ? d : []}; })
      .catch(function(e){ console.error('[Nivo] chargement ' + id, e); store[id] = {status: 'error', data: []}; })
      .then(function(){ pending--; schedule(); });
  });
  fetch('data/meta.json?v=' + v).then(function(r){ return r.ok ? r.json() : null; }).then(function(m){
    meta = m; var el = document.getElementById('nv-updated');
    if (!el || !m || !m.datasets) return;
    var t = Object.keys(m.datasets).map(function(k){ return m.datasets[k].updated; }).filter(Boolean).sort().pop();
    if (!t) return;
    var d = new Date(t);
    el.textContent = 'Données mises à jour le ' + d.toLocaleDateString('fr-FR', {day: 'numeric', month: 'long'}) + ' à ' + d.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
    var age = (Date.now() - d.getTime()) / 36e5;
    if (age > 48){ el.textContent += ' — attention, données de plus de 48 h'; el.classList.add('old'); }
  }).catch(function(){});
})();
