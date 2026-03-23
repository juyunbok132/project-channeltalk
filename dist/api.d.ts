import { c as ChatSession } from './types-CXA-rcBd.js';

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
declare function getCostStats(): {
    dailyCost: number;
    monthlyCost: number;
    dailySessions: number;
};

export { type BudgetCheckResult, createAdminHandler, createChatHandler, createConfigHandler, getAllSessions, getCostStats, getSessionsByFilter };
