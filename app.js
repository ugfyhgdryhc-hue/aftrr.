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
  const year=$('#year');if(year)year.textContent=new Date().getFullYear();

  const configured = window.supabase && window.AFTR_SUPABASE_URL && window.AFTR_SUPABASE_PUBLISHABLE_KEY;
  const sb = configured ? window.supabase.createClient(window.AFTR_SUPABASE_URL, window.AFTR_SUPABASE_PUBLISHABLE_KEY) : null;
  const friendlyError = (err) => {
    const m=(err && err.message)||'Bilinmeyen bir hata oluştu.';
    if(/Invalid login credentials/i.test(m)) return 'E-posta veya şifre yanlış.';
    if(/User already registered/i.test(m)) return 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.';
    if(/Email not confirmed/i.test(m)) return 'Önce e-posta adresini doğrula. Gelen kutunu ve spam klasörünü kontrol et.';
    if(/Password should be at least/i.test(m)) return 'Şifren en az 8 karakter olmalı.';
    if(/Failed to fetch|NetworkError/i.test(m)) return 'Bağlantı kurulamadı. İnternetini ve Supabase proje durumunu kontrol et.';
    return m;
  };
  const say=(el,msg,kind='')=>{if(el){el.textContent=msg;el.dataset.kind=kind;}};
  const ensureConfigured=()=>{if(!sb){alert('Supabase bağlantı dosyası yüklenemedi. supabase-config.js dosyasını ve script bağlantılarını kontrol et.');return false;}return true;};

  const register=$('[data-register-form]');
  if(register) register.addEventListener('submit',async e=>{
    e.preventDefault(); if(!ensureConfigured())return;
    const msg=$('.form-message',register), btn=$('button[type="submit"]',register);
    const name=$('#name').value.trim(), email=$('#email').value.trim(), password=$('#password').value;
    btn.disabled=true; say(msg,'Hesabın oluşturuluyor…');
    try{
      const {data,error}=await sb.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:location.origin+location.pathname.replace(/[^/]*$/,'')+'login.html'}});
      if(error) throw error;
      if(data.session){say(msg,'Hesabın oluşturuldu! Anı arşivine yönlendiriliyorsun.','success');setTimeout(()=>location.href='memories.html',800);}
      else say(msg,'Kayıt isteğin alındı. E-posta doğrulaması açıksa gelen kutuna gelen bağlantıya bas, ardından giriş yap.','success');
    }catch(err){say(msg,friendlyError(err),'error');}finally{btn.disabled=false;}
  });

  const login=$('[data-login-form]');
  if(login) login.addEventListener('submit',async e=>{
    e.preventDefault(); if(!ensureConfigured())return;
    const msg=$('.form-message',login), btn=$('button[type="submit"]',login);
    btn.disabled=true;say(msg,'Giriş yapılıyor…');
    try{
      const {error}=await sb.auth.signInWithPassword({email:$('#email').value.trim(),password:$('#password').value});
      if(error)throw error;
      say(msg,'Giriş başarılı. Anı arşivin açılıyor…','success');setTimeout(()=>location.href='memories.html',500);
    }catch(err){say(msg,friendlyError(err),'error');}finally{btn.disabled=false;}
  });
  const forgot=$('[data-forgot]');
  if(forgot)forgot.addEventListener('click',async e=>{
    e.preventDefault();if(!ensureConfigured())return;
    const email=$('#email').value.trim();const msg=$('.form-message',login);
    if(!email){say(msg,'Önce e-posta adresini yaz, sonra “Şifremi unuttum” seçeneğine bas.','error');$('#email').focus();return;}
    say(msg,'Şifre sıfırlama bağlantısı gönderiliyor…');
    const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname.replace(/[^/]*$/,'')+'login.html'});
    say(msg,error?friendlyError(error):'Şifre sıfırlama bağlantısı gönderildiyse e-posta adresine ulaşacaktır. Spam klasörünü de kontrol et.',error?'error':'success');
  });

  async function getUser(){if(!sb)return null;const {data:{session}}=await sb.auth.getSession();return session?.user||null;}
  const grid=$('#memory-grid'), count=$('#memory-count');
  const fileInputs=[$('#memory-upload'),$('#empty-upload')].filter(Boolean);
  function emptyState(message='Henüz anı eklemedin. İlk fotoğrafını veya videonu yükleyebilirsin.'){
    if(!grid)return;grid.innerHTML='';const box=document.createElement('div');box.className='empty-state';
    const art=document.createElement('div');art.className='empty-illustration';art.textContent='✧';
    const h=document.createElement('h2');h.textContent='Hikâyen burada başlasın.';
    const p=document.createElement('p');p.textContent=message;
    const label=document.createElement('label');label.className='button quiet';label.textContent='İlk anını ekle ';
    const input=document.createElement('input');input.type='file';input.accept='image/*,video/*';input.multiple=true;input.hidden=true;input.addEventListener('change',()=>uploadFiles(input));label.append(input);box.append(art,h,p,label);grid.append(box);
  }
  function formatBytes(n){return n<1024*1024?Math.round(n/1024)+' KB':(n/1024/1024).toFixed(1)+' MB';}
  async function loadMemories(){
    if(!grid)return;if(!ensureConfigured())return;
    const user=await getUser();if(!user){location.href='login.html?next=memories';return;}
    const {data:rows,error}=await sb.from('memories').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
    if(error){emptyState('Anılar yüklenemedi: '+friendlyError(error));return;}
    grid.innerHTML='';
    for(const row of rows){
      const {data:asset}=await sb.storage.from('aftr-memories').createSignedUrl(row.file_path,3600);
      const card=document.createElement('article');card.className='memory-item';
      if(asset?.signedUrl){const media=document.createElement(row.media_type.startsWith('video/')?'video':'img');media.src=asset.signedUrl;if(media.tagName==='VIDEO')media.controls=true;else media.alt=row.title||'AFTR anısı';card.append(media);}
      const title=document.createElement('p');title.textContent=row.title||row.file_path.split('/').pop();
      const del=document.createElement('button');del.type='button';del.className='button quiet';del.textContent='Sil';del.addEventListener('click',()=>deleteMemory(row,card));card.append(title,del);grid.append(card);
    }
    if(count)count.textContent=`${rows.length} anı`;
    if(!rows.length)emptyState();
    const notice=$('.inline-notice');if(notice)notice.textContent='Dosyaların hesabına özel depolanır. Paylaşım bağlantısı oluşturulmadıkça herkese açık değildir.';
  }
  async function uploadFiles(input){
    if(!input.files?.length)return;if(!ensureConfigured())return;
    const user=await getUser();if(!user){location.href='login.html?next=memories';return;}
    const files=[...input.files];input.value='';
    const notice=$('.inline-notice');
    for(const file of files){
      if(!file.type.startsWith('image/')&&!file.type.startsWith('video/')){say(notice,`${file.name}: yalnızca fotoğraf veya video yüklenebilir.`,'error');continue;}
      if(file.size>50*1024*1024){say(notice,`${file.name}: dosya 50 MB sınırını aşıyor.`,'error');continue;}
      say(notice,`${file.name} yükleniyor (${formatBytes(file.size)})…`);
      const safeName=file.name.normalize('NFKD').replace(/[^\w.-]+/g,'-').slice(-100)||'memory';
      const path=`${user.id}/${crypto.randomUUID()}-${safeName}`;
      const {error:uploadError}=await sb.storage.from('aftr-memories').upload(path,file,{contentType:file.type,upsert:false});
      if(uploadError){say(notice,`${file.name}: ${friendlyError(uploadError)}`,'error');continue;}
      const {error:dbError}=await sb.from('memories').insert({user_id:user.id,title:file.name,file_path:path,media_type:file.type});
      if(dbError){await sb.storage.from('aftr-memories').remove([path]);say(notice,`${file.name}: ${friendlyError(dbError)}`,'error');continue;}
      say(notice,`${file.name} güvenli arşivine eklendi.`,'success');
    }
    await loadMemories();
  }
  async function deleteMemory(row,card){
    if(!confirm('Bu anıyı kalıcı olarak silmek istiyor musun?'))return;
    const {error:dbError}=await sb.from('memories').delete().eq('id',row.id);
    if(dbError){alert(friendlyError(dbError));return;}
    const {error:fileError}=await sb.storage.from('aftr-memories').remove([row.file_path]);
    if(fileError)console.warn('Dosya silinemedi:',fileError.message);
    card.remove();const remaining=$$('.memory-item',grid).length;if(count)count.textContent=`${remaining} anı`;if(!remaining)emptyState();
  }
  fileInputs.forEach(input=>input.addEventListener('change',()=>uploadFiles(input)));
  if(grid)loadMemories();

  const status=$('#account-status');
  if(status){(async()=>{if(!ensureConfigured())return;const user=await getUser();if(!user){status.textContent='Şu anda giriş yapılmamış. Hesabına erişmek için giriş yap.';return;}status.textContent=`Giriş yapılan hesap: ${user.email||'e-posta bilgisi yok'}`;})();}
  const signout=$('#sign-out');if(signout)signout.addEventListener('click',async()=>{if(!ensureConfigured())return;const {error}=await sb.auth.signOut();if(error){alert(friendlyError(error));return;}location.href='index.html';});
})();
