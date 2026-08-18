(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();const o={dogs:[],favoriteDogs:[],currentView:"todos",currentQuery:"",currentType:"raza",visibleCount:8,searchTimer:null};function L(){const e=localStorage.getItem("dog-favorites");o.favoriteDogs=e?JSON.parse(e):[]}function B(){localStorage.setItem("dog-favorites",JSON.stringify(o.favoriteDogs))}function C(e){return o.favoriteDogs.some(t=>String(t.id)===String(e))}function S(e){const t=String(e.id),r=o.favoriteDogs.findIndex(n=>String(n.id)===t);return r>-1?(o.favoriteDogs.splice(r,1),!1):(o.favoriteDogs.push(e),!0)}function v(){const e=document.getElementById("favorites-count");e&&(e.textContent=o.favoriteDogs.length)}const w="https://api.thedogapi.com/v1",A="live_acLYevx85viBTpAecI68Vp5tqfYE5rt5KSA01BisEsUdL1oLCOFU64slJYEm2eCW";function T(){return"https://images.dog.ceo/breeds/husky/n02110185_4321.jpg"}function y(e){return e?`https://cdn2.thedogapi.com/images/${e}.jpg`:T()}function h(e,t,r){return{id:r||e.id||Date.now()+Math.random(),name:e.name||"Perro",image:t,country:e.origin||"Desconocido",temperament:e.temperament||"Sin dato",group:e.breed_group||"Sin grupo",life_span:e.life_span||"Sin dato",description:e.description||"Raza de perro.",reference_image_id:e.reference_image_id||""}}function _(e){const t=e?.breeds?.[0]||{},r=e?.url||y(e?.reference_image_id);return h(t,r,e?.id)}function p(e){return h(e,y(e.reference_image_id))}async function g(e){const t=await fetch(`${w}${e}`,{headers:{"x-api-key":A}});if(!t.ok)throw new Error("No se pudo cargar la información de los perros.");return t.json()}async function b(e=6){const t=await g(`/images/search?has_breeds=true&limit=${e}&order=RANDOM`);return Array.isArray(t)?t.map(_):[]}function m(e,t=""){const r=e.trim().toLowerCase();if(!r)return 0;const n=String(t).trim().toLowerCase();return n?n===r?100:n.startsWith(r)?90:n.includes(r)?70:0:0}async function D(e,t="raza",r=8){const n=(e||"").trim();if(!n)return b(r);const s=t==="grupo"?await g("/breeds"):await g(`/breeds/search?q=${encodeURIComponent(n)}`),d=(Array.isArray(s)?s:[]).map(a=>{const c=a?.name||"",l=a?.breed_group||"",I=Math.max(m(n,t==="grupo"?l:c),t==="grupo"?m(n,c):m(n,l));return{breed:a,score:I}}).filter(a=>a.score>0).sort((a,c)=>c.score-a.score||a.breed.name.localeCompare(c.breed.name)).slice(0,r);if(d.length){const a=[];for(const c of d){const l=c.breed.id;try{const u=await g(`/images/search?breed_id=${l}&limit=1`);Array.isArray(u)&&u[0]?a.push(_(u[0])):a.push(p(c.breed))}catch{a.push(p(c.breed))}}return a}return[]}function x(e){return`
    <article class="card">
      <button type="button" class="card__favorite ${C(e.id)?"card__favorite--active":""}" data-dog-id="${e.id}" aria-label="Añadir a favoritos">
        ★
      </button>
      
      <div class="card__media">
        <img src="${e.image||"https://images.dog.ceo/breeds/husky/n02110185_4321.jpg"}" alt="Foto de ${e.name}" loading="lazy" width="300" height="300" />
        <span class="card__image-fallback" hidden>IMAGE NOT AVAILABLE</span>
      </div>
      
      <div class="card__body">
        <h3 class="card__title">${e.name}</h3>
        
        <dl class="card__list">
          <div>
            <dt>Grupo</dt>
            <dd>${e.group||"—"}</dd>
          </div>
          <div>
            <dt>Temperamento</dt>
            <dd>${e.temperament||"—"}</dd>
          </div>
        </dl>
        
      </div>
    </article>
  `}function f(){const e=document.getElementById("dog-grid"),t=document.getElementById("dog-status"),r=document.getElementById("dog-load-more");if(!e)return;const n=o.currentView==="favoritos"?o.favoriteDogs:o.dogs,s=n.slice(0,o.visibleCount);if(e.innerHTML=s.map(x).join(""),e.querySelectorAll(".card__media img").forEach(i=>{i.addEventListener("error",()=>{i.hidden=!0,i.nextElementSibling?.removeAttribute("hidden")},{once:!0})}),e.querySelectorAll(".card__favorite").forEach(i=>{i.addEventListener("click",d=>{d.preventDefault();const a=i.dataset.dogId,c=n.find(l=>String(l.id)===String(a));c&&(S(c),B(),v(),f())})}),!n.length){t.textContent=o.currentView==="favoritos"?"No tienes perros favoritos aún.":"No se encontraron perros con ese término.",r.innerHTML="";return}if(t.textContent="",o.visibleCount>=n.length){r.innerHTML="";return}r.innerHTML='<button type="button" class="btn btn--secondary" id="load-more-btn">Cargar más</button>',document.getElementById("load-more-btn")?.addEventListener("click",()=>{o.visibleCount+=8,f()})}async function E(){const e=document.getElementById("dog-status"),t=document.getElementById("dog-grid"),r=document.getElementById("filters-section");if(!(!t||!e)){if(o.currentView==="favoritos"){r&&(r.style.display="none"),o.visibleCount=8,f();return}r&&(r.style.display="flex"),e.textContent="Cargando perros…",t.innerHTML="";try{const n=o.currentQuery?await D(o.currentQuery,o.currentType,20):await b(12);o.dogs=n,o.visibleCount=8,f()}catch(n){e.textContent=n.message||"No se pudieron cargar los perros."}}}function q(e){const t=document.getElementById("view-root");t.innerHTML=`
    <section class="page page--characters">
      <header class="page__header">
        <h1 class="page__title">El Buscador de Perros Inteligente</h1>
        <p class="page__subtitle">Explora razas de perros, descubre su información y añádelos a favoritos.</p>
      </header>

      <section class="filters" aria-label="Filtros de perros" id="filters-section">
        <div class="filters__field">
          <label class="filters__label" for="dog-query">Texto de Búsqueda</label>
          <input id="dog-query" class="input" type="search" placeholder="Ej. Labrador, Terrier…" />
        </div>

        <div class="filters__field">
          <label class="filters__label" for="dog-type">Opciones de Búsqueda</label>
          <select id="dog-type" class="input">
            <option value="raza">Raza</option>
            <option value="grupo">Grupo</option>
          </select>
        </div>

        <div class="filters__actions">
          <button type="button" class="btn btn--ghost" id="clear-dogs">Limpiar Búsqueda</button>
        </div>
      </section>

      <div class="page__status" id="dog-status"></div>
      <div class="card-grid" id="dog-grid"></div>
      <div class="page__load-more" id="dog-load-more"></div>
    </section>
  `;const r=document.getElementById("dog-query"),n=document.getElementById("dog-type"),s=document.getElementById("clear-dogs");r.addEventListener("input",i=>{o.currentQuery=i.target.value.trim(),clearTimeout(o.searchTimer),o.searchTimer=setTimeout(()=>{e()},250)}),n.addEventListener("change",i=>{o.currentType=i.target.value,e()}),s.addEventListener("click",()=>{o.currentQuery="",o.currentType="raza",r.value="",n.value="raza",e()}),e()}function z(e){document.querySelectorAll(".main-nav__link[data-route]").forEach(r=>{r.addEventListener("click",n=>{n.preventDefault();const s=r.dataset.route;o.visibleCount=6,s==="dogs"?(o.currentView="todos",o.currentQuery="",o.currentType="raza"):s==="favorites"&&(o.currentView="favoritos"),e()})})}L();v();q(E);z(E);
