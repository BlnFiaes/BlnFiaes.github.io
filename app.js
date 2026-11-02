(function () {
  // Navegação fixa: mesma regra no computador e no celular, baseada só na variação real de window.scrollY.
  // Visível no topo; some ao rolar para baixo; volta ao rolar para cima; some de novo após 1,8 s parada.
  // Fica visível enquanto tem foco de teclado, está sob o mouse ou está sendo tocada.
  var topo = document.querySelector('.topo');
  var LIMIAR = 12, TOPO = 120, ESPERA = 1800;
  var refY = posicao(), parado = null, emUso = false;
  function posicao() {
    // Limita ao intervalo real da página: ignora o efeito elástico do topo e do fim (iOS)
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(Math.max(window.scrollY, 0), Math.max(max, 0));
  }
  function mostrar() { topo.classList.remove('nav--oculta'); }
  function ocultar() {
    if (emUso || topo.querySelector(':focus-visible') || posicao() <= TOPO) return;
    topo.classList.add('nav--oculta');
  }
  function agendarOcultar() { clearTimeout(parado); parado = setTimeout(ocultar, ESPERA); }
  window.addEventListener('scroll', function () {
    var y = posicao(), delta = y - refY;
    topo.classList.toggle('nav--rolada', y > 10);
    if (y <= TOPO) { mostrar(); refY = y; }
    else if (delta >= LIMIAR) { ocultar(); refY = y; }
    else if (delta <= -LIMIAR) { mostrar(); refY = y; }
    agendarOcultar();
  }, { passive: true });
  // A barra de endereço do celular muda a altura da janela e pode alterar scrollY: recalcula a referência
  window.addEventListener('resize', function () { refY = posicao(); });
  // Uso ativo: foco de teclado, mouse sobre a navegação ou toque nela
  topo.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) mostrar(); });
  topo.addEventListener('focusout', agendarOcultar);
  topo.addEventListener('pointerover', function (e) { if (e.target.closest('.pilula, .marca')) { emUso = true; mostrar(); } });
  topo.addEventListener('pointerout', function (e) { if (!e.relatedTarget || !topo.contains(e.relatedTarget)) { emUso = false; agendarOcultar(); } });
  topo.addEventListener('touchstart', function () { emUso = true; mostrar(); }, { passive: true });
  topo.addEventListener('touchend', function () { emUso = false; agendarOcultar(); }, { passive: true });
  // Computador: o mouse perto do topo da tela traz a navegação de volta
  document.addEventListener('mousemove', function (e) { if (e.clientY < 90) { mostrar(); agendarOcultar(); } }, { passive: true });

  // Galeria do projeto em destaque: as abas trocam a captura exibida
  var img = document.getElementById('galeria-img');
  var abas = document.querySelectorAll('.galeria__abas button');
  abas.forEach(function (b) {
    b.addEventListener('click', function () {
      img.src = b.getAttribute('data-src');
      img.alt = b.getAttribute('data-alt');
      abas.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });

  // Trajetória em gavetas: sem JS todas ficam abertas; com JS começam fechadas e só uma abre por vez.
  // A classe .js (aplicada no <head>) ativa o recolhimento animado no CSS; fechado, o painel fica com visibility: hidden.
  var etapas = [].slice.call(document.querySelectorAll('.etapa__btn'));
  function abrir(alvo) {
    etapas.forEach(function (btn) {
      var aberto = btn === alvo;
      btn.setAttribute('aria-expanded', String(aberto));
      btn.closest('.etapa').classList.toggle('etapa--aberta', aberto);
    });
  }
  etapas.forEach(function (btn) {
    btn.addEventListener('click', function () {
      abrir(btn.getAttribute('aria-expanded') === 'true' ? null : btn);
    });
  });
  abrir(null);
})();
