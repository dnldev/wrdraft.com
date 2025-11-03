// in /components/BuildPath.tsx
import { Build, Item } from "@/data/championData";
import Image from "next/image";
import React from "react";

interface BuildPathProps {
  build: Build;
}

const ItemImage = ({ item }: { item: Item }) => (
  <Image
    src={item.icon}
    alt={item.name}
    width={48}
    height={48}
    className="item-img"
    title={item.name}
  />
);

export function BuildPath({ build }: BuildPathProps) {
  return (
    <div className="bg-background/50 p-4 rounded-lg">
      <h5 className="font-bold text-lg text-white mb-2">{build.name}</h5>
      <p className="text-sm text-foreground/80 mb-3">
        <strong>Runes:</strong> {build.runes}
      </p>
      <div className="space-y-3">
        <div>
          <h6 className="text-xs uppercase font-semibold text-sky-400 mb-2">
            Core Build
          </h6>
          <div className="flex flex-wrap items-center gap-2">
            {build.core.map((item, index) => (
              <React.Fragment key={item.name}>
                <ItemImage item={item} />
                {index < build.core.length - 1 && (
                  <span className="text-2xl text-slate-500">&rarr;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div>
          <h6 className="text-xs uppercase font-semibold text-sky-400 mb-2">
            Boots
          </h6>
          <div className="flex flex-wrap items-center gap-2">
            {build.boots.map((item) => (
              <ItemImage key={item.name} item={item} />
            ))}
          </div>
        </div>
        <div>
          <h6 className="text-xs uppercase font-semibold text-sky-400 mb-2">
            Situational Items
          </h6>
          <div className="flex flex-wrap items-center gap-2">
            {build.situational.map((item) => (
              <ItemImage key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
