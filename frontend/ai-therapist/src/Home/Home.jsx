import { motion } from "framer-motion";
import { Heart, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  return (
    <section className="hero-section">
      {/* Background blobs */}
      <div className="hero-bg">
        <div className="blob blob-sage" />
        <div className="blob blob-lavender" />
        <div className="blob blob-rose" />
      </div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="hero-badge">
            <Sparkles className="badge-icon" />
            <span>Your safe space to heal</span>
          </div>

          {/* Heading */}
          <h1 className="hero-title">
            Begin your journey to
            <span className="hero-gradient-text">inner peace</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            A compassionate AI companion to help you explore your thoughts and
            emotions, followed by seamless connection to licensed therapists
            when you're ready.
          </p>

          {/* CTA */}
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/onboarding")}
            >
              Start Your Session
            </button>

            <button className="btn-ghost">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="trust-grid"
        >
          {[
            {
              icon: Shield,
              title: "100% Confidential",
              desc: "Your conversations are private and secure",
            },
            {
              icon: Heart,
              title: "Non-Judgmental Space",
              desc: "Express yourself freely without fear",
            },
            {
              icon: Sparkles,
              title: "Evidence-Based",
              desc: "Guided by certified mental health resources",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div className="trust-card" key={idx}>
                <div className="trust-icon">
                  <Icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
