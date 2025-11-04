// in /components/TeamComps.tsx
import { TeamComposition } from "@/data/teamCompsData";
import { Card, CardBody, CardHeader, Divider, Chip } from "@heroui/react";
import { LucideIcon } from "./LucideIcon";

const archetypeColors = {
    engage_dive: "border-danger",
    protect_the_carry: "border-warning",
    poke_siege: "border-primary",
    early_bully: "border-success",
}

export function TeamComps({ teamComps }: { teamComps: TeamComposition[] }) {
    return (
        <div className="space-y-12">
            <Card className="p-0">
                <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6">
                    <LucideIcon name="Users" className="text-primary" />
                    <h2 className="text-3xl font-bold text-primary text-center">
                        Team Compositions
                    </h2>
                </CardHeader>
                <Divider/>
                <CardBody className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {teamComps.map((comp) => (
                        <Card key={comp.archetypeId} className={`p-6 bg-content1 border-t-4 ${archetypeColors[comp.archetypeId as keyof typeof archetypeColors]}`}>
                            <h3 className="text-2xl font-bold text-white mb-2">{comp.name}</h3>
                            <p className="mb-4 text-sm font-light italic text-foreground/60">{comp.description}</p>
                            <p className="mb-6 text-foreground/80">{comp.strategy}</p>

                            <Divider className="my-4"/>

                            <div>
                                <h4 className="font-semibold text-white mb-3">Your Core Champions</h4>
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <p className="text-xs uppercase text-foreground/60 font-bold mb-1">ADCs</p>
                                        <div className="flex flex-wrap gap-1">
                                            {comp.coreChampions.adcs.map(name => <Chip key={name} size="sm">{name}</Chip>)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-foreground/60 font-bold mb-1">Supports</p>
                                        <div className="flex flex-wrap gap-1">
                                            {comp.coreChampions.supports.map(name => <Chip key={name} size="sm">{name}</Chip>)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Divider className="my-4"/>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Synergizes With</h4>
                                <div className="flex flex-wrap gap-1">
                                    {comp.synergisticAllies.map(name => <Chip key={name} size="sm" color="success" variant="flat">{name}</Chip>)}
                                </div>
                            </div>

                            <Divider className="my-4"/>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Countered By</h4>
                                <div className="flex flex-wrap gap-1">
                                    {comp.hardCounters.map(name => <Chip key={name} size="sm" color="danger" variant="flat">{name}</Chip>)}
                                </div>
                            </div>
                        </Card>
                    ))}
                </CardBody>
            </Card>
        </div>
    );
}