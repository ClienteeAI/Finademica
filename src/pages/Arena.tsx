import { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import ArenaDisclaimer from "@/components/arena/ArenaDisclaimer";
import GladiatorCard from "@/components/arena/GladiatorCard";
import GladiatorCallModal from "@/components/arena/GladiatorCallModal";
import { gladiators, type Gladiator } from "@/components/arena/gladiators";
import { Swords, Mic } from "lucide-react";
import { motion } from "framer-motion";

const ARENA_ACCEPTED_KEY = "arena_disclaimer_accepted";

export default function Arena() {
  const [accepted, setAccepted] = useState(
    () => sessionStorage.getItem(ARENA_ACCEPTED_KEY) === "true"
  );
  const [selectedGladiator, setSelectedGladiator] = useState<Gladiator | null>(
    null
  );
  const [callModalOpen, setCallModalOpen] = useState(false);

  const handleAccept = () => {
    sessionStorage.setItem(ARENA_ACCEPTED_KEY, "true");
    setAccepted(true);
  };

  const handleSelectGladiator = (gladiator: Gladiator) => {
    setSelectedGladiator(gladiator);
    setCallModalOpen(true);
  };

  return (
    <SidebarLayout>
      {!accepted ? (
        <ArenaDisclaimer onAccept={handleAccept} />
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Swords className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Psychological Arena
                </h1>
                <p className="text-sm text-muted-foreground">
                  Choose a Gladiator and test your trading psychology
                </p>
              </div>
            </div>
          </motion.div>

          {/* Microphone reminder */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Microphone required.</span>{" "}
              Make sure your mic is enabled and your browser has permission before starting a session.
            </p>
          </motion.div>

          {/* Gladiator Grid */}
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {gladiators.map((gladiator, i) => (
              <div key={gladiator.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <GladiatorCard
                  gladiator={gladiator}
                  index={i}
                  onSelect={handleSelectGladiator}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call Modal */}
      <GladiatorCallModal
        gladiator={selectedGladiator}
        open={callModalOpen}
        onOpenChange={setCallModalOpen}
      />
    </SidebarLayout>
  );
}
