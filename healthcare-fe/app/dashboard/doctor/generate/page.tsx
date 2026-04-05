"use client";

import { useEffect, useState, useMemo } from "react";
import React from "react";

import { DAYS, DAY_LABEL } from "@/app/constants/date";
import { SLOT_MAP, SlotCode } from "@/app/constants/slots";

export default function GeneratePage() {
  // ==============================
  // STATE
  // ==============================
  const [grid, setGrid] = useState<Record<string, string>>({});
  const [isLocked, setIsLocked] = useState(false);

  // ✅ stable userId (tránh re-render không cần thiết)
  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("user_id");
  }, []);

  // ✅ derive SLOTS từ SLOT_MAP
  const SLOTS = useMemo(() => Object.keys(SLOT_MAP) as SlotCode[], []);

  const { year, month } = useMemo(() => {
    const now = new Date();

    let m = now.getMonth() + 1; // JS: 0-11 → +1 = 1-12
    let y = now.getFullYear();

    // +2 months
    m += 2;

    if (m > 12) {
      m -= 12;
      y += 1;
    }

    return { year: y, month: m };
  }, []);

  // ==============================
  // FETCH DATA
  // ==============================
  useEffect(() => {
    if (!userId) return;

    // preview
    fetch(`http://127.0.0.1:8000/schedule/preview/${userId}/${year}/${month}`)
      .then((res) => res.json())
      .then((data) => setGrid(data));

    // lock check
    fetch(`http://127.0.0.1:8000/schedule/status/${userId}/${year}/${month}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.is_inserted) setIsLocked(true);
      });
  }, [userId]);

  // ==============================
  // TOGGLE
  // ==============================
  const toggle = (key: string) => {
    if (isLocked) return;

    setGrid((prev) => ({
      ...prev,
      [key]: prev[key] === "GREEN" ? "RED" : "GREEN",
    }));
  };

  // ==============================
  // CONFIRM
  // ==============================
  const handleConfirm = async () => {
    if (!userId || isLocked) return;

    const slots: { dow: number; slot_code: string }[] = [];

    for (const key in grid) {
      if (grid[key] === "GREEN") {
        const [dow, slot_code] = key.split("_");
        slots.push({
          dow: Number(dow),
          slot_code,
        });
      }
    }

    await fetch("http://127.0.0.1:8000/schedule/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctor_id: userId,
        year,
        month,
        slots,
      }),
    });

    alert("Schedule generated!");
    setIsLocked(true);
  };

  // ==============================
  // UI
  // ==============================
  if (!userId) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        Generate Schedule ({month}/{year})
      </h1>

      {isLocked && (
        <div className="text-red-500 font-semibold">
          🔒 This month is locked
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {/* Header */}
        <div></div>
        {DAY_LABEL.map((d) => (
          <div key={d} className="text-center font-semibold">
            {d}
          </div>
        ))}

        {/* Grid */}
        {SLOTS.map((slot) => (
          <React.Fragment key={slot}>
            {/* Slot label + time */}
            <div className="font-semibold">
              {slot}
              <div className="text-xs text-gray-500">{SLOT_MAP[slot]}</div>
            </div>

            {DAYS.map((d) => {
              const key = `${d}_${slot}`;
              const value = grid[key] || "RED";

              return (
                <div
                  key={key}
                  onClick={() => toggle(key)}
                  className={`p-3 text-center cursor-pointer ${
                    value === "GREEN" ? "bg-green-400" : "bg-red-400"
                  } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {value}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {!isLocked && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleConfirm}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
