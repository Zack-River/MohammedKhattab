import ComingSoon from "@khatab/design/ui/coming-soon";
import AssetImage from "@khatab/design/ui/asset-image";
import type { PortfolioContent } from "@platform/types/portfolio";
import PortfolioSection from "./section";
import PortfolioIcon from "./icon";
export default function PortfolioCourses({
  content,
}: {
  content: PortfolioContent["courses"];
}) {
  return (
    <PortfolioSection content={content} className="p-ref-courses-section">
      <div className="p-ref-courses-youtube-grid personal-courses">
        {content.items.map((course) => (
          <a
            className={`p-ref-course-yt-card personal-course ${course.upcoming ? "personal-course-upcoming" : ""}`}
            key={course.title}
            href={course.href}
            target={course.href.startsWith("https:") ? "_blank" : undefined}
            rel={course.href.startsWith("https:") ? "noopener noreferrer" : undefined}
            aria-label={course.title}
          >
            <div className="p-ref-course-yt-thumb">
              {course.upcoming ? (
                <ComingSoon label={course.badge} detail={content.comingSoonDetail} />
              ) : (
                <>
                  <AssetImage
                    asset={{
                      src: course.image,
                      alt: course.alt,
                      width: 1280,
                      height: 720,
                    }}
                    className="p-ref-course-yt-img"
                  />
                  <span className="p-ref-course-yt-badge">{course.badge}</span>
                </>
              )}
            </div>
            <div className="p-ref-course-yt-content">
              <div>
                <h3 className="p-ref-course-yt-title">{course.title}</h3>
                <p className="p-ref-course-yt-desc">{course.description}</p>
              </div>
              <span className="p-ref-course-yt-cta">
                <span>{course.action}</span>
                <PortfolioIcon name="arrow" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </PortfolioSection>
  );
}
