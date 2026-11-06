"use client";

import { useState } from "react";
import { MONTHS } from "@/constants/categories";
import Icon from "@/components/ui/icon";

type PickerStep = "year" | "month";

export default function CalendarDatePicker({
  date,
  onSelect,
}: {
  date: Date;
  onSelect: (year: number, month: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<PickerStep>("year");
  const [year, setYear] = useState(date.getFullYear());
  const [yearPage, setYearPage] = useState(date.getFullYear() - 5);
  const years = Array.from({ length: 12 }, (_, index) => yearPage + index);

  function showPicker() {
    setYear(date.getFullYear());
    setYearPage(date.getFullYear() - 5);
    setStep("year");
    setOpen(true);
  }

  function closePicker() {
    setOpen(false);
  }

  function chooseMonth(month: number) {
    onSelect(year, month);
    closePicker();
  }

  return (
    <>
      <button
        className="calendar-date-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={showPicker}
      >
        {MONTHS[date.getMonth()]} {date.getFullYear()}
      </button>
      {open && (
        <div
          className="calendar-picker-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) closePicker();
          }}
        >
          <section
            className="calendar-picker-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a calendar date"
            onKeyDown={(event) => {
              if (event.key === "Escape") closePicker();
            }}
          >
            <div className="calendar-picker-selections">
              {step === "year" ? (
                <section className="calendar-picker-section">
                  <div className="calendar-picker-year-heading">
                    <button
                      type="button"
                      aria-label="Previous years"
                      onClick={() => setYearPage((page) => page - 12)}
                    >
                      <Icon name="left" size={15} />
                    </button>
                    <h3>Select year</h3>
                    <button
                      type="button"
                      aria-label="Next years"
                      onClick={() => setYearPage((page) => page + 12)}
                    >
                      <Icon name="right" size={15} />
                    </button>
                  </div>
                  <div className="calendar-picker-years">
                    {years.map((value) => (
                      <button
                        type="button"
                        key={value}
                        className={value === year ? "active" : ""}
                        aria-pressed={value === year}
                        onClick={() => {
                          setYear(value);
                          setStep("month");
                        }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="calendar-picker-section">
                  <div className="calendar-picker-section-heading">
                    <button
                      type="button"
                      className="calendar-picker-back"
                      onClick={() => setStep("year")}
                    >
                      <Icon name="left" size={15} />
                      Change year
                    </button>
                    <strong>{year}</strong>
                  </div>
                  <div className="calendar-picker-months">
                    {MONTHS.map((value, index) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => chooseMonth(index)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
