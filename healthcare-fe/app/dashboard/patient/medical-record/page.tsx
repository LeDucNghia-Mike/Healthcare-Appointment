"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientMedicalRecordPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Lấy insurance từ localStorage (không hardcode nữa)
    const insurance = localStorage.getItem("user_insurance");

    // 2. Kiểm tra nếu không có mã bảo hiểm thì redirect về login hoặc báo lỗi
    if (!insurance) {
      console.error("No insurance found in storage");
      setLoading(false);
      // router.push("/auth/login"); // Có thể redirect nếu cần
      return;
    }

    // 3. Gọi API với mã bảo hiểm động
    fetch(`http://127.0.0.1:8000/records/patient-insurance/${insurance}`)
      .then((res) => res.json())
      .then((resData) => {
        setRecords(resData.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="p-10 text-center font-mono">LOADING_RECORDS...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-6 border-l-4 border-blue-600 pl-3 uppercase">
        Lịch sử khám bệnh
      </h1>

      <div className="grid gap-4">
        {records.length > 0 ? (
          records.map((rec) => (
            <div
              key={rec.slot_id}
              onClick={() =>
                router.push(`/dashboard/patient/medical-record/${rec.slot_id}`)
              }
              className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="text-xs text-gray-500 font-mono mb-1">
                  SLOT: {rec.slot_code}
                </p>
                <h3 className="font-black text-lg text-gray-800">
                  Bác sĩ: {rec.doctor_name}
                </h3>
                <p className="text-sm font-bold text-blue-600">
                  ID: {rec.doctor_id}
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-700">{rec.date}</p>
                <span className="text-[10px] bg-black text-white px-2 py-1 font-mono uppercase">
                  Ver: {rec.version_number}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 border-2 border-dashed border-gray-300 text-center text-gray-400">
            Chưa có dữ liệu hồ sơ cho mã bảo hiểm này.
          </div>
        )}
      </div>
    </div>
  );
}