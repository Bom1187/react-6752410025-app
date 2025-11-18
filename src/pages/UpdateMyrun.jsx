import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabaseClients";
import running from "../assets/running.png"

export default function UpdateMyrun() {
  const { id } = useParams();

  const [run_date, setRun_date] = useState("");
  const [run_distance, setRun_distance] = useState("");
  const [run_place, setRun_place] = useState("");
  const [runPreview, setRunPreview] = useState("");
  const [runFile, setRunFile] = useState(null);

  // โหลดข้อมูลเดิม
  useEffect(() => {
    const fetchRun = async () => {
      const { data, error } = await supabase
        .from("bom_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Swal.fire("Error", "ไม่พบข้อมูลที่ต้องการแก้ไข", "error");
        return;
      }

      setRun_date(data.run_date);
      setRun_distance(data.run_distance);
      setRun_place(data.run_place);
      setRunPreview(data.run_image_url); // แสดงรูปเดิม
    };

    fetchRun();
  }, [id]);

  // เลือกรูปใหม่ + preview
  const handleSelectImageAndPreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRunFile(file);
      setRunPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // อัปโหลดรูปใหม่ถ้ามีเลือก
    let run_image_url = runPreview;

    if (runFile) {
      const newFileName = Date.now() + "-" + runFile.name;

      const { error: uploadError } = await supabase.storage
        .from("bom_bk")
        .upload(newFileName, runFile);

      if (uploadError)
        return Swal.fire("Error", "อัปโหลดรูปไม่สำเร็จ", "error");

      const { data } = supabase.storage
        .from("bom_bk")
        .getPublicUrl(newFileName);

      run_image_url = data.publicUrl;
    }

    // อัปเดตข้อมูล
    const { error } = await supabase
      .from("bom_tb")
      .update({
        run_date,
        run_distance,
        run_place,
        run_image_url,
      })
      .eq("id", id);

    if (error) {
      Swal.fire("Error", "แก้ไขข้อมูลไม่สำเร็จ", "error");
      return;
    }

    Swal.fire("สำเร็จ!", "แก้ไขข้อมูลเรียบร้อยแล้ว", "success").then(() => {
      document.location.href = "/showallmyrun";
    });
  };

  return (
    <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
        <img src={running} alt="รูปวิ่ง" className="block mx-auto w-30 mt-15 my-15"/>
      <h1 className="text-2xl font-bold text-center text-black">
        แก้ไขข้อมูลการวิ่ง
      </h1>

      <form onSubmit={handleSave}>
        <div className="mt-3">
          <label>วันที่วิ่ง</label>
          <input
            type="date"
            value={run_date}
            onChange={(e) => setRun_date(e.target.value)}
            className="border border-gray-400 w-full p-2 mt-2 rounded"
          />
        </div>

        <div className="mt-3">
          <label>ระยะทางที่วิ่ง (กิโลเมตร)</label>
          <input
            type="number"
            value={run_distance}
            onChange={(e) => setRun_distance(e.target.value)}
            className="border border-gray-400 w-full p-2 mt-2 rounded"
          />
        </div>

        <div className="mt-3">
          <label>สถานที่วิ่ง</label>
          <input
            type="text"
            value={run_place}
            onChange={(e) => setRun_place(e.target.value)}
            className="border border-gray-400 w-full p-2 mt-2 rounded"
          />
        </div>

        {/* เลือกรูป */}
        <div className="mt-3 flex flex-col items-center">
          {runPreview && (
            <img
              src={runPreview}
              alt="รูปวิ่ง"
              className="w-40 mb-3 rounded shadow"
            />
          )}

          <input
            type="file"
            id="selectImage"
            className="hidden"
            accept="image/*"
            onChange={handleSelectImageAndPreview}
          />

          <label
            htmlFor="selectImage"
            className="py-2 px-4 bg-green-700 text-white rounded cursor-pointer"
          >
            🔎 SELECT FILE UPLOAD
          </label>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="px-30 bg-blue-500 hover:bg-blue-700 p-2 text-white rounded"
          >
            บันทึกการวิ่ง
          </button>
        </div>
      </form>

      <div className="text-center my-4">
        <Link to="/showallmyrun" className="text-red-500">
          กลับไปหน้าข้อมูลการวิ่ง
        </Link>
      </div>
    </div>
  );
}
