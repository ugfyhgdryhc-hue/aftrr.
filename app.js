(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const body = document.body;
  const storedTheme = localStorage.getItem('aftr-theme') || 'dark';
  body.dataset.theme = storedTheme;
  const drawer = $('.drawer'), scrim = $('.scrim');
  const openMenu = () => { if(drawer){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');} if(scrim) scrim.classList.add('open'); };
  const closeMenu = () => { if(drawer){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');} if(scrim) scrim.classList.remove('open'); };
  $$('[data-menu-open]').forEach(b=>b.addEventListener('click',openMenu));
  $$('[data-menu-close]').forEach(b=>b.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  $$('.theme-card').forEach(card=>{
    if(card.dataset.theme===storedTheme) card.classList.add('selected');
    card.addEventListener('click',()=>{
      const theme=card.dataset.theme;body.dataset.theme=theme;localStorage.setItem('aftr-theme',theme);
      $$('.theme-card').forEach(c=>c.classList.toggle('selected',c===card));
      const msg=$('#theme-message');if(msg)msg.textContent=`${card.querySelector('b').textContent} teması seçildi. Bu cihazda hatırlanacak.`;
    });
  });
  const form=$('[data-demo-form]');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();const msg=$('.form-message',form);if(msg)msg.textContent='Arayüz hazır! Gerçek kayıt ve giriş için Supabase bağlantısını tamamlamamız gerekiyor.';});
  const forgot=$('[data-forgot]');if(forgot)forgot.addEventListener('click',e=>{e.preventDefault();alert('Şifre sıfırlama, Supabase bağlantısından sonra etkinleştirilecek.');});
  const year=$('#year');if(year)year.textContent=new Date().getFullYear();
  const grid=$('#memory-grid'), count=$('#memory-count');
  const fileInputs=[$('#memory-upload'),$('#empty-upload')].filter(Boolean);
  function addFiles(input){
    if(!input.files||!grid)return;
    const empty=$('.empty-state',grid);if(empty)empty.remove();
    [...input.files].forEach(file=>{
      if(!file.type.startsWith('image/')&&!file.type.startsWith('video/'))return;
      const url=URL.createObjectURL(file), card=document.createElement('article');card.className='memory-item';
      const media=document.createElement(file.type.startsWith('video/')?'video':'img');media.src=url;if(media.tagName==='VIDEO')media.controls=true;else media.alt=file.name;
      const p=document.createElement('p');p.textContent=file.name;
      card.append(media,p);grid.prepend(card);
    });
    if(count)count.textContent=`${$$('.memory-item',grid).length} anı`;
    input.value='';
  }
  fileInputs.forEach(input=>input.addEventListener('change',()=>addFiles(input)));
})();