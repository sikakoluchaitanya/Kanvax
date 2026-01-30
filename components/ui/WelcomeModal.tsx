'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';

export function WelcomeModal() {
    const { userName, setUserName } = useTaskStore();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [step, setStep] = useState<'welcome' | 'name' | 'done'>('welcome');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Check if this is the first visit
        const hasSeenWelcome = localStorage.getItem('kanvax-welcome-seen');
        if (!hasSeenWelcome && userName === 'there') {
            // Small delay for smoother UX
            const timer = setTimeout(() => setIsOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, [userName]);

    useEffect(() => {
        if (step === 'name' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [step]);

    const handleContinue = () => {
        if (step === 'welcome') {
            setStep('name');
        } else if (step === 'name') {
            if (name.trim()) {
                setUserName(name.trim());
            }
            setStep('done');
            localStorage.setItem('kanvax-welcome-seen', 'true');
            setTimeout(() => setIsOpen(false), 1500);
        }
    };

    const handleSkip = () => {
        localStorage.setItem('kanvax-welcome-seen', 'true');
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleContinue();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={cn(
                            'relative w-full max-w-md overflow-hidden rounded-2xl',
                            'bg-gradient-to-br from-background via-background to-muted/50',
                            'border border-border shadow-2xl'
                        )}
                    >
                        {/* Decorative gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        {/* Content */}
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {step === 'welcome' && (
                                    <motion.div
                                        key="welcome"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="text-center"
                                    >
                                        {/* Icon */}
                                        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </div>

                                        <h2 className="text-2xl font-bold text-foreground mb-3">
                                            Welcome to Kanvax! ✨
                                        </h2>
                                        <p className="text-muted-foreground mb-8 leading-relaxed">
                                            Your intelligent task management companion.
                                            Let&apos;s personalize your experience.
                                        </p>

                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={handleContinue}
                                                className={cn(
                                                    'w-full flex items-center justify-center gap-2 h-12 rounded-xl',
                                                    'bg-gradient-to-r from-indigo-500 to-purple-600',
                                                    'hover:from-indigo-600 hover:to-purple-700',
                                                    'text-white font-semibold',
                                                    'transition-all duration-200',
                                                    'shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30'
                                                )}
                                            >
                                                Get Started
                                                <ArrowRight size={18} />
                                            </button>
                                            <button
                                                onClick={handleSkip}
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                Skip for now
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'name' && (
                                    <motion.div
                                        key="name"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="text-center"
                                    >
                                        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border-2 border-accent/30">
                                            <span className="text-3xl">👋</span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-foreground mb-3">
                                            What should we call you?
                                        </h2>
                                        <p className="text-muted-foreground mb-6">
                                            We&apos;ll use this to personalize your experience
                                        </p>

                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Enter your name..."
                                            className={cn(
                                                'w-full h-14 px-5 rounded-xl text-center text-lg',
                                                'bg-muted/50 border-2 border-border',
                                                'text-foreground placeholder:text-muted-foreground',
                                                'focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10',
                                                'transition-all duration-200'
                                            )}
                                        />

                                        <div className="flex flex-col gap-3 mt-6">
                                            <button
                                                onClick={handleContinue}
                                                className={cn(
                                                    'w-full flex items-center justify-center gap-2 h-12 rounded-xl',
                                                    'bg-accent hover:bg-accent/90',
                                                    'text-white font-semibold',
                                                    'transition-all duration-200',
                                                    'shadow-lg shadow-accent/25'
                                                )}
                                            >
                                                {name.trim() ? 'Continue' : 'Skip this step'}
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'done' && (
                                    <motion.div
                                        key="done"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-4"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
                                            className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center"
                                        >
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </motion.div>

                                        <h2 className="text-2xl font-bold text-foreground mb-2">
                                            {name.trim() ? `Welcome, ${name.trim()}!` : 'You\'re all set!'}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            Let&apos;s get productive 🚀
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Progress dots */}
                        <div className="flex justify-center gap-2 pb-6">
                            {['welcome', 'name', 'done'].map((s, i) => (
                                <div
                                    key={s}
                                    className={cn(
                                        'w-2 h-2 rounded-full transition-all duration-300',
                                        step === s
                                            ? 'bg-accent w-6'
                                            : i < ['welcome', 'name', 'done'].indexOf(step)
                                                ? 'bg-accent/50'
                                                : 'bg-muted'
                                    )}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
