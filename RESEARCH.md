# Warshat Alt Tagheer source notes

Source fetched on 2026-10-02: [warshataltagheer.vercel.app](https://warshataltagheer.vercel.app/).

The public page title is “ورشة التغيير — أول عميل خلال 7 أيام”. Its Arabic right-to-left sales page presents a seven-day video-editing and freelancing workshop taught by Mohammed Khattab. Its sections cover creator/client examples, a skills transformation, a day-by-day course roadmap, testimonials, instructor biography, money-back guarantee, FAQ, enrolment CTA, and social links. The captured page and its CSS/JavaScript were the basis for the Next.js recreation.

The supplied profile information in the prior task gives Mohammed’s public contact details: +20 155 859 0242 and mohamedkhattab494@gmail.com. The source page had a placeholder checkout URL, so enrolment links now open WhatsApp at that supplied number. The source’s blank hero-video URL now points to the published tutorial `https://www.youtube.com/watch?v=BQTI8hXPVD0` from Mohammed’s matching MKhattab channel.

## Source adjustments

- The original JavaScript generated a 5-day rolling countdown, changed a live viewer number at random, incremented a bookings number, and showed randomized “recent signup” toasts. Those fabricated activity signals and the countdown were removed. The top strip now states the course’s seven-day duration.
- Original course copy, named testimonials, client examples, guarantee text, and results are transcribed from the public source. They have not been independently verified. Confirm the business details, price, dates, workshop availability, testimonials, and guarantee terms before publishing.
- Original social links were updated to use the Facebook profile and Instagram handle provided by the user. The source YouTube/TikTok links remain.
- Original typography is IBM Plex Sans Arabic. Its dark palette uses `#101317` base, `#161B22` alternating sections, `#FC3522` red, and `#36F329` green accents.
- Portrait and client images are saved under `public/assets/images/`; embedded playback uses YouTube Privacy Enhanced Mode.

The source attributes the original design to محمد فرجاني. Its footer credit is retained in the recreated page.
