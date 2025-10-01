import { IEvent } from "../interface";
import { Event } from "../models";
import { find, findOne, update } from "./crud";
import { prepareSend } from "./SendCircuit";

export const processEvents = async () => {
    const events = await find<IEvent>(Event, { processed: false });
    if (events.length === 0) return;
    console.log(events);
    await Promise.all(events.map(async (e) => {
        await prepareSend(e);
        await update(Event, e.id,{processed: true});
    }
    ))
}

setInterval(processEvents, 10000);