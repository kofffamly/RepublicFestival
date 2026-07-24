/**
 * Service de notifications push et in-app
 *
 * Gère l'envoi de notifications via FCM (Firebase Cloud Messaging)
 * et la création de notifications in-app dans Firestore.
 */
import type { Notification, NotificationType } from '../types';
export interface SendNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
    actionUrl?: string;
}
/**
 * Envoie une notification (push + in-app) à un utilisateur
 */
export declare function sendNotification(params: SendNotificationParams): Promise<Notification>;
/**
 * Marque une notification comme lue
 */
export declare function markNotificationAsRead(notificationId: string, userId: string): Promise<void>;
/**
 * Marque toutes les notifications d'un utilisateur comme lues
 */
export declare function markAllNotificationsAsRead(userId: string): Promise<void>;
/**
 * Compte les notifications non lues d'un utilisateur
 */
export declare function countUnreadNotifications(userId: string): Promise<number>;
export declare const NotificationTemplates: {
    readonly requestNew: (collectorName: string, wasteType: string) => {
        title: string;
        body: string;
    };
    readonly requestAccepted: (citizenName: string) => {
        title: string;
        body: string;
    };
    readonly collectorEnRoute: (collectorName: string, etaMinutes: number) => {
        title: string;
        body: string;
    };
    readonly requestCompleted: (amount: number) => {
        title: string;
        body: string;
    };
    readonly paymentReceived: (amount: number, reference: string) => {
        title: string;
        body: string;
    };
    readonly rewardEarned: (points: number, description: string) => {
        title: string;
        body: string;
    };
    readonly impactReport: (co2Kg: number, month: string) => {
        title: string;
        body: string;
    };
};
//# sourceMappingURL=notification.d.ts.map