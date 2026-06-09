document.addEventListener('DOMContentLoaded', ()=>{
  // Lista de logos disponibles en el repo
  const logoFiles = [
    'AMdeBA.jpg','APA.jpg','APAsite.jpg','ASAM.jpg','BMC.jpg','BVS.jpg','CLAM.jpg','Cochrane.jpg','DAMT.jpg','ECOS.jpg','JMT.jpeg','MTP.jpeg','NJMT.jpg','OMS.jpg','OPS.jpg','RIM.jpg','ScienceDirect.jpg','WFMT.jpg','medline.jpg','medscape.jpg','nature.jpg','portalBVS.jpg','psicouba.jpg','pubmed.jpg','voices.jpg'
  ];

  // Normaliza texto para comparar (quita acentos y caracteres no alfanuméricos)
  function normalize(text){
    if(!text) return '';
    return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/ig,'').toLowerCase();
  }

  const logosIndex = logoFiles.map(f=>({ file: f, key: normalize(f.replace(/\.[^.]+$/,'')) }));

  document.querySelectorAll('.resource').forEach(r=>{
    let img = r.querySelector('.resource-img');
    if(!img){
      img = document.createElement('img');
      img.className = 'resource-img';
      img.alt = 'Imagen del recurso';
      r.insertBefore(img, r.firstChild);
    }

    // Evitar mostrar icono roto cuando no hay `src`
    if(!img.hasAttribute('src')){
      img.style.display = 'none';
    }

    // Autoselección visual de logo: prioriza `data-image`, luego coincidencias por título/host
    const provided = r.dataset.image && r.dataset.image.trim();
    const site = r.dataset.site && r.dataset.site.trim();
    if(provided){
      const filename = provided.split('/').pop();
      const match = logoFiles.find(f => f === filename);
      if(match){
        img.src = 'assets/logos_biblioguia/' + match;
        img.style.display = 'block';
        r.dataset.image = img.src;
      } else {
        // si es una URL completa, usarla
        img.src = provided;
        img.style.display = 'block';
        r.dataset.image = provided;
      }
    } else {
      const titleText = r.querySelector('.resource-title')?.innerText || '';
      const titleKey = normalize(titleText);
      let hostKey = '';
      if(site){
        try{ hostKey = normalize(new URL(site).hostname.replace(/\./g,'')); }catch(e){}
      }

      const words = (titleText || '').split(/[^A-Za-z0-9]+/).map(w=>normalize(w)).filter(Boolean);
      const candidates = [titleKey, hostKey, ...words];

      let found = null;
      for(const c of candidates){
        if(!c) continue;
        found = logosIndex.find(l => l.key === c || l.key.includes(c) || c.includes(l.key));
        if(found) break;
      }
      if(found){
        img.src = 'assets/logos_biblioguia/' + found.file;
        img.style.display = 'block';
        r.dataset.image = img.src;
      } else {
        // fallback: intentar favicon del sitio
        let used = false;
        if(site){
          try{
            const hostname = new URL(site).hostname;
            img.src = 'https://www.google.com/s2/favicons?domain=' + hostname + '&sz=128';
            img.style.display = 'block';
            img.alt = r.querySelector('.resource-title')?.innerText || 'Logo';
            r.dataset.image = img.src;
            used = true;
          }catch(e){ /* no site válido */ }
        }
        // Si no se pudo usar favicon, usar placeholder SVG inline
        if(!used){
          const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='84'><rect width='100%' height='100%' fill='%23f0f2f4'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial,Helvetica,sans-serif' font-size='12'>Sin imagen</text></svg>`;
          img.src = svg;
          img.style.display = 'block';
          img.alt = 'Sin imagen disponible';
          r.dataset.image = '';
        }
      }
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
