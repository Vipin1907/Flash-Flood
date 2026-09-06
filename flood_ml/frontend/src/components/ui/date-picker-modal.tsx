"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDateTime: string;
  onSelectDateTime: (dateTimeFormatted: string, isoString?: string) => void;
  selectedState?: "Assam" | "Uttarakhand";
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePickerModal({
  isOpen,
  onClose,
  selectedDateTime,
  onSelectDateTime,
}: DatePickerModalProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  const parseInitial = () => {
    try {
      const d = new Date(
        selectedDateTime.includes("T")
          ? selectedDateTime
          : Date.parse(selectedDateTime) || Date.now()
      );
      if (!isNaN(d.getTime())) return d;
    } catch {}
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState<Date>(parseInitial);
  const [viewYear, setViewYear] = useState<number>(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(currentDate.getMonth());

  // Time states
  const [hours12, setHours12] = useState<number>(() => {
    const h = currentDate.getHours();
    return h % 12 || 12;
  });
  const [minutes, setMinutes] = useState<number>(currentDate.getMinutes());
  const [isPM, setIsPM] = useState<boolean>(currentDate.getHours() >= 12);

  useEffect(() => {
    if (isOpen) {
      const d = parseInitial();
      setCurrentDate(d);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      const h = d.getHours();
      setHours12(h % 12 || 12);
      setMinutes(d.getMinutes());
      setIsPM(h >= 12);
    }
  }, [isOpen, selectedDateTime]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    const h24 = isPM ? (hours12 === 12 ? 12 : hours12 + 12) : hours12 === 12 ? 0 : hours12;
    newDate.setHours(h24, minutes, 0, 0);
    setCurrentDate(newDate);
  };

  const handleApply = () => {
    const finalDate = new Date(currentDate);
    const h24 = isPM ? (hours12 === 12 ? 12 : hours12 + 12) : hours12 === 12 ? 0 : hours12;
    finalDate.setHours(h24, minutes, 0, 0);

    const monthShort = MONTH_NAMES[finalDate.getMonth()].slice(0, 3);
    const day = finalDate.getDate();
    const year = finalDate.getFullYear();
    const formattedHours = hours12.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const ampm = isPM ? "PM" : "AM";

    const formattedStr = `${day} ${monthShort} ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
    const isoStr = finalDate.toISOString();

    onSelectDateTime(formattedStr, isoStr);
    onClose();
  };

  const handlePresetNow = () => {
    const now = new Date();
    setCurrentDate(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    const h = now.getHours();
    setHours12(h % 12 || 12);
    setMinutes(now.getMinutes());
    setIsPM(h >= 12);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute top-full left-0 mt-2 z-50">
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.15 }}
          className="w-80 bg-white dark:bg-[#0C101A] border border-slate-200 dark:border-[#222E46] rounded-2xl p-3.5 shadow-2xl shadow-black/60 text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5A1F]">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Select Date & Time</span>
            </div>

            <button
              type="button"
              onClick={handlePresetNow}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer"
            >
              <Zap className="w-2.5 h-2.5" />
              <span>Now</span>
            </button>
          </div>

          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between mb-2 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
              {MONTH_NAMES[viewMonth].slice(0, 3)} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-mono font-bold text-slate-400 mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-0.5">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 text-center text-xs font-mono mb-3">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              return (
                <div key={`prev-${i}`} className="py-1 text-slate-300 dark:text-slate-600 select-none text-[11px]">
                  {dayNum}
                </div>
              );
            })}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                currentDate.getDate() === day &&
                currentDate.getMonth() === viewMonth &&
                currentDate.getFullYear() === viewYear;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "py-1 rounded-lg transition-colors cursor-pointer text-[11px]",
                    isSelected
                      ? "bg-[#FF5A1F] text-white font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time Selector */}
          <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-slate-50 dark:bg-[#07090F] border border-slate-100 dark:border-white/5 mb-3 text-xs font-mono">
            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
              <Clock className="w-3 h-3 text-[#FF5A1F]" />
              <span>Time:</span>
            </div>

            <div className="flex items-center gap-1">
              <select
                value={hours12}
                onChange={(e) => setHours12(parseInt(e.target.value))}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-lg px-1.5 py-0.5 text-[11px] font-bold cursor-pointer"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {(i + 1).toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-lg px-1.5 py-0.5 text-[11px] font-bold cursor-pointer"
              >
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsPM(!isPM)}
                className="px-1.5 py-0.5 rounded-lg bg-[#FF5A1F]/15 text-[#FF5A1F] font-bold text-[10px] cursor-pointer"
              >
                {isPM ? "PM" : "AM"}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FF5A1F] text-white text-xs font-bold shadow-md shadow-[#FF5A1F]/30 hover:bg-[#FF4500] cursor-pointer"
            >
              <Check className="w-3 h-3" />
              <span>Apply</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
