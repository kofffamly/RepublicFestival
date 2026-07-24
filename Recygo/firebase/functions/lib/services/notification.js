"use strict";
/**
 * Service de notifications push et in-app
 *
 * Gère l'envoi de notifications via FCM (Firebase Cloud Messaging)
 * et la création de notifications in-app dans Firestore.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplates = void 0;
exports.sendNotification = sendNotification;
exports.markNotificationAsRead = markNotificationAsRead;
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
exports.countUnreadNotifications = countUnreadNotifications;
const firebase_1 = require("../firebase");
const admin_1 = require("../firebase/admin");
const errors_1 = require("../utils/errors");
// ═════════════════════════════════════════════════════════════════════
// FONCTIONS PRINCIPALES
// ═════════════════════════════════════════════════════════════════════
/**
 * Envoie une notification (push + in-app) à un utilisateur
 */
async function sendNotification(params) {
    const firestore = (0, firebase_1.getFirestore)();
    const now = admin_1.admin.firestore.Timestamp.now();
    // 1. Créer la notification in-app
    const notificationRef = firestore.collection('notifications').doc();
    const notification = {
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
            throw new errors_1.NotFoundError('Utilisateur', params.userId);
        }
        const user = userDoc.data();
        if (user.notificationToken && user.preferences?.notificationsEnabled !== false) {
            const message = {
                token: user.notificationToken,
                notification: {
                    title: params.title,
                    body: params.body,
                },
                data: {
                    type: params.type,
                    notificationId: notificationRef.id,
                    ...params.data,
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
            await (0, firebase_1.getFirebaseApp)().messaging().send(message);
        }
    }
    catch (error) {
        // Ne pas bloquer l'envoi si le push échoue
        (0, errors_1.logError)('sendNotification.push', error, {
            userId: params.userId,
            type: params.type,
        });
    }
    return notification;
}
/**
 * Marque une notification comme lue
 */
async function markNotificationAsRead(notificationId, userId) {
    const firestore = (0, firebase_1.getFirestore)();
    const doc = await firestore.collection('notifications').doc(notificationId).get();
    if (!doc.exists) {
        throw new errors_1.NotFoundError('Notification', notificationId);
    }
    const data = doc.data();
    if (data.userId !== userId) {
        throw new Error('Non autorisé à modifier cette notification');
    }
    await doc.ref.update({
        read: true,
        readAt: admin_1.admin.firestore.Timestamp.now(),
    });
}
/**
 * Marque toutes les notifications d'un utilisateur comme lues
 */
async function markAllNotificationsAsRead(userId) {
    const firestore = (0, firebase_1.getFirestore)();
    const snapshot = await firestore
        .collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .get();
    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
            read: true,
            readAt: admin_1.admin.firestore.Timestamp.now(),
        });
    });
    await batch.commit();
}
/**
 * Compte les notifications non lues d'un utilisateur
 */
async function countUnreadNotifications(userId) {
    const firestore = (0, firebase_1.getFirestore)();
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
exports.NotificationTemplates = {
    requestNew: (collectorName, wasteType) => ({
        title: '📦 Nouvelle demande de collecte',
        body: `${collectorName} a demandé une collecte pour ${wasteType}`,
    }),
    requestAccepted: (citizenName) => ({
        title: '✅ Demande acceptée',
        body: `${citizenName} a accepté votre demande de collecte`,
    }),
    collectorEnRoute: (collectorName, etaMinutes) => ({
        title: '🚛 Recycleur en route',
        body: `${collectorName} arrive dans environ ${etaMinutes} minutes`,
    }),
    requestCompleted: (amount) => ({
        title: '🎉 Collecte terminée !',
        body: `Votre collecte est terminée. ${amount.toLocaleString()} FCFA crédités sur votre portefeuille.`,
    }),
    paymentReceived: (amount, reference) => ({
        title: '💰 Paiement reçu',
        body: `${amount.toLocaleString()} FCFA reçus. Réf: ${reference}`,
    }),
    rewardEarned: (points, description) => ({
        title: '⭐ Récompense gagnée',
        body: `${points} points gagnés : ${description}`,
    }),
    impactReport: (co2Kg, month) => ({
        title: '🌿 Impact environnemental',
        body: `Bravo ! Vous avez évité ${co2Kg} kg de CO2 en ${month}.`,
    }),
};
//# sourceMappingURL=notification.js.map