/**
 * Service de notifications push et in-app
 *
 * Gère l'envoi de notifications via FCM (Firebase Cloud Messaging)
 * et la création de notifications in-app dans Firestore.
 */

import { getFirestore, getFirebaseApp } from '../firebase';
import { admin } from '../firebase/admin';
import { logError, NotFoundError } from '../utils/errors';
import type { Notification, NotificationType, User } from '../types';

// ═════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════

export interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  actionUrl?: string;
}

// ═════════════════════════════════════════════════════════════════════
// FONCTIONS PRINCIPALES
// ═════════════════════════════════════════════════════════════════════

/**
 * Envoie une notification (push + in-app) à un utilisateur
 */
export async function sendNotification(params: SendNotificationParams): Promise<Notification> {
  const firestore = getFirestore();
  const now = admin.firestore.Timestamp.now();

  // 1. Créer la notification in-app
  const notificationRef = firestore.collection('notifications').doc();

  const notification: Notification = {
    id: notificationRef.id,
    userId: params.userId,
    type: params.type,
    title: params.title,
    body: params.body,
    data: params.data,
    imageUrl: params.imageUrl,
    actionUrl: params.actionUrl,
    read: false,
    createdAt: now,
  };

  await notificationRef.set(notification);

  // 2. Envoyer la notification push FCM si l'utilisateur a un token
  try {
    const userDoc = await firestore.collection('users').doc(params.userId).get();
    if (!userDoc.exists) {
      throw new NotFoundError('Utilisateur', params.userId);
    }

    const user = userDoc.data() as User;

    if (user.notificationToken && user.preferences?.notificationsEnabled !== false) {
      const message: admin.messaging.Message = {
        token: user.notificationToken,
        notification: {
          title: params.title,
          body: params.body,
        },
        data: {
          type: params.type,
          notificationId: notificationRef.id,
          ...(params.data as Record<string, string>),
          ...(params.actionUrl ? { actionUrl: params.actionUrl } : {}),
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'recygo_default',
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              alert: {
                title: params.title,
                body: params.body,
              },
            },
          },
        },
      };

      await getFirebaseApp().messaging().send(message);
    }
  } catch (error) {
    // Ne pas bloquer l'envoi si le push échoue
    logError('sendNotification.push', error as Error, {
      userId: params.userId,
      type: params.type,
    });
  }

  return notification;
}

/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<void> {
  const firestore = getFirestore();
  const doc = await firestore.collection('notifications').doc(notificationId).get();

  if (!doc.exists) {
    throw new NotFoundError('Notification', notificationId);
  }

  const data = doc.data() as Notification;
  if (data.userId !== userId) {
    throw new Error('Non autorisé à modifier cette notification');
  }

  await doc.ref.update({
    read: true,
    readAt: admin.firestore.Timestamp.now(),
  });
}

/**
 * Marque toutes les notifications d'un utilisateur comme lues
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection('notifications')
    .where('userId', '==', userId)
    .where('read', '==', false)
    .get();

  const batch = firestore.batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      read: true,
      readAt: admin.firestore.Timestamp.now(),
    });
  });

  await batch.commit();
}

/**
 * Compte les notifications non lues d'un utilisateur
 */
export async function countUnreadNotifications(userId: string): Promise<number> {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection('notifications')
    .where('userId', '==', userId)
    .where('read', '==', false)
    .count()
    .get();

  return snapshot.data().count;
}

// ═════════════════════════════════════════════════════════════════════
// CONTEXTES DE NOTIFICATIONS (helpers)
// ═════════════════════════════════════════════════════════════════════

export const NotificationTemplates = {
  requestNew: (collectorName: string, wasteType: string) => ({
    title: '📦 Nouvelle demande de collecte',
    body: `${collectorName} a demandé une collecte pour ${wasteType}`,
  }),

  requestAccepted: (citizenName: string) => ({
    title: '✅ Demande acceptée',
    body: `${citizenName} a accepté votre demande de collecte`,
  }),

  collectorEnRoute: (collectorName: string, etaMinutes: number) => ({
    title: '🚛 Recycleur en route',
    body: `${collectorName} arrive dans environ ${etaMinutes} minutes`,
  }),

  requestCompleted: (amount: number) => ({
    title: '🎉 Collecte terminée !',
    body: `Votre collecte est terminée. ${amount.toLocaleString()} FCFA crédités sur votre portefeuille.`,
  }),

  paymentReceived: (amount: number, reference: string) => ({
    title: '💰 Paiement reçu',
    body: `${amount.toLocaleString()} FCFA reçus. Réf: ${reference}`,
  }),

  rewardEarned: (points: number, description: string) => ({
    title: '⭐ Récompense gagnée',
    body: `${points} points gagnés : ${description}`,
  }),

  impactReport: (co2Kg: number, month: string) => ({
    title: '🌿 Impact environnemental',
    body: `Bravo ! Vous avez évité ${co2Kg} kg de CO2 en ${month}.`,
  }),
} as const;
