export interface IEvent{
    id: number;
    stop_api_id: number;
    action: string;
    processed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}