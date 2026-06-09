# Plantilla: Página principal de recursos

Archivo de ejemplo que contiene una plantilla HTML minimalista con cajas desplegables para agrupar recursos.

- Edita el título y la descripción en [index.html](index.html).
- Para añadir un recurso copia un bloque `<article class="resource">` dentro de `.resource-list`.
- Opciones por recurso:
  - `data-site`: la URL del sitio (se usa para enlazar y para obtener favicon como imagen alternativa).
  - `data-image`: (opcional) URL de la imagen principal del sitio; si se pone, se usará en lugar del favicon.

Ejemplo de recurso:

```html
<article class="resource" data-site="https://example.com" data-image="https://example.com/imagen-principal.jpg">
  <img class="resource-img" alt="Imagen del sitio">
  <div class="resource-content">
    <h3 class="resource-title"><a href="https://example.com" target="_blank" rel="noopener">Título</a></h3>
    <p class="resource-desc">Breve descripción.</p>
  </div>
</article>
```

Cómo probar: abrir `index.html` en el navegador.
# biblioguia_musicologia
Sitio para alojar la biblioguía de musicología en el marco de la materia Fuentes de Información en Ciencia y Técnica
