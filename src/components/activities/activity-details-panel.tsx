"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import sanitizeHtml from "sanitize-html";

import ActivityCategoryBadge from "@/components/activities/activity-category-badge";
import Icon from "@/components/ui/icon";
import { formatDate } from "@/lib/dates";
import type { Activity } from "@/types/activity";

export default function ActivityDetailsPanel({
  activity,
  onClose,
  onEdit,
  onSave,
}: {
  activity: Activity;
  onClose: () => void;
  onEdit: () => void;
  onSave: (activity: Activity) => Promise<boolean>;
}) {
  const notesRef = useRef<HTMLDivElement>(null);
  const savingRef = useRef(false);

  const [savingProgress, setSavingProgress] = useState(0);

  const sanitizedNotes = activity.notes
    ? sanitizeHtml(activity.notes, {
        allowedTags: [
          "p",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "ul",
          "ol",
          "li",
          "br",
          "label",
          "input",
          "span",
          "div",
        ],
        allowedAttributes: {
          ul: ["data-type"],
          ol: ["data-type", "start"],
          li: ["data-type", "data-checked"],
          input: ["type", "checked"],
        },
        allowedSchemes: [],
        transformTags: {
          input: (_tagName, attribs) => ({
            tagName: "input",
            attribs: {
              type: "checkbox",
              ...(attribs.checked !== undefined ? { checked: "checked" } : {}),
            },
          }),
        },
      })
    : "";

  useEffect(() => {
    const container = notesRef.current;

    if (!container) return;

    const notesContainer = container;

    async function handleChange(event: Event) {
      const target = event.target;

      if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") {
        return;
      }

      const listItem = target.closest("li[data-type='taskItem']");

      if (!listItem) return;

      // Prevent multiple simultaneous saves.
      if (savingRef.current) {
        target.checked = !target.checked;
        return;
      }

      const previousChecked = !target.checked;
      const previousDataChecked = listItem.getAttribute("data-checked");

      // Synchronize the live checkbox state with its HTML attribute.
      target.toggleAttribute("checked", target.checked);
      listItem.setAttribute("data-checked", String(target.checked));

      // Get only the actual notes HTML, excluding the progress bar.
      const notesContent = notesContainer.querySelector(".activity-notes-html");

      const updatedNotes = notesContent?.innerHTML ?? "";

      savingRef.current = true;
      setSavingProgress(10);

      const progressInterval = window.setInterval(() => {
        setSavingProgress((current) =>
          current < 90 ? Math.min(current + 10, 90) : current,
        );
      }, 150);

      try {
        const saved = await onSave({
          ...activity,
          notes: updatedNotes,
        });

        if (!saved) {
          target.checked = previousChecked;
          target.toggleAttribute("checked", previousChecked);

          if (previousDataChecked === null) {
            listItem.removeAttribute("data-checked");
          } else {
            listItem.setAttribute("data-checked", previousDataChecked);
          }

          setSavingProgress(0);
          return;
        }

        setSavingProgress(100);
      } catch (error) {
        console.error("Checklist auto-save failed:", error);

        target.checked = previousChecked;
        target.toggleAttribute("checked", previousChecked);

        if (previousDataChecked === null) {
          listItem.removeAttribute("data-checked");
        } else {
          listItem.setAttribute("data-checked", previousDataChecked);
        }

        setSavingProgress(0);
      } finally {
        window.clearInterval(progressInterval);
        savingRef.current = false;

        window.setTimeout(() => {
          setSavingProgress(0);
        }, 300);
      }
    }

    notesContainer.addEventListener("change", handleChange);

    return () => {
      notesContainer.removeEventListener("change", handleChange);
    };
  }, [activity, onSave]);

  return (
    <div
      className="panel-overlay activity-details-overlay"
      onMouseDown={onClose}
      role="presentation"
    >
      <section
        className="activity-details-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-details-title"
        onMouseDown={(event: MouseEvent<HTMLElement>) =>
          event.stopPropagation()
        }
      >
        <header className="activity-details-header">
          <div className="activity-details-heading">
            <ActivityCategoryBadge
              category={activity.category}
              color={activity.color}
            />
            <h2 id="activity-details-title">{activity.title}</h2>
          </div>

          <button
            type="button"
            className="icon-btn"
            aria-label="Close activity details"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </header>

        <div
          className="activity-details-content"
          style={{ "--activity-color": activity.color } as CSSProperties}
        >
          <div
            className="activity-details-color"
            style={{ background: activity.color }}
          />

          <dl className="activity-details-fields">
            <div>
              <dt>Date</dt>
              <dd>{formatDate(activity.date, "EEEE, MMMM d, yyyy")}</dd>
            </div>

            <div>
              <dt>Time</dt>
              <dd>
                {activity.start} – {activity.end}
              </dd>
            </div>

            <div>
              <dt>Description</dt>
              <dd>{activity.description || "No description added"}</dd>
            </div>

            <div>
              <dt>Notes and accomplishments</dt>
              <dd>
                {sanitizedNotes ? (
                  <div
                    ref={notesRef}
                    className="activity-notes-content"
                    aria-busy={savingProgress > 0}
                  >
                    <div
                      className="activity-notes-html"
                      dangerouslySetInnerHTML={{
                        __html: sanitizedNotes,
                      }}
                    />

                    {savingProgress > 0 && (
                      <div
                        className="activity-notes-progress"
                        role="progressbar"
                        aria-label="Updating checklist"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={savingProgress}
                      >
                        <div
                          className="activity-notes-progress-bar"
                          style={{ width: `${savingProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  "No notes added"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <footer className="activity-details-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>

          <button type="button" className="primary-btn" onClick={onEdit}>
            <Icon name="edit" size={16} />
            Edit activity
          </button>
        </footer>
      </section>
    </div>
  );
}
