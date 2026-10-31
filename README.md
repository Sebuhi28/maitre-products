# Maitre · Məhsullar səhifəsi

Restoran menyusundakı məhsulları idarə etmək üçün admin panelin məhsullar səhifəsi.

**Canlı link:** BURA_VERCEL_LINKINI_YAZIN

## İşə salmaq

    npm install
    npm run dev

Brauzerdə terminalda göstərilən ünvanı açın (adətən http://localhost:5173).

İstehsal versiyası üçün:

    npm run build
    npm run preview

## Texnologiyalar

React, TypeScript, Vite. Əlavə kitabxana yoxdur.

## Əsas qərarlar və səbəbləri

- **Əlavə kitabxana işlətmədim.** Layihə kiçikdir. Sadə CSS və React-in öz imkanları kifayət edir. Bu, layihəni yüngül saxlayır.
- **Dizayn dəyərləri CSS dəyişənlərində** (`src/styles/tokens.css`). Stil bələdçisindəki rəng, ölçü və boşluqlar bir yerdə durur, dəyişmək asandır.
- **Məntiq hook-larda, görünüş komponentlərdə.** Məlumat götürmə (`useProducts`, `useCategories`), toggle (`useToggleAvailability`), URL (`useUrlFilters`) ayrı hook-lardadır. Komponentlər yalnız göstərir.
- **Yoxlama ayrı faylda** (`validateProduct.ts`). React-dan asılı deyil, test etmək asandır.
- **Köhnə cavabların qarşısı.** API gec cavab verir. Parametr dəyişəndə köhnə sorğunun gec gələn cavabı yeni nəticənin üstünə yazılmasın deyə `cancelled` bayrağı işlədilir.
- **Toggle optimistic işləyir.** Toggle dərhal dəyişir, server xəta qaytarsa əvvəlki vəziyyətinə qayıdır və bildiriş çıxır. Eyni məhsulda sorğu gedərkən toggle bloklanır.
- **Modal üçün `<dialog>`.** Fokusu saxlayır, `Esc` ilə bağlayır, əlavə kitabxana tələb etmir.
- **Həqiqi `<table>`, `role="switch"`, `aria-*`.** Əlçatanlıq üçün.
- **Router yoxdur.** Layihədə tək səhifə var. URL ilə işləmək üçün brauzerin `URLSearchParams` və `history` imkanları kifayətdir.

## Açıq qalan məqamlar üçün qərarlarım

- **Axtarış** 300 ms gecikdirilir. Azərbaycan və ingilis adlarında, böyük-kiçik hərfə baxmadan axtarır (API-nin davranışıdır).
- **Filtr və ya axtarış dəyişəndə** səhifə 1-ə qayıdır.
- **"48 məhsul" yazısı** filtrə görə dəyişir, çünki filtrlənmiş sayı göstərir.
- **Mövcud olmayan səhifə nömrəsi** (`?page=99`) sonuncu səhifəyə yönləndirilir. Yanlış dəyərlər (`?page=abc`) standart dəyərə çevrilir.
- **URL-də** axtarış (`q`), kateqoriya (`category`) və səhifə (`page`) saxlanır. Standart dəyərlər yazılmır. Axtarış tarixçəyə yeni qeyd əlavə etmir, kateqoriya və səhifə əlavə edir.
- **Qiymət sahəsi** mətn sahəsidir: vergül və nöqtə qəbul edilir, vergüldən sonra ən çox 2 rəqəm. Qiymət siyahıda `4,50 ₼` formatındadır.
- **Yeni məhsul** siyahının sonuna düşür (API belə işləyir). Yaradılandan sonra siyahı yenilənir və yaşıl bildiriş göstərilir.
- **Düzəlişdən sonra** məhsul yerində yenilənir. Kateqoriyası dəyişib filtrə uyğun gəlməsə, səhifə yenilənənə qədər siyahıda qala bilər.
- **Server xətası formada:** modal açıq qalır, yazılanlar itmir, yuxarıda xəta mesajı göstərilir.
- **Saxlanma gedərkən** modal bağlanmır ki, sorğu təkrarlanmasın.
- **Mobildə** cədvəl kartlara çevrilir.
- **Ingilis adı olmayan məhsulda** `—` göstərilir.
- **Satışdan çıxarmaq** məhsulu siyahıdan silmir, yalnız statusu dəyişir.

## Sərf olunan vaxt

TAPŞIRIĞA_SƏRF_ETDİYİNİZ_VAXTI_YAZIN (məsələn: təxminən 5 saat)

## Daha çox vaxtım olsaydı

- Əsas hissələr üçün test yazardım: `validateProduct`, `formatPrice`, `useUrlFilters`-in oxuma məntiqi və toggle-ın geri qayıtması.
- URL-də kateqoriya nömrəsi mövcud deyilsə, kateqoriyalar yüklənəndən sonra onu avtomatik təmizləyərdim.
- Server xətasında sorğunu avtomatik bir-iki dəfə təkrarlayardım.
- Modalda fokusun bağlanandan sonra "Düzəlt" düyməsinə qayıtmasını əlavə edərdim.
- Dizaynı piksel səviyyəsində masaüstü şəkli ilə üst-üstə qoyub yenidən yoxlayardım.
- Yeni məhsul yaradılandan sonra istifadəçini həmin məhsulun olduğu səhifəyə aparardım.