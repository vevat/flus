"use client";

import { motion } from "framer-motion";

type Props = {
  onClose: () => void;
};

export function MillianGreeting({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl border border-[#c9a84c]/30 p-6 pb-8"
        style={{
          background: "linear-gradient(165deg, #14120e 0%, #0d0f14 40%, #0f0d0a 100%)",
          boxShadow: "0 0 80px rgba(201,168,76,0.08), 0 0 1px rgba(201,168,76,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* X close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1a1a1e] border border-[#2a2a2e] flex items-center justify-center text-[#908b80] hover:text-white transition-colors"
          aria-label="Lukk"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Gold decorative line */}
        <div className="flex justify-center mb-5">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
        </div>

        <div className="space-y-4 text-[13px] leading-relaxed">
          <div className="text-center">
            <h2 className="font-display text-lg font-semibold text-[#c9a84c]">
              Kjære Millian,
            </h2>
            <p className="mt-1 text-[#b5a890] font-medium text-[14px]">
              Gratulerer så mye med konfirmasjonsdagen!
            </p>
          </div>

          <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

          <p className="text-[#d4cfc4]">
            Det er en glede å være onkelen din, og det har vært spennende å følge
            oppveksten din. Selv om jeg gjerne skulle visst enda mer om hva som
            skjer i livet ditt og hvordan verden ser ut gjennom dine øyne — så er
            du i mine øyne en flott ungdom det er lett å være stolt av.
          </p>

          <p className="text-[#d4cfc4]">
            Jeg har tenkt mye på hva jeg selv skulle ønske jeg fikk i gave da jeg
            var konfirmant. Du er allerede en god og varm person, så der er jeg
            ikke bekymret. Men å gi deg noen verktøy som kan gi deg økonomisk
            frihet i fremtiden — det kan jeg faktisk bidra med.
          </p>

          <p className="text-[#d4cfc4]">
            Jeg kan dessverre ikke reise tilbake i tid, men om jeg visste det jeg
            vet i dag da jeg var på din alder, er det mye jeg ville gjort
            annerledes. Denne appen har jeg laget til deg, for at du skal se og
            forstå noe veldig få faktisk vet:
          </p>

          <p className="text-[#c9a84c] font-medium text-center italic text-[14px] py-1">
            Hvor enkelt store formuer kan bygges over tid,
            <br />
            med bevisste valg.
          </p>

          <p className="text-[#d4cfc4]">
            Bruker du den rett, mer enn dobler du pengene dine hver tiende år.
          </p>

          <p className="text-[#d4cfc4]">
            Bruk den. Lek med den. Del den.
            <br />
            Og la tallene overraske og inspirere.
          </p>

          <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

          <div className="text-center space-y-1 pt-1">
            <p className="text-[#b5a890]">
              Glad i deg, og lykke til videre på livsreisen din!
            </p>
            <p className="text-[#c9a84c] font-display font-semibold text-[15px]">
              Onkel Cato
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
          </div>

          <p className="text-center text-[11px] text-[#6b6555] italic">
            Stay curious
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
