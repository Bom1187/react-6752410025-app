import React, { useState } from "react";
import running from "../assets/running.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabaseClients";


export default function AddMyrun() {
  // สร้าง state
  const [run_date, setRun_date] = useState("");
  const [run_distance, setRun_distance] = useState("");
  const [run_place, setRun_place] = useState("");
  const [runFile, setRunFile] = useState(null);
  const [runPreview, setRunPreview] = useState("");

  // เลือกรูป + preview
  const handleSelectImageAndPreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRunFile(file);
      setRunPreview(URL.createObjectURL(file));
    }
  };

  const warningAlert = (msg) => {
    Swal.fire({
      icon: "warning",
      iconColor: "#E81A07",
      title: msg,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#E81A07",
    });
  };

  const successAlert = (msg) => {
    Swal.fire({
      icon: "success",
      iconColor: "#108723",
      title: msg,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#108723",
    }).then(() => {
      document.location.href = "/showallmyrun";
    });
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    // Validate
    if (!run_date.trim()) {
      return warningAlert("กรุณาเลือกวันที่วิ่ง");
    }
    if (!run_distance.trim()) {
      return warningAlert("กรุณากรอกระยะทางที่วิ่ง");
    }
    if (!run_place.trim()) {
      return warningAlert("กรุณากรอกสถานที่วิ่ง");
    }

    // Upload รูป
    let run_image_url = "";

    if (runFile) {
      const newFileName = Date.now() + "-" + runFile.name;

      const { error: uploadError } = await supabase.storage
        .from("bom_bk")
        .upload(newFileName, runFile);

      if (uploadError) {
        return warningAlert("เกิดข้อผิดพลาดในการอัปโหลดรูป");
      }

      const { data } = supabase.storage
        .from("bom_bk")
        .getPublicUrl(newFileName);

      run_image_url = data.publicUrl;
    }

    // Insert ลง DB
    const { error } = await supabase.from("bom_tb").insert({
      run_date,
      run_distance,
      run_place,
      run_image_url,
    });

    if (error) {
      return warningAlert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }

    successAlert("บันทึกข้อมูลการวิ่งเรียบร้อยแล้ว");
  };

  return (
    <>
      <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
        <img src={running} alt="running" className="block mx-auto w-30 mt-15 my-15" />
        <h1 className="text-2xl font-bold text-center text-black my-15">
          เพิ่มข้อมูลการวิ่ง
        </h1>

        <form onSubmit={handleSaveClick}>
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
              placeholder="เช่น 5, 10, 21"
              className="border border-gray-400 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>สถานที่ที่วิ่ง</label>
            <input
              type="text"
              value={run_place}
              onChange={(e) => setRun_place(e.target.value)}
              placeholder="เช่น ลานกีฬา, สวนสาธารณะ ...."
              className="border border-gray-400 w-full p-2 mt-2 rounded"
            />
          </div>

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
    </>
  );
}
