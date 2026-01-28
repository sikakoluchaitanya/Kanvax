'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    color?: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    size?: 'sm' | 'md';
}

export function Select({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
    size = 'md',
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className={cn('relative', className)}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center justify-between gap-2 w-full rounded-lg',
                    'bg-secondary border border-border',
                    'text-left transition-all duration-200',
                    'hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-accent/30',
                    size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3 text-sm',
                    isOpen && 'ring-2 ring-accent/30'
                )}
            >
                <span className={cn(!selectedOption && 'text-muted-foreground')}>
                    {selectedOption ? (
                        <span className="flex items-center gap-2">
                            {selectedOption.color && (
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: selectedOption.color }}
                                />
                            )}
                            {selectedOption.label}
                        </span>
                    ) : (
                        placeholder
                    )}
                </span>
                <ChevronDown
                    size={14}
                    className={cn(
                        'text-muted-foreground transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'absolute z-50 w-full mt-1',
                            'bg-card border border-border rounded-lg shadow-lg',
                            'overflow-hidden'
                        )}
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    'flex items-center justify-between w-full px-3 py-2 text-sm',
                                    'hover:bg-secondary transition-colors duration-150',
                                    option.value === value && 'bg-secondary/50'
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {option.color && (
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: option.color }}
                                        />
                                    )}
                                    {option.label}
                                </span>
                                {option.value === value && (
                                    <Check size={14} className="text-accent" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
