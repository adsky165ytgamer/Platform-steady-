import { Platform, Layer } from '../types';

export const PLATFORMS: Platform[] = [
  {
    id: 'android',
    name: 'Android',
    subtitle: 'Linux-based open-source platform',
    status: 'active',
    badgeText: 'Curriculum Available',
    description: 'Explore the architecture, runtime environment, and system internals that power billions of smart devices.',
  },
  {
    id: 'linux',
    name: 'Linux',
    subtitle: 'Unix-like monolithic kernel & distributions',
    status: 'upcoming',
    badgeText: 'Future Roadmap',
    description: 'Future educational module covering Unix fundamentals, kernel internals, and system calls.',
  },
  {
    id: 'windows',
    name: 'Windows',
    subtitle: 'Hybrid kernel operating system architecture',
    status: 'upcoming',
    badgeText: 'Future Roadmap',
    description: 'Future educational module covering Windows NT executive services, Win32 subsystems, and drivers.',
  },
];

export const ANDROID_WELCOME = {
  title: 'Welcome to Android!',
  greeting: 'Hey there! Welcome to the Android world!',
  paragraphs: [
    'You probably use Android every day. You open apps, watch videos, send messages, and change settings.',
    'But have you ever wondered what Android actually is, what it does, or how everything works together?',
    "Don't worry if you've never studied technology before. We'll start with the basics and gradually explore the entire Android platform, from the things you can see to the systems hidden underneath.",
  ],
  callToActionQuestion: 'Ready to discover Android?',
  buttonText: "Let's Get Started",
};

export const LAYER_1: Layer = {
  id: 'layer-1',
  number: 1,
  title: 'Layer 1 — Understanding Operating Systems and Android',
  description: 'The fundamental bridge connecting users, application software, and underlying physical hardware.',
  learningPoints: [
    'What an operating system is.',
    'Why devices need an operating system.',
    'What Android is.',
    'What an operating system does.',
    'The relationship between applications, the operating system, and hardware.',
    'How Android differs from an application and from a device manufacturer.',
  ],
  lessons: [
    {
      id: 'lesson-1-1',
      number: '1.1',
      title: 'Lesson 1.1 — What Is an Operating System?',
      subtitle: 'The foundational coordinator of computational hardware and software',
      content: [
        "An operating system (OS) is the core software that manages a device's resources and provides the services needed for applications to run.",
        "Think of a phone: applications need ways to use memory, storage, the screen, the camera, and other hardware. The operating system helps coordinate those resources and provides common services that applications rely on.",
        "Examples of operating systems include Android, Windows, Linux distributions, macOS, and iOS.",
      ],
      keyTakeaway: 'Without an operating system, every individual application would have to write its own custom code to interact with screens, memory chips, and processors directly.',
      focusConcepts: [
        {
          term: 'Resource Management',
          explanation: 'Allocates CPU time, random-access memory (RAM), and flash storage fairly among competing processes without collisions.',
        },
        {
          term: 'Hardware Abstraction',
          explanation: 'Provides uniform interfaces so apps do not need custom code for each specific camera sensor or screen panel.',
        },
        {
          term: 'Service Provider',
          explanation: 'Offers networking, file access, security boundaries, and user input handling as shared system facilities.',
        },
      ],
    },
    {
      id: 'lesson-1-2',
      number: '1.2',
      title: 'Lesson 1.2 — What Is Android?',
      subtitle: 'A full platform stack built around the Linux kernel',
      content: [
        "Android is an operating system platform built around the Linux kernel, together with Android-specific software components, system services, application frameworks, and tools.",
        "It provides the foundation on which Android applications run and connects software to the device's hardware through multiple layers.",
        "Android is much more than the home screen, icons, and settings you see. Those are only part of the experience.",
      ],
      keyTakeaway: 'Android is an independent operating system platform, separate from any specific phone manufacturer or external custom skin.',
      focusConcepts: [
        {
          term: 'The Linux Kernel Foundation',
          explanation: 'Android relies on Linux for core system drivers, power management, memory protection, and low-level hardware communication.',
        },
        {
          term: 'Android Software Stack',
          explanation: 'Includes the Android Runtime (ART), native C/C++ libraries, and the Android Application Framework.',
        },
        {
          term: 'Platform vs. Application',
          explanation: 'Applications run on top of Android, whereas Android governs the entire ecosystem and hardware lifecycle.',
        },
      ],
    },
  ],
};
