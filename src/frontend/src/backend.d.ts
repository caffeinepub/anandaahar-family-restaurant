import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    category: string;
    price: number;
}
export interface Booking {
    id: bigint;
    customerName: string;
    status: string;
    date: string;
    guestCount: bigint;
    time: string;
    timestamp: bigint;
    phone: string;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    totalAmount: number;
    timestamp: bigint;
    phone: string;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export interface OrderItem {
    itemId: bigint;
    itemName: string;
    quantity: bigint;
    price: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(item: MenuItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(customerName: string, phone: string, date: string, time: string, guestCount: bigint): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllOrders(): Promise<Array<Order>>;
    getBooking(id: bigint): Promise<Booking | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getOrder(id: bigint): Promise<Order | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerName: string, phone: string, items: Array<OrderItem>): Promise<bigint>;
    removeMenuItem(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedMenu(): Promise<void>;
    updateBookingStatus(id: bigint, status: string): Promise<void>;
    updateMenuItem(id: bigint, updatedItem: MenuItem): Promise<void>;
    updateOrderStatus(id: bigint, status: string): Promise<void>;
}
