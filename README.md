# AFTR. — Çok sayfalı başlangıç paketi

## Dosyalar
- `index.html` — Ana sayfa
- `register.html` — Kayıt arayüzü
- `login.html` — Giriş arayüzü
- `themes.html` — Tema seçimi
- `memories.html` — Anı arşivi önizlemesi
- `settings.html` — Ayarlar
- `style.css` — Ortak görünüm
- `app.js` — Menü, tema ve demo etkileşimleri

## GitHub Pages'e yükleme (iPhone)
1. ZIP dosyasını Dosyalar uygulamasında aç.
2. GitHub'daki `aftr` deposunda `Add file` → `Upload files` seç.
3. Bu klasörün içindeki tüm dosyaları seçip yükle. Dosyaları alt klasörün içine değil, deponun ana dizinine koy.
4. `Commit changes` ile kaydet. `index.html` için mevcut dosyanın üzerine yazmayı onayla.
5. `Settings` → `Pages` içinde `main` ve `/(root)` ayarları kalsın. Birkaç dakika bekle.

## Önemli
Bu paket tasarım ve gezinme prototipidir. Kayıt/giriş formları demo durumundadır; gerçek hesap açmaz. Anı arşivi seçilen dosyaları yalnızca tarayıcıda geçici önizler; dosyalar sunucuya yüklenmez. Gerçek kullanıcı hesapları, gizlilik, kalıcı depolama ve paylaşım için Supabase entegrasyonu ve Row Level Security kurulmalıdır. Hiçbir gizli sunucu anahtarını GitHub'a koymayın.
