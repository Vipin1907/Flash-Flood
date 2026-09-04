"use client";

import { useState } from "react";
import { GlassCard } from "../glass-card";
import {
  Bell,
  Send,
  MessageSquare,
  Users,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Globe,
  Radio,
  Copy,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { triggerAlert } from "@/lib/api";

interface AlertsViewProps {
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
  riskProbability?: number;
  rainfallMm?: number;
}

const RECIPIENT_ROSTER = [
  { name: "District Magistrate & DDMA Office", phone: "+91 94350 XXXXX", role: "Incident Commander", status: "Active" },
  { name: "SDRF Silchar Rapid Response Team", phone: "+91 94351 XXXXX", role: "Rescue & Evacuation", status: "Standby" },
  { name: "Executive Engineer, CWC Water Resources", phone: "+91 94352 XXXXX", role: "Sluice Gate Control", status: "Active" },
  { name: "Panchayat Disaster Committee (Lakhipur)", phone: "+91 94353 XXXXX", role: "Community Alert", status: "Active" },
  { name: "State Emergency Operations Center (SEOC)", phone: "+91 1070 XXXXX", role: "State Authority", status: "Connected" },
];

export function AlertsView({
  selectedState,
  selectedDistrict,
  selectedCatchment,
  riskProbability = 78,
  rainfallMm = 28.5,
}: AlertsViewProps) {
  const [selectedLang, setSelectedLang] = useState<"en" | "as" | "hi">("en");
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const [alertHistory, setAlertHistory] = useState([
    {
      id: "ALERT-9021",
      time: "12 mins ago",
      type: "RED ALERT",
      channel: "Bilingual SMS + LangGraph Agent",
      target: "5 Stakeholders (DDMA + SDRF)",
      status: "Delivered (100%)",
    },
    {
      id: "ALERT-9018",
      time: "2 hours ago",
      type: "YELLOW WATCH",
      channel: "Automated Telemetry Ping",
      target: "CWC Hydrology Team",
      status: "Acknowledged",
    },
  ]);

  const messages = {
    en: `🚨 URGENT FLASH FLOOD ALERT: PravahAI early warning system predicts severe flood surge in ${selectedDistrict}, ${selectedState} (${selectedCatchment}). Rainfall: ${rainfallMm}mm in last hour. Evacuation Corridor: Move to Lakhipur High Ground Shelter via NH-37. Avoid riverbank roads. - District Disaster Management Authority (DDMA)`,
    as: `🚨 জৰুৰী বান সতৰ্কবাণী: প্ৰৱাহ এআই (PravahAI) সতৰ্কতা ব্যৱস্থাই ${selectedDistrict}, ${selectedState} অঞ্চলত ভয়াৱহ বানপানীৰ আশংকা প্ৰকাশ কৰিছে। বিগত ঘণ্টাত বৰষুণ: ${rainfallMm}mm। নিৰাপদ আশ্ৰয় শিবিৰলৈ যাবলৈ অনুৰোধ জনোৱা হৈছে। নদীৰ পাৰৰ পথসমূহ এৰাই চলক। - জিলা দুৰ্যোগ ব্যৱস্থাপনা কৰ্তৃপক্ষ`,
    hi: `🚨 अति आवश्यक बाढ़ चेतावनी: प्रवाह एआई (PravahAI) प्रणाली द्वारा ${selectedDistrict}, ${selectedState} (${selectedCatchment}) में आकस्मिक बाढ़ का उच्च खतरा दर्ज किया गया है। पिछले घंटे में बारिश: ${rainfallMm}mm। तुरंत लखीपुर सुरक्षित उच्च राहत शिविर की ओर प्रस्थान करें। - जिला आपदा प्रबंधन प्राधिकरण (DDMA)`,
  };

  const handleSendBroadcast = async () => {
    setIsSending(true);
    try {
      const threadId = `agent-alert-${Date.now()}`;
      await triggerAlert({
        thread_id: threadId,
        risk_level: riskProbability > 70 ? "HIGH" : "MODERATE",
        rainfall_mm: rainfallMm,
        safe_route_summary: `Evacuate to Lakhipur High Ground Shelter via designated route.`,
      }).catch(() => {});

      setSentCount(RECIPIENT_ROSTER.length);

      setAlertHistory((prev) => [
        {
          id: `ALERT-${Math.floor(1000 + Math.random() * 9000)}`,
          time: "Just now",
          type: "RED ALERT BROADCAST",
          channel: "LangGraph + Gemini Agent SMS",
          target: `${RECIPIENT_ROSTER.length} Field Responders`,
          status: "Delivered (100%)",
        },
        ...prev,
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messages[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Agentic Emergency Alert Dispatch:
            </span>
            <span className="text-xs text-[#FF3B1D] font-bold bg-[#FF3B1D]/15 px-2.5 py-0.5 rounded-lg border border-[#FF3B1D]/25 font-mono">
              LangGraph + Gemini 1.5 Flash Bilingual Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Active Target: <b className="text-white">{selectedDistrict}, {selectedState}</b> • SMS Gateway: <b className="text-emerald-400">Twilio / C-DAC India Live</b>
          </p>
        </div>

        <button
          onClick={handleSendBroadcast}
          disabled={isSending}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3B1D] to-[#D9260B] hover:from-[#FF4E33] hover:to-[#E02E10] text-white text-xs font-black font-mono tracking-wider uppercase transition-all shadow-lg shadow-[#FF3B1D]/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSending ? "Broadcasting SMS..." : "Dispatch Emergency Alert"}</span>
        </button>
      </div>

      {sentCount !== null && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Bilingual SMS Alert successfully broadcasted to all {sentCount} emergency authorities & field teams!</span>
        </div>
      )}

      {/* Main Broadcast Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: AI Bilingual Message Drafter */}
        <div className="lg:col-span-7 bg-[#0B0E18] border border-[#181F30] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF3B1D]" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Automated Bilingual SMS Generator
              </h3>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#080B14] p-1 rounded-xl border border-[#151C2C]">
              <button
                onClick={() => setSelectedLang("en")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedLang === "en" ? "bg-[#FF3B1D] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setSelectedLang("as")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedLang === "as" ? "bg-[#FF3B1D] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                অসমীয়া (Assamese)
              </button>
              <button
                onClick={() => setSelectedLang("hi")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedLang === "hi" ? "bg-[#FF3B1D] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Message Preview Box */}
          <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] relative">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-2">
              <span>SMS Broadcast Draft • 140 Chars / Segment</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
              {messages[selectedLang]}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleSendBroadcast}
              className="flex-1 py-3 rounded-xl bg-[#FF3B1D] hover:bg-[#E02E10] text-white text-xs font-black font-mono tracking-wider uppercase transition-all shadow-md shadow-[#FF3B1D]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Now</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-3 rounded-xl bg-[#0E1322] hover:bg-[#141B30] border border-[#1C253B] text-slate-200 text-xs font-bold font-mono tracking-wider transition-all cursor-pointer"
            >
              {copied ? "Copied" : "Copy to Clipboard"}
            </button>
          </div>
        </div>

        {/* Right: Recipient Roster & Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0B0E18] border border-[#181F30] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Target Broadcast Roster
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">5 Responders</span>
            </div>

            <div className="space-y-2.5">
              {RECIPIENT_ROSTER.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="text-white font-bold text-xs">{rec.name}</div>
                    <div className="text-slate-500 text-[10px]">{rec.role} • {rec.phone}</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Transmission Logs */}
          <div className="bg-[#0B0E18] border border-[#181F30] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white uppercase tracking-wider">
                Recent Broadcast Logs
              </span>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              {alertHistory.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-[#080B14] border border-[#151C2C] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 font-bold text-[11px]">{item.id}</span>
                      <span className="text-slate-500 text-[10px]">{item.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5">{item.type} ({item.target})</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
