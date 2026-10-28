# AFTR. — çok sayfalı + Supabase bağlantısı

## İçerik
- `index.html`, `register.html`, `login.html`, `themes.html`, `memories.html`, `settings.html`
- `style.css`, `app.js`, `supabase-config.js`
- `supabase-setup.sql`

## GitHub Pages'e yükleme
ZIP'i aç. İçindeki dosyaların hepsini (alt klasör olarak değil) GitHub deposunun ana dizinine yükle ve mevcut dosyaların üzerine yaz. Settings → Pages kısmında `main` / `(root)` seçili olsun.

## Supabase
1. `supabase-setup.sql` içeriğini Supabase → SQL Editor'de çalıştır (daha önce aynı SQL'i çalıştırdıysan yeniden çalıştırmak zorunda değilsin).
2. `supabase-config.js` dosyasında Project URL ve Publishable key önceden doldurulmuştur. Yalnızca tarayıcı için tasarlanan publishable key kullanılmalıdır. `service_role` veya `secret` anahtarını asla buraya koyma.
3. Supabase → Authentication → URL Configuration bölümünde Site URL'yi `https://ugfyhgdryhc-hue.github.io/aftr` olarak ayarla ve Redirect URLs listesine `https://ugfyhgdryhc-hue.github.io/aftr/**` ekle. Kendi GitHub Pages adresin farklıysa onu kullan.
4. Authentication → Providers → Email bölümünde e-posta doğrulaması açıksa yeni hesap oluşturunca e-postadaki doğrulama bağlantısına bas. Test sırasında gelen kutusu ve spam klasörünü kontrol et.
5. GitHub Pages değişiklikleri yayınladıktan sonra siteyi açıp önce kayıt ol, gerekiyorsa e-postayı doğrula, sonra giriş yap ve anı yüklemeyi dene.

## Güvenlik ve sınırlar
- RLS politikaları kullanıcının sadece kendi satırlarını görmesine izin verir. Storage bucket özeldir; dosyalar kısa ömürlü imzalı URL ile gösterilir.
- Dosya yükleme arayüzü 50 MB üstünü reddeder; Supabase projenin kendi depolama/plan limitleri de geçerlidir.
- Publishable key'in istemci kodunda bulunması beklenir; yönetici/secret anahtarları asla istemciye konmaz.
- Statik GitHub Pages kullanıldığı için uygulama kodu herkese açıktır; gizlilik RLS ve Storage politikalarına dayanır.
- Bu başlangıç sürümü e-posta/şifre auth ve özel fotoğraf/video arşivini içerir. Şifre sıfırlama bağlantısı e-posta sağlayıcısı ve URL ayarlarına bağlıdır.
