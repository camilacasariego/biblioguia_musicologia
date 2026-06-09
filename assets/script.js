document.addEventListener('DOMContentLoaded', ()=>{
  // Para cada recurso: si tiene data-image la usamos; si no, cargamos favicon como alternativa
  document.querySelectorAll('.resource').forEach(r=>{
    let img = r.querySelector('.resource-img');
    if(!img){
      img = document.createElement('img');
      img.className = 'resource-img';
      img.alt = 'Imagen del recurso';
      r.insertBefore(img, r.firstChild);
    }

    const provided = r.dataset.image && r.dataset.image.trim();
    const site = r.dataset.site && r.dataset.site.trim();
    if(provided){ img.src = provided; return; }
    if(site){
      try{
        const u = new URL(site);
        img.src = 'https://www.google.com/s2/favicons?domain=' + u.hostname + '&sz=128';
      }catch(e){ img.alt = 'Imagen no disponible'; }
    } else {
      img.alt = 'Imagen no especificada';
    }
  });

  // Mejora accesibilidad: permitir abrir/cerrar detalles con Enter/Space en summary
  document.querySelectorAll('summary').forEach(s=>{
    s.setAttribute('tabindex', '0');
    s.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); s.parentElement.open = !s.parentElement.open; }
    });
  });

  const offsetTop = -350;
  const parallaxFactor = 0.5;
  let latestScrollY = window.scrollY;
  let ticking = false;
  const updateBackground = () => {
    const positionY = offsetTop + latestScrollY * parallaxFactor;
    document.documentElement.style.backgroundPosition = `center ${positionY}px`;
    ticking = false;
  };
  const scheduleUpdate = () => {
    latestScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateBackground);
      ticking = true;
    }
  };

  document.querySelectorAll('details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        document.querySelectorAll('details').forEach(other => {
          if (other !== d) other.open = false;
        });
        d.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      scheduleUpdate();
    });
  });

  window.addEventListener('scroll', scheduleUpdate);
  window.addEventListener('resize', scheduleUpdate);
  updateBackground();
});
