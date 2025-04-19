/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { BlogFooter, BlogSection, StoryHeader } from "./story-blocks";

export const StoryScreen = () => {
  return (
    <div className="mx-6 grid grid-cols-1">
      <StoryHeader />
      {/* Introduction */}
      <p className="text-lg text-white mb-10 leading-relaxed">
        Hey there! I'm a Senior Software Engineer today, but my journey here
        wasn't a straight line—it was more like a rollercoaster with a lot of
        bug fixes along the way.
      </p>
      {/* Blog Sections */}
      <BlogSection
        title="The Early Days of Confusion"
        emoji="✨"
        content="Once upon a classroom, I was a mechanical engineering student, drowning in thermodynamics and trying to understand why heat flows from hot to cold. I didn't choose this life because I loved gears; I chose it because it sounded solid. But deep down? I was confused and curious."
        imageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        imageAlt="Student studying in classroom"
      />
      <BlogSection
        title="The Automotive World"
        emoji="🚗"
        content="After graduation, I entered the automotive industry as a Service Engineer. My job? Diagnose used vehicles, manage warranty claims, and face off with angry engines and angrier customers. It was challenging, sure. But something felt missing. I was maintaining systems, not building them."
        imageUrl="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=500&auto=format&fit=crop&q=60"
        imageAlt="Car engine repair"
        reverse={true}
      />
      <BlogSection
        title="The Tech Spark"
        emoji="✨"
        content="Then came the moment that changed everything. A group of friends and I decided to start a tech-based startup. We were clueless, ambitious, and full of caffeine. That's when I dove head-first into the world of software."
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        imageAlt="Group brainstorming session"
      />

      <BlogSection
        title="Learning to Code"
        emoji="⌨️"
        content="I didn't just learn to code—I battled with it. HTML made me feel smart. CSS made me cry. JavaScript? Let's just say we had trust issues. But with every bug, I got better. I learned about React, TypeScript, Zod, and how to handle everything from forms to file uploads."
        imageUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        imageAlt="Coding on laptop"
        reverse={true}
      />

      <BlogSection
        title="Startup Hustle"
        emoji="🚀"
        content="Working on our startup meant learning under fire. I coded by day, debugged by night, and lived on Stack Overflow. I stored base64 files in session like they were national secrets and learned to juggle multiple roles like a circus performer with a caffeine problem."
        imageUrl="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        imageAlt="Startup team working late"
      />
      <BlogSection
        title="Today: Senior Software Engineer"
        emoji="✪"
        content="Now, I work as a Senior Engineer, solving real-world problems through clean code, smart systems, and constant curiosity. My role keeps me on my toes—from mentoring juniors to architecting solutions to figuring out why production broke (again). Tech changes fast, and I love every bit of the chase."
        imageUrl="https://images.unsplash.com/photo-1709547228697-fa1f424a3f39?w=500&auto=format&fit=crop&q=60"
        imageAlt="Professional software engineer at work"
        reverse={true}
      />

      <BlogSection
        title="Looking Ahead"
        emoji="🌟"
        content="I'm not done. The journey from spanners to syntax is still evolving. I want to lead bigger projects, solve tougher problems, and help others navigate their own transitions.\n\nIf you're confused today, trust me—you're not lost. You're just starting your story. And it could be epic."
        imageUrl="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        imageAlt="Looking ahead to the future"
      />
      {/* Quote Section */}
      <div className="quote-section text-gray-400">
        "The most exciting phrase to hear in science, the one that heralds new
        discoveries, is not 'Eureka!' but 'That's funny...'" — Isaac Asimov
      </div>
      <BlogFooter />
    </div>
  );
};
