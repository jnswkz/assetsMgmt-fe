export interface AiAskRequest {
  readonly message: string;
  readonly assetId?: string | null;
  readonly conversationId?: string | null;
}

export interface AiSourceReference {
  readonly title: string;
  readonly url: string;
  readonly kind?: string | null;
}

export interface AiAskResponse {
  readonly conversationId: string;
  readonly intent: string;
  readonly selectedTool: string;
  readonly toolArguments: Record<string, unknown>;
  readonly answer: string;
  readonly suggestedActions: readonly string[];
  readonly sources: readonly AiSourceReference[];
}
