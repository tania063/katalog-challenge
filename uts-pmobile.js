"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Chatbot from "../components/chatbot";




// Komponen AnimatedSection untuk mengontrol animasi on-scroll
const AnimatedSection = ({ id, children, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: delay,
            staggerChildren: 0.1,
          },
        },
      }}
      className="relative z-10 py-20 text-center"
    >
      {children}
    </motion.section>
  );
};

// Komponen untuk animasi card
const AnimatedCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5, delay }
        }
      }}
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      {children}
    </motion.div>
  );
};

// Komponen untuk animasi gambar dengan efek zoom
const ZoomableImage = ({ src, alt, width, height, className }) => {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </motion.div>
  );
};

export default function Portfolio() {
  const [isDay, setIsDay] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [avg, setAvg] = useState(null);
  const [count, setCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Halo! Ada yang bisa saya bantu?", sender: "bot" },
  ]);

  const handleSendMessage = () => {
    if (userMessage.trim() !== "") {
      setMessages([
        ...messages,
        { text: userMessage, sender: "user" },
        { text: "Terima kasih atas pesannya! Saya akan segera membantu.", sender: "bot" },
      ]);
      setUserMessage("");
    }
  };

   // Fetch rating from the server
   const fetchRating = async () => {
    try {
      const res = await fetch('/api/rating');
      const data = await res.json();
      console.log("DATA RATING:", data);
      setAvg(data.average);
      setCount(data.count);
    } catch (err) {
      console.error("Gagal fetch rating:", err);
    }
  };
  
  // Submit a rating to the server
  const submitRating = async (value) => {
    setSelected(value);
    try {
      await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      fetchRating(); // Fetch rating after submitting
    } catch (err) {
      console.error("Gagal kirim rating:", err);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      // Reset form or show success message if needed
      setContact({ name: '', email: '', message: '' });
      alert("Pesan terkirim!");
    } catch (err) {
      console.error("Gagal kirim kontak:", err);
      alert("Gagal mengirim pesan, coba lagi nanti.");
    }
  };

  // Effect hook to fetch rating data on component mount
  useEffect(() => {
    fetchRating();
  }, []);


  useEffect(() => {
    document.body.className = isDay ? "day-mode" : "night-mode";

    const handleScroll = () => {
      const sections = ["home", "about",  "skills", "projects", "experience", "contact"];
      let currentSection = "home";

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDay]);

  return (
    <div className="relative min-h-screen transition-colors duration-500 text-gray-900 dark:text-gray-200">
      {/* Background Animation */}
      {isDay ? (
        <div className="absolute inset-0 overflow-hidden bg-blue-400">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="absolute opacity-80 animate-clouds"
              style={{
                backgroundImage: "url('/clouds.png')",
                backgroundSize: "contain",
                width: `${200 + index * 50}px`,
                height: `${120 + index * 30}px`,
                top: `${index * 15}%`,
                left: `${index * 18}%`,
                animationDuration: `${50 + index * 10}s`,
              }}
            ></div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 overflow-hidden bg-black">
          {[...Array(50)].map((_, index) => (
            <div
              key={index}
              className="absolute bg-white rounded-full animate-stars"
              style={{
                width: "3px",
                height: "3px",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Cloud & Star Animation */}
      <style jsx>{`
        @keyframes moveClouds {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        .animate-clouds {
          animation: moveClouds 60s linear infinite;
        }
        @keyframes twinkle {
          0% { opacity: 0.2; }
          50% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .animate-stars {
          animation: twinkle 1.5s infinite alternate;
        }
      `}</style>


{/* Navbar */}
<nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white/40 backdrop-blur-lg shadow-md ring-1 ring-white/30 transition-all duration-300 py-3 px-8 flex justify-center rounded-full">
  <ul className="flex space-x-6">
    {["home", "about", "skills", "experience", "projects",  "contact"].map((item) => (
      <li key={item} className={`cursor-pointer transition-colors ${activeSection === item ? "text-blue-500 font-bold" : "hover:text-blue-400"}`}>
        <a 
          href={`#${item}`} 
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item).scrollIntoView({ behavior: "smooth" });
            setActiveSection(item);
          }}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </a>
      </li>
    ))}
  </ul>
</nav>



      {/* Toggle Mode */}
      <motion.button
        className="fixed bottom-4 right-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg z-50 transition-all"
        onClick={() => setIsDay(!isDay)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDay ? "🌙" : "☀️"}
      </motion.button>

      {/* Home Section */}
      <AnimatedSection id="home">
        <motion.h2 
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-4xl font-bold"
        >
          Selamat Datang di Portfolio Saya
        </motion.h2>
        
        <ZoomableImage 
          src="/ttan.jpg" 
          alt="Titania" 
          width={150} 
          height={150} 
          className="mx-auto rounded-full shadow-lg my-6" 
        />
        
        <motion.p 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="mt-4 text-lg max-w-3xl mx-auto"
        >
          Halo, saya Titania! Saya seorang mahasiswa Komputerisasi Akuntansi yang memiliki minat dalam pemrograman dan analisis data keuangan serta bidang akuntansi lainnya. Selamat datang di portofolio saya, tempat saya berbagi pengalaman, keterampilan, dan proyek yang telah saya kerjakan.
        </motion.p>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 0.3 } }
          }}
          className="mt-6 flex justify-center space-x-4"
        >
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <Link href="https://www.instagram.com/titania_08?igsh=MWhkcHJsY2RrMHNrZQ==" target="_blank">
              <Image src="/instagram.png" alt="Instagram" width={40} height={40} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <Link href="https://www.linkedin.com/in/titania-15b2b42aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank">
              <Image src="/linkedin.png" alt="LinkedIn" width={40} height={40} />
            </Link>
          </motion.div>
        </motion.div>
      </AnimatedSection>

{/* About Section */}
<AnimatedSection id="about">
  <motion.h2 
    variants={{
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 }
    }}
    className="text-4xl font-bold mb-8 text-gray-800 dark:text-white"
  >
    About Me
  </motion.h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
    <AnimatedCard delay={0.2}>
      <motion.p 
        className="text-lg text-gray-800 dark:text-white bg-white/70 dark:bg-white/20 backdrop-blur-md p-6 rounded-xl border border-gray-300 dark:border-white/30 shadow-lg"
        whileHover={{ scale: 1.02 }}
      >
        Halo, Saya Titania, seorang mahasiswa jurusan Komputerisasi Akuntansi yang memiliki minat besar dalam dunia keuangan dan akuntansi. Saya senang bekerja dengan data, teliti dalam perhitungan, serta tertarik mendalami sistem informasi yang berkaitan dengan manajemen keuangan. Semangat belajar dan rasa ingin tahu yang tinggi mendorong saya untuk terus mengembangkan kemampuan dalam bidang yang saya tekuni
      </motion.p>
    </AnimatedCard>
    
    <AnimatedCard delay={0.4}>
      <motion.p 
        className="text-lg text-gray-800 dark:text-white bg-white/70 dark:bg-white/20 backdrop-blur-md p-6 rounded-xl border border-gray-300 dark:border-white/30 shadow-lg"
        whileHover={{ scale: 1.02 }}
      >
        Dengan latar belakang di bidang akuntansi dan pemrograman, saya berusaha menggabungkan keduanya untuk menciptakan solusi yang efisien dalam pengelolaan data keuangan. Saya memiliki pengalaman dalam menggunakan Next.js, PHP, Tailwind CSS, MySQL, dan beberapa framework lainnya untuk membangun sistem berbasis web.
      </motion.p>
    </AnimatedCard>
  </div>
</AnimatedSection>





/* Skills Section */
<AnimatedSection id="skills">
  <motion.h2 
    variants={{
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 }
    }}
    className="text-2xl font-semibold text-white mb-8"
  >
    Keahlian (Skills)
  </motion.h2>
  
  <div className="flex flex-wrap justify-center gap-4">
    {[
      "Next.js, PHP, HTML, CSS, JavaScript, Tailwind CSS",
      "Database Management: MySQL",
      "Software Akuntansi: Excel, SQL untuk analisis data keuangan",
      "Analisis Keuangan: Membuat laporan keuangan, audit sederhana"
    ].map((skill, index) => (
      <AnimatedCard 
        key={index}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { delay: index * 0.2 } 
          }
        }}
        className="px-4 py-3 backdrop-blur-md bg-white/20 rounded-xl border border-white/30 shadow-lg text-white text-sm max-w-fit"
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      >
        {skill}
      </AnimatedCard>
    ))}
  </div>
</AnimatedSection>

    
{/* experience Section */}
<AnimatedSection id="experience">
  <motion.h2 
    initial={{ opacity: 0, y: -30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-3xl md:text-4xl font-extrabold text-center text-cyan-600 mb-16"
  >
    My Experience
  </motion.h2>

  <div className="relative mx-auto max-w-5xl px-4">
    <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-cyan-400"></div>

    {[
      {
        title: "Pelatihan Web Development",
        location: "ma'soem University",
        description: "Selama perkuliahan semester 4, belajar tentang web mobile dan pemrograman web2.",
        year: "bersama dosen pak Iin",
        icon: "🌐",
      },
      {
        title: "Sertifikasi Microsoft Excel for Financial Analysis",
        location: "Online",
        description: "Untuk mempersiapkan bekal kesiapan untuk bekerja.",
        year: "2023",
        icon: "📊",
      },
      {
        title: "Workshop Akuntansi Digital & Data Analytics",
        location: "Online",
        description: "Workshop bermanfaat untuk meningkatkan keterampilan kerja.",
        year: "2022",
        icon: "📈",
      },
    ].map((exp, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? -60 : 60 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2, duration: 0.6 }}
        className="mb-20 flex flex-col md:flex-row items-center justify-between relative"
      >
        {index % 2 === 0 ? (
          <>
            <div className="w-full md:w-5/12 text-right pr-4">
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-md p-6 rounded-xl shadow-lg transition hover:shadow-xl">
                <h3 className="text-xl font-semibold text-[#071739] dark:text-white">{exp.title}</h3>
                <p className="text-sm text-[#4B6382] dark:text-gray-300">{exp.location}</p>
                <p className="text-sm mt-2 text-[#071739] dark:text-gray-100">{exp.description}</p>
                <p className="text-xs text-[#4B6382] dark:text-gray-400 mt-2 italic">{exp.year}</p>
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-cyan-500 text-white rounded-full z-10 shadow-md">
              {exp.icon}
            </div>
            <div className="w-full md:w-5/12"></div>
          </>
        ) : (
          <>
            <div className="w-full md:w-5/12"></div>
            <div className="w-10 h-10 flex items-center justify-center bg-cyan-500 text-white rounded-full z-10 shadow-md">
              {exp.icon}
            </div>
            <div className="w-full md:w-5/12 pl-4 text-left">
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-md p-6 rounded-xl shadow-lg transition hover:shadow-xl">
                <h3 className="text-xl font-semibold text-[#071739] dark:text-white">{exp.title}</h3>
                <p className="text-sm text-[#4B6382] dark:text-gray-300">{exp.location}</p>
                <p className="text-sm mt-2 text-[#071739] dark:text-gray-100">{exp.description}</p>
                <p className="text-xs text-[#4B6382] dark:text-gray-400 mt-2 italic">{exp.year}</p>
              </div>
            </div>
          </>
        )}
      </motion.div>
    ))}
  </div>
</AnimatedSection>

{/* Project Section */}
<AnimatedSection id="projects">
  <motion.h2 
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-3xl md:text-4xl font-extrabold text-center text-cyan-600 mb-12"
  >
    My Projects
  </motion.h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
    {[
      {
        title: "CV Online (Next.js)",
        description: "Membuat web portofolio yang interaktif dengan tampilan elegan, animasi, dan tema mode siang & malam.",
        icon: "🖥️"
      },
      {
        title: "Sistem Akuntansi Sederhana (PHP & MySQL)",
        description: "Web untuk pencatatan transaksi keuangan sederhana.",
        icon: "💼"
      },
    ].map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2, duration: 0.6 }}
      >
        <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-300 dark:border-white/20 shadow-md hover:shadow-xl transition transform hover:scale-105">
          <div className="text-5xl mb-4 text-cyan-500">{item.icon}</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
</AnimatedSection>


      {/* Contact Section */}
      <AnimatedSection id="contact">
  <motion.h2
    className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white"
    variants={{
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
    }}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.6 }}
  >
    Kontak Saya
  </motion.h2>

  <form
    onSubmit={handleContactSubmit}
    className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
  >
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
        Nama
      </label>
      <input
        type="text"
        value={contact.name}
        onChange={(e) => setContact({ ...contact, name: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
        Email
      </label>
      <input
        type="email"
        value={contact.email}
        onChange={(e) => setContact({ ...contact, email: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
        Pesan
      </label>
      <textarea
        value={contact.message}
        onChange={(e) => setContact({ ...contact, message: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
        rows="4"
        required
      />
    </div>

    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
    >
      Kirim
    </button>
  </form>
</AnimatedSection>

 {/* ⭐ RATING SECTION START */}
 <AnimatedSection id="rating">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          Berikan Rating
        </motion.h2>

        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => submitRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className={`text-4xl cursor-pointer mx-1 transition-colors duration-200 ${
                (hovered >= star || selected >= star) ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              ★
            </motion.span>
          ))}
        </div>

        <p className="text-center text-gray-700 dark:text-gray-300 text-lg">
          {avg !== null && !isNaN(avg) ? (
            <>
              Rating: <span className="font-semibold">{avg.toFixed(1)}</span> dari{" "}
              <span className="font-semibold">{count}</span> vote{count === 1 ? "" : "s"}
            </>
          ) : (
            <span>Memuat rating...</span>
          )}
        </p>
      </AnimatedSection>

      
      {/* Panggil Chatbot */}
      <Chatbot />

</div>
  );
}