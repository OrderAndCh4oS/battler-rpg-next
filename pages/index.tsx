import React, {ChangeEvent, FC, MouseEvent, useEffect, useState} from "react";
import {makeCharacter} from "../rpg/character";
import {Combatant, CombatantStats, Item} from "../rpg/interface";
import Battler, {LoggerRenderer} from "../rpg/battle";
import {getAttackRateStats, getBlockStats, getDodgeStats} from "../rpg/stats";
import WeaponSelect from "../components/weapon-select";
import ShieldSelect from "../components/offhand-select";
import ArmourSelect from "../components/armour-select";
import Image from "next/image";

const Main: FC = () => {
    const characterImageList = [
        "0bc98a.png",
        "0f73ba.jpg",
        "1ecb32.jpg",
        "3ec130.jpg",
        "4c3a5a.jpg",
        "4f85c2.jpg",
        "04fd82.png",
        "6f9a78.jpg",
        "8c0ffe.png",
        "9ed390.jpg",
        "30a66e.jpg",
        "035d41.jpg",
        "45e30c.jpg",
        "61e5c0.png",
        "73b9d5.png",
        "99ad7d.jpg",
        "163bf9.jpg",
        "397fee.jpg",
        "2633c7.jpg",
        "3711d1.jpg",
        "3744e2.jpg",
        "4443bd.jpg",
        "9938d6.jpg",
        "053774.jpg",
        "66090e.jpg",
        "120449.jpg",
        "123196.jpg",
        "383135.jpg",
        "512861.png",
        "543196.jpg",
        "617422.jpg",
        "774049.jpg",
        "aa270c.jpg",
        "ac337e.jpg",
        "af68b4.jpg",
        "b4bdd6.jpg",
        "b5c91d.jpg",
        "b499b1.jpg",
        "b8561b.jpg",
        "b08789.jpg",
        "cf1589.jpg",
        "d5e49f.jpg",
        "e7ed2b.jpg",
        "e8e731.jpg",
        "e49e42.jpg",
        "ea804e.jpg",
        "ece066.jpg",
        "f5f98b.jpg",
        "f07db3.jpg",
        "faf630.jpg",
        "fcc115.jpg",
        "fce557.jpg",
    ].reduce((arr, img) => (arr.splice(~~(Math.random() * arr.length), 0, img), arr), [] as string[]);

    const [state, setState] = useState({
        playerOne: makeCharacter("One", characterImageList[0]),
        playerTwo: makeCharacter("Two", characterImageList[1])
    });
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

    const updatePlayerName = (player: "playerOne" | "playerTwo") => (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setState(prevState => ({...prevState, [player]: {...prevState[player], name}}));
    };

    const updatePlayerStat = (
        player: "playerOne" | "playerTwo",
        statKey: 'strength' | 'dexterity' | 'intelligence'
    ) => (event: ChangeEvent<HTMLInputElement>) => {
        const value = +event.target.value;
        setState(prevState => ({
            ...prevState,
            [player]: {
                ...prevState[player],
                actor: {
                    ...prevState[player].actor,
                    [statKey]: value
                }
            }
        }));
    };

    const pickRandomImage = (
        player: "playerOne" | "playerTwo",
    ) => (event: MouseEvent<HTMLButtonElement>) => {
        setState(prevState => ({
            ...prevState,
            [player]: {
                ...prevState[player],
                image: characterImageList[~~(Math.random() * characterImageList.length)]
            }
        }));
    };

    const setCharacterItem = (
        player: "playerOne" | "playerTwo",
        itemKey: 'mainHand' | 'offHand' | 'armour'
    ) => (item: Item) => {
        setState(prevState => ({
            ...prevState,
            [player]: {
                ...prevState[player],
                actor: {
                    ...prevState[player].actor,
                    [itemKey]: item
                }
            }
        }));
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

    return (
        <div>
            <div>
                <h1 className='pb-4 text-3xl'>
                    RPG Battler
                </h1>
                <div className='pb-4'>
                    <h2 className='pb-4 text-2xl'>Player One</h2>
                    <div>
                        <Image src={`/images/${state.playerOne.image}`} alt='Player one avatar' width={256}
                               height={256}/>
                        <button onClick={pickRandomImage('playerOne')}>⟳</button>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Name</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerName("playerOne")}
                                value={state.playerOne.name}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Str</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("playerOne", "strength")}
                                value={state.playerOne.actor.strength}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Dex</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("playerOne", "dexterity")}
                                value={state.playerOne.actor.dexterity}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Int</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("playerOne", "intelligence")}
                                value={state.playerOne.actor.intelligence}
                            />
                        </div>
                    </div>
                    <p>Main hand: {state.playerOne.actor.mainHand.name}</p>
                    <p>Off hand: {state.playerOne.actor.offHand.name}</p>
                    <p className='pb-4'>Armour: {state.playerOne.actor.armour.name}</p>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('playerOne', 'mainHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Offhand Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('playerOne', 'offHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Shield (Offhand)</label>
                    <ShieldSelect setCharacterShield={setCharacterItem('playerOne', 'offHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Armour</label>
                    <ArmourSelect setCharacterArmour={setCharacterItem('playerOne', 'armour')}/>
                </div>
                <div className='pb-4'>
                    <h2 className='pb-4 text-2xl'>Player Two</h2>
                    <div>
                        <Image src={`/images/${state.playerTwo.image}`} alt='Player two avatar' width={256}
                               height={256}/>
                        <button onClick={pickRandomImage('playerTwo')}>⟳</button>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Name</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerName("playerTwo")}
                                value={state.playerTwo.name}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Str</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("playerTwo", "strength")}
                                value={state.playerTwo.actor.strength}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Dex</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("playerTwo", "dexterity")}
                                value={state.playerTwo.actor.dexterity}
                            />
                        </div>
                        <div className='flex flex-col gap-1 mb-2'>
                            <label>Int</label>
                            <input
                                className='py-1 px-2 border rounded'
                                onChange={updatePlayerStat("playerTwo", "intelligence")}
                                value={state.playerTwo.actor.intelligence}
                            />
                        </div>
                    </div>
                    <p>Main hand: {state.playerTwo.actor.mainHand.name}</p>
                    <p>Off hand: {state.playerTwo.actor.offHand.name}</p>
                    <p className='pb-4'>Armour: {state.playerTwo.actor.armour.name}</p>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('playerTwo', 'mainHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Offhand Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('playerTwo', 'offHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Shield (Offhand)</label>
                    <ShieldSelect setCharacterShield={setCharacterItem('playerTwo', 'offHand')}/>
                    <label className='pb-2 block border-b mb-4 border-b-white'>Select Armour</label>
                    <ArmourSelect setCharacterArmour={setCharacterItem('playerTwo', 'armour')}/>
                </div>
                <button
                    className='text-white bg-red-700 hover:bg-red-500 rounded py-1 px-4 mb-4'
                    onClick={() => {
                        setLogs([]);
                        setStats(null);
                        setCombatantStats(null);
                        setCombatantStats(battler.start(state.playerOne, state.playerTwo));
                    }}
                >Fight!
                </button>
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
