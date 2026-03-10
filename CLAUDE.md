# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**UIGen** — AI destekli React bileşen üreticisi (live preview ile). Kullanıcılar doğal dil ile React bileşeni tanımlar, Claude AI gerçek zamanlı kod üretir ve sanal dosya sisteminde önizleme yapılır.

## Commands

```bash
# İlk kurulum (bağımlılıklar + Prisma client + migration)
npm run setup

# Geliştirme sunucusu (Turbopack ile)
npm run dev

# Production build
npm run build

# Testleri çalıştır
npm run test

# Tek test dosyası çalıştır
npx vitest run src/path/to/test.test.ts

# Linting
npm run lint

# Veritabanını sıfırla
npm run db:reset

# Prisma migration
npx prisma migrate dev
```

## Environment Variables

`.env` dosyasında tek zorunlu değişken:
```
ANTHROPIC_API_KEY=...
```
API key yoksa uygulama `MockLanguageModel` kullanır (hardcoded örnek bileşenler döner).

## Architecture

### AI Pipeline

1. Kullanıcı mesajı → `ChatInterface` bileşeni
2. `POST /api/chat` (`src/app/api/chat/route.ts`) — streaming endpoint
3. `src/lib/provider.ts` — Anthropic API key varsa Claude, yoksa MockLanguageModel
4. AI iki araç kullanır:
   - `str_replace_editor` (`src/lib/tools/`) — dosya içeriği düzenleme
   - `file_manager` — dosya oluşturma/silme
5. `src/lib/file-system.ts` — **Virtual File System** (diske hiçbir şey yazılmaz)
6. Kimliği doğrulanmış kullanıcılar için Prisma ile SQLite'a kaydedilir

### Key Data Flow

- **FileSystemContext** — sanal FS durumunu tüm bileşenler arasında paylaşır
- **ChatContext** — chat mesajları ve proje ID'sini yönetir
- Project verisi DB'de JSON string olarak saklanır (`messages` ve `data` alanları)

### Authentication

- JWT tabanlı, httpOnly cookie (`auth-token`, 7 gün)
- Bcrypt ile şifre hash'leme
- `src/middleware.ts` — belirli API route'larını korur
- Anonim kullanım desteklenir; projeler yalnızca giriş yapan kullanıcılar için kalıcıdır

### Important Files

| Dosya | Açıklama |
|-------|----------|
| `src/app/api/chat/route.ts` | AI streaming endpoint |
| `src/lib/provider.ts` | LLM seçimi (Anthropic/Mock) |
| `src/lib/file-system.ts` | Sanal dosya sistemi |
| `src/lib/prompts/generation.tsx` | Claude'a gönderilen sistem prompt'u |
| `src/lib/tools/` | AI araçları (str_replace_editor, file_manager) |
| `src/actions/index.ts` | Auth server actions (signUp, signIn, getUser) |
| `src/app/main-content.tsx` | Ana layout (chat + editor + preview) |
| `prisma/schema.prisma` | DB şeması (User, Project) — veri yapısını anlamak için her zaman buraya başvur |

### Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **AI:** Vercel AI SDK + `@ai-sdk/anthropic`
- **DB:** SQLite + Prisma 6
- **Testing:** Vitest + React Testing Library (jsdom)
- **Path alias:** `@/*` → `./src/*`

## Code Style

Yorum satırlarını az kullan. Yalnızca karmaşık, açıklaması gerekli mantık için yorum ekle.

### Node Compatibility

Tüm `next` komutları `NODE_OPTIONS='--require ./node-compat.cjs'` ile çalışır — bu `package.json` scriptlerinde zaten tanımlıdır. Doğrudan `next` çağırırken bu prefix gereklidir.
