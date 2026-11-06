"use client";

import { CATEGORIES } from "@/constants/categories";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ActivityFilters({
  query,
  category,
  date,
  onQueryChange,
  onCategoryChange,
  onDateChange,
  onAdd,
}: {
  query: string;
  category: string;
  date: string;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="section-actions">
      <div className="filter-search">
        <Icon name="search" />
        <Input
          className="filter-search-input"
          aria-label="Search activities"
          placeholder="Search your activities..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="filter-select" aria-label="Filter by category">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {CATEGORIES.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="filter-date-input"
        aria-label="Filter by date"
        type="date"
        value={date}
        onChange={(event) => onDateChange(event.target.value)}
      />
      <button className="primary-btn" onClick={onAdd}>
        <Icon name="plus" /> Add activity
      </button>
    </div>
  );
}
