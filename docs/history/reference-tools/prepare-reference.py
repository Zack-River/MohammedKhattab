"""Prepare a locally fetched Warshat Altgheer page for server rendering."""

from pathlib import Path
import re
import sys


source = Path(sys.argv[1])
document = source.read_text(encoding="utf-8")
match = re.search(r"<body[^>]*>(.*)</body\s*>", document, flags=re.IGNORECASE | re.DOTALL)
if not match:
    raise SystemExit("The source document does not contain a body element.")

content = match.group(1)
content = re.sub(r"<script\b[^>]*>.*?</script\s*>", "", content, flags=re.IGNORECASE | re.DOTALL)
content = re.sub(
    r'<aside class="recent-signup-toast".*?</aside>',
    "",
    content,
    flags=re.IGNORECASE | re.DOTALL,
)
content = re.sub(
    r'<aside class="top-scarcity-bar".*?</aside>',
    '''<aside class="top-scarcity-bar" aria-label="تفاصيل الورشة">
      <div class="container top-bar-inner">
        <div class="top-scarcity-nav-capsule">
          <div class="top-live-item"><span class="live-dot" aria-hidden="true"></span>
            <span>ورشة عملية لمدة <b class="proof-num-highlight numeral">7</b> أيام</span>
          </div>
          <span class="top-bar-sep" aria-hidden="true">•</span>
          <span class="top-timer-label">تعلم المونتاج وابدأ رحلتك مع العملاء</span>
        </div>
      </div>
    </aside>''',
    content,
    flags=re.IGNORECASE | re.DOTALL,
)

content = content.replace('assets/images/', '/assets/images/')
content = content.replace(
    "https://example.com/checkout",
    "https://wa.me/201558590242?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%88%D8%B1%D8%B4%D8%A9%20%D8%A7%D9%84%D8%AA%D8%BA%D9%8A%D9%8A%D8%B1",
)
content = content.replace(
    "https://www.facebook.com/share/1GaKrsfaVo/",
    "https://www.facebook.com/profile.php?id=61567528060353",
)
content = content.replace(
    "https://www.instagram.com/khatttab7?stkn=YWk5ZzVmMDBkNWp4",
    "https://www.instagram.com/mohamed_khatttab7/",
)
content = content.replace('data-video-embed=""', 'data-video-embed="https://www.youtube-nocookie.com/embed/BQTI8hXPVD0"')
content = content.replace(
    "شاهد الفيديو التعريفي للورشة مع محمد خطاب",
    "شاهد أسلوب محمد في المونتاج على يوتيوب",
).replace("فيديو تعريفي لورشة التغيير", "فيديو من قناة محمد خطاب")

client_images = {
    "أسامة عصام الدين_.jpg": "osama-essam-eldeen.jpg",
    "بلال طرخان_.jpg": "bilal-tarkhan.jpg",
    "عبدالله الغفيص_.jpg": "abdullah-alghufais.jpg",
    "محمد الخضير_.jpg": "mohammed-alkhudair.jpg",
    "مستر أحمد.jpg": "mr-ahmed.jpg",
    "نجم الدين.jpg": "najm-eldeen.jpg",
}
for original, local in client_images.items():
    content = content.replace(original, local)

content = content.replace(
    "<div class=\"footer-copy-text\">جميع الحقوق محفوظة © ورشة التغيير — محمد خطاب</div>",
    "<div class=\"footer-copy-text\">جميع الحقوق محفوظة © ورشة التغيير — محمد خطاب</div>\n        <div class=\"footer-contact\"><a href=\"tel:+201558590242\">+20 155 859 0242</a> · <a href=\"mailto:mohamedkhattab494@gmail.com\">mohamedkhattab494@gmail.com</a></div>",
)

destination = Path("content/workshop.html")
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_text(content.strip() + "\n", encoding="utf-8")
print(f"Prepared {destination} ({len(content)} characters)")
