import { b as ChatMessage, c as ChatSession } from './types-Bw74UrpG.cjs';

interface ChatHandlerOptions {
    knowledgePath?: string;
    configPath?: string;
}
declare function createChatHandler(options?: ChatHandlerOptions): {
    POST: (req: Request) => Promise<Response>;
};

interface ConfigHandlerOptions {
    configPath?: string;
}
declare function createConfigHandler(options?: ConfigHandlerOptions): {
    GET: () => Promise<Response>;
};

declare function createAdminHandler(): {
    GET: (req: Request) => Promise<Response>;
};

declare function getSession(sessionId: string): Promise<ChatSession | null>;
declare function addMessage(sessionId: string, message: ChatMessage): Promise<void>;
declare function updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<void>;
declare function getAllSessions(): Promise<ChatSession[]>;
declare function getSessionsByFilter(filter: {
    language?: string;
    converted_to?: string | null;
    has_fallback?: boolean;
    date_from?: string;
    date_to?: string;
}): Promise<ChatSession[]>;

interface BudgetCheckResult {
    allowed: boolean;
    reason?: 'daily_limit' | 'monthly_limit' | 'kill_switch' | 'session_limit' | 'rate_limit';
    dailyCost?: number;
    monthlyCost?: number;
}
declare function getCostStats(): Promise<{
    dailyCost: number;
    monthlyCost: number;
    dailySessions: number;
}>;

export { type BudgetCheckResult, addMessage, createAdminHandler, createChatHandler, createConfigHandler, getAllSessions, getCostStats, getSession, getSessionsByFilter, updateSession };
