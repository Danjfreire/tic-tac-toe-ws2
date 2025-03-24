import { MessageHandler } from './message-handler.interface';
import { JoinHandler } from './join-handler';
import { FindMatchHandler } from './find-match-handler';
import { CancelMatchmakingHandler } from './cancel-matchmaking-handler';

export class MessageHandlerRegistry {
    private handlers: Map<string, MessageHandler> = new Map();

    constructor() {
        this.registerHandler('join', new JoinHandler());
        this.registerHandler('find_match', new FindMatchHandler());
        this.registerHandler('cancel_matchmaking', new CancelMatchmakingHandler());
    }

    registerHandler(type: string, handler: MessageHandler): void {
        this.handlers.set(type, handler);
    }

    getHandler(type: string): MessageHandler | undefined {
        return this.handlers.get(type);
    }
} 