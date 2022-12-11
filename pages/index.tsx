import {ChangeEvent, FC, useEffect, useState} from "react";
import {makeCharacter} from "../rpg/character";
import {Combatant, CombatantStats, Item} from "../rpg/interface";
import Battler, {LoggerRenderer} from "../rpg/battle";
import {getAttackRateStats, getBlockStats, getDodgeStats} from "../rpg/stats";
import WeaponSelect from "../components/weapon-select";
import ShieldSelect from "../components/offhand-select";
import ArmourSelect from "../components/armour-select";

const Main: FC = () => {
    const [state, setState] = useState({
        playerOne: makeCharacter("One"),
        playerTwo: makeCharacter("Two")
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
                <h1 className='pb-4 text-2xl'>
                    RPG Battler
                </h1>
                <div className='pb-4'>
                    <div className='flex flex-col gap-1 mb-2'>
                        <label>Player One Name</label>
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
                    <p className='pb-4'>Main hand: {state.playerOne.actor.mainHand.name}</p>
                    <label>Select Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('playerOne', 'mainHand')}/>
                    <p className='pb-4'>Off hand: {state.playerOne.actor.offHand.name}</p>
                    <label>Select Offhand Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('playerOne', 'offHand')}/>
                    <label>Select Shield</label>
                    <ShieldSelect setCharacterShield={setCharacterItem('playerOne', 'offHand')}/>
                    <p className='pb-4'>Armour: {state.playerOne.actor.armour.name}</p>
                    <ArmourSelect setCharacterArmour={setCharacterItem('playerOne', 'armour')}/>
                </div>
                <div className='pb-4'>
                    <div className='flex flex-col gap-1 mb-2'>
                        <label>Player Two Name</label>
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
                    <p className='pb-4'>Main hand: {state.playerTwo.actor.mainHand.name}</p>
                    <label>Select Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('playerTwo', 'mainHand')}/>
                    <p className='pb-4'>Off hand: {state.playerTwo.actor.offHand.name}</p>
                    <label>Select Offhand Weapon</label>
                    <WeaponSelect setCharacterWeapon={setCharacterItem('playerTwo', 'offHand')}/>
                    <label>Select Shield</label>
                    <ShieldSelect setCharacterShield={setCharacterItem('playerTwo', 'offHand')}/>
                    <p className='pb-4'>Armour: {state.playerTwo.actor.armour.name}</p>
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
                    <h3 className='pb-4'>Player Two</h3>
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
