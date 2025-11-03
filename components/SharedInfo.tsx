// in /components/SharedInfo.tsx

import { LucideIcon } from "./LucideIcon";

export function SharedInfo() {
  return (
    <div className="space-y-12">
      {/* Picks & Bans */}
      <section className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-4 md:p-6 border-b border-slate-700 bg-slate-900/30 flex items-center justify-center gap-3">
          <LucideIcon name="Swords" className="text-red-400" />
          <h2 className="text-3xl font-bold text-red-400 text-center">
            Drafting Strategy
          </h2>
        </div>
        <div className="p-4 md:p-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <LucideIcon name="BrainCircuit" className="text-sky-400" /> The
              Drafting Mindset
            </h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-slate-300 pl-4">
              <li>
                <strong className="text-white">Comfort &gt; Counter:</strong> A
                well-piloted{" "}
                <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                  Nami ★
                </span>{" "}
                is always better than a poorly played{" "}
                <strong className="text-gray-400">Alistar</strong>.
              </li>
              <li>
                <strong className="text-white">Identify Win Conditions:</strong>{" "}
                Are you a "Protect the Carry" comp? A "Dive" comp? Draft with a
                clear goal.
              </li>
              <li>
                <strong className="text-white">Check Damage Profile:</strong> If
                your team is all AD, you must pick an AP support (
                <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                  Zilean
                </span>
                ,{" "}
                <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                  Morgana
                </span>
                ) or AP ADC (
                <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                  Kai'Sa
                </span>
                ,{" "}
                <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                  Varus
                </span>
                ).
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Priority Bans
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong className="text-red-300">Zed / Yasuo / Akali:</strong>{" "}
                  Protects your immobile ADCs.
                </li>
                <li>
                  <strong className="text-red-300">Yuumi:</strong> A "simplify
                  the game" ban.
                </li>
                <li>
                  <strong className="text-red-300">Blitzcrank / Thresh:</strong>{" "}
                  Protects your squishy enchanters.
                </li>
              </ul>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Strategic Bans
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  Want to play{" "}
                  <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                    Leona ☆
                  </span>
                  ? Ban{" "}
                  <strong className="font-bold text-purple-400">Morgana</strong>
                  .
                </li>
                <li>
                  Want to play{" "}
                  <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                    Jinx ★
                  </span>
                  ? Ban{" "}
                  <strong className="font-bold text-yellow-400">
                    Nautilus
                  </strong>
                  .
                </li>
                <li>
                  Want to play{" "}
                  <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                    Miss Fortune
                  </span>
                  ? Ban{" "}
                  <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                    Braum
                  </span>{" "}
                  or{" "}
                  <strong className="font-bold text-yellow-300">Yasuo</strong>.
                </li>
              </ul>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Safe First-Picks
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong className="text-green-300">
                    <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                      Caitlyn:
                    </span>
                  </strong>{" "}
                  Her extreme range allows for safe laning.
                </li>
                <li>
                  <strong className="text-green-300">
                    <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                      Lulu:
                    </span>
                  </strong>{" "}
                  Fits into any comp and has great peel.
                </li>
                <li>
                  <strong className="text-green-300">
                    <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                      Thresh:
                    </span>
                  </strong>{" "}
                  The ultimate utility support.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Comps */}
      <section className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-4 md:p-6 border-b border-slate-700 bg-slate-900/30 flex items-center justify-center gap-3">
          <LucideIcon name="Users" className="text-cyan-400" />
          <h2 className="text-3xl font-bold text-cyan-400 text-center">
            Team Compositions
          </h2>
        </div>
        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-700/50 p-4 rounded-lg border-t-4 border-red-500">
            <h3 className="text-2xl font-bold text-red-400 mb-3">
              Engage / Dive
            </h3>
            <p className="mb-4 text-sm">Force fights with hard CC.</p>
            <h4 className="text-lg font-semibold text-white mb-2">
              Your Picks:
            </h4>
            <p className="mb-4 text-sm">
              <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Leona
              </span>{" "}
              + (
              <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                MF
              </span>
              ,{" "}
              <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Xayah
              </span>
              ,{" "}
              <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Kai'Sa
              </span>
              )
            </p>
            <h4 className="text-lg font-semibold text-white mb-2">
              Draft with:
            </h4>
            <p className="mb-4 text-sm">
              <strong className="font-bold text-yellow-300">
                Yasuo, Yone, Akali, Galio
              </strong>
            </p>
            <h4 className="text-lg font-semibold text-white mb-2">
              Avoid against:
            </h4>
            <p className="text-sm">
              <strong className="font-bold text-teal-300">
                Janna, Milio, Lulu
              </strong>
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border-t-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">
              Protect the Carry
            </h3>
            <p className="mb-4 text-sm">Funnel resources into a hyper-carry.</p>
            <h4 className="text-lg font-semibold text-white mb-2">
              Your Picks:
            </h4>
            <p className="mb-4 text-sm">
              <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Jinx
              </span>{" "}
              + (
              <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Milio
              </span>
              ,{" "}
              <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Braum
              </span>
              ,{" "}
              <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Lulu
              </span>
              )
            </p>
            <h4 className="text-lg font-semibold text-white mb-2">
              Draft with:
            </h4>
            <p className="mb-4 text-sm">
              <strong className="font-bold text-purple-400">
                Orianna, Galio, Lissandra
              </strong>
            </p>
            <h4 className="text-lg font-semibold text-white mb-2">Avoid if:</h4>
            <p className="text-sm">
              Your team is all scaling or has no frontline.
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-400 mb-3">
              Poke / Siege
            </h3>
            <p className="mb-4 text-sm">Whittle down enemies from afar.</p>
            <h4 className="text-lg font-semibold text-white mb-2">
              Your Picks:
            </h4>
            <p className="mb-4 text-sm">
              (
              <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Varus
              </span>
              ,{" "}
              <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Caitlyn
              </span>
              ,{" "}
              <span className="bg-blue-600 text-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Jhin
              </span>
              ) + (
              <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Zilean
              </span>
              ,{" "}
              <span className="bg-green-600 text-green-50 px-2.5 py-0.5 rounded-full font-semibold text-xs inline-block">
                Morgana
              </span>
              )
            </p>
            <h4 className="text-lg font-semibold text-white mb-2">
              Draft with:
            </h4>
            <p className="mb-4 text-sm">
              <strong className="font-bold text-orange-400">
                Brand, Lux, Vel'Koz, Ahri
              </strong>
            </p>
            <h4 className="text-lg font-semibold text-white mb-2">
              Avoid against:
            </h4>
            <p className="text-sm">
              Hard engage (
              <strong className="font-bold text-yellow-400">
                Nautilus, Leona
              </strong>
              )
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
