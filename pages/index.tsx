import React, {ChangeEvent, FC, MouseEvent, useEffect, useState} from "react";
import {makeCharacter} from "../rpg/character";
import {Character, Combatant, CombatantStats, Item} from "../rpg/interface";
import Battler, {Logger, LoggerRenderer, NullLogger} from "../rpg/battle";
import {getAttackRateStats, getBlockStats, getDodgeStats} from "../rpg/stats";
import WeaponSelect from "../components/weapon-select";
import ShieldSelect from "../components/offhand-select";
import ArmourSelect from "../components/armour-select";
import Image from "next/image";
import characterImageList from "../utilities/character-images";
import generateEnemy from "../rpg/generate-enemy";

const Main: FC = () => {
    const [player, setPlayer] = useState({...makeCharacter("Player One", characterImageList[0])});
    const [enemy, setEnemy] = useState<Character | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [combatantStats, setCombatantStats] = useState<{
        combatantOne: Combatant,
        combatantTwo: Combatant,
    } | null>(null);
    const [stats, setStats] = useState<{
        combatantOneStats: CombatantStats,
        combatantTwoStats: CombatantStats,
    } | null>(null);

    const addToLogs = (logs: string[]) => {
        const nextLog = logs.join(", ");
        setLogs(prevState => ([...prevState, nextLog]));
    };

    const logger = new LoggerRenderer(addToLogs);
    const battler = new Battler(logger);

    const updatePlayerName = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setPlayer(prevState => ({...prevState, name}));
    };

    const updatePlayerStat = (
        statKey: 'str' | 'dex' | 'int'
    ) => (event: ChangeEvent<HTMLInputElement>) => {
        const value = +event.target.value;
        setPlayer(prevState => ({
                ...prevState,
                actor: {
                    ...prevState.actor,
                    [statKey]: value
                }
            }
        ));
    };

    const pickRandomImage = () => {
        setPlayer(prevState => ({
                ...prevState,
                image: characterImageList[~~(Math.random() * characterImageList.length)]
            }
        ));
    };

    const setCharacterItem = (
        itemKey: 'mainHand' | 'offHand' | 'armour'
    ) => (item: Item) => {
        setPlayer(prevState => ({
                ...prevState,
                actor: {
                    ...prevState.actor,
                    [itemKey]: item
                }
            }
        ));
    };

    const handleGenerateEnemy = () => {
        const enemy = generateEnemy(player.actor);
        // const logger = new NullLogger();
        // const battler = new Battler(logger);
        // const mockPlayer = {...player};
        // const mockEnemy = {...enemy};
        // let result: any;
        // for(let i = 0; i < 10; i++) {
        //     result = battler.start(mockPlayer, mockEnemy);
        // }
        // console.log(result!.combatantOne.character.wins);
        // console.log(result!.combatantTwo.character.wins);
        setEnemy(enemy);
    };

    // useEffect(() => {
    //     if (!combatantStats) return;
    //     const {combatantOne, combatantTwo} = combatantStats;
    //     const combatantOneStats: CombatantStats = {
    //         attackRateStats: getAttackRateStats(combatantOne),
    //         dodgeStats: getDodgeStats(combatantOne),
    //         blockStats: getBlockStats(combatantOne)
    //     };
    //
    //     const combatantTwoStats: CombatantStats = {
    //         attackRateStats: getAttackRateStats(combatantTwo),
    //         dodgeStats: getDodgeStats(combatantTwo),
    //         blockStats: getBlockStats(combatantTwo)
    //     };
    //
    //     setStats({combatantOneStats, combatantTwoStats});
    // }, [combatantStats]);

    return (
        <div>
            <div>
                <div className='pb-4'>
                    <h2 className='pb-4 text-2xl'>Player One</h2>
                    <div>
                        <Image
                            className='pb-2'
                            src={`/images/${player.image}`}
                            alt='Player one avatar'
                            width={256}
                            height={256}
                        />
                        <button className='text-3xl mb-4 py-0 px-0.5' onClick={pickRandomImage}>⟳</button>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Name</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerName}
                                value={player.name}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Str</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("str")}
                                value={player.actor.str}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Dex</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("dex")}
                                value={player.actor.dex}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Int</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("int")}
                                value={player.actor.int}
                            />
                        </div>
                    </div>
                    <p>Main hand: {player.actor.mainHand.name}</p>
                    <p>Off hand: {player.actor.offHand.name}</p>
                    <p className='pb-4'>Armour: {player.actor.armour.name}</p>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('mainHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Offhand Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('offHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Shield (Offhand)</label>
                    <ShieldSelect setCharacterShield={setCharacterItem('offHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Armour</label>
                    <ArmourSelect setCharacterArmour={setCharacterItem('armour')}/>
                </div>
                <button
                    className='text-white bg-green-700 hover:bg-green-500 rounded py-1 px-4 mb-4'
                    onClick={handleGenerateEnemy}
                >Generate Enemy
                </button>
                {enemy && (
                    <div className='pb-4'>
                        <h2 className='pb-4 text-2xl'>Enemy</h2>
                        <div>
                            <Image
                                className='pb-2'
                                src={`/images/${enemy.image}`}
                                alt='Player two avatar'
                                width={256}
                                height={256}
                            />
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex flex-col gap-1 mb-2'>
                                <label>Name</label>
                                <input
                                    readOnly
                                    className='py-1 px-2 border rounded'
                                    value={enemy.name}
                                />
                            </div>
                            <div className='flex flex-col gap-1 mb-2'>
                                <label>Str</label>
                                <input
                                    readOnly
                                    className='py-1 px-2 border rounded'
                                    value={enemy.actor.str}
                                />
                            </div>
                            <div className='flex flex-col gap-1 mb-2'>
                                <label>Dex</label>
                                <input
                                    readOnly
                                    className='py-1 px-2 border rounded'
                                    value={enemy.actor.dex}
                                />
                            </div>
                            <div className='flex flex-col gap-1 mb-2'>
                                <label>Int</label>
                                <input
                                    readOnly
                                    className='py-1 px-2 border rounded'
                                    value={enemy.actor.int}
                                />
                            </div>
                        </div>
                        <p>Main hand: {enemy.actor.mainHand.name}</p>
                        <p>Off hand: {enemy.actor.offHand.name}</p>
                        <p className='pb-4'>Armour: {enemy.actor.armour.name}</p>
                    </div>
                )}
                {enemy && (
                    <button
                        className='text-white bg-red-700 hover:bg-red-500 rounded py-1 px-4 mb-4'
                        onClick={() => {
                            setLogs([]);
                            setStats(null);
                            setCombatantStats(null);
                            setCombatantStats(battler.start(player, enemy));
                        }}
                    >Fight!
                    </button>
                )}
            </div>
            <div className='pb-4'>
                <h2 className='pb-4 text-2xl'>Battle Log</h2>
                <textarea className='w-full h-64 block border rounded mb-4' readOnly value={logs.join("\n")}/>
            </div>
            {combatantStats && (
                <div className='pb-4'>
                    <h2 className='pb-4 text-2xl'>Result</h2>
                    <p>Player One Wins: {combatantStats.combatantOne.character.wins}</p>
                    <p>Player Two Wins: {combatantStats.combatantTwo.character.wins}</p>
                </div>
            )}
            {stats && (
                <div className='pb-4'>
                    <h2 className='pb-4 text-2xl'>Statistics</h2>
                    <h3 className='pb-4'>Player One</h3>
                    <p>Total Damage: {stats.combatantOneStats.attackRateStats.totalDamage}</p>
                    <p>Total Damage Given: {stats.combatantOneStats.attackRateStats.totalDamage}</p>
                    <p>Total Attacks: {stats.combatantOneStats.attackRateStats.count}</p>
                    <p>Total Successful Attacks: {stats.combatantOneStats.attackRateStats.successCount}</p>
                    <p>Total Critical Hits: {stats.combatantOneStats.attackRateStats.criticalHitSuccessCount}</p>
                    <h3 className='py-4'>Player Two</h3>
                    <p>Total Damage: {stats.combatantTwoStats.attackRateStats.totalDamage}</p>
                    <p>Total Damage Given: {stats.combatantTwoStats.attackRateStats.totalDamage}</p>
                    <p>Total Attacks: {stats.combatantTwoStats.attackRateStats.count}</p>
                    <p>Total Successful Attacks: {stats.combatantTwoStats.attackRateStats.successCount}</p>
                    <p>Total Critical Hits: {stats.combatantTwoStats.attackRateStats.criticalHitSuccessCount}</p>
                </div>
            )}
        </div>
    );
};

export default Main;
