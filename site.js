(function(){
  var EN = window.I18N_EN || {};
  var PT = {};
  document.querySelectorAll("[data-i18n]").forEach(function(el){ PT[el.dataset.i18n] = el.textContent; });
  document.querySelectorAll("[data-i18n-html]").forEach(function(el){ PT[el.dataset.i18nHtml] = el.innerHTML; });
  var extraPT = window.I18N_PT || {};
  for (var k in extraPT) PT[k] = extraPT[k];

  var lang = "pt";
  try { var s = localStorage.getItem("bm-lang"); if (s === "en" || s === "pt") lang = s; } catch(e){}
  function t(k){ return (lang === "en" && EN[k]) || PT[k] || k; }
  window.BM = { t: t, lang: function(){ return lang; } };

  function apply(){
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    document.querySelectorAll("[data-i18n]").forEach(function(el){ el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach(function(el){ el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("#lang span").forEach(function(s){ s.classList.toggle("on", s.dataset.l === lang); });
    if (window.BM_render) window.BM_render(lang);
  }
  var btn = document.getElementById("lang");
  if (btn) btn.addEventListener("click", function(){
    lang = lang === "pt" ? "en" : "pt";
    try { localStorage.setItem("bm-lang", lang); } catch(e){}
    apply();
  });

  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var v = b.dataset.copy;
    var done = function(){ b.textContent = t("ct.copied"); setTimeout(function(){ b.textContent = t("ct.copy"); }, 1600); };
    var fallback = function(){
      var el = b.closest(".ch").querySelector(".v");
      var r = document.createRange(); r.selectNodeContents(el);
      var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    };
    try { navigator.clipboard.writeText(v).then(done, fallback); } catch(err){ fallback(); }
  });

  function tick(){
    var c = document.getElementById("clock"); if (!c) return;
    try { c.textContent = new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit",timeZone:"America/Sao_Paulo"}).format(new Date()); } catch(e){}
  }
  tick(); setInterval(tick, 15000);

  // film grain
  var S = 160, c = document.createElement("canvas"); c.width = S; c.height = S;
  var ctx = c.getContext("2d"), img = ctx.createImageData(S,S), frames = [];
  for (var f=0; f<4; f++){
    var d = img.data;
    for (var i=0;i<d.length;i+=4){ var v = Math.random()*255|0; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; }
    ctx.putImageData(img,0,0); frames.push(c.toDataURL());
  }
  var layer = document.createElement("div");
  layer.setAttribute("aria-hidden","true");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:50;opacity:var(--grain);mix-blend-mode:screen;background-size:"+S+"px "+S+"px;background-image:url("+frames[0]+")";
  document.body.appendChild(layer);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce){
    var k2 = 0;
    setInterval(function(){ k2=(k2+1)%frames.length; layer.style.backgroundImage="url("+frames[k2]+")"; layer.style.backgroundPosition=(Math.random()*S|0)+"px "+(Math.random()*S|0)+"px"; }, 110);
  }

  apply();
})();
