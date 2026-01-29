'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    X,
    Clock
} from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday,
    isPast,
    isBefore,
    startOfDay
} from 'date-fns';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    className?: string;
}

const quickDates = [
    { label: 'Today', getValue: () => new Date() },
    { label: 'Tomorrow', getValue: () => addDays(new Date(), 1) },
    { label: 'Next Week', getValue: () => addDays(new Date(), 7) },
];

export function DatePicker({ value, onChange, placeholder = 'Select due date', className }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Generate calendar days
    const generateCalendarDays = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days: Date[] = [];
        let day = startDate;

        while (day <= endDate) {
            days.push(day);
            day = addDays(day, 1);
        }

        return days;
    };

    const days = generateCalendarDays();
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const handleDateSelect = (date: Date) => {
        onChange(date);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl',
                    'bg-card border border-input text-left',
                    'hover:border-accent/50 hover:bg-card/80',
                    'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
                    'transition-all duration-200',
                    isOpen && 'ring-2 ring-accent/30 border-accent'
                )}
            >
                <Calendar size={18} className="text-muted-foreground" />
                <span className={cn(
                    'flex-1',
                    value ? 'text-foreground' : 'text-muted-foreground'
                )}>
                    {value ? format(value, 'EEE, MMM d, yyyy') : placeholder}
                </span>
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={14} className="text-muted-foreground" />
                    </button>
                )}
            </button>

            {/* Calendar Dropdown - Opens UPWARD to avoid modal cutoff */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'absolute bottom-full left-0 right-0 mb-2 z-[100]',
                            'bg-card border border-border rounded-2xl shadow-2xl',
                            'overflow-hidden'
                        )}
                    >
                        {/* Quick Select */}
                        <div className="p-3 border-b border-border bg-muted/30">
                            <div className="flex gap-2 flex-wrap">
                                {quickDates.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => handleDateSelect(item.getValue())}
                                        className={cn(
                                            'px-3 py-1.5 text-xs font-medium rounded-lg',
                                            'bg-background border border-border',
                                            'hover:bg-accent hover:text-white hover:border-accent',
                                            'transition-all duration-200'
                                        )}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Month Navigation */}
                        <div className="flex items-center justify-between p-3 border-b border-border">
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <h3 className="font-semibold text-foreground">
                                {format(currentMonth, 'MMMM yyyy')}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="p-3">
                            {/* Week Days Header */}
                            <div className="grid grid-cols-7 mb-1">
                                {weekDays.map((day) => (
                                    <div
                                        key={day}
                                        className="text-center text-xs font-medium text-muted-foreground py-1"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-0.5">
                                {days.map((day, index) => {
                                    const isCurrentMonth = isSameMonth(day, currentMonth);
                                    const isSelected = value && isSameDay(day, value);
                                    const isTodayDate = isToday(day);
                                    const isPastDate = isBefore(day, startOfDay(new Date())) && !isTodayDate;

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleDateSelect(day)}
                                            className={cn(
                                                'w-8 h-8 rounded-lg text-xs font-medium',
                                                'transition-all duration-150 hover:scale-105',
                                                !isCurrentMonth && 'text-muted-foreground/40',
                                                isCurrentMonth && !isSelected && 'text-foreground hover:bg-muted',
                                                isTodayDate && !isSelected && 'bg-accent/10 text-accent font-bold ring-1 ring-accent/30',
                                                isPastDate && isCurrentMonth && 'text-muted-foreground/60',
                                                isSelected && 'bg-accent text-white shadow-lg'
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        {value && (
                            <div className="px-3 py-2 border-t border-border bg-muted/30">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock size={12} />
                                    <span>
                                        {isPast(value) && !isToday(value)
                                            ? 'This date is in the past'
                                            : isToday(value)
                                                ? 'Due today!'
                                                : `Due in ${Math.ceil((value.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                                        }
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
