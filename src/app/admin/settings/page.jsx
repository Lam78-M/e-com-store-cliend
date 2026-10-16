"use client";

import { useEffect, useState } from "react";
import { Clock3, LoaderCircle, Save } from "lucide-react";
import toast from "react-hot-toast";
import { getCanteenSettings, updateCanteenSettings } from "@/lib/admin-api";
import { ErrorState, LoadingState, PageIntro, Panel, PrimaryButton } from "@/components/admin/AdminUi";

const HOURS_FIELDS = [
  { key: "schoolHours", title: "School hours", startLabel: "School opening time", endLabel: "School closing time" },
  { key: "tiffinTime", title: "Tiffin time", startLabel: "Tiffin start time", endLabel: "Tiffin end time" },
  { key: "canteenHours", title: "Canteen hours", startLabel: "Canteen opening time", endLabel: "Canteen closing time" },
];

function normalizeSettings(settings) {
  return Object.fromEntries(HOURS_FIELDS.map(({ key }) => {
    const group = settings[key] || {};
    return [key, {
      openingTime: group.openingTime || group.start || "",
      closingTime: group.closingTime || group.end || "",
    }];
  }));
}

export default function CanteenSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getCanteenSettings({ signal: controller.signal })
      .then((record) => {
        setSettings(normalizeSettings(record));
        setError("");
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reload]);

  function setTime(key, field, value) {
    setSettings((current) => ({
      ...current,
      [key]: { ...current[key], [field]: value },
    }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const result = await updateCanteenSettings(settings);
      setSettings(normalizeSettings(result));
      toast.success("Canteen hours saved.");
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Could not save canteen hours.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-3.5 text-sm outline-none focus:border-[var(--c-caramel)] focus:ring-2 focus:ring-[var(--c-caramel)]/15";

  return (
    <>
      <PageIntro eyebrow="Configuration" title="Canteen settings" description="Manage the school schedule and the times customers can visit the canteen." />
      {loading ? <LoadingState label="Loading canteen hours..." /> : error ? (
        <ErrorState message={error} onRetry={() => { setLoading(true); setReload((value) => value + 1); }} />
      ) : (
        <form onSubmit={save} className="max-w-4xl space-y-5">
          {HOURS_FIELDS.map(({ key, title, startLabel, endLabel }) => (
            <Panel key={key} title={title} description="Times are saved in 24-hour format and can be displayed on the storefront.">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-bold">{startLabel}<input required type="time" value={settings[key].openingTime} onChange={(event) => setTime(key, "openingTime", event.target.value)} className={inputClass} /></label>
                <label className="text-sm font-bold">{endLabel}<input required type="time" value={settings[key].closingTime} onChange={(event) => setTime(key, "closingTime", event.target.value)} className={inputClass} /></label>
              </div>
            </Panel>
          ))}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs text-[#746d64]"><Clock3 size={15} />Updates are stored through the canteen settings API.</p>
            <PrimaryButton type="submit" disabled={saving}>{saving ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" /> : <Save size={17} />}{saving ? "Saving..." : "Save settings"}</PrimaryButton>
          </div>
        </form>
      )}
    </>
  );
}
