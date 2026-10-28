# AFTR. 2.0 — anılarını kişiselleştir

## İçindekiler
- `index.html`, `register.html`, `login.html`, `memories.html`, `themes.html`, `profile.html`, `settings.html`
- `style.css`, `app.js`, `supabase-config.js`
- `aftr-v2-migration.sql` (yeni anı özellikleri için gereken küçük veritabanı güncellemesi)

## GitHub Pages'e yükleme
ZIP'i açın; içindeki dosyaların tamamını GitHub deposunun ana dizinine yükleyin ve mevcut dosyaların üzerine yazın. Klasörün kendisini yüklemeyin. `supabase-config.js` içindeki Project URL ve publishable key zaten yapılandırılmıştır. `service_role`/secret anahtarını asla ön yüze eklemeyin.

## Önemli: SQL güncellemesi
Yeni başlık/açıklama/emoji/etiket/çerçeve alanlarının veritabanında kaydedilmesi için Supabase → SQL Editor bölümünde `aftr-v2-migration.sql` dosyasının içeriğini bir kez çalıştırın. Eski SQL'i yeniden çalıştırmanız gerekmez.

## Yeni özellikler
- Mobil alt navigasyon ve daha düzenli, profil içeren yan menü
- Profil görünen adı, bio ve emoji; hesap bilgileri ve çıkış
- Anı başlığı, açıklaması, emoji, etiketler ve çerçeve seçimi
- Kahve, çiçek, kelebek, botanik, analog film ve sakura çerçeveleri
- Arşiv araması, etiket filtresi, sıralama, ızgara/kolaj/liste düzeni
- Fotoğraf ve videolar özel Supabase Storage'da; RLS kuralları kullanıcı klasörlerini korumalı

Not: Tema ve arşiv görünüm tercihi şu anda kullanılan cihaz/tarayıcıda saklanır. Hesap silme ve e-posta değiştirme gibi hassas işlemler bu sürümde eklenmedi. Dosya yükleme sınırı uygulama tarafında 50 MB'dır; Supabase projenizin Storage limitleri de geçerlidir.
