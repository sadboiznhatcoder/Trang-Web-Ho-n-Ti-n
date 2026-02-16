"use client";

// =============================================================================
// FABSupport - Floating Action Button with speed-dial support options
// =============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, X, HelpCircle } from "lucide-react";

const SUPPORT_OPTIONS = [
    {
        id: "messenger",
        label: "Messenger",
        icon: MessageCircle,
        color: "from-blue-500 to-blue-600",
        href: "https://m.me/cashbacktitan",
    },
    {
        id: "zalo",
        label: "Zalo",
        icon: MessageCircle,
        color: "from-blue-400 to-blue-500",
        href: "https://zalo.me/cashbacktitan",
    },
    {
        id: "phone",
        label: "Hotline",
        icon: Phone,
        color: "from-emerald-500 to-emerald-600",
        href: "tel:+84123456789",
    },
];

export function FABSupport() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
            {/* Main FAB button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="help"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <HelpCircle className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Speed dial options */}
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col items-end gap-2">
                        {SUPPORT_OPTIONS.map((option, index) => (
                            <motion.a
                                key={option.id}
                                href={option.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: { delay: index * 0.08 },
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 20,
                                    scale: 0.8,
                                    transition: { delay: (SUPPORT_OPTIONS.length - index) * 0.05 },
                                }}
                                className="flex items-center gap-3 group"
                            >
                                <span className="bg-zinc-800/90 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {option.label}
                                </span>
                                <div
                                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}
                                >
                                    <option.icon className="w-5 h-5" />
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
