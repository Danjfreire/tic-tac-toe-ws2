import { Injectable } from '@angular/core';
import { MessageHandler, ServerMessage } from './message-handler.interface';
import { JoinedHandler } from './joined-handler';
import { PlayerCountHandler } from './player-count-handler';
import { MatchFoundHandler } from './match-found-handler';

@Injectable({
    providedIn: 'root'
})
export class MessageHandlerRegistry {
    private handlers: MessageHandler[];

    constructor(
        joinedHandler: JoinedHandler,
        playerCountHandler: PlayerCountHandler,
        matchFoundHandler: MatchFoundHandler
    ) {
        this.handlers = [
            joinedHandler,
            playerCountHandler,
            matchFoundHandler
        ];
    }

    handleMessage(message: ServerMessage): void {
        for (const handler of this.handlers) {
            if (handler.canHandle(message)) {
                handler.handle(message);
                return;
            }
        }
        console.warn('No handler found for message type:', message.type);
    }
}
