/* CUENTA.JS — inicio de la zona de asociados (/asociados/). Los datos vienen de /api/yo. */
(function () {
  'use strict';

  var LOGIN = '/paginicio/acceso-asociados.html';
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];

  function parsearFecha(iso) {
    var m = String(iso || '').slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    var fecha = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if (fecha.getFullYear() !== Number(m[1]) ||
        fecha.getMonth() !== Number(m[2]) - 1 ||
        fecha.getDate() !== Number(m[3])) return null;
    return fecha;
  }

  function formatearFecha(iso) {
    var fecha = parsearFecha(iso);
    if (!fecha) return iso || '';
    return fecha.getDate() + ' de ' + MESES[fecha.getMonth()] + ' de ' + fecha.getFullYear();
  }

  function tiempoDeAsociado(iso) {
    var ingreso = parsearFecha(iso);
    if (!ingreso) return '';
    var hoy = new Date();
    hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    if (ingreso > hoy) return 'Fecha de ingreso futura';

    var anios = hoy.getFullYear() - ingreso.getFullYear();
    var meses = hoy.getMonth() - ingreso.getMonth();
    var dias = hoy.getDate() - ingreso.getDate();

    if (dias < 0) {
      meses--;
      dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    }
    if (meses < 0) {
      anios--;
      meses += 12;
    }

    var partes = [];
    if (anios > 0) partes.push(anios + (anios === 1 ? ' año' : ' años'));
    if (meses > 0) partes.push(meses + (meses === 1 ? ' mes' : ' meses'));
    if (dias > 0 || partes.length === 0) partes.push(dias + (dias === 1 ? ' día' : ' días'));
    return partes.join(', ');
  }

  fetch('/api/yo', { credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (!j || !j.autenticado) { location.href = LOGIN; return; }
      var s = j.socio;
      document.getElementById('saludo').textContent = 'Hola, ' + String(s.nombre).split(' ')[0];

      document.querySelectorAll('#datos-socio dd[data-campo]').forEach(function (dd) {
        var campo = dd.dataset.campo;
        var valor = s[campo];
        if ((campo === 'vencimiento' || campo === 'fecha_ingreso') && valor) valor = formatearFecha(valor);
        if (campo === 'tiempo_asociado') valor = tiempoDeAsociado(s.fecha_ingreso);
        if (valor) {
          dd.textContent = valor;
          dd.hidden = false;
          var dt = document.querySelector('#datos-socio dt[data-opcional="' + campo + '"]');
          if (dt) dt.hidden = false;
        } else if (!dd.hasAttribute('hidden')) {
          dd.textContent = 'Sin registrar';
        }
      });

      var renovar = document.getElementById('renovar');
      if (renovar) {
        var texto = 'Hola, quiero renovar mi membresía. Mi número de socio es ' + s.numero_socio + '.';
        renovar.href = 'https://wa.me/50622618489?text=' + encodeURIComponent(texto);
      }
    })
    .catch(function () { location.href = LOGIN; });
})();
