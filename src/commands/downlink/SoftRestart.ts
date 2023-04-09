import Command from '../../Command.js';


const COMMAND_ID = 0x19;
const COMMAND_TITLE = `SOFT_RESTART`;


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SoftRestart from 'jooby-codec/commands/downlink/SoftRestart';
 *
 * const command = new SoftRestart();
 *
 * someting interesting
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 19 00
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/SoftRestart.md#request)
 */
class SoftRestart extends Command {
    static readonly id = COMMAND_ID;

    static readonly isUplink = false;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes () {
        return new SoftRestart();
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID + 1);
    }
}


export default SoftRestart;
