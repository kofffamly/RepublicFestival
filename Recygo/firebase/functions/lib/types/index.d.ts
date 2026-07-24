/**
 * Types TypeScript partagés pour les Cloud Functions RecyGo CI
 *
 * Définit les interfaces pour :
 * - Utilisateurs, profils, rôles
 * - Requêtes/réponses de l'analyse IA
 * - Requêtes/réponses de l'assistant IA
 * - Notifications
 * - Gestion des déchets
 */
import * as admin from 'firebase-admin';
export type UserRole = 'citizen' | 'collector' | 'admin';
export interface User {
    uid: string;
    email: string;
    displayName: string;
    phone?: string;
    photoURL?: string;
    role: UserRole;
    createdAt: admin.firestore.Timestamp;
    updatedAt: admin.firestore.Timestamp;
    lastLoginAt?: admin.firestore.Timestamp;
    isActive: boolean;
    notificationToken?: string;
    preferences: UserPreferences;
}
export interface UserPreferences {
    language: 'fr' | 'en';
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
}
export interface Profile {
    userId: string;
    role: UserRole;
    displayName: string;
    phone?: string;
    photoURL?: string;
    address?: Address;
    bio?: string;
    createdAt: admin.firestore.Timestamp;
    updatedAt: admin.firestore.Timestamp;
}
export interface Address {
    street: string;
    district: string;
    city: string;
    region?: string;
    country: string;
    postalCode?: string;
    coordinates?: GeoPoint;
}
export interface GeoPoint {
    latitude: number;
    longitude: number;
}
export interface AnalyzeWasteRequest {
    imageBase64: string;
    mimeType: string;
    userId?: string;
}
export interface AnalyzeWasteResponse {
    success: boolean;
    data?: AIAnalysis;
    error?: ApiError;
    processingTimeMs: number;
}
export interface AIAnalysis {
    wasteType: string;
    category: string;
    material: string;
    confidence: number;
    description: string;
    recommendation: string;
    recyclingInstructions: string;
    binType: string;
    hazardLevel: 'none' | 'low' | 'moderate' | 'high' | 'toxic';
    estimatedWeight: number;
    estimatedValueMin: number;
    estimatedValueMax: number;
    recyclable: boolean;
    tags: string[];
}
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
export interface AskAssistantRequest {
    message: string;
    conversationHistory?: ChatMessage[];
    userId?: string;
}
export interface AskAssistantResponse {
    success: boolean;
    data?: {
        reply: string;
        context?: Record<string, unknown>;
        sources?: string[];
    };
    error?: ApiError;
    processingTimeMs: number;
}
export type NotificationType = 'request_new' | 'request_accepted' | 'collector_en_route' | 'request_completed' | 'payment_received' | 'reward_earned' | 'impact_report' | 'system';
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
    actionUrl?: string;
    read: boolean;
    readAt?: admin.firestore.Timestamp;
    createdAt: admin.firestore.Timestamp;
}
export type CollectionStatus = 'pending' | 'accepted' | 'en_route' | 'in_progress' | 'completed' | 'cancelled' | 'refused';
export interface Collection {
    id: string;
    userId: string;
    collectorId?: string;
    wasteType: string;
    weight: number;
    estimatedValue: number;
    finalValue?: number;
    status: CollectionStatus;
    address: Address;
    notes?: string;
    scheduledDate: admin.firestore.Timestamp;
    completedAt?: admin.firestore.Timestamp;
    createdAt: admin.firestore.Timestamp;
    updatedAt: admin.firestore.Timestamp;
}
export interface Transaction {
    id: string;
    userId: string;
    collectionId?: string;
    type: 'credit' | 'debit';
    amount: number;
    currency: string;
    description: string;
    reference: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: admin.firestore.Timestamp;
}
export interface ApiError {
    code: string;
    message: string;
    details?: string;
    stack?: string;
}
export interface WasteCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    recyclable: boolean;
    averageValue: number;
    binType: string;
    tips: string[];
}
//# sourceMappingURL=index.d.ts.map