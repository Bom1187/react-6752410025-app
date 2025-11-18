import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClients";
import Swal from "sweetalert2";
import running from "../assets/running.png";

export default function ShowAllMyrun() {
  const [bom, setboms] = useState([]);

  useEffect(() => {
    const fetchboms = async () => {
      const { data, error } = await supabase
        .from("bom_tb")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        Swal.fire({
          icon: "warning",
          iconColor: "#E89E07",
          title: error.message,
          showConfirmButton: true,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setboms(data);
      }
    };

    fetchboms();
  }, []);

  const handleDeleteClick = async (id, run_image_url) => {
    const result = await Swal.fire({
      icon: "question",
      iconColor: "#E81A07",
      title: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้",
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#E81A07",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      if (run_image_url !== "") {
        const image_name = run_image_url.split("/").pop();

        const { error: imgErr } = await supabase.storage
          .from("bom_bk")
          .remove([image_name]);

        if (imgErr) {
          alert("เกิดข้อผิดพลาดในการลบรูปภาพ");
          return;
        }
      }

      const { error: delErr } = await supabase
        .from("bom_tb")
        .delete()
        .eq("id", id);

      if (delErr) {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        return;
      }

      alert("ลบข้อมูลเรียบร้อยแล้ว");

      setboms(bom.filter((b) => b.id !== id));
    }
  };

  return (
    <>
      <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
        <img
          src={running}
          alt="running"
          className="block mx-auto w-30 mt-15 my-15"
        />

        <h1 className="text-2xl font-bold text-center text-black my-15">
          การวิ่งของฉัน
        </h1>

        <table className="w-full border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-400">
              <th className="p-2">No.</th>
              <th className="p-2">วันที่วิ่ง</th>
              <th className="p-2">รูปที่วิ่ง</th>
              <th className="p-2">ระยะทางที่วิ่ง (กิโลเมตร)      </th>
              <th className="p-2">สถานที่วิ่ง</th>
              <th className="p-2"></th>
            </tr>
          </thead>

          <tbody>
            {bom.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-2 text-center">{index + 1}</td>

                <td className="border p-2 text-center">
                  {item.run_date
                    ? new Date(item.run_date).toLocaleDateString("th-TH")
                    : "-"}
                </td>

                <td className="border p-2 text-center">
                  {item.run_image_url ? (
                    <img
                      src={item.run_image_url}
                      alt="รูปวิ่ง"
                      className="w-20 mx-auto"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td className="border p-2 text-center">{item.run_distance}</td>

                <td className="border p-2 text-center">{item.run_place}</td>

                <td className="border p-2 text-center">
                  <Link to={"/updatemyrun/" + item.id}>
                    <button className="text-blue-500 underline mx-2 cursor-pointer">
                      แก้ไข
                    </button>
                  </Link>

                  <button
                    className="text-blue-500 underline mx-2 cursor-pointer"
                    onClick={() =>
                      handleDeleteClick(item.id, item.run_image_url)
                    }
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="my-8 flex justify-end">
          <Link
            to="/createmyrun"
            className="w-full text-center bg-blue-700 p-3 rounded hover:bg-blue-800 text-white"
          >
            <button>เพิ่มข้อมูลการวิ่งของฉัน</button>
          </Link>
        </div>
      </div>
    </>
  );
}
