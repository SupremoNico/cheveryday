"use client";

import { useState, type FormEvent, type MouseEvent } from "react";
import { CATEGORIES } from "@/constants/categories";
import { categoryColorKey } from "@/lib/dates";
import { activitySchema } from "@/lib/validations/activity.schema";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Activity, Category } from "@/types/activity";
import type { Theme } from "@/types/theme";

export default function ActivityPanel({
  activity,
  theme,
  onClose,
  onSave,
  onDelete,
  errorMessage,
}: {
  activity: Activity;
  theme: Theme;
  onClose: () => void;
  onSave: (activity: Activity) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  errorMessage: string | null;
}) {
  const [form, setForm] = useState(activity);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<"save" | "delete" | null>(
    null,
  );
  const set = (key: keyof Activity, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const categoryColor = (category: Category) =>
    theme[categoryColorKey(category)];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingAction) return;
    const result = activitySchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check activity details.");
      return;
    }
    setError("");
    setPendingAction("save");
    const saved = await onSave(result.data);
    if (!saved) setError(errorMessage ?? "Could not save activity. Try again.");
    setPendingAction(null);
  }

  return (
    <div
      className="panel-overlay"
      onMouseDown={() => {
        if (!pendingAction) onClose();
      }}
      role="presentation"
    >
      <form
        className="activity-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-panel-title"
        aria-busy={pendingAction !== null}
        onMouseDown={(event: MouseEvent<HTMLFormElement>) =>
          event.stopPropagation()
        }
        onSubmit={submit}
      >
        <div className="panel-header">
          <div>
            <p>{form.id ? "EDIT ACTIVITY" : "NEW ACTIVITY"}</p>
            <h2 id="activity-panel-title">
              {form.id ? "Update your activity" : "Plan something meaningful"}
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            disabled={pendingAction !== null}
            aria-label="Close activity form"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="panel-content">
          <Field label="Activity title">
            <Input
              required
              autoFocus
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
              placeholder="What are you working on?"
            />
          </Field>
          <Field label="Description">
            <Input
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              placeholder="Add a short description"
            />
          </Field>
          <div className="form-row">
            <Field label="Category">
              <Select
                value={form.category}
                onValueChange={(value) => {
                  const category = value as Category;
                  setForm((current) => ({
                    ...current,
                    category,
                    color: categoryColor(category),
                  }));
                }}
              >
                <SelectTrigger aria-label="Category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Date">
              <Input
                required
                type="date"
                value={form.date}
                onChange={(event) => set("date", event.target.value)}
              />
            </Field>
          </div>
          <div className="form-row">
            <Field label="Start time">
              <Input
                required
                type="time"
                value={form.start}
                onChange={(event) => set("start", event.target.value)}
              />
            </Field>
            <Field label="End time">
              <Input
                required
                type="time"
                value={form.end}
                onChange={(event) => set("end", event.target.value)}
              />
            </Field>
          </div>
          <Field label="Notes or accomplishments">
            <RichTextEditor
              value={form.notes}
              onChange={(value) => set("notes", value)}
              placeholder="Capture details, outcomes, or anything to remember..."
            />
          </Field>
          <Field label="Activity color">
            <div className="activity-colors">
              {CATEGORIES.map((category) => (
                <button
                  type="button"
                  aria-label={`${category} color`}
                  aria-pressed={form.color === categoryColor(category)}
                  key={category}
                  className={
                    form.color === categoryColor(category) ? "active" : ""
                  }
                  style={{ background: categoryColor(category) }}
                  onClick={() => set("color", categoryColor(category))}
                />
              ))}
              <Input
                aria-label="Custom activity color"
                type="color"
                value={form.color}
                onChange={(event) => set("color", event.target.value)}
              />
            </div>
          </Field>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="panel-footer">
          {form.id ? (
            <button
              type="button"
              className="delete-btn"
              disabled={pendingAction !== null}
              onClick={async () => {
                if (pendingAction) return;
                setError("");
                setPendingAction("delete");
                const deleted = await onDelete(form.id);
                if (!deleted) {
                  setError(
                    errorMessage ?? "Could not delete activity. Try again.",
                  );
                  setPendingAction(null);
                }
              }}
            >
              <Icon
                name={pendingAction === "delete" ? "loader" : "trash"}
                size={17}
              />
              {pendingAction === "delete" ? "Deleting..." : "Delete"}
            </button>
          ) : (
            <span />
          )}
          <div>
            <Button
              type="button"
              variant="outline"
              className="secondary-btn"
              onClick={onClose}
              disabled={pendingAction !== null}
            >
              Cancel
            </Button>
            <Button
              className="primary-btn"
              type="submit"
              disabled={pendingAction !== null}
            >
              {pendingAction === "save" && <Icon name="loader" size={16} />}
              {pendingAction === "save" ? "Saving..." : "Save activity"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
