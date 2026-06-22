import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const stepAnimation = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.3, ease: "easeInOut" as const }
};

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  // const [reminderPreference, setReminderPreference] = useState(""); // Not directly used in UI after selection, but set in localStorage
  // const [bibleVersion, setBibleVersion] = useState(""); // Same as above
  const navigate = useNavigate();

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSetReminder = (value: string) => {
    localStorage.setItem('reminderPreference', value);
    // setReminderPreference(value); // If needed for UI feedback later
    handleNext();
  };

  const handleSetBibleVersion = (value: string) => {
    localStorage.setItem('bibleVersionPreference', value);
    // setBibleVersion(value); // If needed for UI feedback later
    handleNext();
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/', { replace: true });
  };
  
  const blessingText = "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace.";
  const blessingReference = "Numbers 6:24-26";

  return (
    <Layout title="Welcome to Threads of Grace">
      <motion.div
        className="p-4 md:p-8 max-w-lg mx-auto text-center flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" {...stepAnimation} className="w-full flex flex-col items-center">
              <h2 className="text-3xl font-serif text-primary mb-4">Welcome to Threads of Grace</h2>
              <p className="text-muted-foreground mb-8">
                A quiet space to reflect, connect with your faith, and find peace in your daily journey.
              </p>
              <Button onClick={handleNext} className="rounded-2xl px-6">
                Begin
              </Button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" {...stepAnimation} className="w-full flex flex-col items-center">
              <h3 className="text-xl font-serif text-foreground mb-2">Set a Gentle Reminder?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Receive a soft nudge for your daily reflection time. (This is conceptual for now)
              </p>
              <div className="space-y-3 mb-6 w-full">
                <Button variant="outline" className="w-full rounded-xl p-6" onClick={() => handleSetReminder('morning')}>Morning</Button>
                <Button variant="outline" className="w-full rounded-xl p-6" onClick={() => handleSetReminder('afternoon')}>Afternoon</Button>
                <Button variant="outline" className="w-full rounded-xl p-6" onClick={() => handleSetReminder('evening')}>Evening</Button>
                <Button variant="outline" className="w-full rounded-xl p-6" onClick={() => handleSetReminder('none')}>No Reminder</Button>
              </div>
              <div className="flex justify-between w-full mt-8">
                <Button variant="ghost" onClick={handleBack} className="rounded-xl">Back</Button>
                <Button variant="ghost" onClick={() => handleSetReminder('none')} className="rounded-xl">Skip</Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" {...stepAnimation} className="w-full flex flex-col items-center">
              <h3 className="text-xl font-serif text-foreground mb-2">Preferred Bible Version?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select a version for future scripture displays. (Conceptual for now)
              </p>
              <div className="space-y-3 mb-6 w-full">
                <Button variant="outline" className="w-full rounded-xl p-6" onClick={() => handleSetBibleVersion('KJV')}>KJV</Button>
                <Button variant="outline" className="w-full rounded-xl p-6" onClick={() => handleSetBibleVersion('NIV')}>NIV</Button>
                <Button variant="outline" className="w-full rounded-xl p-6" onClick={() => handleSetBibleVersion('ESV')}>ESV</Button>
                <Button variant="outline" className="w-full rounded-xl p-6" onClick={() => handleSetBibleVersion('default')}>Default</Button>
              </div>
              <div className="flex justify-between w-full mt-8">
                <Button variant="ghost" onClick={handleBack} className="rounded-xl">Back</Button>
                <Button variant="ghost" onClick={() => handleSetBibleVersion('default')} className="rounded-xl">Skip</Button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" {...stepAnimation} className="w-full flex flex-col items-center">
              <h3 className="text-xl font-serif text-primary mb-4">A Moment of Peace</h3>
              <div className="p-6 bg-grace-100/70 rounded-2xl shadow-inner my-6">
                <p className="text-lg font-serif text-foreground mb-2">{blessingText}</p>
                <p className="text-sm text-muted-foreground font-serif">{blessingReference}</p>
              </div>
              <Button 
                onClick={handleFinishOnboarding} 
                className="rounded-2xl px-8 py-3 mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Enter Threads of Grace
              </Button>
              <Button variant="ghost" onClick={handleBack} className="rounded-xl mt-4">Back</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default OnboardingPage;
