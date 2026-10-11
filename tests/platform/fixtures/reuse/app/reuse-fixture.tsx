"use client";
import { useEffect, useState } from "react";
import LandingPage, {
  type LandingModel,
} from "@platform/components/marketing/landing-page";
import ProfileForm from "@platform/components/account/profile-form";
import LessonNotes from "@platform/components/learning/lesson-notes";
import FaqSection from "@khatab/design/ui/faq-section";
import CourseGrid from "@platform/components/courses/course-grid";
import RevealContent from "@platform/components/marketing/reveal-content";
import CoachingSection from "@platform/components/marketing/coaching-section";
import DashboardStats from "@platform/components/learning/dashboard-stats";
import LessonOutline from "@platform/components/learning/lesson-outline";
import ResourceCard from "@platform/components/resources/resource-card";
import CertificateCard from "@platform/components/certificates/certificate-card";
import { notesKey } from "@platform/config/persistence";

const profileCopy = {
  error: "INVALID",
  name: "NAME", username: "USERNAME", usernameHint: "CHOOSE USERNAME",
  email: "EMAIL",
  emailPlaceholder: "EMAIL",
  saving: "SAVING",
  enterDemo: "ENTER",
  save: "SAVE",
  profileSaved: "SAVED",
};
const noteCopy = {
  notes: "NOTE",
  notesHint: "WRITE",
  notesUnavailable: "FAILED",
  notesSaved: "STORED",
};
function alternate(base: LandingModel, prefix: string): LandingModel {
  const labels = <T extends Record<string, string>>(value: T) =>
    Object.fromEntries(
      Object.keys(value).map((key) => [key, `${prefix}-${key}`]),
    ) as T;
  return {
    ...base,
    order: ["hero", "coaching", "instructor"],
    motion: false,
    header: base.header && {
      ...base.header,
      site: { name: prefix, englishName: prefix },
      copy: labels(base.header.copy),
      interfaceCopy: labels(base.header.interfaceCopy),
      marketingNavigation: [{ href: `#${prefix}`, label: `${prefix}-NAV` }],
      actions: {
        home: `/${prefix}`,
        start: `/${prefix}/start`,
      },
    },
    hero: {
      ...base.hero,
      preview: undefined,
      site: { englishName: prefix },
      interfaceCopy: labels(base.hero.interfaceCopy),
      actions: { browse: `/${prefix}/browse`, dashboard: `/${prefix}/learn` },
    },
    instructor:{content:{section:{id:`${prefix}-instructor`,className:"custom-instructor"},name:`${prefix}-TRAINER`,tagline:prefix,manifesto:[prefix],image:{src:"/assets/images/favicon.svg",alt:`${prefix}-PORTRAIT`,width:32,height:32},badge:prefix,experience:prefix,stats:[{value:"7",label:`${prefix}-STAT`}]}},
    coaching: {
      section: { id: prefix, className: "custom-section" },
      content: { title: [`${prefix}-COACHING`] },
      benefits: [
        { id: "one", title: `${prefix}-ONE`, body: prefix, symbol: "grid" },
      ],
    },
    footer: base.footer && {
      ...base.footer,
      credit: { label: `${prefix}-DESIGNER`, href: `https://${prefix.toLowerCase()}.example.com` },
      projectNavigation: {
        label: `${prefix}-PAGES`,
        links: [{ href: `/${prefix}/project`, label: `${prefix}-PROJECT` }],
      },
      site: {
        name: prefix,
        englishName: prefix,
        email: `${prefix}@example.com`,
        demoLabel: prefix,
      },
      copy: labels(base.footer.copy),
      interfaceCopy: labels(base.footer.interfaceCopy),
      marketingNavigation: [
        { href: `/${prefix}/footer`, label: `${prefix}-FOOTER` },
      ],
      homeHref: `/${prefix}`,
      contactHref: `mailto:${prefix}@example.com`,
    },
  };
}
export default function Fixture({ model }: { model: LandingModel }) {
  useEffect(()=>{document.documentElement.dataset.fixtureReady="true";},[]);
  const [mounted, setMounted] = useState(true);
  const faq = {
    section: { id: "custom-faq", className: "custom-faq" },
    heading: { title: ["CUSTOM FAQ"] },
    items: [{ question: "QUESTION", answer: "ANSWER" }],
  };
  const course = model.courses.courses[0];
  return (
    <>
      <div data-fixture="alpha">
        <LandingPage model={alternate(model, "Alpha")} />
      </div>
      <div data-fixture="beta">
        <LandingPage model={alternate(model, "Beta")} />
      </div>
      <button onClick={() => setMounted((value) => !value)}>
        Toggle controls
      </button>
      {mounted && (
        <div data-fixture="instances">
          <div data-profile="one">
            <ProfileForm
              profile={{ name: "One", email: "one@example.com" }}
              copy={profileCopy}
              interfaceCopy={{ namePlaceholder: "ENTER NAME" }}
            />
          </div>
          <div data-profile="two">
            <ProfileForm
              profile={{ name: "Two", email: "two@example.com" }}
              copy={profileCopy}
              interfaceCopy={{ namePlaceholder: "ENTER NAME" }}
            />
          </div>
          <div data-notes="one">
            <LessonNotes
              storageKey={notesKey("learner-a", "course", "lesson")}
              copy={noteCopy}
            />
          </div>
          <div data-notes="same">
            <LessonNotes
              storageKey={notesKey("learner-a", "course", "lesson")}
              copy={noteCopy}
            />
          </div>
          <div data-notes="other">
            <LessonNotes
              storageKey={notesKey("learner-b", "course", "lesson")}
              copy={noteCopy}
            />
          </div>
          <div data-faq="one">
            <FaqSection contextVariant="plain" reveal
              content={{ ...faq, section: { ...faq.section, id: "faq-one" } }}
            />
          </div>
          <div data-faq="two">
            <FaqSection contextVariant="plain" reveal
              content={{ ...faq, section: { ...faq.section, id: "faq-two" } }}
            />
          </div>
        </div>
      )}
      <div data-fixture="standalone">
        <RevealContent as="div">
          <CoachingSection
            {...model.coaching}
            section={{ id: "standalone", className: "alternate-class" }}
          />
        </RevealContent>
      </div>
      {(["public", "dashboard"] as const).map((layout) => (
        <div data-grid={layout} key={layout}>
          <CourseGrid
            {...model.courses}
            courses={[course]}
            layout={layout}
            motion={false}
          />
        </div>
      ))}
      <div data-fixture="narrow-models">
        <DashboardStats
          stats={[{ label: "ALT STAT", value: 2, symbol: "book" }]}
        />
        <LessonOutline
          model={{
            title: "ALT OUTLINE",
            progress: { count: 0, total: 0, percent: 0, next: undefined },
            modules: [],
          }}
          active=""
          copy={{
            courseContent: "CONTENTS",
            completed: "DONE",
            pending: "PENDING",
            progress: "PROGRESS",
            lessons: "LESSONS",
          }}
        />
        <ResourceCard
          resource={{
            id: "alternative",
            title: "ALT RESOURCE",
            description: "BODY",
            type: "TEXT",
          }}
          copy={{ download: "GET RESOURCE" }}
        />
        <CertificateCard
          course={{slug:course.slug,title:course.title}}
          learnerName="ALT LEARNER"
          site={{ name: "ALT ISSUER", demoLabel: "ALT DEMO" }}
          copy={{ print: "GET CERTIFICATE" }}
          interfaceCopy={{ certificateHeading: "ALT CERTIFICATE" }}
        />
      </div>
    </>
  );
}
