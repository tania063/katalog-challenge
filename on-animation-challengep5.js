"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
<nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 shadow-md py-3 px-8 flex justify-center rounded-full">
  <ul className="flex space-x-6">
    {["home", "about", "skills", "experience", "projects",  "contact"].map((item) => (
      <li key={item} className={`cursor-pointer transition-colors ${activeSection === item ? "text-blue-500 font-bold" : "hover:text-blue-400"}`}>
        <a 
          href={`#${item}`} 
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item).scrollIntoView({ behavior: "smooth" });
            setActiveSection(item); // Update state agar berubah saat diklik
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
          Halo, saya Titania! Saya seorang mahasiswa Komputerisasi Akuntansi yang memiliki minat dalam pemrograman dan analisis data keuangan. Selamat datang di portofolio saya, tempat saya berbagi pengalaman, keterampilan, dan proyek yang telah saya kerjakan.
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
          className="text-4xl font-bold mb-8"
        >
          About Me
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <AnimatedCard delay={0.2}>
            <motion.p className="text-lg">
              Halo, saya Titania! Saya seorang mahasiswa Komputerisasi Akuntansi yang memiliki minat dalam pemrograman dan analisis data keuangan. Selamat datang di portofolio saya, tempat saya berbagi pengalaman, keterampilan, dan proyek yang telah saya kerjakan.
            </motion.p>
          </AnimatedCard>
          
          <AnimatedCard delay={0.4}>
            <motion.p className="text-lg">
              Dengan latar belakang di bidang akuntansi dan pemrograman, saya berusaha menggabungkan keduanya untuk menciptakan solusi yang efisien dalam pengelolaan data keuangan. Saya memiliki pengalaman dalam menggunakan Next.js, PHP, Tailwind CSS, MySQL, dan beberapa framework lainnya untuk membangun sistem berbasis web.
            </motion.p>
          </AnimatedCard>
        </div>
      </AnimatedSection>

      {/* Skills Section */}
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
        
        <AnimatedCard>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js, PHP, HTML, CSS, JavaScript, Tailwind CSS",
              "Database Management: MySQL",
              "Software Akuntansi: Excel, SQL untuk analisis data keuangan",
              "Analisis Keuangan: Membuat laporan keuangan, audit sederhana"
            ].map((skill, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.1 } 
                  }
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#4a5568" }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md text-sm"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </AnimatedCard>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection id="experience">
        <motion.h2 
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-2xl font-semibold text-white text-center mb-8"
        >
          experience
        </motion.h2>
        
        <div className="relative border-l-4 border-gray-500 ml-6">
          {[
            {
              title: "Pelatihan Web Development",
              location: "ma'soem University",
              description: "selama perkuliahan semester 4, belajar tentang web mobile dan pemograman web2",
              year: "bersama dosen pak Iin",
              icon: "🎓",
            },
            {
              title: "Sertifikasi Microsoft Excel for Financial Analysis",
              location: "online",
              description: "untuk mempersiapkan bekal kesiapan untuk bekerja.",
              year: "2017",
              icon: "💼",
            },
            {
              title: "Workshop Akuntansi Digital & Data Analyticss",
              location: "online",
              description: "untuk mempersiapkan bekal kesiapan untuk bekerja.",
              year: "2017",
              icon: "💼",
            },
          ].map((exp, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.2 } 
                }
              }}
              className="mb-8 flex items-center"
            >
              {/* Icon */}
              <motion.div 
                whileHover={{ scale: 1.2 }}
                className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full absolute -left-5"
              >
                {exp.icon}
              </motion.div>
              {/* Card */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800 text-white p-4 rounded-lg shadow-md ml-6 w-full max-w-md"
              >
                <h3 className="text-lg font-bold">{exp.title}</h3>
                <p className="text-sm text-gray-300">{exp.location}</p>
                <p className="text-sm mt-2">{exp.description}</p>
                <p className="text-xs text-gray-400 mt-2">{exp.year}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Experience Section */}
      <AnimatedSection id="projects">
        <motion.h2 
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-4xl font-bold mb-8"
        >
          projects
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "CV Online (Next.js)",
              description: "Membuat web portofolio yang interaktif dengan tampilan elegan, animasi, dan tema mode siang & malam.",
              icon: "📍"
            },
            {
              title: " Sistem Akuntansi Sederhana (PHP & MySQL)",
              description: "Web untuk pencatatan transaksi keuangan sederhana.",
              icon: "📍"
            },
            
          ].map((item, index) => (
            <AnimatedCard key={index} delay={index * 0.2}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <span className="text-4xl mb-4">{item.icon}</span>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection id="contact">
        <motion.h2 
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-3xl font-bold mb-4"
        >
          Kontak
        </motion.h2>
        
        <motion.p 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="text-lg max-w-3xl mx-auto mb-6"
        >
          Silakan isi formulir di bawah ini untuk menghubungi saya.
        </motion.p>
        
        <AnimatedCard>
          <form className="max-w-lg mx-auto">
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.1 } }
              }}
              className="mb-4"
            >
              <input 
                type="text" 
                placeholder="Nama" 
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white" 
                required 
              />
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
              }}
              className="mb-4"
            >
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white" 
                required 
              />
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.3 } }
              }}
              className="mb-4"
            >
              <textarea 
                placeholder="Pesan" 
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white" 
                rows="4" 
                required
              ></textarea>
            </motion.div>
            
            <motion.button 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delay: 0.4 } }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Kirim
            </motion.button>
          </form>
        </AnimatedCard>
      </AnimatedSection>
    </div>
  );
}