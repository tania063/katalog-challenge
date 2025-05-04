"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const classes = [
  {
    name: "Sistem Informasi",
    students: [
      { name: "Karina", image: "1.jpeg" },
      { name: "Bella", image: "2.jpeg" },
      { name: "Cindy", image: "3.jpeg" },
      { name: "Jiso", image: "4.jpeg" },
      { name: "Rose", image: "5.jpeg" },
    ],
  },
  {
    name: "Komputerisasi Akuntansi",
    students: [
      { name: "Dea", image: "6.jpeg" },
      { name: "Siti", image: "7.jpeg" },
      { name: "Mirna", image: "8.jpeg" },
      { name: "Intan", image: "9.jpeg" },
      { name: "Husnul", image: "10.jpeg" },
    ],
  },
  {
    name: "Bisnis Digital",
    students: [
      { name: "Kiki", image: "11.jpeg" },
      { name: "Lina", image: "12.jpeg" },
      { name: "Marta", image: "13.jpeg" },
      { name: "Irene", image: "14.jpeg" },
      { name: "Ocha", image: "15.jpeg" },
    ],
  },
];

export default function ManageProfile() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Gradasi Berjalan */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{ backgroundSize: "400% 400%", pointerEvents: "none" }}
      ></motion.div>

      {/* Efek tambahan bintang kelap-kelip */}
      <motion.div
        className="absolute inset-0 bg-[url('/stars-bg.gif')] bg-cover opacity-30"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ pointerEvents: "none" }}
      ></motion.div>

      {/* Judul */}
      <h1 className="text-4xl font-bold mb-8 relative z-10 text-white">
        🌌Teman terbaik 🌟
      </h1>

      {/* Grid Card Kelas */}
      <div className="grid md:grid-cols-3 gap-6 relative z-10">
        {classes.map((classItem, index) => (
          <motion.div
            key={index}
            className="bg-gray-900 bg-opacity-80 p-6 rounded-xl shadow-lg text-center border border-gray-600 w-[320px]"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">{classItem.name}</h2>

            {/* Profil Siswa */}
            <div className="flex justify-center gap-4 flex-wrap">
              {classItem.students.map((student, idx) => (
                <motion.div key={idx} className="flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-300 shadow-md hover:scale-110 transition duration-300">
                    <Image
                      src={`/dummy/${student.image}`}
                      alt={student.name}
                      width={64} 
                      height={64} 
                      objectFit="cover"
                    />
                  </div>
                  <p className="text-sm mt-2 text-white">{student.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
