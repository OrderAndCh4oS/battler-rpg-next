import React, {ChangeEvent, FC, useEffect, useState} from "react";
import {Character, Combatant, CombatantStats, Item} from "../rpg/interface";
import Battler, {LoggerRenderer, NullLogger} from "../rpg/battle";
import {getAttackRateStats, getBlockStats, getDodgeStats} from "../rpg/stats";
import WeaponSelect from "../components/weapon-select";
import ShieldSelect from "../components/offhand-select";
import ArmourSelect from "../components/armour-select";
import Image from "next/image";
import characterImageList from "../utilities/character-images";
import generateEnemy from "../rpg/generate-enemy";
import deepClone from "../utilities/deep-clone";
import generatePlayer from "../rpg/generate-player";
import getXpLevels from "../utilities/get-xp-levels";
import getXp from "../utilities/get-xp";
import getGold from "../utilities/get-gold";

const levels = getXpLevels(200, 1.5, 50);

const Main: FC = () => {
    const [isGeneratingEnemy, setIsGeneratingEnemy] = useState(false);
    const [player, setPlayer] = useState(generatePlayer('Player One'));
    const [enemy, setEnemy] = useState<Character | null>(null);
    const [winChance, setWinChance] = useState<number | null>(null);
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
        setPlayer(prevState => {
            const attributePointDiff = value - prevState.actor[statKey];
            if(attributePointDiff > prevState.attributePoints) {
                return prevState;
            }
            const attributePoints = prevState.attributePoints - attributePointDiff;
            return ({
                    ...prevState,
                    attributePoints,
                    actor: {
                        ...prevState.actor,
                        [statKey]: value
                    }
                }
            );
        });
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
        if(item.price > player.gold) return;
        setPlayer(prevState => ({
                ...prevState,
                gold: prevState.gold - item.price,
                actor: {
                    ...prevState.actor,
                    [itemKey]: item
                }
            }
        ));
    };

    const handleGenerateEnemy = () => {
        setIsGeneratingEnemy(true);
        const enemy = generateEnemy(player.actor, player.level);
        const logger = new NullLogger();
        const battler = new Battler(logger);
        let result: any;
        const wl = {w: 0, l: 0}
        const rounds = 1000;
        for (let i = 0; i < rounds; i++) {
            const mockPlayer = deepClone({...player, wins: 0});
            const mockEnemy = deepClone(enemy);
            result = battler.start(mockPlayer, mockEnemy);
            if (mockPlayer.wins) wl.w++; else wl.l++;
        }
        setWinChance(wl.w / rounds)
        setEnemy(enemy);
        setIsGeneratingEnemy(false);
    };

    useEffect(() => {
        if (!combatantStats) return;
        const {combatantOne, combatantTwo} = combatantStats;
        const combatantOneStats: CombatantStats = {
            attackRateStats: getAttackRateStats(combatantOne),
            dodgeStats: getDodgeStats(combatantOne),
            blockStats: getBlockStats(combatantOne)
        };

        const combatantTwoStats: CombatantStats = {
            attackRateStats: getAttackRateStats(combatantTwo),
            dodgeStats: getDodgeStats(combatantTwo),
            blockStats: getBlockStats(combatantTwo)
        };

        setStats({combatantOneStats, combatantTwoStats});
    }, [combatantStats]);

    const handleBattle = () => {
        if(!enemy || !winChance) throw new Error('enemy or winChance not set');
        setLogs([]);
        setStats(null);
        setCombatantStats(null);
        const result = battler.start(player, enemy);
        if(result.combatantOne.roundStats.winner) {
            result.combatantOne.character.experience += getXp(winChance);
            result.combatantOne.character.gold += getGold(winChance);
            if(player.level <= 50 && result.combatantOne.character.experience > levels[player.level - 1]) {
                result.combatantOne.character.level++
                result.combatantOne.character.attributePoints += 5
            }
        }
        setCombatantStats(result);
    };

    return (
        <div>
            <div>
                <div className='pb-4'>
                    <h2 className='pb-4 text-2xl'>Player One</h2>
                    <div>
                        <Image
                            className='pb-2'
                            src={`/mj-images/${player.image}`}
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
                    <p>Gold: {player.gold}</p>
                    <p>Attribute Points: {player.attributePoints}</p>
                    <p>Level: {player.level}</p>
                    <p className='pb-4'>XP: {player.experience}</p>
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
                {isGeneratingEnemy && <p>Generating…</p>}
                {enemy && winChance !== null && (
                    <div className='pb-4'>
                        <h2 className='pb-4 text-2xl'>Enemy (Win: {~~(winChance * 100)}%, Gold: {getGold(winChance)}, XP: {getXp(winChance)})</h2>
                        <div>
                            <Image
                                className='pb-2'
                                src={`/mj-images/${enemy.image}`}
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
                        onClick={handleBattle}
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
