/**
 * [[include:commands/downlink/GetArchiveDaysMC.md]]
 *
 * @packageDocumentation
 */

import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directionTypes.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';


/**
 * GetArchiveDaysMC command parameters
 *
 * @example
 * // request for 1 days archive values from channel #1 from 2023-12-24T00:00:00.000Z or 756691200 seconds since 2000 year
 * {channelList: [0], days: 1, seconds: 756691200}
 */
interface IDownlinkGetArchiveDaysMCParameters {
    /** amount of days to retrieve */
    days: number,

    /** time */
    startTime: number,

    /** array of channelList indexes */
    channelList: Array<number>
}


const COMMAND_ID = 0x1b;
const COMMAND_TITLE = 'GET_ARCHIVE_DAYS_MC';
const COMMAND_BODY_SIZE = 4;


/**
 * Downlink command
 *
 * @example
 * ```js
 * import GetArchiveDaysMC from 'jooby-codec/commands/downlink/GetArchiveDaysMC';
 *
 * const parameters = {channelList: [0], days: 1, seconds: 756691200};
 * const command = new GetArchiveDaysMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1b 04 2f 98 01 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveDaysMC.md#request)
 */
class GetArchiveDaysMC extends Command {
    constructor ( public parameters: IDownlinkGetArchiveDaysMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a - b);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`${this.getName()}. Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channelList = buffer.getChannels();
        const days = buffer.getUint8();

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new GetArchiveDaysMC({channelList, days, startTime: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {channelList, days, startTime} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        const date = getDateFromSeconds(startTime);

        buffer.setDate(date);
        buffer.setChannels(channelList.map(index => ({index} as IChannel)));
        buffer.setUint8(days);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveDaysMC;