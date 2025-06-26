import { IAuthUser } from "@/interface/Context/auth";

type WebSocketMessage = {
	action:
		| "message_sync"
		| "session"
		| "message_init"
		| "message_send"
		| "message_receive"
		| "message_update"
		| "message_delete"
		| "message_list"
		| "message_list_request"
		| "sync_request"
		| "sync_response"
		| "admin_sync_request"
		| "admin_sync_response"
		| "admin_selected_room"
		| "admin_selected_room_response";
	payload: {
		type?:
			| "ping"
			| "pong"
			| "message"
			| "message_list"
			| "message_list_request"
			| "message_sync";
		message?: string;
		timestamp?: number;
		sendFrom?: number;
		sendTo?: number;
		roomId?: string;
		userRole?: "admin" | "customer";
		requestingRoomId?: string;
		requestingCustomerId?: number;
		respondingRoomId?: string;
		respondingCustomerId?: number;
		messages?: IMessage[]; // Added for message list in sync response
		rooms?: IRoom[];
		room?: IRoom;
	};
};

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export interface IMessage {
	senderId: number;
	senderRole: "customer" | "admin";
	message: string;
	timestamp: string;
	images?: string[];
	sendTo?: number;
}

export interface IUserInfo {
	name: string;
	phone: string;
	avatar: string;
}

export interface IRoom {
	adminIds?: string[];
	adminId: number;
	adminInfo: IUserInfo;
	createdAt: string;
	customerId: number;
	customerInfo: IUserInfo;
	id: string;
	isActive: boolean;
	isAnonymous?: boolean;
	messages: IMessage[];
	updatedAt: string;
}

class WebSocketService {
	private ws: WebSocket | null = null;
	private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
	private statusHandlers: ((status: ConnectionStatus) => void)[] = [];
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private roomId: string | null = null;
	private storageListener: ((event: StorageEvent) => void) | null = null;
	private connectionCheckInterval: NodeJS.Timeout | null = null;
	// private connectionCheckInterval: () => void = () => {};
	private isInitialized = false;
	private lastMessageTime: number = 0;
	private messageCount: number = 0;
	private apiUrl: string = `ws://localhost:8000/ws/chat`; // TODO: make this dynamic
	private customerId: number | undefined = undefined;
	private userRole: "admin" | "customer" = "customer";

	constructor() {
		// Don't generate tabId or connect in constructor
	}

	public initialize(user: IAuthUser) {
		if (this.isInitialized || !user?.customerId) return;

		if (typeof window !== "undefined") {
			// Generate tabId only on client side
			this.roomId = Math.random().toString(36).substring(7);
			// Get customerId from localStorage if available
			this.customerId = user?.customerId;
			this.userRole = user?.role as "admin" | "customer";
			console.log(
				`[WebSocket] Initializing with roomId: ${this.roomId}, customerId: ${this.customerId}`
			);
			this.setupStorageListener();
			this.startConnectionCheck();
			this.connect();
			this.isInitialized = true;
		}
	}

	private startConnectionCheck() {
		if (typeof window === "undefined") return;

		// this.connectionCheckInterval = setInterval(() => {
		// 	console.log("connection check interval");
		// 	if (this.ws?.readyState === WebSocket.OPEN) {
		// 		// Only send a ping, not a sync_request
		// 		this.send({
		// 			action: "sync_request",
		// 			payload: {
		// 				type: "ping",
		// 				roomId: this.roomId as string,
		// 				customerId: this.customerId,
		// 			},
		// 		});
		// 	} else if (this.ws?.readyState === WebSocket.CLOSED) {
		// 		this.connect();
		// 	}
		// }, 30 * 1000);
	}

	private setupStorageListener() {
		if (typeof window === "undefined") return;

		this.storageListener = (event: StorageEvent) => {
			if (event.key === "ws_sync_request" && event.newValue) {
				const request = JSON.parse(event.newValue);
				if (request.roomId !== this.roomId) {
					// Another tab is requesting sync
					this.send({
						action: "sync_response",
						payload: {
							requestingRoomId: request.roomId,
							requestingCustomerId: request.customerId,
							respondingRoomId: this.roomId as string,
							respondingCustomerId: this.customerId,
							timestamp: Date.now(),
							sendFrom: this.customerId,
							sendTo: request.customerId,
						},
					});
				}
			}
		};

		window.addEventListener("storage", this.storageListener);
	}

	public cleanup() {
		if (typeof window !== "undefined" && this.storageListener) {
			window.removeEventListener("storage", this.storageListener);
		}
		// if (this.connectionCheckInterval) {
		// 	clearInterval(this.connectionCheckInterval);
		// }
		if (this.ws) {
			this.ws.close();
		}
		this.isInitialized = false;
		console.log("[WebSocket] Cleanup completed");
	}

	private updateStatus(status: ConnectionStatus) {
		console.log(`[WebSocket] Status changed to: ${status}`);
		this.statusHandlers.forEach((handler) => handler(status));
	}

	private connect() {
		if (typeof window === "undefined" || !this.roomId) return;

		console.log(
			`[WebSocket] Attempting to connect to server with roomId: ${this.roomId}`
		);
		this.updateStatus("connecting");

		try {
			const clientID = this.roomId;
			const apiUrl = this.apiUrl;
			this.ws = new WebSocket(`${apiUrl}/${clientID}`);

			this.ws.onopen = () => {
				console.log(
					`[WebSocket] Connected successfully to ${apiUrl}/${clientID}`
				);
				this.reconnectAttempts = 0;
				this.updateStatus("connected");

				// Request initial sync from server
				this.send({
					action: "sync_request",
					payload: {
						type: "message_sync",
						roomId: this.roomId as string,
						sendFrom: this.customerId,
						userRole: this.userRole,
					},
				});
			};

			this.ws.onmessage = (event) => {
				try {
					const message: WebSocketMessage = JSON.parse(event.data);
					this.lastMessageTime = Date.now();
					this.messageCount++;
					console.log(
						`[WebSocket] Received message (${this.messageCount}):`,
						message
					);

					// Handle sync messages
					if (
						message.action === "sync_request" &&
						message.payload.roomId !== this.roomId
					) {
						// Another tab is requesting sync
						this.send({
							action: "sync_response",
							payload: {
								requestingRoomId: message.payload.roomId,
								requestingCustomerId: message.payload.sendFrom,
								respondingRoomId: this.roomId as string,
								respondingCustomerId: this.customerId,
								timestamp: Date.now(),
								sendFrom: this.customerId,
								sendTo: message.payload.sendTo,
							},
						});
					} else if (
						message.action === "sync_response" &&
						(message.payload.requestingRoomId === this.roomId ||
							message.payload.requestingCustomerId ===
								this.customerId)
					) {
						console.log(
							`[WebSocket] Received sync response from room: ${message.payload.respondingRoomId}`
						);
					}

					this.messageHandlers.forEach((handler) => handler(message));
				} catch (error) {
					console.error("[WebSocket] Error parsing message:", error);
				}
			};

			this.ws.onclose = (event) => {
				console.log(
					`[WebSocket] Disconnected. Code: ${event.code}, Reason: ${event.reason}`
				);
				this.updateStatus("disconnected");

				if (this.reconnectAttempts < this.maxReconnectAttempts) {
					this.reconnectAttempts++;
					console.log(
						`[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
					);
					setTimeout(() => this.connect(), 5000);
				} else {
					console.error(
						"[WebSocket] Max reconnection attempts reached"
					);
					this.updateStatus("error");
				}
			};

			this.ws.onerror = (error) => {
				console.error("[WebSocket] Error:", error);
				this.updateStatus("error");
			};
		} catch (error) {
			console.error("[WebSocket] Error creating connection:", error);
			this.updateStatus("error");
		}
	}

	private requestSync() {
		if (typeof window === "undefined" || !this.roomId) return;

		console.log(`[WebSocket] Requesting sync from other tabs`);
		// Use localStorage to notify other tabs
		localStorage.setItem(
			"ws_sync_request",
			JSON.stringify({
				roomId: this.roomId,
				timestamp: Date.now(),
				customerId: this.customerId,
			})
		);
		// Remove the item to allow future sync requests
		setTimeout(() => {
			localStorage.removeItem("ws_sync_request");
		}, 100);
	}

	public subscribe(handler: (message: WebSocketMessage) => void) {
		this.messageHandlers.push(handler);
		return () => {
			this.messageHandlers = this.messageHandlers.filter(
				(h) => h !== handler
			);
		};
	}

	public subscribeToStatus(handler: (status: ConnectionStatus) => void) {
		this.statusHandlers.push(handler);
		return () => {
			this.statusHandlers = this.statusHandlers.filter(
				(h) => h !== handler
			);
		};
	}

	public send(message: WebSocketMessage) {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.messageCount++;
			console.log(
				`[WebSocket] Sending message (${this.messageCount}):`,
				message
			);
			this.ws.send(JSON.stringify(message));
		} else {
			console.error(
				"[WebSocket] Not connected. Message not sent:",
				message
			);
		}
	}

	public getRoomId() {
		return this.roomId;
	}

	public isConnected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	public getConnectionStats() {
		return {
			messageCount: this.messageCount,
			lastMessageTime: this.lastMessageTime,
			timeSinceLastMessage: Date.now() - this.lastMessageTime,
			roomId: this.roomId,
			status: this.ws?.readyState,
		};
	}
}

export const websocketService = new WebSocketService();
