/* Varnika Silks — complete offline-first storefront demo (no backend) */
(() => {
  'use strict';
  const db = window.VARNIKA_DATA || { products: [], articles: [], team: [] };
  const $ = (q, scope=document) => scope.querySelector(q);
  const $$ = (q, scope=document) => Array.from(scope.querySelectorAll(q));
  const escapeHTML = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const params = new URLSearchParams(location.search);
  const money = n => '₹' + Number(n).toLocaleString('en-IN');
  const iconArrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
  const iconLetter = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>';
  const toStore = (key,val) => { try {localStorage.setItem(key,val);} catch(e) {} };
  const fromStore = (key,def) => {try {return localStorage.getItem(key) ?? def;}catch(e){return def;} };
  let toastTimeout;
  function toast(msg) {
    const t=$('#site-toast'); if(!t) return;
    t.textContent=msg; t.classList.add('show'); clearTimeout(toastTimeout);
    toastTimeout=setTimeout(()=>t.classList.remove('show'),4500);
  }
  function themeUpdate(){
    const dark=document.documentElement.getAttribute('data-theme')==='dark';
    $$('[data-theme-toggle]').forEach(el=>el.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode'));
    $$('[data-theme-label]').forEach(el=>el.textContent=dark?'Switch to Light':'Switch to Dark');
  }
  function applyHeader(){
    themeUpdate();
    const siteHeader=$('#site-header');
    if(siteHeader){const onScroll=()=>siteHeader.classList.toggle('is-scrolled',window.scrollY>12);window.addEventListener('scroll',onScroll,{passive:true});onScroll();}
    $$('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{
      const current=document.documentElement.getAttribute('data-theme');
      const next=current==='dark'?'light':'dark'; document.documentElement.setAttribute('data-theme',next);
      toStore('varnika_theme',next); themeUpdate();
    }));
    function dirUpdate(){
      const rtl=document.documentElement.getAttribute('dir')==='rtl';
      $$('[data-direction-toggle]').forEach(b=>{b.setAttribute('aria-label',rtl?'Switch to left-to-right direction':'Switch to right-to-left direction');if(b.classList.contains('direction-toggle'))b.textContent=rtl?'LTR':'RTL';});
      $$('[data-dir-label]').forEach(el=>{el.textContent=rtl?'Switch to LTR':'Switch to RTL';});
    }
    dirUpdate();
    $$('[data-direction-toggle]').forEach(b=>b.addEventListener('click',()=>{
      const next=document.documentElement.getAttribute('dir')==='rtl'?'ltr':'rtl';
      document.documentElement.setAttribute('dir',next);toStore('varnika_dir',next);dirUpdate();
    }));
    const menu=$('#mobile-nav'), toggle=$('#menu-toggle');
    if(toggle&&menu){
      const close=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');};
      toggle.addEventListener('click',()=>{const willOpen=menu.hidden;menu.hidden=!willOpen;toggle.setAttribute('aria-expanded',String(willOpen));toggle.setAttribute('aria-label',willOpen?'Close navigation':'Open navigation');});
      $$('a',menu).forEach(a=>a.addEventListener('click',close));
      document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
      window.addEventListener('resize',()=>{if(window.innerWidth>=992)close();});
    }
    const drop=$('.home-dropdown');
    if(drop)document.addEventListener('click',e=>{if(!drop.contains(e.target))drop.removeAttribute('open');});
    const year=$('#copyright-year'); if(year)year.textContent=String(new Date().getFullYear());
  }
  function productCard(p){
    const id=encodeURIComponent(p.id),title=escapeHTML(p.name),image=escapeHTML(p.image),fab=escapeHTML(p.fabric),occasion=escapeHTML(p.occasion),color=escapeHTML(p.color);
    return `<article class="product-card"><a class="product-img-link" href="saree-details.html?id=${id}" aria-label="View details for ${title}"><img src="${image}" alt="${title} in ${color}" loading="eager" decoding="async">${p.isNew?'<span class="product-tag">New Edit</span>':''}</a><div class="product-info"><span class="product-meta">${fab} / ${occasion}</span><h3><a href="saree-details.html?id=${id}">${title}</a></h3><p class="product-shade">${color} · Sample collection</p><div class="product-price">${money(p.price)} <small>indicative</small></div><div class="product-actions"><a class="btn btn-primary" href="saree-details.html?id=${id}">View Details ${iconArrow}</a><a class="icon-action" href="contact.html?product=${id}" aria-label="Enquire about ${title}" title="Enquire about this saree">${iconLetter}</a></div></div></article>`;
  }
  function blogCard(a){
    const id=encodeURIComponent(a.id),title=escapeHTML(a.title),link=`blog-details.html?article=${id}`;
    return `<article class="blog-card"><a href="${link}" class="blog-img" aria-label="Read ${title}"><img src="${escapeHTML(a.image)}" alt="Illustration for ${title}" loading="eager" decoding="async"></a><div class="blog-info"><span class="blog-meta">${escapeHTML(a.category)} · ${escapeHTML(a.readTime)}</span><h3><a href="${link}">${title}</a></h3><p>${escapeHTML(a.excerpt)}</p><a class="btn btn-text" href="${link}">Read Article ${iconArrow}</a></div></article>`;
  }
  function renderHome(){
    const box=$('#featured-products');if(box)box.innerHTML=db.products.slice(0,4).map(productCard).join('');
    const bridal=$('#bridal-home-products');if(bridal){
      // Curated wedding looks also include Kanchipuram weaves, not just the Bridal tag.
      const chosen=[4,10,16].map(i=>db.products[i]).filter(Boolean);bridal.innerHTML=chosen.map(productCard).join('');
    }
  }
  function renderCatalogue(){
    const grid=$('#catalogue-grid');if(!grid)return;
    const search=$('#filter-search'),fabric=$('#filter-fabric'),occasion=$('#filter-occasion'),sort=$('#filter-sort'),count=$('#product-count'),empty=$('#catalogue-empty');
    function update(){
      const query=search.value.trim().toLowerCase();
      let items=db.products.filter(p=>(!fabric.value||p.fabric===fabric.value)&&(!occasion.value||p.occasion===occasion.value)&&(!query||[p.name,p.fabric,p.occasion,p.color,p.description].join(' ').toLowerCase().includes(query)));
      if(sort.value==='price-asc')items.sort((a,b)=>a.price-b.price);
      if(sort.value==='price-desc')items.sort((a,b)=>b.price-a.price);
      if(sort.value==='az')items.sort((a,b)=>a.name.localeCompare(b.name));
      grid.innerHTML=items.map(productCard).join('');count.textContent=`Showing ${items.length} of ${db.products.length} illustrative sarees`;
      if(empty)empty.hidden=items.length!==0;
    }
    function reset(){search.value='';fabric.value='';occasion.value='';sort.value='featured';update();}
    if(params.has('fabric'))fabric.value=params.get('fabric')||'';
    if(params.has('occasion'))occasion.value=params.get('occasion')||'';
    if(params.has('q'))search.value=params.get('q')||'';
    [search,fabric,occasion,sort].forEach(el=>el.addEventListener(el===search?'input':'change',update));
    $('#filter-reset')?.addEventListener('click',reset);
    $('#empty-reset')?.addEventListener('click',reset);
    update();
  }
  function renderBridal(){
    const grid=$('#bridal-grid');if(!grid)return;
    const search=$('#bridal-search'),count=$('#bridal-count');
    // Wedding edit draws from ceremony-oriented fabric and occasion styles.
    const all=db.products.filter(p=>p.occasion==='Bridal'||p.fabric==='Kanchipuram Silk'||p.occasion==='Traditional Functions');
    const shade=params.get('shade')||'';
    const shades={Red:['Vermilion','Ruby','Crimson','Wine','Rose','Rust','Terracotta'],Gold:['Mustard Gold','Saffron','Mango','Ivory','Ochre'],Maroon:['Wine','Crimson','Vermilion','Ruby'],Green:['Teal','Emerald','Jade','Sage','Peacock']};
    if(shade&&shades[shade]){const info=$('.bridal-controls .eyebrow');if(info)info.textContent=`${shade.toUpperCase()}-INSPIRED EDIT`;}
    function update(){
      const q=search.value.toLowerCase().trim();let items=all.filter(p=>!q||[p.name,p.fabric,p.color,p.description].join(' ').toLowerCase().includes(q));
      if(shade&&shades[shade]){
        const byShade=items.filter(p=>shades[shade].includes(p.color));
        if(byShade.length)items=byShade;
      }
      grid.innerHTML=items.length?items.map(productCard).join(''):'<div class="empty-state" style="grid-column:1/-1"><h3>No matching bridal styles</h3><p>Try a different search or explore all collections.</p><a class="btn btn-outline" href="bridal-sarees.html">Reset Bridal Search →</a></div>';
      count.textContent=`${items.length} illustrative styles`;
    }
    search.addEventListener('input',update);update();
  }
  function renderProductDetail(){
    const host=$('#product-detail');if(!host)return;
    const id=params.get('id');const p=db.products.find(x=>x.id===id);
    const crumb=$('#detail-crumb');if(crumb)crumb.textContent=p?p.name:'Saree Not Found';
    if(!p){host.innerHTML='<div class="empty-state"><h1>We couldn\'t find that saree.</h1><p>Explore the complete demonstration catalogue instead.</p><a class="btn btn-primary" href="collections.html">Explore Collections →</a></div>';return;}
    document.title=`${p.name} | Varnika Silks`;
    const desc=document.querySelector('meta[name="description"]');if(desc)desc.setAttribute('content',p.description);
    host.innerHTML=`<div class="product-detail-layout"><div class="detail-photo"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)} in ${escapeHTML(p.color)}" id="detail-image"></div><div class="detail-side"><span class="eyebrow">THE VARNIKA COLLECTION / ${escapeHTML(p.occasion)}</span><h1>${escapeHTML(p.name)}</h1><div class="detail-price">${money(p.price)} <small>indicative demo price</small></div><p>${escapeHTML(p.description)}</p><p>${escapeHTML(p.details)}</p><div class="detail-specs"><div><span>Fabric</span><strong>${escapeHTML(p.fabric)}</strong></div><div><span>Colour</span><strong>${escapeHTML(p.color)}</strong></div><div><span>Occasion</span><strong>${escapeHTML(p.occasion)}</strong></div><div><span>Availability</span><strong>To be confirmed</strong></div></div><div class="detail-care"><strong>Care note</strong><br>${escapeHTML(p.care)}</div><div class="hero-actions"><a class="btn btn-primary" href="contact.html?product=${encodeURIComponent(p.id)}">Enquire About This Saree ${iconArrow}</a><a class="btn btn-outline" href="collections.html?fabric=${encodeURIComponent(p.fabric)}">Browse Similar Styles ${iconArrow}</a></div><p class="detail-disclaimer">This is a demonstration product. Fabric specifications, availability and prices require business verification.</p></div></div>`;
    const related=db.products.filter(x=>x.id!==p.id&&x.fabric===p.fabric).slice(0,4);
    const box=$('#related-products');if(box)box.innerHTML=related.map(productCard).join('');
  }
  function renderTeam(){
    const host=$('#team-grid');if(!host)return;
    host.innerHTML=db.team.map(t=>`<article class="team-card"><img src="${escapeHTML(t.image)}" loading="eager" alt="Illustrative portrait for ${escapeHTML(t.role)}"><div class="team-content"><h3>${escapeHTML(t.name)}</h3><span class="team-role">${escapeHTML(t.role)}</span><p>${escapeHTML(t.description)}</p></div></article>`).join('');
  }
  function renderBlog(){
    const host=$('#blog-grid');if(!host)return;
    const search=$('#blog-search'),cat=$('#blog-category'),count=$('#blog-count'),empty=$('#blog-empty');
    function update(){
      const query=search.value.trim().toLowerCase();const filtered=db.articles.filter(a=>(!cat.value||a.category===cat.value)&&(!query||[a.title,a.category,a.excerpt,a.intro].join(' ').toLowerCase().includes(query)));
      host.innerHTML=filtered.map(blogCard).join('');count.textContent=`${filtered.length} of ${db.articles.length} stories`;
      if(empty)empty.hidden=filtered.length!==0;
    }
    function reset(){search.value='';cat.value='';update();}
    search.addEventListener('input',update);cat.addEventListener('change',update);
    $('#blog-reset')?.addEventListener('click',reset);$('#blog-empty-reset')?.addEventListener('click',reset);update();
  }
  function renderArticle(){
    const host=$('#article-detail');if(!host)return;
    const article=db.articles.find(a=>a.id===params.get('article'));
    const crumb=$('#blog-crumb');if(crumb)crumb.textContent=article?article.title:'Article Not Found';
    if(!article){host.innerHTML='<div class="empty-state"><h1>That story could not be found.</h1><p>Visit the Journal to explore other articles.</p><a class="btn btn-primary" href="blog.html">All Articles →</a></div>';return;}
    document.title=`${article.title} | Varnika Silks`;
    const desc=$('meta[name="description"]');if(desc)desc.setAttribute('content',article.excerpt);
    host.innerHTML=`<header class="article-head"><span class="eyebrow">${escapeHTML(article.category)} / ${escapeHTML(article.readTime)}</span><h1>${escapeHTML(article.title)}</h1><p>${escapeHTML(article.excerpt)}</p></header><img class="article-cover" src="${escapeHTML(article.image)}" alt="Illustration for ${escapeHTML(article.title)}"><div class="article-prose"><p>${escapeHTML(article.intro)}</p>${article.sections.map(s=>`<section><h2>${escapeHTML(s.heading)}</h2><p>${escapeHTML(s.body)}</p></section>`).join('')}<div class="article-tips"><h3>Thoughtful tips</h3><ul>${article.tips.map(t=>`<li>${escapeHTML(t)}</li>`).join('')}</ul></div><p>For more personal inspiration, explore related sarees in the collection and choose fabrics and details that suit your own preferences.</p><div class="article-back"><a class="btn btn-primary" href="collections.html">Explore Sarees ${iconArrow}</a> <a class="btn btn-outline" href="blog.html">Back to Articles ${iconArrow}</a></div></div>`;
    const related=db.articles.filter(a=>a.id!==article.id).slice(0,3);
    const hostRelated=$('#related-articles');if(hostRelated)hostRelated.innerHTML=related.map(blogCard).join('');
  }
  function applyForms(){
    const phone=$('#enq-phone');if(phone)phone.addEventListener('input',()=>{phone.value=phone.value.replace(/\D/g,'').slice(0,10);});
    const date=$('#enq-date');if(date){const d=new Date();const yyyy=d.getFullYear(),mm=String(d.getMonth()+1).padStart(2,'0'),dd=String(d.getDate()).padStart(2,'0');date.min=`${yyyy}-${mm}-${dd}`;}
    const enquiry=$('#enquiry-form');
    if(enquiry){
      const product=db.products.find(p=>p.id===params.get('product'));
      const interest=params.get('interest');
      if(product){$('#enq-type').value='Product Enquiry';$('#enq-interest').value=product.fabric;$('#enq-message').value=`I would like to know more about ${product.name} (${product.id}), including availability and fabric details.`;}
      else if(interest){const type=$('#enq-type'),sel=$('#enq-interest');type.value=interest==='Showroom Visit'?'Showroom Visit':interest==='Bridal Sarees'?'Bridal Sarees':'Product Enquiry';if([...sel.options].some(x=>x.value===interest))sel.value=interest;}
      enquiry.addEventListener('submit',e=>{
        e.preventDefault();const data=new FormData(enquiry);const fullName=String(data.get('name')||'').trim(),mobile=String(data.get('phone')||'').trim(),email=String(data.get('email')||'').trim(),type=String(data.get('type')||''),visit=String(data.get('date')||''),message=String(data.get('message')||'').trim();
        const status=$('#form-message');let error='';
        if(fullName.length<2||!/^[\p{L}][\p{L} .'-]+$/u.test(fullName))error='Please enter your full name using at least two letters.';
        else if(!/^\d{10}$/.test(mobile))error='Enter a valid 10-digit Indian mobile number.';
        else if(!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email))error='Please enter a valid email address (for example, name@example.com).';
        else if(!type)error='Please select the enquiry type.';
        else if(type==='Showroom Visit'&&!visit)error='Please choose a preferred visit date.';
        else if(visit&&date&&visit<date.min)error='Please choose today or a future visit date.';
        else if(message.length<10)error='Please enter a message of at least 10 characters.';
        if(error){if(status){status.className='form-message error';status.textContent=error;status.scrollIntoView({behavior:'smooth',block:'center'});}return;}
        const submission={name:fullName,phone:mobile,email,type,interest:String(data.get('interest')||''),date:visit,message,submittedAt:new Date().toISOString(),demo:true};
        try{const list=JSON.parse(fromStore('varnika_demo_enquiries','[]'));if(Array.isArray(list)){list.push(submission);toStore('varnika_demo_enquiries',JSON.stringify(list.slice(-20)));}}catch(err){toStore('varnika_demo_enquiries',JSON.stringify([submission]));}
        if(status){status.className='form-message';status.textContent='Demo request saved in this browser only. It has NOT been sent to a store or confirmed as an appointment.';}
        toast('Demo enquiry saved locally. No message has been sent.');enquiry.reset();
      });
    }
    const news=$('#newsletter-form');
    if(news) news.addEventListener('submit',e=>{
      e.preventDefault();const email=$('#newsletter-email')?.value.trim()||'';
      if(!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)){toast('Enter a valid email address for the newsletter preview.');return;}
      toStore('varnika_demo_newsletter',email);toast('Newsletter preview saved in this browser only. No email has been sent.');news.reset();
    });
  }
  function init(){
    applyHeader(); renderHome();renderCatalogue();renderBridal();renderProductDetail();renderTeam();renderBlog();renderArticle();applyForms();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
