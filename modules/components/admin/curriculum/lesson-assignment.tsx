"use client";
import { useState } from "react";
import Select from "@khatab/design/ui/select";
import type { CurriculumCourse, CurriculumLabels } from "@platform/types/curriculum";
export default function LessonAssignment({ course, chapterId, sectionId, labels }: { course: CurriculumCourse; chapterId: string; sectionId: string; labels: CurriculumLabels }) {
  const [selected, setSelected] = useState(chapterId);
  const sections = course.modules.find(chapter => chapter.id === selected)?.sections ?? [];
  return <>
    <Select label={labels.chapterLabel} name="chapterId" required value={selected} onValueChange={setSelected} options={course.modules.map(chapter => ({ value: chapter.id, label: chapter.title }))} />
    <Select key={selected} label={labels.sectionLabel} name="sectionId" defaultValue={selected === chapterId ? sectionId : ""} options={[{ value: "", label: labels.ungrouped }, ...sections.map(section => ({ value: section.id, label: section.title }))]} />
  </>;
}
