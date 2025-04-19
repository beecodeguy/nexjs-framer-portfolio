/* eslint-disable react/no-unescaped-entities */
import { cn } from "@/lib/utils";
import { Code } from "lucide-react";
import React from "react";

export const StoryHeader = () => {
  return (
    <header className="py-10 bg-gradient-to-r from-blue-400 to-orange-200 rounded-2xl mb-8">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="inline-block p-2 bg-white rounded-full shadow-md mb-4">
          <Code size={40} className="text-indigo-600" />
        </div>
        <h1 className="blog-heading">
          From Mechanical Gears ⚙ to Digital Code 💻
        </h1>
        <p className="blog-subtitle">
          My journey from mechanical engineering to becoming a Senior Software
          Engineer
        </p>
      </div>
    </header>
  );
};

interface BlogSectionProps {
  title: string;
  emoji: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  reverse?: boolean;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  title,
  emoji,
  content,
  imageUrl,
  imageAlt,
  reverse = false,
}) => {
  return (
    <div
      className={cn(
        "mb-12",
        reverse ? "md:flex-row-reverse" : "",
        "md:flex md:gap-8 md:items-center"
      )}
    >
      <div className={cn("md:w-2/3")}>
        <h2 className="section-heading text-white">
          <span className="emoji-highlight">{emoji}</span>
          {title}
        </h2>
        <p className="section-content whitespace-pre-line text-white">
          {content}
        </p>
      </div>

      {imageUrl && (
        <div className="blog-image-container md:w-1/3 mt-6 md:mt-0">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="blog-image"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export const BlogFooter = () => {
  return (
    <footer className="py-8 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <p className="text-4xl text-center font-semibold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Let's build cool stuff, break things (safely), and learn endlessly.
          </p>
        </div>
      </div>
    </footer>
  );
};
