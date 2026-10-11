# Cloudinary image storage

Cloudinary stores user profile images and course thumbnails. Video sources and streaming remain on Google Drive. Existing platform/reference assets remain local; there is no bulk asset migration.

## Environment

Set these **server-only** variables in the ignored `.env.local` and Vercel environments:

```dotenv
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Do not use a `NEXT_PUBLIC_` prefix. No unsigned upload preset is required. Credentials are used only by the Next.js API to sign Cloudinary requests. `.env.example` contains placeholders. The local supplied credentials authenticated successfully; the user confirmed saving the three variables in Vercel Production.

## Folders

```text
ta3allam/
  production/
    users/{immutable-user-id}/avatars/{generated-image-id}
    courses/{course-slug}/thumbnails/{generated-image-id}
  preview/       # same structure for Vercel previews
  development/   # same structure for local development
```

`asset_folder` organizes the Cloudinary Media Library; the same prefix is included in `public_id`. Usernames and emails are not used as paths. The environment is derived server-side from `VERCEL_ENV` or `NODE_ENV`. Folders are created as images are uploaded. These are organizational folders, not private buckets; approved images use public CDN delivery. Previous images are retained in their folders when users replace a photo or admins change a thumbnail. Course uploads not subsequently saved also remain available in the Media Library; automated retention/account-deletion cleanup is not part of this change.

## Endpoint and permissions

`POST /api/media/images` accepts multipart form data:

- `file`: JPEG, PNG or WebP, at most 3 MiB.
- `kind`: `avatar` or `course`.
- `courseSlug`: required only for course thumbnails.

Authentication and current account access are required. Avatar ownership comes from the verified session; client `userId`, `folder`, `publicId` values cannot select the destination. Course uploads require live administrator authority and an existing course. Cross-origin requests are rejected. Both the total streamed request and file size are bounded, including requests without Content-Length. File signatures and declared MIME types must agree; Cloudinary restricts and decodes formats again. SVG, videos, remote URL uploads and raw files are unsupported.

Only URL, public ID and image dimensions are returned, with private/no-store response headers. Provider failures return a generic translated error. Avatar URLs save to the existing `profiles.avatar_url` column; failed persistence triggers removal of the newly uploaded image. No database schema or RLS changes were needed. As elsewhere in the app, live session/access checks remain authoritative. A distributed per-user upload rate limiter has not been added; request/file limits do not constitute account upload quotas.

Avatars are cropped to 512×512. Thumbnails preserve aspect ratio and are limited to 2048×2048. Incoming processing strips profiles/metadata; delivered URLs use `f_auto,q_auto` for CDN format/quality optimization. Browser controls remain disabled until hydration and while uploading, allowing the same file to be selected again afterward.

## UI and reuse

Account Settings shows the current avatar and upload control. Avatar uploads immediately save and refresh the profile/navigation. Course editor uploads populate the existing editable thumbnail URL; the admin then clicks **Save changes** to publish that URL. Upload feedback makes this distinction explicit. Existing thumbnail and Drive video URL editing remains available.

`modules/components/ui/image-upload.tsx` receives a typed target, text labels and optional `onUploaded` callback. Avatar/course adapters compose it. Policy lives in `modules/config/image-upload.ts`; translated copy in `modules/data/image-upload.ts`; bounded reading and signed provider calls are separate small helpers. Styling uses the existing theme and preserves responsive settings card alignment.

## Verification

```sh
NODE_OPTIONS=--conditions=react-server node --import tsx --test tests/backend/image-upload-unit.test.ts
BACKEND_SUITE=image-uploads npm run backend:test
```

The backend command requires the isolated local Supabase instance/status file and local Cloudinary credentials. It creates disposable database accounts, uploads real test images only to development folders, restores the local course metadata, and deletes every successfully tracked Cloudinary test image. It never edits a real production account photo or course. Evidence: `docs/evidence/image-uploads/acceptance.json`.

Four unit cases, 36 image-upload integration checks, the existing 190 backend checks, production build/TypeScript, lint and architecture (591 files / zero violations) passed.

The unit cases cover bounded streaming, invalid paths/scopes/size, MIME spoofing and signed request/error behavior. Integration covers owner isolation, actual Cloudinary folders, profile persistence and refresh, course URL persistence/reload, banned/guest denial, cross-origin protection and responsive widths from 320 to 1920px.

## Hosted acceptance

Application commit `b6c0f98` deployed successfully. The live endpoint rejects guests with HTTP 401. The real-admin smoke test verified the avatar upload control, uploaded one temporary course thumbnail, checked the production folder and editable URL, and compared course metadata before/after to ensure it was unchanged. The temporary image was deleted afterward; zero browser runtime errors were observed. Evidence: `docs/evidence/image-uploads/live.json`. No production account photo was changed. Reproduce with `node tests/backend/image-uploads-live.cjs` using ignored local admin/Cloudinary credentials.

Implementation follows [Cloudinary's signed Upload API and folder options](https://cloudinary.com/documentation/image_upload_api_reference), the installed Next.js Route Handler guide, and [Supabase filtered updates](https://supabase.com/docs/reference/javascript/update).
