"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Plus } from "lucide-react";

type View = "month" | "week" | "day";
type EventColor = "purple" | "peach" | "green";
type DemoEvent = { title: string; color: EventColor };

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function keyFor(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfWeek(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

function eventsAround(today: Date): Record<string, DemoEvent[]> {
  const addDays = (offset: number) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    date.setDate(date.getDate() + offset);
    return keyFor(date);
  };

  return {
    [addDays(0)]: [
      { title: "Morning planning", color: "purple" },
      { title: "Walk & reset", color: "green" },
    ],
    [addDays(2)]: [{ title: "Project check-in", color: "peach" }],
    [addDays(4)]: [{ title: "Focus time", color: "purple" }],
    [addDays(7)]: [{ title: "Creative work", color: "peach" }],
    [addDays(10)]: [{ title: "Read & reflect", color: "green" }],
  };
}

export default function CalendarDemo() {
  const [month, setMonth] = useState(new Date(2026, 10, 1));
  const [today, setToday] = useState(new Date(2026, 10, 16));
  const [selected, setSelected] = useState(new Date(2026, 10, 16));
  const [view, setView] = useState<View>("month");
  const [events, setEvents] = useState<Record<string, DemoEvent[]>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const localToday = new Date();
    const firstOfMonth = new Date(localToday.getFullYear(), localToday.getMonth(), 1);
    setToday(localToday);
    setSelected(localToday);
    setMonth(firstOfMonth);
    setEvents(eventsAround(localToday));
  }, []);

  const dates = useMemo(() => {
    if (view === "day") return [new Date(selected.getFullYear(), selected.getMonth(), selected.getDate())];
    const start = view === "week" ? startOfWeek(selected) : startOfWeek(new Date(month.getFullYear(), month.getMonth(), 1));
    const count = view === "week" ? 7 : 42;
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [month, selected, view]);

  const monthTitle = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedTitle = selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  function changeMonth(offset: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    setMonth(next);
    setSelected(new Date(next.getFullYear(), next.getMonth(), Math.min(selected.getDate(), 28)));
  }

  function selectDate(date: Date) {
    setSelected(date);
    if (date.getMonth() !== month.getMonth() || date.getFullYear() !== month.getFullYear()) {
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }

  function addEvent() {
    const key = keyFor(selected);
    setEvents((current) => ({
      ...current,
      [key]: [...(current[key] ?? []), { title: "A little progress", color: "green" }],
    }));
    setMessage("Activity added to your day");
    window.setTimeout(() => setMessage(""), 2200);
  }

  return (
    <div className="calendar-demo scroll-reveal" aria-label="Interactive calendar demo">
      <div className="calendar-demo-toolbar">
        <div className="calendar-demo-nav">
          <button className="calendar-demo-today" onClick={() => { setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today); }}>Today</button>
          <button aria-label="Previous month" onClick={() => changeMonth(-1)}><ArrowLeft size={15} /></button>
          <button aria-label="Next month" onClick={() => changeMonth(1)}><ArrowRight size={15} /></button>
          <h3>{monthTitle}</h3>
        </div>
        <div className="calendar-demo-actions">
          <div className="calendar-demo-views" aria-label="Calendar view">
            {(["month", "week", "day"] as View[]).map((option) => <button key={option} className={view === option ? "active" : ""} aria-pressed={view === option} onClick={() => setView(option)}>{option[0].toUpperCase() + option.slice(1)}</button>)}
          </div>
          <button className="calendar-demo-add" onClick={addEvent}><Plus size={15} /> New activity</button>
        </div>
      </div>

      {view === "day" ? (
        <div className="calendar-demo-day-view">
          <div className="calendar-demo-day-heading"><CalendarDays size={16} /> {selectedTitle}</div>
          {["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"].map((time, index) => {
            const event = (events[keyFor(selected)] ?? [])[index];
            return <div className="calendar-demo-time-row" key={time}><span>{time}</span>{event ? <i className={`calendar-demo-event ${event.color}`}>{event.title}</i> : <small>Space for what matters</small>}</div>;
          })}
        </div>
      ) : (
        <div className={`calendar-demo-grid-wrap ${view === "week" ? "week" : ""}`}>
          <div className="calendar-demo-weekdays">{(view === "week" ? dates.map((date) => date.toLocaleDateString("en-US", { weekday: "long" })) : weekdays).map((weekday, index) => <span key={`${weekday}-${index}`}>{weekday.slice(0, 3)}</span>)}</div>
          <div className="calendar-demo-grid">
            {dates.map((date) => {
              const dateKey = keyFor(date);
              const selectedDate = dateKey === keyFor(selected);
              const isToday = dateKey === keyFor(today);
              return <button className={`calendar-demo-cell ${date.getMonth() !== month.getMonth() ? "outside" : ""} ${isToday ? "today" : ""} ${selectedDate ? "selected" : ""}`} key={dateKey} onClick={() => selectDate(date)}>
                <span className="calendar-demo-date">{date.getDate()}</span>
                {(events[dateKey] ?? []).slice(0, 3).map((event, index) => <i className={`calendar-demo-event ${event.color}`} key={`${event.title}-${index}`}>{event.title}</i>)}
              </button>;
            })}
          </div>
        </div>
      )}

      <div className="calendar-demo-footer"><span className="calendar-demo-live"><i /> INTERACTIVE DEMO</span><span>Selected: {selectedTitle}</span></div>
      {message && <div className="calendar-demo-message" role="status">{message}</div>}
    </div>
  );
}
