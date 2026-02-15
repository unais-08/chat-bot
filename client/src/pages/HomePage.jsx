import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useAuth } from "../features/auth/context/AuthContext";

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row items-center gap-8 min-h-[calc(100vh-160px)] 
                   px-4 md:px-8 lg:px-16 py-8"
    >
      {/* Orbital Background Image */}

      <img
        src="/orbital.png"
        alt="Decorative background"
        className="fixed bottom-0 left-0 opacity-5 animate-rotateOrbital -z-10 
                 max-w-[40%] md:max-w-[30%]"
      />

      {/* Left Content Section */}
      <div
        className="flex-1 w-full lg:w-auto flex flex-col items-center text-center 
                     gap-4 md:gap-6"
      >
        <h1
          className="text-5xl md:text-6xl lg:text-[90px] bg-gradient-to-r from-[#217bfe] 
                      to-[#e55571] text-transparent bg-clip-text leading-tight"
        >
          Mini GPT
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mt-4">
          Supercharge your creativity and productivity
        </h2>
        <p className="text-base md:text-md text-gray-300 max-w-2xl mt-4">
          "The future belongs to those who believe in the beauty of their
          dreams." – Eleanor Roosevelt
        </p>
        <p className="text-sm md:text-md text-gray-400 max-w-2xl mt-2">
          ⚠️ Remember: To go back to the home page, click on the logo in the
          top-left corner.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 bg-[#217bfe] text-white rounded-xl text-sm md:text-base 
                   mt-4 hover:bg-white hover:text-[#217bfe] transition-all duration-300 
                   w-fit"
        >
          Get Started
        </button>
      </div>

      {/* Right Content Section */}
      <div className="flex-1 w-full max-w-4xl relative pb-16 md:pb-24 lg:pb-0">
        <div
          className="bg-[#140e2d] rounded-3xl lg:rounded-[50px] aspect-video 
                       overflow-visible relative"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl lg:rounded-[50px]">
            <div
              className="w-[200%] h-full bg-[url('/bg.png')] opacity-20 bg-repeat-x 
                          animate-slideBg"
            />
          </div>

          {/* Bot Image */}
          <img
            src="/bot.png"
            alt="AI Assistant"
            className="w-full h-full object-contain animate-botAnimate p-4"
          />

          {/* Chat Animation Container */}
          <div
            className="absolute bottom-(0) right-4 md:bottom-6 md:right-6 lg:bottom-0
                        lg:right-8 flex items-center gap-2 p-3 md:p-3 bg-[#2c2937] 
                        rounded-lg transition-all hover:scale-105 hover:shadow-lg 
                        backdrop-blur-sm"
          >
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                    ? "/human2.jpeg"
                    : "/bot.png"
              }
              alt="Profile"
              className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border-2 
                       border-gray-600"
            />
            <TypeAnimation
              sequence={[
                "Unais:How to learn Code",
                2000,
                () => setTypingStatus("bot"),
                "Bot:Keep practicing and building projects",
                2000,
                () => setTypingStatus("human2"),
                "Human2:What do you do?",
                2000,
                () => setTypingStatus("bot"),
                "Bot:I am an AI Assistant",
                2000,
                () => setTypingStatus("human1"),
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
              className="text-xs md:text-sm font-mono text-gray-100 min-w-[160px] 
                        md:min-w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center 
                     gap-2 w-full px-4"
      >
        <div className="container mx-auto flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="w-4 h-4 opacity-80"
          />
          <div className="flex gap-2 text-gray-500 text-xs mt-2">
            <Link to="/" className="hover:text-gray-400 transition-colors">
              Terms
            </Link>
            <span>|</span>
            <Link to="/" className="hover:text-gray-400 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
