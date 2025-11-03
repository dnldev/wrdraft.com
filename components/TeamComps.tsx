// in /components/TeamComps.tsx
import { Card, CardBody, CardHeader } from "@heroui/react";
import { LucideIcon } from "./LucideIcon";

export function TeamComps() {
  return (
    <Card className="p-0">
      <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6 bg-card/50">
        <LucideIcon name="Users" className="text-cyan-400" />
        <h2 className="text-3xl font-bold text-cyan-400 text-center">
          Team Compositions
        </h2>
      </CardHeader>
      <CardBody className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 bg-background/50 border-t-4 border-red-500">
          <h3 className="text-2xl font-bold text-red-400 mb-3">
            Engage / Dive
          </h3>
          <p className="mb-4 text-sm">Force fights with AoE CC.</p>
          <h4 className="text-lg font-semibold text-white mb-2">Your Picks:</h4>
          <p className="mb-4 text-sm">
            <span className="champ-supp">Leona</span> + (
            <span className="champ-adc">MF</span>,{" "}
            <span className="champ-adc">Xayah</span>,{" "}
            <span className="champ-adc">Kai'Sa</span>)
          </p>
          <h4 className="text-lg font-semibold text-white mb-2">Draft with:</h4>
          <p className="mb-4 text-sm">
            <strong className="text-yellow-300">
              Yasuo, Yone, Akali, Galio
            </strong>
          </p>
          <h4 className="text-lg font-semibold text-white mb-2">
            Avoid against:
          </h4>
          <p className="text-sm">
            <strong className="text-teal-300">Janna, Milio, Lulu</strong>
          </p>
        </Card>
        <Card className="p-4 bg-background/50 border-t-4 border-yellow-500">
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">
            Protect the Carry
          </h3>
          <p className="mb-4 text-sm">Funnel resources into a hyper-carry.</p>
          <h4 className="text-lg font-semibold text-white mb-2">Your Picks:</h4>
          <p className="mb-4 text-sm">
            <span className="champ-adc">Jinx</span> + (
            <span className="champ-supp">Milio</span>,{" "}
            <span className="champ-supp">Braum</span>,{" "}
            <span className="champ-supp">Lulu</span>)
          </p>
          <h4 className="text-lg font-semibold text-white mb-2">Draft with:</h4>
          <p className="mb-4 text-sm">
            <strong className="text-purple-400">
              Orianna, Galio, Lissandra
            </strong>
          </p>
          <h4 className="text-lg font-semibold text-white mb-2">Avoid if:</h4>
          <p className="text-sm">
            Your team is all scaling or has no frontline.
          </p>
        </Card>
        <Card className="p-4 bg-background/50 border-t-4 border-blue-500">
          <h3 className="text-2xl font-bold text-blue-400 mb-3">
            Poke / Siege
          </h3>
          <p className="mb-4 text-sm">Whittle down enemies from afar.</p>
          <h4 className="text-lg font-semibold text-white mb-2">Your Picks:</h4>
          <p className="mb-4 text-sm">
            (<span className="champ-adc">Varus</span>,{" "}
            <span className="champ-adc">Caitlyn</span>,{" "}
            <span className="champ-adc">Jhin</span>) + (
            <span className="champ-supp">Zilean</span>,{" "}
            <span className="champ-supp">Morgana</span>)
          </p>
          <h4 className="text-lg font-semibold text-white mb-2">Draft with:</h4>
          <p className="mb-4 text-sm">
            <strong className="text-orange-400">
              Brand, Lux, Vel'Koz, Ahri
            </strong>
          </p>
          <h4 className="text-lg font-semibold text-white mb-2">
            Avoid against:
          </h4>
          <p className="text-sm">
            Hard engage (
            <strong className="text-yellow-400">Nautilus, Leona</strong>)
          </p>
        </Card>
      </CardBody>
    </Card>
  );
}
