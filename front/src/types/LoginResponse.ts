import type {User} from "./User.ts";


export interface LoginResponse {
    token: string;
    user: User;
}