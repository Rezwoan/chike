import React from "react";

// Import your images/icons at the top
import logoFooter from "../assets/logo-footer.png";
import facebookIcon from "../assets/facebook.png";
import xIcon from "../assets/x.png";
import instagramIcon from "../assets/instagram.png";
import youtubeIcon from "../assets/youtube.png";
import tiktokIcon from "../assets/tiktok.png";
import telegramIcon from "../assets/telegram.png";

const Footer = () => {
  return (
    <footer className="bg-[#67358E] h-96 md:h-1/3 text-white font-sans">
      {/* Container for logo and social icons */}
      <div className="flex justify-between items-center h-1/2 px-16 py-10">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src={logoFooter}
            alt="Logo"
            className="h-20 mr-6"
          />
        </div>

        {/* Social Icons Section */}
        <div className="grid grid-cols-3 md:flex gap-4 items-center">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125"
          >
            <img
              src={facebookIcon}
              alt="Facebook"
              className="h-16 w-16 rounded-full p-1"
            />
          </a>

          {/* X (formerly Twitter) */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125"
          >
            <img
              src={xIcon}
              alt="X (Twitter)"
              className="h-16 w-16 rounded-full p-1"
            />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125"
          >
            <img
              src={instagramIcon}
              alt="Instagram"
              className="h-16 w-16 rounded-full p-1"
            />
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125"
          >
            <img
              src={youtubeIcon}
              alt="YouTube"
              className="h-16 w-16 rounded-full p-1"
            />
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125"
          >
            <img
              src={tiktokIcon}
              alt="TikTok"
              className="h-16 w-16 rounded-full p-1"
            />
          </a>

          {/* Telegram */}
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125"
          >
            <img
              src={telegramIcon}
              alt="Telegram"
              className="h-16 w-16 rounded-full p-1"
            />
          </a>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-white my-5 mx-auto w-11/12" />

      {/* Copyright & Links */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center px-4 md:px-16 text-lg space-y-2 md:space-y-0">
        <p className="text-center md:text-left text-base">
          Copyright &copy; 2024 chi.ke. All Rights Reserved.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/privacy-policy"
            className="hover:underline text-base"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-use"
            className="hover:underline text-base"
          >
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
