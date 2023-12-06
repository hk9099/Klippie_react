// import authRequest from "../utils/authRequest";
// // import { SubscriptionPlan, SubscriptionPrice } from "./plans";

// export function getSubscription() {
//     return new Promise((resolve, reject) => {
//         authRequest({ url: "/sub/get", method: "post" })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// }

// export function cancelSubscription(subscriptionID) {
//     return new Promise((resolve, reject) => {
//         authRequest({
//             url: "/sub/cancel",
//             method: "post",
//             data: { id: subscriptionID },
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             })
//             .finally(() => { });
//     });
// }

// export function reactivateSubscription(subscriptionID) {
//     return new Promise((resolve, reject) => {
//         authRequest({
//             url: "/sub/reactivate",
//             method: "post",
//             data: { id: subscriptionID },
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             })
//             .finally(() => { });
//     });
// }

// export function resumeSubscription(subscriptionID) {
//     return new Promise((resolve, reject) => {
//         authRequest({
//             url: "/sub/resume",
//             method: "post",
//             data: { id: subscriptionID },
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             })
//             .finally(() => { });
//     });
// }

// export function removeChanges(subscriptionID) {
//     return new Promise((resolve, reject) => {
//         authRequest({
//             url: "/sub/remove-changes",
//             method: "post",
//             data: { id: subscriptionID },
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             })
//             .finally(() => { });
//     });
// }

// export function changeSubscription(subscriptionID, newPrice) {
//     return new Promise((resolve, reject) => {
//         authRequest({
//             url: "/sub/change",
//             method: "post",
//             data: { id: subscriptionID, new_sub_id: newPrice },
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             })
//             .finally(() => { });
//     });
// }

// export function pauseSubscription(subscriptionID, resume_date) {
//     return new Promise((resolve, reject) => {
//         authRequest({
//             url: "/sub/pause",
//             method: "post",
//             data: { id: subscriptionID, resume_date: resume_date },
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             })
//             .finally(() => { });
//     });
// }

// export function changeCBSubscription(
//     subscriptionID,
//     new_sub_id,
//     remove_members,
//     engine_id
// ) {
//     return new Promise((resolve, reject) => {
//         authRequest({
//             url: "/sub/change",
//             method: "post",
//             data: {
//                 id: subscriptionID,
//                 new_sub_id: new_sub_id,
//                 remove_members: remove_members,
//                 engine_id: engine_id,
//             },
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             })
//             .finally(() => { });
//     });
// }

// export function createCheckoutSession({ plan_id, fprom_tid }) {
//     return new Promise(async (resolve, reject) => {
//         authRequest({
//             url: "/sub/create-checkout-session",
//             method: "post",
//             data: { plan_id: plan_id, fprom_tid: fprom_tid },
//             headers: {
//                 "content-type": "application/json",
//             },
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// }

// export function createPortalSession() {
//     return new Promise((resolve, reject) => {
//         authRequest({
//             url: "/sub/create-portal-session",
//             method: "post",
//         })
//             .then(({ data }) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// }
