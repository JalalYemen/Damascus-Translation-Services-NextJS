
import React from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Resources } from './Resources';
import { Contact } from './Contact';

export const Home: React.FC = () => {
  return (
    <>
        <Hero />
        <Features />
        <HowItWorks />
        <Resources />
        <Contact />
    </>
  );
};
